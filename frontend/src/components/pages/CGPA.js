import React, { useState } from 'react';
import '../../styles/components.css';

const CGPA = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: '', credits: 3, grade: 'A' }
  ]);
  const [cgpa, setCgpa] = useState(null);

  const gradePoints = {
    'A': 4.00, 'A-': 3.70,
    'B+': 3.30, 'B': 3.00, 'B-': 2.70,
    'C+': 2.30, 'C': 2.00, 'C-': 1.70,
    'D': 1.00, 'F': 0.00
  };

  const addCourse = () => {
    setCourses([
      ...courses,
      { id: Date.now(), name: '', credits: 3, grade: 'A' }
    ]);
  };

  const removeCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id, field, value) => {
    setCourses(courses.map(c => 
      c.id === id ? { ...c, [field]: field === 'credits' ? parseInt(value) : value } : c
    ));
  };

  const calculateCGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      if (course.name.trim()) {
        const points = gradePoints[course.grade] || 0;
        totalPoints += points * course.credits;
        totalCredits += course.credits;
      }
    });

    const result = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    setCgpa(result);
  };

  const getGradeColor = (cgpaValue) => {
    const value = parseFloat(cgpaValue);
    if (value >= 3.5) return '#22c55e';
    if (value >= 3.0) return '#84cc16';
    if (value >= 2.5) return '#eab308';
    if (value >= 2.0) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="cgpa-page">
      <h2 className="page-title">
        <i className="fas fa-calculator"></i>
        CGPA Calculator
      </h2>

      {/* Courses Card */}
      <div className="card courses-card">
        <div className="courses-header">
          <h3>Your Courses</h3>
          <button className="btn btn-primary btn-sm" onClick={addCourse}>
            <i className="fas fa-plus"></i>
            Add
          </button>
        </div>

        <div className="courses-list">
          {courses.map((course, index) => (
            <div key={course.id} className="course-item">
              <span className="course-number">{index + 1}</span>
              <input
                type="text"
                placeholder="Course Name"
                value={course.name}
                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                className="course-name-input"
              />
              <select
                value={course.credits}
                onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                className="credits-select"
              >
                <option value={1}>1 cr</option>
                <option value={2}>2 cr</option>
                <option value={3}>3 cr</option>
                <option value={4}>4 cr</option>
              </select>
              <select
                value={course.grade}
                onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                className="grade-select"
              >
                {Object.keys(gradePoints).map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              <button
                className="remove-course-btn"
                onClick={() => removeCourse(course.id)}
                disabled={courses.length === 1}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Result Card */}
      <div className="card result-card">
        <div className="result-icon">
          <i className="fas fa-chart-line"></i>
        </div>
        <p className="result-label">Your CGPA</p>
        <div 
          className="cgpa-value"
          style={{ color: cgpa ? getGradeColor(cgpa) : '#a78bfa' }}
        >
          {cgpa || '0.00'}
        </div>
        <button className="btn btn-primary btn-lg" onClick={calculateCGPA}>
          <i className="fas fa-calculator"></i>
          Calculate CGPA
        </button>

        {cgpa && (
          <div className="result-message">
            {parseFloat(cgpa) >= 3.5 && (
              <p className="excellent">
                <i className="fas fa-star"></i>
                Excellent! Keep up the great work!
              </p>
            )}
            {parseFloat(cgpa) >= 3.0 && parseFloat(cgpa) < 3.5 && (
              <p className="good">
                <i className="fas fa-thumbs-up"></i>
                Good job! You're doing well!
              </p>
            )}
            {parseFloat(cgpa) >= 2.0 && parseFloat(cgpa) < 3.0 && (
              <p className="average">
                <i className="fas fa-info-circle"></i>
                There's room for improvement.
              </p>
            )}
            {parseFloat(cgpa) < 2.0 && (
              <p className="needs-work">
                <i className="fas fa-exclamation-triangle"></i>
                Consider seeking academic support.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Grade Scale Reference */}
      <div className="card grade-scale-card">
        <h3>
          <i className="fas fa-info-circle"></i>
          Grade Scale Reference
        </h3>
        <div className="grade-scale">
          {Object.entries(gradePoints).map(([grade, points]) => (
            <div key={grade} className="grade-item">
              <span className="grade-letter">{grade}</span>
              <span className="grade-points">{points.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CGPA;
