package com.leeds.athena.ui.theme

import androidx.compose.ui.graphics.Color

// Brand Colors
val LeedsRed = Color(0xFFC50032)
val LeedsGreen = Color(0xFF00B140)
val LeedsDark = Color(0xFF2D2D2D)
val LeedsLight = Color(0xFFF5F5F5)
val LeedsBlue = Color(0xFF0057B8)

// Status Colors for Attendance
val StatusCheckedIn = Color(0xFF16A34A) // Green 600
val StatusMissed = Color(0xFFDC2626)    // Red 600
val StatusPending = Color(0xFFD97706)   // Amber 600
val StatusCheckedInBg = Color(0xFFDCFCE7) // Green 100
val StatusMissedBg = Color(0xFFFEE2E2)    // Red 100
val StatusPendingBg = Color(0xFFFEF3C7)   // Amber 100

// Semantic Colors
val RiskHigh = Color(0xFFEF4444)
val RiskMedium = Color(0xFFF59E0B)
val RiskLow = Color(0xFF10B981)

// 'Obsidian' Dark Mode & 'Paper' Light Mode
val ObsidianBackground = Color(0xFF18181B) // Zinc 900
val ObsidianSurface = Color(0xFF27272A)    // Zinc 800
val PaperBackground = Color(0xFFFAFAFA)    // Zinc 50
val PaperSurface = Color(0xFFFFFFFF)       // White

// M3 Light Theme Colors (Paper)
val LightPrimary = LeedsBlue
val LightOnPrimary = Color.White
val LightPrimaryContainer = Color(0xFFDBEAFE)
val LightOnPrimaryContainer = Color(0xFF1E3A8A)
val LightSecondary = Color(0xFF52525B) // Zinc 600
val LightOnSecondary = Color.White
val LightSecondaryContainer = Color(0xFFE4E4E7)
val LightOnSecondaryContainer = Color(0xFF18181B)
val LightBackground = PaperBackground
val LightOnBackground = Color(0xFF18181B)
val LightSurface = PaperSurface
val LightOnSurface = Color(0xFF18181B)
val LightSurfaceVariant = Color(0xFFE4E4E7)
val LightOnSurfaceVariant = Color(0xFF52525B)
val LightError = LeedsRed
val LightOnError = Color.White

// M3 Dark Theme Colors (Obsidian) - Updated to Orange Accents
val DarkPrimary = Color(0xFFFB923C) // Orange 400
val DarkOnPrimary = Color(0xFF431407) // Orange 950
val DarkPrimaryContainer = Color(0xFF9A3412) // Orange 800
val DarkOnPrimaryContainer = Color(0xFFFFDBC8) // Orange 100
val DarkSecondary = Color(0xFFA1A1AA) // Zinc 400
val DarkOnSecondary = Color(0xFF27272A)
val DarkSecondaryContainer = Color(0xFF3F3F46)
val DarkOnSecondaryContainer = Color(0xFFE4E4E7)
val DarkBackground = ObsidianBackground
val DarkOnBackground = Color(0xFFF4F4F5)
val DarkSurface = ObsidianSurface
val DarkOnSurface = Color(0xFFF4F4F5)
val DarkSurfaceVariant = Color(0xFF3F3F46)
val DarkOnSurfaceVariant = Color(0xFFA1A1AA)
val DarkError = Color(0xFFF87171)
val DarkOnError = Color(0xFF450A0A)