import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';

const TeacherHome = () => {
  const { authFetch } = useAuth() || {};
  const [lessonsMap, setLessonsMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        const res = authFetch
          ? await authFetch('/api/teacher_lessons', { method: 'GET' })
          : await fetch('/api/teacher_lessons');
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || 'Failed to fetch lessons');
        }
        const data = await res.json();
        // data is expected to be a map: { user_id: [lessonRes] }
        setLessonsMap(data);
      } catch (e) {
        setError(e.message || 'Failed to load lessons');
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [authFetch]);

  if (loading) return <div className='p-6'>Loading lessons...</div>;
  if (error) return <div className='p-6 text-red-600'>{error}</div>;

  if (!lessonsMap || Object.keys(lessonsMap).length === 0)
    return (
      <div className='flex items-center justify-center min-h-[60vh] p-6'>
        <div className='max-w-md w-full bg-white rounded-lg shadow p-8 text-center'>
          <h3 className='text-lg font-medium text-purple-700'>
            You do not have any lessons booked yet.
          </h3>
        </div>
      </div>
    );

  return (
    <div className='max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow'>
      <h2 className='text-2xl font-semibold text-purple-700 mb-4'>
        My Lessons
      </h2>
      {Object.entries(lessonsMap).map(([userId, lessonList]) => (
        <div key={userId} className='mb-6'>
          {/* lessonRes: { id, created_at, updated_at, lesson_time, email, first_name, last_name, teacher, user_id } */}
          <h3 className='font-medium'>
            Student:{' '}
            {(Array.isArray(lessonList) &&
              lessonList[0] &&
              (lessonList[0].first_name || lessonList[0].FirstName)) ||
              userId}
          </h3>

          <ul className='mt-2 space-y-2'>
            {Array.isArray(lessonList) && lessonList.length > 0 ? (
              lessonList.map((lesson, idx) => (
                <li key={lesson.id || idx} className='p-3 border rounded'>
                  <div>
                    <strong>Time:</strong>{' '}
                    {lesson.lesson_time
                      ? new Date(lesson.lesson_time).toLocaleString()
                      : lesson.LessonTime
                      ? new Date(lesson.LessonTime).toLocaleString()
                      : '—'}
                  </div>
                  <div>
                    <strong>Student Email:</strong>{' '}
                    {lesson.email || lesson.Email || '—'}
                  </div>
                  <div>
                    <strong>Student:</strong>{' '}
                    {lesson.first_name || lesson.FirstName || ''}{' '}
                    {lesson.last_name || lesson.LastName || ''}
                  </div>
                </li>
              ))
            ) : (
              <li className='text-sm text-gray-500'>
                No lessons for this student.
              </li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TeacherHome;
