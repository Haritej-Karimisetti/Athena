
package com.leeds.athena.data.api

import com.leeds.athena.data.model.*
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

interface AthenaApiService {

    // --- Timetable ---
    @GET("athena/v1/timetable/today")
    suspend fun getTodayTimetable(): Response<TimetableResponse>

    // --- Attendance ---
    @POST("athena/v1/attendance/check-in")
    suspend fun checkIn(@Body request: CheckInRequest): Response<CheckInResponse>

    @GET("athena/v1/attendance/history")
    suspend fun getAttendanceHistory(): Response<AttendanceHistoryResponse>

    // --- Community ---
    @GET("athena/v1/community/feed")
    suspend fun getCommunityFeed(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 10
    ): Response<CommunityFeedResponse>

    // --- Engagement ---
    @GET("athena/v1/engagement/risk")
    suspend fun getEngagementRisk(): Response<EngagementRiskResponse>

    // --- Admin ---
    // Assuming a separate Admin model file or using a generic Map for dashboard for now
    @GET("athena/v1/admin/dashboard")
    suspend fun getAdminDashboard(): Response<Map<String, Any>>
}
