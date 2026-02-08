from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    role = Column(String)  # STUDENT, STAFF
    email = Column(String)
    
    # Gamification
    level = Column(Integer, default=1)
    current_xp = Column(Integer, default=0)
    streak_days = Column(Integer, default=0)

    attendances = relationship("Attendance", back_populates="student")

class Course(Base):
    __tablename__ = "courses"
    id = Column(String, primary_key=True, index=True)
    code = Column(String) # e.g. COMP3001
    title = Column(String)

    sessions = relationship("Session", back_populates="course")

class Session(Base):
    __tablename__ = "sessions"
    id = Column(String, primary_key=True, index=True)
    course_id = Column(String, ForeignKey("courses.id"))
    type = Column(String) # Lecture, Lab, Seminar
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    location = Column(String)
    lecturer = Column(String)
    is_check_in_open = Column(Boolean, default=False)

    course = relationship("Course", back_populates="sessions")
    attendances = relationship("Attendance", back_populates="session")

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("sessions.id"))
    student_id = Column(String, ForeignKey("users.id"))
    status = Column(String) # CHECKED_IN, MISSED, PENDING
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    session = relationship("Session", back_populates="attendances")
    student = relationship("User", back_populates="attendances")

class Post(Base):
    __tablename__ = "posts"
    id = Column(String, primary_key=True, index=True)
    author_name = Column(String)
    author_role = Column(String)
    content = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    likes = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    tags = Column(String) # Comma separated for simplicity in SQLite
