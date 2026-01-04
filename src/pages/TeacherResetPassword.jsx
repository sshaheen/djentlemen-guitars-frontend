import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../AuthContext';

const TeacherResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { authFetch, userInfo } = useAuth() || {};
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!userInfo || !userInfo.email) {
      setError('You must be logged in to change your password');
      return;
    }
    if (!password) {
      setError('Please enter a new password');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const payload = { email: userInfo.email, password };
      const res = authFetch
        ? await authFetch('/api/teachers', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/teachers', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to update password');
      }

      setSuccess('Password updated successfully');
      setPassword('');
      setConfirm('');
      // optional: navigate back to teacher home after a short delay
      setTimeout(() => navigate('/teacher'), 1200);
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow'>
      <h2 className='text-2xl font-semibold text-purple-700 mb-4'>
        Reset Password
      </h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm text-gray-700'>New password</label>
          <input
            required
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='mt-1 block w-full border border-gray-200 rounded px-3 py-2'
          />
        </div>

        <div>
          <label className='block text-sm text-gray-700'>
            Confirm password
          </label>
          <input
            required
            type='password'
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className='mt-1 block w-full border border-gray-200 rounded px-3 py-2'
          />
        </div>

        {error && <div className='text-red-600'>{error}</div>}
        {success && <div className='text-green-600'>{success}</div>}

        <div>
          <button
            type='submit'
            disabled={loading}
            className='px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700'
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeacherResetPassword;
