import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../AuthContext';

const BookLesson = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [teacher, setTeacher] = useState('');
  const [lessonTime, setLessonTime] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { authFetch } = useAuth() || {};
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        lesson_time: lessonTime ? new Date(lessonTime).toISOString() : null,
        email,
        first_name: firstName,
        last_name: lastName,
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
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm text-gray-700'>First name</label>
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className='mt-1 block w-full border border-gray-200 rounded px-3 py-2'
            />
          </div>
          <div>
            <label className='block text-sm text-gray-700'>Last name</label>
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className='mt-1 block w-full border border-gray-200 rounded px-3 py-2'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm text-gray-700'>Email</label>
          <input
            required
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='mt-1 block w-full border border-gray-200 rounded px-3 py-2'
          />
        </div>

        <div>
          <label className='block text-sm text-gray-700'>Teacher</label>
          <input
            required
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            className='mt-1 block w-full border border-gray-200 rounded px-3 py-2'
            placeholder='e.g. John Doe'
          />
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
