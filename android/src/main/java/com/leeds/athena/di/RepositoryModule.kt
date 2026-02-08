
package com.leeds.athena.di

import android.content.Context
import com.leeds.athena.data.api.AthenaApiService
import com.leeds.athena.data.repository.*
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object RepositoryModule {

    @Provides
    @Singleton
    fun provideTimetableRepository(apiService: AthenaApiService): TimetableRepository {
        return TimetableRepositoryImpl(apiService)
    }

    @Provides
    @Singleton
    fun provideAttendanceRepository(apiService: AthenaApiService): AttendanceRepository {
        return AttendanceRepositoryImpl(apiService)
    }

    @Provides
    @Singleton
    fun provideCommunityRepository(apiService: AthenaApiService): CommunityRepository {
        return CommunityRepositoryImpl(apiService)
    }

    @Provides
    @Singleton
    fun provideEngagementRepository(apiService: AthenaApiService): EngagementRepository {
        return EngagementRepositoryImpl(apiService)
    }
    
    @Provides
    @Singleton
    fun provideAdminRepository(apiService: AthenaApiService): AdminRepository {
        return AdminRepositoryImpl(apiService)
    }

    @Provides
    @Singleton
    fun provideUserPreferencesRepository(@ApplicationContext context: Context): UserPreferencesRepository {
        return UserPreferencesRepository(context)
    }
}
