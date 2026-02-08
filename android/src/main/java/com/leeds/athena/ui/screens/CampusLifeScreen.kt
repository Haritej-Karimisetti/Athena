package com.leeds.athena.ui.screens

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.leeds.athena.ui.theme.LeedsBlue
import com.leeds.athena.ui.theme.LeedsGreen

data class CampusLocation(
    val id: String,
    val name: String,
    val description: String,
    val fullDescription: String,
    val imageUrl: String,
    val tags: List<String>,
    val address: String,
    val openingHours: String,
    val facilities: List<String>
)

val CAMPUS_LOCATIONS = listOf(
    CampusLocation(
        "1", "Parkinson Building", 
        "The iconic clock tower and entrance to the university.",
        "Opened in 1951, the Parkinson Building is a Grade II listed art deco building that serves as a landmark for the university and the city of Leeds. It houses the Brotherton Library collection and the university art gallery.",
        "https://images.unsplash.com/photo-1548842145-23c8a3233306?auto=format&fit=crop&q=80&w=800",
        listOf("Landmark", "Art Gallery", "Cafe"),
        "Woodhouse Lane, Leeds LS2 9JT",
        "08:00 - 20:00",
        listOf("Treasures Gallery", "Stanley & Audrey Burton Gallery", "Parkinson Court Cafe")
    ),
    CampusLocation(
        "2", "Leeds University Union", 
        "The heart of student life with clubs, shops, and bars.",
        "LUU is a charity that supports over 38,000 students. It was the first students' union in the UK to be awarded 'Excellent' status by the NUS.",
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        listOf("Social", "Shops", "Events"),
        "Lifton Place, Leeds LS2 9JZ",
        "08:00 - Late",
        listOf("Old Bar", "Terrace", "Co-op", "Common Ground", "Riley Smith Theatre")
    ),
    CampusLocation(
        "3", "Edward Boyle Library", 
        "Modern library with extensive study spaces.",
        "Recently refurbished, 'Eddy B' offers over 2,000 study spaces, research hubs, and a dedicated postgraduate level. It is one of the busiest libraries on campus.",
        "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800",
        listOf("Study", "Quiet", "Resources"),
        "University of Leeds, Leeds LS2 9JT",
        "24/7 (Term Time)",
        listOf("Group Study Rooms", "Postgraduate Roof Garden", "Cafe", "IT Clusters")
    ),
    CampusLocation(
        "4", "Roger Stevens", 
        "Brutalist building housing 25 lecture theatres.",
        "A Grade II* listed building known for its unique brutalist architecture. It is the primary teaching building for many faculties and features a complex layout of tiered lecture theatres.",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
        listOf("Lectures", "Coffee Bar", "Pond"),
        "University of Leeds, Willow Terrace Road",
        "08:00 - 18:00",
        listOf("Lecture Theatres", "Sustainable Garden", "Coffee Bar", "Vending Machines")
    )
)

@Composable
fun CampusLifeScreen(onNavigateBack: () -> Unit) {
    var selectedLocation by remember { mutableStateOf<CampusLocation?>(null) }

    // Handle Back Press to close detail view first
    BackHandler(enabled = selectedLocation != null) {
        selectedLocation = null
    }

    if (selectedLocation != null) {
        CampusLocationDetail(location = selectedLocation!!) {
            selectedLocation = null
        }
    } else {
        Scaffold(
            topBar = {
                TopAppBar(
                    title = { Text("Campus Life", fontWeight = FontWeight.Bold) },
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
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                item {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = LeedsBlue),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(24.dp)) {
                            Text(
                                text = "Welcome to Leeds",
                                style = MaterialTheme.typography.headlineSmall,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "Explore the vibrant spaces that make our campus unique. Tap a location to learn more.",
                                style = MaterialTheme.typography.bodyMedium,
                                color = Color.White.copy(alpha = 0.9f)
                            )
                        }
                    }
                }

                items(CAMPUS_LOCATIONS) { location ->
                    LocationCard(location) {
                        selectedLocation = location
                    }
                }
            }
        }
    }
}

