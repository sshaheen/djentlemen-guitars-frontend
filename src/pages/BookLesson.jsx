import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../AuthContext';

const BookLesson = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [lessonTime, setLessonTime] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const { authFetch, userInfo, token } = useAuth() || {};
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      setTeachersLoading(true);
      try {
        let res;
        if (authFetch) {
          res = await authFetch('/api/teachers', { method: 'GET' });
        } else {
          if (!token) throw new Error('No auth token');
          res = await fetch('/api/teachers', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || 'Failed to fetch teachers');
        }
        const data = await res.json();
        setTeachers(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          const firstId = String(data[0].teacher_id);
          setSelectedTeacherId(firstId);
        }
      } catch (e) {
        setError(e.message || 'Failed to load teachers');
      } finally {
        setTeachersLoading(false);
      }
    };

    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!userInfo || !userInfo.email) {
        throw new Error('You must be logged in to book a lesson');
      }
      if (!selectedTeacherId) {
        throw new Error('Please select a teacher');
      }
      const teacherObj = teachers.find(
        (t) => String(t.teacher_id) === String(selectedTeacherId)
      );
      const teacherName = `${teacherObj?.first_name || ''} ${
        teacherObj?.last_name || ''
      }`.trim();
      const payload = {
        lesson_time: lessonTime ? new Date(lessonTime).toISOString() : null,
        email: userInfo.email,
        first_name: userInfo.first_name || userInfo.firstName || null,
        last_name: userInfo.last_name || userInfo.lastName || null,
        teacher: teacherName,
        teacher_id: String(selectedTeacherId),
      };

      const res = authFetch
        ? await authFetch('/api/lessons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/lessons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to create lesson');
      }

      navigate('/', { state: { reload: Date.now() } });
    } catch (err) {
      setError(err.message || 'Failed to book lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow'>
      <h2 className='text-2xl font-semibold text-purple-700 mb-4'>
        Book a Lesson
      </h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Name and email come from the authenticated user's `userInfo` */}

        <div>
          <label className='block text-sm text-gray-700'>Teacher</label>
          {teachersLoading ? (
            <div className='mt-1 text-sm text-gray-500'>
              Loading teachers...
            </div>
          ) : (
            <select
              required
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className='mt-1 block w-full border border-gray-200 rounded px-3 py-2'
            >
              <option value=''>Select a teacher</option>
              {teachers.map((t) => {
                const id = String(t.teacher_id);
                const name = `${t.first_name || ''} ${
                  t.last_name || ''
                }`.trim();
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
            </select>
          )}
        </div>

        <div>
          <label className='block text-sm text-gray-700'>
            Lesson date & time
          </label>
          <input
            required
            type='datetime-local'
            value={lessonTime}
            onChange={(e) => setLessonTime(e.target.value)}
            className='mt-1 block w-full border border-gray-200 rounded px-3 py-2'
          />
        </div>

        {error && <div className='text-red-600'>{error}</div>}

        <div>
          <button
            type='submit'
            disabled={loading}
            className='px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700'
          >
            {loading ? 'Booking...' : 'Book Lesson'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookLesson;
