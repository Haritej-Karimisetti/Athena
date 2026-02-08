
package com.leeds.athena.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.leeds.athena.data.model.Session
import com.leeds.athena.data.repository.TimetableRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class HomeUiState(
    val isLoading: Boolean = false,
    val nextClass: Session? = null,
    val userName: String = "John Snow", // Mocked
    val error: String? = null
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val timetableRepository: TimetableRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState(isLoading = true))
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init {
        loadHomeData()
    }

    private fun loadHomeData() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            
            val timetableResult = timetableRepository.getTodayTimetable()
            
            if (timetableResult.isSuccess) {
                // Logic to find the next upcoming class
                val sessions = timetableResult.getOrNull()?.sessions ?: emptyList()
                // Simple logic: first session that hasn't happened yet (mocking "now" logic)
                val nextClass = sessions.firstOrNull() 
                
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    nextClass = nextClass,
                    error = null
                )
            } else {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = timetableResult.exceptionOrNull()?.message ?: "Failed to load home data"
                )
            }
        }
    }
}