@Composable
fun LocationCard(location: CampusLocation, onClick: () -> Unit) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
    ) {
        Column {
            Box(modifier = Modifier.height(200.dp).fillMaxWidth()) {
                Image(
                    painter = rememberAsyncImagePainter(location.imageUrl),
                    contentDescription = location.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = Color.White.copy(alpha = 0.9f),
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(12.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Place,
                        contentDescription = null,
                        tint = LeedsBlue,
                        modifier = Modifier.padding(8.dp).size(20.dp)
                    )
                }
                
                // Overlay Tags on Image for style
                Row(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    location.tags.take(3).forEach { tag ->
                        Surface(
                            color = Color.Black.copy(alpha = 0.6f),
                            shape = RoundedCornerShape(4.dp)
                        ) {
                            Text(
                                text = tag.uppercase(),
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = Color.White,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                    }
                }
            }
            
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = location.name,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                
                Spacer(modifier = Modifier.height(4.dp))
                
                Text(
                    text = location.description,
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.Gray,
                    maxLines = 2
                )
            }
        }
    }
}

@Composable
fun CampusLocationDetail(location: CampusLocation, onBack: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .verticalScroll(rememberScrollState())
    ) {
        // Hero Image
        Box(modifier = Modifier.height(300.dp).fillMaxWidth()) {
            Image(
                painter = rememberAsyncImagePainter(location.imageUrl),
                contentDescription = location.name,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
            
            // Gradient Overlay
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.8f)),
                            startY = 300f
                        )
                    )
            )

            // Back Button
            // Uses statusBarsPadding() to ensure it clears the system bar
            IconButton(
                onClick = onBack,
                modifier = Modifier
                    .statusBarsPadding()
                    .padding(top = 8.dp, start = 16.dp)
                    .clip(CircleShape)
                    .background(Color.Black.copy(alpha = 0.4f))
            ) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
            }

            // Title overlaid
            Column(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(24.dp)
            ) {
                Text(
                    text = location.name,
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    location.tags.forEach { tag ->
                        Surface(
                            color = Color.White.copy(alpha = 0.2f),
                            shape = RoundedCornerShape(4.dp)
                        ) {
                            Text(
                                text = tag,
                                style = MaterialTheme.typography.labelSmall,
                                color = Color.White,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }
                }
            }
        }

        Column(modifier = Modifier.padding(24.dp)) {
            // About Section
            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(bottom = 8.dp)) {
                Icon(Icons.Default.Info, contentDescription = null, tint = LeedsBlue, modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("About", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            }
            Text(
                text = location.fullDescription,
                style = MaterialTheme.typography.bodyLarge,
                color = Color.Gray,
                lineHeight = 24.sp
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Info Card
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFFF9FAFB)),
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE5E7EB)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    Row(verticalAlignment = Alignment.Top) {
                        Icon(Icons.Default.Place, contentDescription = null, tint = Color.Gray, modifier = Modifier.size(20.dp))
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text("ADDRESS", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold, color = Color.Gray)
                            Text(location.address, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Medium)
                        }
                    }
                    Divider(color = Color(0xFFE5E7EB))
                    Row(verticalAlignment = Alignment.Top) {
                        Icon(Icons.Default.Schedule, contentDescription = null, tint = Color.Gray, modifier = Modifier.size(20.dp))
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text("OPENING HOURS", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold, color = Color.Gray)
                            Text(location.openingHours, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Medium)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Facilities
            Text("Key Facilities", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 12.dp))
            
            // Grid of facilities
            // Using a simple column of rows for better control inside a scrollable column than nested lazygrids
            location.facilities.chunked(2).forEach { rowItems ->
                Row(
                    modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    rowItems.forEach { facility ->
                        Surface(
                            modifier = Modifier.weight(1f),
                            color = Color.White,
                            shape = RoundedCornerShape(8.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE5E7EB)),
                            shadowElevation = 1.dp
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(LeedsGreen))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(facility, style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.Medium)
                            }
                        }
                    }
                    if (rowItems.size == 1) {
                        Spacer(modifier = Modifier.weight(1f))
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(40.dp))
        }
    }
}