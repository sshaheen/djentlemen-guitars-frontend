import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../AuthContext';
import makennaImg from '../assets/Makenna.jpeg';
import bobbyImg from '../assets/Bobby.png';
import fionaImg from '../assets/Fiona.png';
import raulImg from '../assets/Raul.png';

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

        <div className='relative'>
          <label className='block text-sm text-gray-700'>Teacher</label>
          <TeacherDropdown
            value={teacher}
            onChange={setTeacher}
            className='mt-1'
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

const teachers = [
  { name: 'Bobby', img: bobbyImg },
  { name: 'Fiona', img: fionaImg },
  { name: 'Raul', img: raulImg },
  { name: 'Makenna', img: makennaImg },
];

function TeacherDropdown({ value, onChange, className = '' }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const selected = teachers.find((t) => t.name === value) || null;

  return (
    <div ref={ref} className={`${className} inline-block w-full`}>
      <button
        type='button'
        onClick={() => setOpen((s) => !s)}
        className='w-full text-left flex items-center justify-between border border-gray-200 rounded px-3 py-2 bg-white'
      >
        <div className='flex items-center space-x-3'>
          {selected ? (
            <img
              src={selected.img}
              alt={selected.name}
              className='w-8 h-8 rounded-full object-cover'
            />
          ) : (
            <div className='w-8 h-8 rounded-full bg-gray-100' />
          )}
          <span>{selected ? selected.name : 'Select a teacher'}</span>
        </div>
        <span className='text-gray-400'>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <ul className='absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-sm'>
          {teachers.map((t) => (
            <li key={t.name}>
              <button
                type='button'
                onClick={() => {
                  onChange(t.name);
                  setOpen(false);
                }}
                className='w-full text-left px-3 py-2 flex items-center space-x-3 hover:bg-gray-50'
              >
                <img
                  src={t.img}
                  alt={t.name}
                  className='w-8 h-8 rounded-full object-cover'
                />
                <span>{t.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function makeAvatar(name, bg) {
  const initials = (name || '')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='100%' height='100%' fill='${bg}' rx='12'/><text x='50%' y='50%' font-size='36' fill='white' dominant-baseline='middle' text-anchor='middle' font-family='Arial, Helvetica, sans-serif'>${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
