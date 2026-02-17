from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Data storage (in-memory for simplicity - use database in production)
learner_profiles = {}
skill_assessments = {}
learning_paths = {}
progress_data = {}

# Load CSV datasets
def load_datasets():
    """Load students and courses CSV files"""
    students_file = 'data/students.csv'
    courses_file = 'data/courses.csv'
    
    students_df = None
    courses_df = None
    
    try:
        if os.path.exists(students_file):
            students_df = pd.read_csv(students_file)
            print(f"Loaded {len(students_df)} student records")
    except Exception as e:
        print(f"Error loading students.csv: {e}")
    
    try:
        if os.path.exists(courses_file):
            courses_df = pd.read_csv(courses_file)
            print(f"Loaded {len(courses_df)} course records")
    except Exception as e:
        print(f"Error loading courses.csv: {e}")
    
    return students_df, courses_df

# Initialize datasets
students_df, courses_df = load_datasets()

def analyze_skill_gaps(assessment_skills, target_domain):
    """
    Improved skill gap analysis with flexible domain matching
    """

    domain_requirements = {
        'computer-science': ['Programming Fundamentals', 'Data Structures', 'Algorithms', 'Software Engineering'],
        'data-science': ['Python', 'Statistics', 'Machine Learning', 'Data Analysis'],
        'web-development': ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Database Design'],
        'mobile-development': ['Mobile App Design', 'iOS Development', 'Android Development', 'UI/UX', 'API Integration'],
        'cybersecurity': ['Network Security', 'Ethical Hacking', 'Cryptography', 'Security Analysis'],
        'ai-ml': ['Python', 'Machine Learning', 'Deep Learning', 'Neural Networks'],
        'business': ['Business Strategy', 'Marketing', 'Finance', 'Management'],
        'design': ['UI/UX Design', 'Graphic Design', 'Design Tools', 'User Research'],
        'marketing': ['Digital Marketing', 'SEO', 'Content Marketing', 'Analytics']
    }

    # Normalize domain (VERY IMPORTANT FIX)
    normalized_domain = target_domain.lower().strip().replace(" ", "-")

    required_skills = []

    # Flexible domain matching
    for domain in domain_requirements:
        if domain in normalized_domain or normalized_domain in domain:
            required_skills = domain_requirements[domain]
            break

    # If no match found → fallback to data-science (safe default)
    if not required_skills:
        required_skills = domain_requirements['data-science']

    skill_gaps = []

    for skill in required_skills:
        found = False

        for assessed_skill in assessment_skills:
            if skill.lower() in assessed_skill['name'].lower():
                found = True

                if assessed_skill['level'] <= 2:
                    skill_gaps.append({
                        'name': skill,
                        'current_level': assessed_skill['level'],
                        'recommended_level': 4,
                        'priority': 'High'
                    })
                break

        if not found:
            skill_gaps.append({
                'name': skill,
                'current_level': 0,
                'recommended_level': 3,
                'priority': 'High'
            })

    return skill_gaps


def recommend_courses(learner_profile, assessment_skills, skill_gaps):
    """
    Improved course recommendation logic
    """

    recommendations = []

    if courses_df is not None and not courses_df.empty:

        target_domain = learner_profile.get('currentDomain', '').lower()

        # Flexible filtering
        if 'domain' in courses_df.columns:
            domain_courses = courses_df[
                courses_df['domain'].str.lower().str.contains(target_domain, na=False)
            ]
        else:
            domain_courses = courses_df

        # If no match → use all courses
        if domain_courses.empty:
            domain_courses = courses_df

        for _, course in domain_courses.iterrows():
            score = 0

            course_skills = str(course.get('skills', '')).lower()

            # Skill gap match
            for gap in skill_gaps:
                if gap['name'].lower() in course_skills:
                    score += 3

            # Experience level match
            experience = learner_profile.get('experienceLevel', 'beginner').lower()
            course_level = str(course.get('level', 'beginner')).lower()

            if experience == course_level:
                score += 2

            # Learning style match
            learning_style = learner_profile.get('learningStyle', 'video').lower()
            course_format = str(course.get('format', 'video')).lower()

            if learning_style in course_format:
                score += 1

            # Always allow minimal score
            if score >= 1:
                recommendations.append({
                    'title': course.get('title', 'Unknown Course'),
                    'provider': course.get('provider', 'Unknown'),
                    'level': course.get('level', 'Beginner'),
                    'duration': course.get('duration', 'N/A'),
                    'rating': float(course.get('rating', 0)) if pd.notna(course.get('rating')) else 0,
                    'students': course.get('students', 'N/A'),
                    'description': course.get('description', ''),
                    'score': score
                })

        recommendations.sort(key=lambda x: x['score'], reverse=True)

        if recommendations:
            return recommendations[:10]

    # Guaranteed fallback if CSV fails
    return [{
        'title': 'Python for Data Science',
        'provider': 'Udemy',
        'level': 'Beginner',
        'duration': '30 hours',
        'rating': 4.6,
        'students': '100,000+',
        'description': 'Complete Python guide for Data Science',
        'score': 5
    }]


