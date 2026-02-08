package com.leeds.athena.data.repository

import com.leeds.athena.data.api.AthenaApiService
import javax.inject.Inject

interface AdminRepository {
    suspend fun getDashboardStats(): Result<Map<String, Any>>
}

class AdminRepositoryImpl @Inject constructor(
    private val apiService: AthenaApiService
) : AdminRepository {

    override suspend fun getDashboardStats(): Result<Map<String, Any>> {
        return try {
            val response = apiService.getAdminDashboard()
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to load admin dashboard"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}