# AI-Powered Personalized Learning Path Generator - Backend

A Flask-based REST API backend for the AI-Powered Personalized Learning Path Generator system.

## Features

- Learner profile registration
- Skill assessment submission
- AI-powered learning path generation with skill gap analysis
- Course recommendation system
- Progress tracking and dashboard data

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Prepare Data Files

Ensure the following CSV files exist in the `data/` directory:
- `students.csv` - Sample student data
- `courses.csv` - Course catalog with metadata

### 3. Run the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### 1. Register Learner Profile
**POST** `/register`

Request Body:
```json
{
  "fullName": "John Doe",
  "age": 22,
  "educationLevel": "Bachelor's Degree",
  "currentDomain": "web-development",
  "careerGoal": "Become a full-stack developer",
  "experienceLevel": "intermediate",
  "learningStyle": "video",
  "weeklyStudyHours": 10
}
```

Response:
```json
{
  "success": true,
  "message": "Learner profile registered successfully",
  "userId": "user_20241201120000",
  "profile": {...}
}
```

### 2. Submit Skill Assessment
**POST** `/assessment`

Request Body:
```json
{
  "userId": "user_20241201120000",
  "skills": [
    {"name": "JavaScript", "level": 3},
    {"name": "React", "level": 2},
    {"name": "Node.js", "level": 1}
  ]
}
```

Response:
```json
{
  "success": true,
  "message": "Skill assessment submitted successfully",
  "assessment": {
    "userId": "user_20241201120000",
    "skills": [...],
    "totalSkills": 3,
    "totalScore": 6,
    "averageLevel": 2.0
  }
}
```

### 3. Generate Learning Path
**POST** `/generate-path`

Request Body:
```json
{
  "userId": "user_20241201120000"
}
```

Response:
```json
{
  "success": true,
  "message": "Learning path generated successfully",
  "learningPath": {
    "userId": "user_20241201120000",
    "skills": [...],
    "courses": [...],
    "totalSkills": 5,
    "totalCourses": 6
  }
}
```

### 4. Get Dashboard Data
**GET** `/dashboard/<user_id>`

Response:
```json
{
  "success": true,
  "dashboard": {
    "userId": "user_20241201120000",
    "statistics": {
      "totalCourses": 6,
      "completedCourses": 1,
      "inProgressCourses": 3,
      "overallProgress": 45.5
    },
    "skills": [...],
    "courses": [...],
    "summary": {...}
  }
}
```

### 5. Update Progress
**POST** `/update-progress`

Request Body:
```json
{
  "userId": "user_20241201120000",
  "skillProgress": [
    {"name": "JavaScript", "progress": 75}
  ],
  "courseProgress": [
    {"title": "Complete JavaScript Course 2024", "progress": 60}
  ]
}
```

## Project Structure

```
.
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
└── data/
    ├── students.csv      # Student dataset
    └── courses.csv       # Course catalog
```

## Technologies Used

- **Flask** - Web framework
- **Flask-CORS** - Cross-Origin Resource Sharing
- **Pandas** - CSV data processing
- **Python** - Programming language

## Notes

- Data is stored in-memory (suitable for development/demo)
- For production, consider using a database (SQLite, PostgreSQL, etc.)
- CSV files are loaded at startup
- CORS is enabled for frontend integration

## Testing

You can test the API using tools like:
- Postman
- cURL
- Python requests library
- Frontend application

Example cURL command:
```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","age":22,"educationLevel":"Bachelor'\''s Degree","currentDomain":"web-development","careerGoal":"Become a developer","experienceLevel":"intermediate","learningStyle":"video","weeklyStudyHours":10}'
```

