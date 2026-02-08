package com.leeds.athena.data.model

import com.google.gson.annotations.SerializedName

data class EngagementRiskResponse(
    @SerializedName("student_id") val studentId: String,
    @SerializedName("risk_level") val riskLevel: RiskLevel,
    @SerializedName("gamification") val gamification: GamificationData,
    @SerializedName("metrics") val metrics: List<EngagementMetric>,
    @SerializedName("recommendations") val recommendations: List<String>
)

enum class RiskLevel {
    @SerializedName("LOW") LOW,
    @SerializedName("MEDIUM") MEDIUM,
    @SerializedName("HIGH") HIGH,
    @SerializedName("CRITICAL") CRITICAL
}

data class GamificationData(
    @SerializedName("level") val level: Int,
    @SerializedName("current_xp") val currentXp: Int,
    @SerializedName("next_level_xp") val nextLevelXp: Int,
    @SerializedName("avatar_url") val avatarUrl: String
)

data class EngagementMetric(
    @SerializedName("category") val category: String,
    @SerializedName("score") val score: Int,
    @SerializedName("status") val status: MetricStatus
)

enum class MetricStatus {
    @SerializedName("GOOD") GOOD,
    @SerializedName("WARNING") WARNING,
    @SerializedName("CRITICAL") CRITICAL
}
