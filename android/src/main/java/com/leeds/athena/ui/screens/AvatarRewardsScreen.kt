package com.leeds.athena.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.leeds.athena.data.model.GamificationData
import com.leeds.athena.ui.theme.LeedsBlue
import com.leeds.athena.ui.viewmodel.AvatarViewModel

@Composable
fun AvatarRewardsScreen(
    onNavigateBack: () -> Unit,
    viewModel: AvatarViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("My Avatar & Rewards", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.White
                )
            )
        },
        containerColor = Color(0xFFF9FAFB)
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            uiState.gamificationData?.let { data ->
                AvatarHeader(data)
            } ?: run {
                if (uiState.isLoading) {
                    Box(Modifier.fillMaxWidth().height(200.dp), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator()
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Text(
                text = "Unlockable Rewards",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 16.dp)
            )
            
            Spacer(modifier = Modifier.height(8.dp))

            // Mock Reward Items based on user level
            val currentLevel = uiState.gamificationData?.level ?: 1
            val rewards = listOf(
                RewardItem("Coffee Voucher", "Lvl 5", currentLevel >= 5, "☕"),
                RewardItem("Library Pass", "Lvl 10", currentLevel >= 10, "📚"),
                RewardItem("Gold Border", "Lvl 15", currentLevel >= 15, "✨"),
                RewardItem("Hoodie Discount", "Lvl 20", currentLevel >= 20, "👕"),
                RewardItem("Special Badge", "Lvl 25", currentLevel >= 25, "🏅"),
                RewardItem("Cafe Meal", "Lvl 30", currentLevel >= 30, "🍔")
            )

            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                contentPadding = PaddingValues(16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(rewards) { reward ->
                    RewardCard(reward)
                }
            }
        }
    }
}

@Composable
fun AvatarHeader(data: GamificationData) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color.Transparent)
    ) {
        Box(
            modifier = Modifier
                .background(
                    Brush.verticalGradient(
                        colors = listOf(LeedsBlue, Color(0xFF3B82F6))
                    )
                )
                .padding(24.dp)
                .fillMaxWidth()
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.fillMaxWidth()
            ) {
                // Avatar Circle
                Box(
                    modifier = Modifier
                        .size(100.dp)
                        .clip(CircleShape)
                        .background(Color.White.copy(alpha = 0.2f))
                        .border(4.dp, Color.White.copy(alpha = 0.5f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "👾", // Placeholder Pixel Art
                        fontSize = 50.sp
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = "Level ${data.level}",
                    style = MaterialTheme.typography.headlineMedium,
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(8.dp))

                // XP Bar
                Column(modifier = Modifier.fillMaxWidth()) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "${data.currentXp} XP",
                            style = MaterialTheme.typography.bodySmall,
                            color = Color.White.copy(alpha = 0.8f)
                        )
                        Text(
                            text = "${data.nextLevelXp} XP",
                            style = MaterialTheme.typography.bodySmall,
                            color = Color.White.copy(alpha = 0.8f)
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    LinearProgressIndicator(
                        progress = { 
                            if (data.nextLevelXp > 0) data.currentXp.toFloat() / data.nextLevelXp.toFloat() else 0f
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(8.dp)
                            .clip(RoundedCornerShape(4.dp)),
                        color = Color(0xFFFFD700), // Gold
                        trackColor = Color.White.copy(alpha = 0.3f),
                    )
                }
            }
        }
    }
}

data class RewardItem(
    val name: String,
    val requirement: String,
    val isUnlocked: Boolean,
    val icon: String
)

@Composable
fun RewardCard(item: RewardItem) {
    Card(
        colors = CardDefaults.cardColors(
            containerColor = if (item.isUnlocked) Color.White else Color(0xFFF3F4F6)
        ),
        elevation = CardDefaults.cardElevation(
            defaultElevation = if (item.isUnlocked) 2.dp else 0.dp
        ),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier.height(140.dp)
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text(
                    text = if (item.isUnlocked) item.icon else "🔒",
                    fontSize = 32.sp
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = item.name,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center,
                    color = if (item.isUnlocked) Color.Black else Color.Gray
                )
                Spacer(modifier = Modifier.height(4.dp))
                if (!item.isUnlocked) {
                    Text(
                        text = "Unlock at ${item.requirement}",
                        style = MaterialTheme.typography.labelSmall,
                        color = Color.Gray
                    )
                } else {
                    Text(
                        text = "Unlocked!",
                        style = MaterialTheme.typography.labelSmall,
                        color = LeedsBlue,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
            
            if (item.isUnlocked) {
                Icon(
                    imageVector = Icons.Default.Star,
                    contentDescription = null,
                    tint = Color(0xFFFFD700),
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(8.dp)
                        .size(16.dp)
                )
            }
        }
    }
}
