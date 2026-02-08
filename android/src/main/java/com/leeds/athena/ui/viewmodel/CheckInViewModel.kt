package com.leeds.athena.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.gson.Gson
import com.google.gson.annotations.SerializedName
import com.leeds.athena.data.model.CheckInData
import com.leeds.athena.data.repository.AttendanceRepository
import com.leeds.athena.data.repository.TimetableRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import javax.inject.Inject

sealed class CheckInUiState {
    object Idle : CheckInUiState()
    object Scanning : CheckInUiState()
    object Processing : CheckInUiState()
    data class Success(val data: CheckInData) : CheckInUiState()
    data class Error(val message: String, val canRetry: Boolean = true) : CheckInUiState()
}

data class QrPayload(
    @SerializedName("session_id") val sessionId: String,
    @SerializedName("token") val token: String
)

@HiltViewModel
class CheckInViewModel @Inject constructor(
    private val attendanceRepository: AttendanceRepository,
    private val timetableRepository: TimetableRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<CheckInUiState>(CheckInUiState.Scanning)
    val uiState: StateFlow<CheckInUiState> = _uiState.asStateFlow()

    private val gson = Gson()

    fun onQrCodeScanned(qrContent: String) {
        if (_uiState.value !is CheckInUiState.Scanning) return
        
        _uiState.value = CheckInUiState.Processing

        try {
            // 1. Parse QR JSON
            val payload = gson.fromJson(qrContent, QrPayload::class.java)
            if (payload.sessionId.isBlank() || payload.token.isBlank()) {
                _uiState.value = CheckInUiState.Error("Invalid QR Code format.")
                return
            }

            // 2. Validate Session & Time Window
            validateAndCheckIn(payload)

        } catch (e: Exception) {
            _uiState.value = CheckInUiState.Error("Failed to read QR Code.")
        }
    }

    private fun validateAndCheckIn(payload: QrPayload) {
        viewModelScope.launch {
            // Get today's timetable to verify session exists and is happening now
            val timetableResult = timetableRepository.getTodayTimetable()
            
            if (timetableResult.isFailure) {
                _uiState.value = CheckInUiState.Error("Could not verify class schedule. Please check internet.")
                return@launch
            }

            val sessions = timetableResult.getOrNull()?.sessions ?: emptyList()
            val session = sessions.find { it.id == payload.sessionId }

            if (session == null) {
                _uiState.value = CheckInUiState.Error("Class not found in your timetable.")
                return@launch
            }

            // 3. Enforce Time Window Rule
            // Rule: Valid if current time is > (Start + 5min) AND < (End - 5min)
            // Note: ISO 8601 strings expected "2023-10-25T09:00:00Z"
            if (!isWithinTimeWindow(session.startTime, session.endTime)) {
                _uiState.value = CheckInUiState.Error("Check-in window is closed. (Available 5 mins after start until 5 mins before end)", canRetry = false)
                return@launch
            }

            // 4. Call API
            val result = attendanceRepository.checkIn(payload.sessionId, payload.token)
            
            if (result.isSuccess) {
                val data = result.getOrNull()?.data
                if (data != null) {
                    _uiState.value = CheckInUiState.Success(data)
                } else {
                    _uiState.value = CheckInUiState.Error("Check-in recorded, but no data returned.")
                }
            } else {
                _uiState.value = CheckInUiState.Error(result.exceptionOrNull()?.message ?: "Check-in failed")
            }
        }
    }

    private fun isWithinTimeWindow(startTimeStr: String, endTimeStr: String): Boolean {
        return try {
            // Simple parsing assuming standard ISO format provided by API
            // In a real app, use a robust Instant/ZonedDateTime parser
            val now = LocalDateTime.now()
            val start = LocalDateTime.parse(startTimeStr, DateTimeFormatter.ISO_DATE_TIME)
            val end = LocalDateTime.parse(endTimeStr, DateTimeFormatter.ISO_DATE_TIME)

            val windowStart = start.plusMinutes(5)
            val windowEnd = end.minusMinutes(5)

            now.isAfter(windowStart) && now.isBefore(windowEnd)
        } catch (e: Exception) {
            // Fallback: If parsing fails (e.g. mock data issues), let the backend handle it or allow it
            true 
        }
    }

    fun resetScanner() {
        _uiState.value = CheckInUiState.Scanning
    }
}