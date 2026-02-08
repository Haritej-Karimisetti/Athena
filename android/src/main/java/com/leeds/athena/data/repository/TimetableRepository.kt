package com.leeds.athena.data.repository

import com.leeds.athena.data.api.AthenaApiService
import com.leeds.athena.data.model.TimetableResponse
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

interface TimetableRepository {
    suspend fun getTodayTimetable(): Result<TimetableResponse>
}

class TimetableRepositoryImpl @Inject constructor(
    private val apiService: AthenaApiService
) : TimetableRepository {

    override suspend fun getTodayTimetable(): Result<TimetableResponse> {
        return try {
            val response = apiService.getTodayTimetable()
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Error fetching timetable: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
