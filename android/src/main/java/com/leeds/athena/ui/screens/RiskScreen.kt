package com.leeds.athena.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.leeds.athena.data.model.EngagementMetric
import com.leeds.athena.data.model.MetricStatus
import com.leeds.athena.data.model.RiskLevel
import com.leeds.athena.ui.theme.*
import com.leeds.athena.ui.viewmodel.RiskViewModel

@Composable
fun RiskScreen(
    onNavigateBack: () -> Unit,
    viewModel: RiskViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Engagement Risk", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        },
        containerColor = Color(0xFFF9FAFB)
    ) { paddingValues ->
        if (uiState.isLoading) {
            Box(Modifier.fillMaxSize().padding(paddingValues), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Risk Gauge
                item {
                    RiskLevelCard(uiState.riskLevel)
                }

                // Metrics
                item {
                    Text(
                        "Contributing Factors",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                }
                items(uiState.metrics) { metric ->
                    MetricCard(metric)
                }

                // Recommendations
                item {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "Recommendations",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                }
                items(uiState.recommendations) { rec ->
                    RecommendationCard(rec)
                }
            }
        }
    }
}

@Composable
fun RiskLevelCard(riskLevel: RiskLevel) {
    val (color, label, icon) = when (riskLevel) {
        RiskLevel.LOW -> Triple(LeedsGreen, "Low Risk", Icons.Default.CheckCircle)
        RiskLevel.MEDIUM -> Triple(RiskMedium, "Medium Risk", Icons.Default.Warning)
        RiskLevel.HIGH -> Triple(RiskHigh, "High Risk", Icons.Default.Error)
        RiskLevel.CRITICAL -> Triple(RiskHigh, "Critical Risk", Icons.Default.Report)
    }

    Card(
        colors = CardDefaults.cardColors(containerColor = color),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier.fillMaxWidth().height(160.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = Color.White,
                modifier = Modifier.size(48.dp)
            )
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = label,
                style = MaterialTheme.typography.headlineMedium,
                color = Color.White,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "Based on attendance & VLE activity",
                style = MaterialTheme.typography.bodySmall,
                color = Color.White.copy(alpha = 0.8f)
            )
        }
    }
}

@Composable
fun MetricCard(metric: EngagementMetric) {
    val color = when (metric.status) {
        MetricStatus.GOOD -> LeedsGreen
        MetricStatus.WARNING -> RiskMedium
        MetricStatus.CRITICAL -> RiskHigh
    }

    Card(
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = metric.category,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.SemiBold
                )
                Text(
                    text = metric.status.name,
                    style = MaterialTheme.typography.labelSmall,
                    color = color
                )
            }
            
            // Progress Bar
            Box(modifier = Modifier.width(100.dp).height(8.dp).clip(RoundedCornerShape(4.dp)).background(Color.Gray.copy(alpha = 0.1f))) {
                Box(modifier = Modifier.fillMaxHeight().fillMaxWidth(metric.score / 100f).background(color))
            }
            
            Spacer(modifier = Modifier.width(12.dp))
            Text(
                text = "${metric.score}%",
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
fun RecommendationCard(text: String) {
    Card(
        colors = CardDefaults.cardColors(containerColor = LeedsBlue.copy(alpha = 0.05f)),
        shape = RoundedCornerShape(8.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.Top) {
            Icon(Icons.Default.Info, contentDescription = null, tint = LeedsBlue, modifier = Modifier.size(20.dp))
            Spacer(modifier = Modifier.width(12.dp))
            Text(text = text, style = MaterialTheme.typography.bodyMedium, color = LeedsDark)
        }
    }
}