package com.leeds.athena.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.leeds.athena.data.model.GamificationData
import com.leeds.athena.data.repository.EngagementRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class AvatarUiState(
    val isLoading: Boolean = false,
    val gamificationData: GamificationData? = null,
    val error: String? = null
)

@HiltViewModel
class AvatarViewModel @Inject constructor(
    private val repository: EngagementRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(AvatarUiState(isLoading = true))
    val uiState: StateFlow<AvatarUiState> = _uiState.asStateFlow()

    init {
        loadAvatarData()
    }

    private fun loadAvatarData() {
        viewModelScope.launch {
            val result = repository.getEngagementRisk()
            if (result.isSuccess) {
                _uiState.value = AvatarUiState(
                    isLoading = false,
                    gamificationData = result.getOrNull()?.gamification
                )
            } else {
                _uiState.value = AvatarUiState(
                    isLoading = false,
                    error = result.exceptionOrNull()?.message
                )
            }
        }
    }
}