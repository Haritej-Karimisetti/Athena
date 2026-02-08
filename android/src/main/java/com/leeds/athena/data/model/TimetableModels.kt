package com.leeds.athena.data.model

import com.google.gson.annotations.SerializedName

data class TimetableResponse(
    @SerializedName("date") val date: String,
    @SerializedName("sessions") val sessions: List<Session>
)

data class Session(
    @SerializedName("id") val id: String,
    @SerializedName("module_code") val moduleCode: String,
    @SerializedName("module_title") val moduleTitle: String,
    @SerializedName("type") val type: String,
    @SerializedName("start_time") val startTime: String,
    @SerializedName("end_time") val endTime: String,
    @SerializedName("location") val location: String,
    @SerializedName("lecturer") val lecturer: String,
    @SerializedName("is_check_in_open") val isCheckInOpen: Boolean,
    @SerializedName("attendance_status") val attendanceStatus: AttendanceStatus
)

enum class AttendanceStatus {
    @SerializedName("PENDING") PENDING,
    @SerializedName("CHECKED_IN") CHECKED_IN,
    @SerializedName("MISSED") MISSED
}