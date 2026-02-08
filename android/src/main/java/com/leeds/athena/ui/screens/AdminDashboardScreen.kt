
package com.leeds.athena.ui.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.leeds.athena.ui.theme.LeedsBlue
import com.leeds.athena.ui.theme.RiskHigh
import com.leeds.athena.ui.viewmodel.AdminDashboardViewModel

@Composable
fun AdminDashboardScreen(
    onNavigateBack: () -> Unit,
    viewModel: AdminDashboardViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Staff Dashboard", fontWeight = FontWeight.Bold) },
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
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            item {
                Text("Attendance Trends", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(12.dp))
                AttendanceLineChart()
            }

            item {
                Text("Students At Risk", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(12.dp))
                StudentRiskTable()
            }
        }
    }
}

@Composable
fun AttendanceLineChart() {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = Modifier.fillMaxWidth().height(220.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Weekly Attendance Average (%)", style = MaterialTheme.typography.labelMedium, color = Color.Gray)
            Spacer(modifier = Modifier.height(24.dp))
            
            // Mock Data
            val data = listOf(0.85f, 0.82f, 0.78f, 0.88f, 0.75f, 0.70f)
            
            Box(modifier = Modifier.fillMaxSize()) {
                Canvas(modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp, vertical = 8.dp)) {
                    val width = size.width
                    val height = size.height
                    val spacing = width / (data.size - 1)
                    
                    val path = Path().apply {
                        data.forEachIndexed { index, fraction ->
                            val x = index * spacing
                            val y = height - (fraction * height)
                            if (index == 0) moveTo(x, y) else lineTo(x, y)
                        }
                    }

                    // Draw the line
                    drawPath(
                        path = path,
                        color = LeedsBlue,
                        style = Stroke(width = 3.dp.toPx())
                    )

                    // Draw dots
                    data.forEachIndexed { index, fraction ->
                        val x = index * spacing
                        val y = height - (fraction * height)
                        drawCircle(
                            color = LeedsBlue,
                            radius = 5.dp.toPx(),
                            center = Offset(x, y)
                        )
                        drawCircle(
                            color = Color.White,
                            radius = 2.dp.toPx(),
                            center = Offset(x, y)
                        )
                    }
                }
                
                // Labels
                Row(
                    modifier = Modifier.fillMaxWidth().align(Alignment.BottomCenter).padding(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    data.forEachIndexed { index, _ ->
                        Text("W${index + 1}", style = MaterialTheme.typography.labelSmall, color = Color.Gray)
                    }
                }
            }
        }
    }
}

@Composable
fun StudentRiskTable() {
    val students = listOf(
        StudentRisk("Alice Smith", "COMP3001", "High"),
        StudentRisk("Bob Jones", "COMP3220", "Medium"),
        StudentRisk("Charlie Brown", "LUBS1000", "Critical")
    )

    Card(
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFFF3F4F6))
                    .padding(12.dp)
            ) {
                Text("Student", modifier = Modifier.weight(1f), fontWeight = FontWeight.Bold)
                Text("Module", modifier = Modifier.weight(1f), fontWeight = FontWeight.Bold)
                Text("Risk", modifier = Modifier.width(80.dp), fontWeight = FontWeight.Bold)
            }
            
            students.forEach { student ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(student.name, modifier = Modifier.weight(1f))
                    Text(student.module, modifier = Modifier.weight(1f), color = Color.Gray)
                    
                    val color = when(student.risk) {
                        "Critical" -> RiskHigh
                        "High" -> Color(0xFFEF4444)
                        "Medium" -> Color(0xFFF59E0B)
                        else -> LeedsBlue
                    }
                    
                    Surface(
                        color = color.copy(alpha = 0.1f),
                        shape = RoundedCornerShape(4.dp),
                        modifier = Modifier.width(80.dp)
                    ) {
                        Text(
                            text = student.risk,
                            color = color,
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )
                    }
                }
                Divider(color = Color.Gray.copy(alpha = 0.1f))
            }
        }
    }
}

data class StudentRisk(val name: String, val module: String, val risk: String)
