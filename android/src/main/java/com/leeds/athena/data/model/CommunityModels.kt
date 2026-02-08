package com.leeds.athena.data.model

import com.google.gson.annotations.SerializedName

data class CommunityFeedResponse(
    @SerializedName("posts") val posts: List<Post>
)

data class Post(
    @SerializedName("id") val id: String,
    @SerializedName("author") val author: String,
    @SerializedName("role") val role: UserRole,
    @SerializedName("content") val content: String,
    @SerializedName("timestamp") val timestamp: String,
    @SerializedName("likes") val likes: Int,
    @SerializedName("comments_count") val commentsCount: Int,
    @SerializedName("tags") val tags: List<String>
)

enum class UserRole {
    @SerializedName("STAFF") STAFF,
    @SerializedName("STUDENT") STUDENT
}
