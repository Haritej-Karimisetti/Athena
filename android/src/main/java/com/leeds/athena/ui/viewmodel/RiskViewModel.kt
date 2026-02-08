package com.leeds.athena.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.leeds.athena.data.model.EngagementMetric
import com.leeds.athena.data.model.RiskLevel
import com.leeds.athena.data.repository.EngagementRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class RiskUiState(
    val isLoading: Boolean = false,
    val riskLevel: RiskLevel = RiskLevel.LOW,
    val metrics: List<EngagementMetric> = emptyList(),
    val recommendations: List<String> = emptyList(),
    val error: String? = null
)

@HiltViewModel
class RiskViewModel @Inject constructor(
    private val repository: EngagementRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(RiskUiState(isLoading = true))
    val uiState: StateFlow<RiskUiState> = _uiState.asStateFlow()

    init {
        loadRiskData()
    }

    fun loadRiskData() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            val result = repository.getEngagementRisk()
            
            if (result.isSuccess) {
                val data = result.getOrNull()
                _uiState.value = RiskUiState(
                    isLoading = false,
                    riskLevel = data?.riskLevel ?: RiskLevel.LOW,
                    metrics = data?.metrics ?: emptyList(),
                    recommendations = data?.recommendations ?: emptyList()
                )
            } else {
                _uiState.value = RiskUiState(
                    isLoading = false,
                    error = result.exceptionOrNull()?.message
                )
            }
        }
    }
}