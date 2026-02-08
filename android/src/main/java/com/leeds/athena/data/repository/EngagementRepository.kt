package com.leeds.athena.data.repository

import com.leeds.athena.data.api.AthenaApiService
import com.leeds.athena.data.model.EngagementRiskResponse
import javax.inject.Inject

interface EngagementRepository {
    suspend fun getEngagementRisk(): Result<EngagementRiskResponse>
}

class EngagementRepositoryImpl @Inject constructor(
    private val apiService: AthenaApiService
) : EngagementRepository {

    override suspend fun getEngagementRisk(): Result<EngagementRiskResponse> {
        return try {
            val response = apiService.getEngagementRisk()
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to load engagement data: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}