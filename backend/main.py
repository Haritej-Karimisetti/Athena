from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import datetime
import random

from database import engine, Base, get_db
import models
import schemas
import seed

# Init DB
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Athena API")

# Allow CORS for mobile dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed Data on Startup
@app.on_event("startup")
def startup_event():
    db = next(get_db())
    seed.seed_data(db)

# --- Routes ---

# 1. Timetable
@app.get("/athena/v1/timetable/today", response_model=schemas.TimetableResponse)
def get_today_timetable(db: Session = Depends(get_db)):
    # In a real app, we filter by authenticated user ID
    student_id = "MOCK_STUDENT_123"
    
    # Get today's range (Mocking "today" as the seeded date logic)
    # For demo persistence, we just return the "s_today" sessions
    sessions = db.query(models.Session).filter(models.Session.id.contains("s_today")).all()
    
    response_sessions = []
    for s in sessions:
        # Check attendance status
        attendance = db.query(models.Attendance).filter(
            models.Attendance.session_id == s.id,
            models.Attendance.student_id == student_id
        ).first()
        
        status = schemas.AttendanceStatus.PENDING
        if attendance:
            status = schemas.AttendanceStatus(attendance.status)

        response_sessions.append(schemas.SessionResponse(
            id=s.id,
            module_code=s.course.code,
            module_title=s.course.title,
            type=s.type,
            start_time=s.start_time.isoformat(),
            end_time=s.end_time.isoformat(),
            location=s.location,
            lecturer=s.lecturer,
            is_check_in_open=s.is_check_in_open,
            attendance_status=status
        ))

    return schemas.TimetableResponse(
        date=datetime.datetime.now().strftime("%A, %d %B"),
        sessions=response_sessions
    )

# 2. Check-In
@app.post("/athena/v1/attendance/check-in", response_model=schemas.CheckInResponse)
def check_in(request: schemas.CheckInRequest, db: Session = Depends(get_db)):
    student_id = "MOCK_STUDENT_123"
    
    session = db.query(models.Session).filter(models.Session.id == request.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Check if already checked in
    existing = db.query(models.Attendance).filter(
        models.Attendance.session_id == request.session_id,
        models.Attendance.student_id == student_id
    ).first()

    if existing:
         return schemas.CheckInResponse(
            status="SUCCESS",
            message="Already checked in",
            data=None
        )

    # Record Attendance
    new_attendance = models.Attendance(
        session_id=request.session_id,
        student_id=student_id,
        status="CHECKED_IN",
        timestamp=datetime.datetime.utcnow()
    )
    db.add(new_attendance)

    # Gamification Update
    user = db.query(models.User).filter(models.User.id == student_id).first()
    xp_gained = 50
    user.current_xp += xp_gained
    user.streak_days += 1 # Simplified streak logic
    db.commit()

    return schemas.CheckInResponse(
        status="SUCCESS",
        message="Checked in successfully",
        data=schemas.CheckInData(
            check_in_time=datetime.datetime.now().isoformat(),
            current_streak=user.streak_days,
            xp_gained=xp_gained
        )
    )

# 3. Community Feed
@app.get("/athena/v1/community/feed", response_model=schemas.CommunityFeedResponse)
def get_community_feed(db: Session = Depends(get_db)):
    posts = db.query(models.Post).order_by(models.Post.timestamp.desc()).all()
    
    mapped_posts = []
    for p in posts:
        tags_list = p.tags.split(",") if p.tags else []
        mapped_posts.append(schemas.PostResponse(
            id=p.id,
            author=p.author_name,
            role=schemas.UserRole(p.author_role),
            content=p.content,
            timestamp=p.timestamp.strftime("%Y-%m-%d %H:%M"),
            likes=p.likes,
            comments_count=p.comments_count,
            tags=tags_list
        ))
    
    return schemas.CommunityFeedResponse(posts=mapped_posts)

# 4. Engagement Risk (The Logic)
@app.get("/athena/v1/engagement/risk", response_model=schemas.EngagementRiskResponse)
def get_engagement_risk(db: Session = Depends(get_db)):
    student_id = "MOCK_STUDENT_123"
    user = db.query(models.User).filter(models.User.id == student_id).first()

    # Calculate Attendance Rate
    # Find all sessions that have ended
    now = datetime.datetime.now()
    past_sessions_count = db.query(models.Session).filter(models.Session.end_time < now).count()
    attended_count = db.query(models.Attendance).filter(
        models.Attendance.student_id == student_id,
        models.Attendance.status == "CHECKED_IN"
    ).count()

    attendance_rate = 100
    if past_sessions_count > 0:
        attendance_rate = int((attended_count / past_sessions_count) * 100)

    # Determine Risk Level
    risk_level = schemas.RiskLevel.LOW
    recommendations = []
    
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
            level=user.level,
            current_xp=user.current_xp,
            next_level_xp=3000,
            avatar_url=""
        ),
        metrics=metrics,
        recommendations=recommendations
    )

# 5. Admin Dashboard
@app.get("/athena/v1/admin/dashboard")
def get_admin_dashboard(db: Session = Depends(get_db)):
    # Simple aggregate stats
    total_students = db.query(models.User).filter(models.User.role == "STUDENT").count()
    total_checkins = db.query(models.Attendance).filter(models.Attendance.status == "CHECKED_IN").count()
    
    return {
        "total_students_monitored": total_students,
        "total_checkins_today": total_checkins,
        "average_attendance": "78%",
        "at_risk_count": 12
    }
