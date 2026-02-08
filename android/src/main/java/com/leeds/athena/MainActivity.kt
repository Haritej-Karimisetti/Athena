
package com.leeds.athena

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.leeds.athena.ui.screens.*
import com.leeds.athena.ui.theme.AthenaTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AthenaTheme {
                val navController = rememberNavController()
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    NavHost(navController = navController, startDestination = "home") {
                        composable("home") {
                            HomeScreen(onNavigate = { route -> navController.navigate(route) })
                        }
                        composable("check_in") {
                            CheckInScannerScreen(onNavigateBack = { navController.popBackStack() })
                        }
                        composable("wellbeing") {
                            RiskScreen(onNavigateBack = { navController.popBackStack() })
                        }
                        composable("community") {
                            CommunityScreen(onNavigateBack = { navController.popBackStack() })
                        }
                        composable("campus") {
                            CampusLifeScreen(onNavigateBack = { navController.popBackStack() })
                        }
                        composable("settings") {
                            SettingsScreen(onNavigateBack = { navController.popBackStack() })
                        }
                         composable("rewards") {
                            AvatarRewardsScreen(onNavigateBack = { navController.popBackStack() })
                        }
                        composable("admin") {
                            AdminDashboardScreen(onNavigateBack = { navController.popBackStack() })
                        }
                    }
                }
            }
        }
    }
}
