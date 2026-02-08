package com.leeds.athena.data.repository

import com.leeds.athena.data.api.AthenaApiService
import com.leeds.athena.data.model.AttendanceHistoryResponse
import com.leeds.athena.data.model.CheckInRequest
import com.leeds.athena.data.model.CheckInResponse
import javax.inject.Inject

interface AttendanceRepository {
    suspend fun checkIn(sessionId: String, qrToken: String): Result<CheckInResponse>
    suspend fun getHistory(): Result<AttendanceHistoryResponse>
}

class AttendanceRepositoryImpl @Inject constructor(
    private val apiService: AthenaApiService
) : AttendanceRepository {

    override suspend fun checkIn(sessionId: String, qrToken: String): Result<CheckInResponse> {
        return try {
            val timestamp = java.time.Instant.now().toString()
            val request = CheckInRequest(sessionId, qrToken, timestamp)
            
            val response = apiService.checkIn(request)
            
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                // In a real app, parse error body for "WINDOW_EXPIRED" etc.
                Result.failure(Exception("Check-in failed: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getHistory(): Result<AttendanceHistoryResponse> {
        return try {
            val response = apiService.getAttendanceHistory()
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch history"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
