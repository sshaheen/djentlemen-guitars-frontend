import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../AuthContext';

const BookLesson = () => {
  const [teacher, setTeacher] = useState('Makenna');
  const [lessonTime, setLessonTime] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { authFetch, userInfo } = useAuth() || {};
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!userInfo || !userInfo.email) {
        throw new Error('You must be logged in to book a lesson');
      }
      if (!teacher) {
        throw new Error('Please select a teacher');
      }
      const payload = {
        lesson_time: lessonTime ? new Date(lessonTime).toISOString() : null,
        email: userInfo.email,
        first_name: userInfo.first_name || userInfo.firstName || null,
        last_name: userInfo.last_name || userInfo.lastName || null,
        teacher,
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
          <select
            required
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            className='mt-1 block w-full border border-gray-200 rounded px-3 py-2'
          >
            <option value=''>Select a teacher</option>
            <option value='Bobby'>Bobby</option>
            <option value='Fiona'>Fiona</option>
            <option value='Raul'>Raul</option>
            <option value='Makenna'>Makenna</option>
          </select>
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
