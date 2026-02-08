package com.leeds.athena.data.api

import com.leeds.athena.data.model.*
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

interface AthenaApiService {

    // --- Timetable ---
    @GET("timetable/today")
    suspend fun getTodayTimetable(): Response<TimetableResponse>

    // --- Attendance ---
    @POST("attendance/check-in")
    suspend fun checkIn(@Body request: CheckInRequest): Response<CheckInResponse>

    @GET("attendance/history")
    suspend fun getAttendanceHistory(): Response<AttendanceHistoryResponse>

    // --- Community ---
    @GET("community/feed")
    suspend fun getCommunityFeed(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 10
    ): Response<CommunityFeedResponse>

    // --- Engagement ---
    @GET("engagement/risk")
    suspend fun getEngagementRisk(): Response<EngagementRiskResponse>

    // --- Admin ---
    // Assuming a separate Admin model file or using a generic Map for dashboard for now
    @GET("admin/dashboard")
    suspend fun getAdminDashboard(): Response<Map<String, Any>>
}
