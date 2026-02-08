from sqlalchemy.orm import Session
from models import User, Course, Session as DbSession, Attendance, Post
from datetime import datetime, timedelta
import uuid

def seed_data(db: Session):
    # Check if data exists
    if db.query(User).first():
        return

    # 1. Create Student
    student = User(
        id="MOCK_STUDENT_123",
        name="Alex Student",
        role="STUDENT",
        email="alex@leeds.ac.uk",
        level=12,
        current_xp=2450,
        streak_days=14
    )
    db.add(student)

    # 2. Create Staff
    staff = User(
        id="STAFF_001",
        name="Dr. Smith",
        role="STAFF",
        email="smith@leeds.ac.uk"
    )
    db.add(staff)

    # 3. Create Courses
    c1 = Course(id="c1", code="COMP3001", title="Advanced Software Engineering")
    c2 = Course(id="c2", code="COMP3220", title="Artificial Intelligence")
    c3 = Course(id="c3", code="LUBS1000", title="Innovation & Entrepreneurship")
    db.add_all([c1, c2, c3])
    db.commit()

    # 4. Create Sessions (Timetable)
    # Create sessions for Today
    now = datetime.now()
    today_start = now.replace(hour=9, minute=0, second=0, microsecond=0)
    
    # Session 1: 09:00 - 10:00 (Today)
    s1 = DbSession(
        id="s_today_1", course_id="c1", type="Lecture",
        start_time=today_start,
        end_time=today_start + timedelta(hours=1),
        location="Roger Stevens LT 20", lecturer="Dr. A. Smith",
        is_check_in_open=True
    )

    # Session 2: 11:00 - 13:00 (Today)
    s2 = DbSession(
        id="s_today_2", course_id="c2", type="Lab",
        start_time=today_start + timedelta(hours=2),
        end_time=today_start + timedelta(hours=4),
        location="EC Stoner 9.10", lecturer="Prof. B. Jones",
        is_check_in_open=False
    )
    
    # Past Sessions (for Risk Calculation)
    # Simulate 5 past sessions, student missed 2
    past_sessions = []
    for i in range(1, 6):
        past_date = now - timedelta(days=i)
        sess = DbSession(
            id=f"s_past_{i}", course_id="c1", type="Lecture",
            start_time=past_date, end_time=past_date + timedelta(hours=1),
            location="Remote", lecturer="Dr. Smith"
        )
        past_sessions.append(sess)
        
        # Mark attendance for 3 of them
        if i <= 3:
            att = Attendance(session_id=f"s_past_{i}", student_id=student.id, status="CHECKED_IN")
            db.add(att)
        else:
             # Add missed record explicitly or leave null (logic handles both)
             att = Attendance(session_id=f"s_past_{i}", student_id=student.id, status="MISSED")
             db.add(att)

    db.add_all([s1, s2] + past_sessions)

    # 5. Create Community Posts
    p1 = Post(
        id=str(uuid.uuid4()), author_name="Dr. Smith", author_role="STAFF",
        content="Reminder: Assignment 1 deadline extended by 24 hours due to server maintenance.",
        likes=45, comments_count=12, tags="Announcement,Help"
    )
    p2 = Post(
        id=str(uuid.uuid4()), author_name="Jamie Lee", author_role="STUDENT",
        content="Does anyone want to form a study group for the AI module? Meet at Laidlaw?",
        likes=8, comments_count=3, tags="Study Group,Social"
    )
    db.add_all([p1, p2])

    db.commit()
