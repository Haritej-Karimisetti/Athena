package com.leeds.athena.data.repository

import com.leeds.athena.data.api.AthenaApiService
import com.leeds.athena.data.model.CommunityFeedResponse
import javax.inject.Inject

interface CommunityRepository {
    suspend fun getFeed(page: Int = 1): Result<CommunityFeedResponse>
}

class CommunityRepositoryImpl @Inject constructor(
    private val apiService: AthenaApiService
) : CommunityRepository {

    override suspend fun getFeed(page: Int): Result<CommunityFeedResponse> {
        return try {
            val response = apiService.getCommunityFeed(page = page)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to load feed: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}