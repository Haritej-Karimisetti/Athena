from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import datetime
import random
import uuid

import schemas
from sheets_client import SheetsClient

app = FastAPI(title="Athena API")

# Allow CORS for mobile dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Singleton Sheets Client ---
# This approach creates one client instance to be reused across requests.
sheets_client = SheetsClient()

def get_sheets_client():
    return sheets_client

# --- Routes ---

# 1. Timetable
@app.get("/athena/v1/timetable/today", response_model=schemas.TimetableResponse)
def get_today_timetable(client: SheetsClient = Depends(get_sheets_client)):
    student_id = "MOCK_STUDENT_123"
    
    # Get all sessions and attendance records
    all_sessions = client.get_all_records('Sessions')
    all_attendance = client.get_all_records('Attendance')

    # Filter for today's sessions (simple string matching for demo)
    today_str = datetime.datetime.now().strftime("%Y-%m-%d")
    today_sessions = [s for s in all_sessions if s['start_time'].startswith(today_str)]
    
    response_sessions = []
    for s in today_sessions:
        # Find the student's attendance for this session
        attendance_record = next((a for a in all_attendance if a['session_id'] == s['id'] and a['student_id'] == student_id), None)
        
        status = schemas.AttendanceStatus.PENDING
        if attendance_record:
            status = schemas.AttendanceStatus(attendance_record['status'])

        response_sessions.append(schemas.SessionResponse(
            id=s['id'],
            module_code=s['course_code'],
            module_title=s['course_title'],
            type=s['type'],
            start_time=s['start_time'],
            end_time=s['end_time'],
            location=s['location'],
            lecturer=s['lecturer'],
            is_check_in_open=s['is_check_in_open'].upper() == 'TRUE',
            attendance_status=status
        ))

    return schemas.TimetableResponse(
        date=datetime.datetime.now().strftime("%A, %d %B"),
        sessions=response_sessions
    )

# 2. Check-In
@app.post("/athena/v1/attendance/check-in", response_model=schemas.CheckInResponse)
def check_in(request: schemas.CheckInRequest, client: SheetsClient = Depends(get_sheets_client)):
    student_id = "MOCK_STUDENT_123"
    
    # Check if session exists
    session = client.find_record('Sessions', 'id', request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Check if already checked in
    attendance_records = client.get_all_records('Attendance')
    existing = any(a for a in attendance_records if a['session_id'] == request.session_id and a['student_id'] == student_id)
    if existing:
         return schemas.CheckInResponse(status="SUCCESS", message="Already checked in", data=None)

    # Append to Attendance Sheet
    new_attendance_row = [
        str(uuid.uuid4()),  # id
        request.session_id,
        student_id,
        "CHECKED_IN",
        datetime.datetime.utcnow().isoformat()
    ]
    client.append_row('Attendance', new_attendance_row)

    # Update User XP and Streak
    user_row, user_data = client.find_row_and_data('Users', 'id', student_id)
    if not user_row or not user_data:
        raise HTTPException(status_code=404, detail="User not found")
        
    xp_gained = 50
    new_xp = int(user_data.get('current_xp', 0)) + xp_gained
    new_streak = int(user_data.get('streak_days', 0)) + 1
    
    client.update_cell('Users', user_row, 6, new_xp) # Col F for current_xp
    client.update_cell('Users', user_row, 7, new_streak) # Col G for streak_days
    
    return schemas.CheckInResponse(
        status="SUCCESS",
        message="Checked in successfully",
        data=schemas.CheckInData(
            check_in_time=datetime.datetime.now().isoformat(),
            current_streak=new_streak,
            xp_gained=xp_gained
        )
    )

# 3. Community Feed
@app.get("/athena/v1/community/feed", response_model=schemas.CommunityFeedResponse)
def get_community_feed(client: SheetsClient = Depends(get_sheets_client)):
    posts_data = client.get_all_records('Posts')
    
    # Sort by timestamp descending (assuming ISO format)
    posts_data.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
    
    mapped_posts = []
    for p in posts_data:
        tags_list = p.get('tags', '').split(",") if p.get('tags') else []
        mapped_posts.append(schemas.PostResponse(
            id=p['id'],
            author=p['author_name'],
            role=schemas.UserRole(p['author_role']),
            content=p['content'],
            timestamp=p.get('timestamp', ''),
            likes=int(p.get('likes', 0)),
            comments_count=int(p.get('comments_count', 0)),
            tags=tags_list
        ))
    
    return schemas.CommunityFeedResponse(posts=mapped_posts)

# 4. Engagement Risk (The Logic)
@app.get("/athena/v1/engagement/risk", response_model=schemas.EngagementRiskResponse)
def get_engagement_risk(client: SheetsClient = Depends(get_sheets_client)):
    student_id = "MOCK_STUDENT_123"
    user_data = client.find_record('Users', 'id', student_id)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    # Calculate Attendance Rate
    all_sessions = client.get_all_records('Sessions')
    all_attendance = client.get_all_records('Attendance')

    now = datetime.datetime.utcnow()
    # Note: Comparing ISO string dates
    past_sessions = [s for s in all_sessions if s['end_time'] < now.isoformat()]
    
    student_attended = [a for a in all_attendance if a['student_id'] == student_id and a['status'] == 'CHECKED_IN']
    
    attendance_rate = 100
    if len(past_sessions) > 0:
        attendance_rate = int((len(student_attended) / len(past_sessions)) * 100)

    # Determine Risk Level
    risk_level, recommendations = schemas.RiskLevel.LOW, []
    if attendance_rate < 50:
        risk_level = schemas.RiskLevel.CRITICAL
        recommendations.append("Book an urgent meeting with your personal tutor.")
    elif attendance_rate < 70:
        risk_level = schemas.RiskLevel.HIGH
        recommendations.append("Your attendance is dropping. Review missed lectures on Minerva.")
    elif attendance_rate < 85:
        risk_level = schemas.RiskLevel.MEDIUM
        recommendations.append("Try to attend all sessions next week to boost your streak.")
    
    # Mock other metrics
    vle_score = random.randint(40, 90)
    submission_score = random.randint(60, 100)

    metrics = [
        schemas.EngagementMetric(
            category="Attendance", 
            score=attendance_rate, 
            status=schemas.MetricStatus.CRITICAL if attendance_rate < 50 else schemas.MetricStatus.GOOD
        ),
        schemas.EngagementMetric(
            category="VLE Activity", 
            score=vle_score, 
            status=schemas.MetricStatus.WARNING if vle_score < 60 else schemas.MetricStatus.GOOD
        ),
        schemas.EngagementMetric(
            category="Submissions", 
            score=submission_score, 
            status=schemas.MetricStatus.GOOD
        )
    ]

    return schemas.EngagementRiskResponse(
        student_id=student_id,
        risk_level=risk_level,
        gamification=schemas.GamificationData(
            level=int(user_data.get('level', 1)),
            current_xp=int(user_data.get('current_xp', 0)),
            next_level_xp=3000, # Mocked
            avatar_url=""
        ),
        metrics=metrics,
        recommendations=recommendations
    )
