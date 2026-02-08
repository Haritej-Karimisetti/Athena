from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

# --- Enums ---
class UserRole(str, Enum):
    STAFF = "STAFF"
    STUDENT = "STUDENT"

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class MetricStatus(str, Enum):
    GOOD = "GOOD"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"

class AttendanceStatus(str, Enum):
    PENDING = "PENDING"
    CHECKED_IN = "CHECKED_IN"
    MISSED = "MISSED"

# --- Models ---

class SessionResponse(BaseModel):
    id: str
    module_code: str
    module_title: str
    type: str
    start_time: str
    end_time: str
    location: str
    lecturer: str
    is_check_in_open: bool
    attendance_status: AttendanceStatus

class TimetableResponse(BaseModel):
    date: str
    sessions: List[SessionResponse]

class CheckInRequest(BaseModel):
    session_id: str
    qr_token: str
    timestamp: str

class CheckInData(BaseModel):
    check_in_time: str
    current_streak: int
    xp_gained: int

class CheckInResponse(BaseModel):
    status: str
    message: str
    data: Optional[CheckInData] = None

class PostResponse(BaseModel):
    id: str
    author: str
    role: UserRole
    content: str
    timestamp: str
    likes: int
    comments_count: int
    tags: List[str]

class CommunityFeedResponse(BaseModel):
    posts: List[PostResponse]

class GamificationData(BaseModel):
    level: int
    current_xp: int
    next_level_xp: int
    avatar_url: str

class EngagementMetric(BaseModel):
    category: str
    score: int
    status: MetricStatus

class EngagementRiskResponse(BaseModel):
    student_id: str
    risk_level: RiskLevel
    gamification: GamificationData
    metrics: List[EngagementMetric]
    recommendations: List[str]