# API Endpoints

@app.route('/')
def home():
    """Home endpoint"""
    return jsonify({
        'message': 'AI-Powered Personalized Learning Path Generator API',
        'version': '1.0.0',
        'endpoints': {
            'POST /register': 'Register learner profile',
            'POST /assessment': 'Submit skill assessment',
            'POST /generate-path': 'Generate personalized learning path',
            'GET /dashboard/<user_id>': 'Get dashboard data'
        }
    })

@app.route('/register', methods=['POST'])
def register_learner():
    """Register a new learner profile"""
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['fullName', 'age', 'educationLevel', 'currentDomain', 
                          'careerGoal', 'experienceLevel', 'learningStyle', 'weeklyStudyHours']
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Generate user ID
        user_id = f"user_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Store learner profile
        learner_profiles[user_id] = {
            'userId': user_id,
            **data,
            'registeredAt': datetime.now().isoformat()
        }
        
        return jsonify({
            'success': True,
            'message': 'Learner profile registered successfully',
            'userId': user_id,
            'profile': learner_profiles[user_id]
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/assessment', methods=['POST'])
def submit_assessment():
    """Submit skill assessment"""
    try:
        data = request.json
        
        # Validate required fields
        if 'userId' not in data:
            return jsonify({'error': 'Missing userId'}), 400
        
        if 'skills' not in data or not isinstance(data['skills'], list):
            return jsonify({'error': 'Missing or invalid skills array'}), 400
        
        user_id = data['userId']
        
        # Validate user exists
        if user_id not in learner_profiles:
            return jsonify({'error': 'User not found. Please register first.'}), 404
        
        # Calculate assessment metrics
        skills = data['skills']
        total_skills = len(skills)
        total_score = sum(skill.get('level', 0) for skill in skills)
        average_level = total_score / total_skills if total_skills > 0 else 0
        
        # Store assessment
        skill_assessments[user_id] = {
            'userId': user_id,
            'skills': skills,
            'totalSkills': total_skills,
            'totalScore': total_score,
            'averageLevel': round(average_level, 2),
            'assessedAt': datetime.now().isoformat()
        }
        
        return jsonify({
            'success': True,
            'message': 'Skill assessment submitted successfully',
            'assessment': skill_assessments[user_id]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/generate-path', methods=['POST'])
def generate_learning_path():
    """Generate personalized learning path"""
    try:
        data = request.json
        
        # Validate required fields
        if 'userId' not in data:
            return jsonify({'error': 'Missing userId'}), 400
        
        user_id = data['userId']
        
        # Validate user exists
        if user_id not in learner_profiles:
            return jsonify({'error': 'User not found. Please register first.'}), 404
        
        # Validate assessment exists
        if user_id not in skill_assessments:
            return jsonify({'error': 'Assessment not found. Please submit assessment first.'}), 404
        
        # Get learner profile and assessment
        profile = learner_profiles[user_id]
        assessment = skill_assessments[user_id]
        
        # Perform skill gap analysis
        skill_gaps = analyze_skill_gaps(
            assessment['skills'],
            profile.get('currentDomain', '')
        )
        
        # Get recommended skills (from skill gaps)
        recommended_skills = [
            {
                'name': gap['name'],
                'description': f"Develop {gap['name']} skills to reach level {gap['recommended_level']}",
                'level': 'Beginner' if gap['current_level'] == 0 else 
                        'Intermediate' if gap['current_level'] <= 2 else 'Advanced',
                'priority': gap['priority']
            }
            for gap in skill_gaps
        ]
        
        # Get course recommendations
        recommended_courses = recommend_courses(profile, assessment['skills'], skill_gaps)
        
        # Generate learning path
        learning_path = {
            'userId': user_id,
            'generatedAt': datetime.now().isoformat(),
            'skills': recommended_skills,
            'courses': recommended_courses,
            'totalSkills': len(recommended_skills),
            'totalCourses': len(recommended_courses),
            'skillGaps': skill_gaps
        }
        
        # Store learning path
        learning_paths[user_id] = learning_path
        
        # Initialize progress data
        if user_id not in progress_data:
            progress_data[user_id] = {
                'skills': [
                    {'name': skill['name'], 'progress': 0, 'level': skill['level']}
                    for skill in recommended_skills
                ],
                'courses': [
                    {'title': course['title'], 'provider': course['provider'], 
                     'progress': 0, 'status': 'not-started'}
                    for course in recommended_courses
                ]
            }
        
        return jsonify({
            'success': True,
            'message': 'Learning path generated successfully',
            'learningPath': learning_path
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/dashboard/<user_id>', methods=['GET'])
def get_dashboard_data(user_id):
    """Get dashboard data for a user"""
    try:
        # Check if user exists
        if user_id not in learner_profiles:
            return jsonify({'error': 'User not found'}), 404
        
        # Get progress data
        user_progress = progress_data.get(user_id, {
            'skills': [],
            'courses': []
        })
        
        # Calculate statistics
        total_courses = len(user_progress['courses'])
        completed_courses = len([c for c in user_progress['courses'] if c.get('progress', 0) == 100])
        in_progress_courses = len([c for c in user_progress['courses'] 
                                  if 0 < c.get('progress', 0) < 100])
        
        overall_progress = 0
        if total_courses > 0:
            total_progress = sum(c.get('progress', 0) for c in user_progress['courses'])
            overall_progress = round(total_progress / total_courses, 1)
        
        # Calculate skill statistics
        total_skills = len(user_progress['skills'])
        mastered_skills = len([s for s in user_progress['skills'] if s.get('progress', 0) >= 80])
        
        # Calculate average skill level
        avg_level = 0
        if total_skills > 0:
            level_values = {'Beginner': 1, 'Intermediate': 2, 'Advanced': 3}
            total_level = sum(level_values.get(s.get('level', 'Beginner'), 1) 
                            for s in user_progress['skills'])
            avg_level = round(total_level / total_skills, 1)
        
        # Calculate hours completed (assuming 40 hours per course on average)
        hours_completed = round(sum(c.get('progress', 0) / 100 * 40 for c in user_progress['courses']), 1)
        
        dashboard_data = {
            'userId': user_id,
            'statistics': {
                'totalCourses': total_courses,
                'completedCourses': completed_courses,
                'inProgressCourses': in_progress_courses,
                'overallProgress': overall_progress
            },
            'skills': user_progress['skills'],
            'courses': user_progress['courses'],
            'summary': {
                'totalSkills': total_skills,
                'masteredSkills': mastered_skills,
                'averageSkillLevel': avg_level,
                'hoursCompleted': hours_completed,
                'completionRate': overall_progress
            }
        }
        
        return jsonify({
            'success': True,
            'dashboard': dashboard_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/update-progress', methods=['POST'])
def update_progress():
    """Update progress for skills or courses"""
    try:
        data = request.json
        
        if 'userId' not in data:
            return jsonify({'error': 'Missing userId'}), 400
        
        user_id = data['userId']
        
        if user_id not in progress_data:
            return jsonify({'error': 'User progress not found'}), 404
        
        # Update skill progress
        if 'skillProgress' in data:
            for skill_update in data['skillProgress']:
                for skill in progress_data[user_id]['skills']:
                    if skill['name'] == skill_update['name']:
                        skill['progress'] = skill_update['progress']
                        break
        
        # Update course progress
        if 'courseProgress' in data:
            for course_update in data['courseProgress']:
                for course in progress_data[user_id]['courses']:
                    if course['title'] == course_update['title']:
                        course['progress'] = course_update['progress']
                        if course_update['progress'] == 100:
                            course['status'] = 'completed'
                        elif course_update['progress'] > 0:
                            course['status'] = 'in-progress'
                        break
        
        return jsonify({
            'success': True,
            'message': 'Progress updated successfully',
            'progress': progress_data[user_id]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    
    print("Starting Flask server...")
    print("API Endpoints:")
    print("  POST /register - Register learner profile")
    print("  POST /assessment - Submit skill assessment")
    print("  POST /generate-path - Generate learning path")
    print("  GET /dashboard/<user_id> - Get dashboard data")
    print("  POST /update-progress - Update progress")
    
    app.run(debug=True, host='0.0.0.0', port=5000)

