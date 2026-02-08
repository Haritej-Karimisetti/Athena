package com.leeds.athena.data.model

import com.google.gson.annotations.SerializedName

// --- Check-In ---
data class CheckInRequest(
    @SerializedName("session_id") val sessionId: String,
    @SerializedName("qr_token") val qrToken: String,
    @SerializedName("timestamp") val timestamp: String
)

data class CheckInResponse(
    @SerializedName("status") val status: String,
    @SerializedName("message") val message: String,
    @SerializedName("data") val data: CheckInData?
)

data class CheckInData(
    @SerializedName("check_in_time") val checkInTime: String,
    @SerializedName("current_streak") val currentStreak: Int,
    @SerializedName("xp_gained") val xpGained: Int
)

// --- History ---
data class AttendanceHistoryResponse(
    @SerializedName("current_streak_days") val currentStreakDays: Int,
    @SerializedName("total_attendance_percentage") val totalAttendancePercentage: Double,
    @SerializedName("history") val history: List<AttendanceHistoryItem>
)

data class AttendanceHistoryItem(
    @SerializedName("date") val date: String,
    @SerializedName("session") val session: String,
    @SerializedName("status") val status: String
)

// --- Error ---
data class ApiErrorResponse(
    @SerializedName("detail") val detail: ErrorDetail
)

data class ErrorDetail(
    @SerializedName("code") val code: String,
    @SerializedName("message") val message: String
)
