import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { useAuth } from '../AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await auth.login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const formatError = (err) => {
    if (!err) return '';
    // if it's already an object
    if (typeof err === 'object') {
      if (err.message) return err.message;
      if (err.error) return String(err.error);
      return JSON.stringify(err);
    }
    // try parse JSON strings
    if (typeof err === 'string') {
      const trimmed = err.trim();
      if (
        (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']'))
      ) {
        try {
          const parsed = JSON.parse(trimmed);
          if (parsed.message) return parsed.message;
          if (parsed.error) return parsed.error;
          if (parsed.detail) return parsed.detail;
          if (parsed.errors) {
            if (typeof parsed.errors === 'string') return parsed.errors;
            if (Array.isArray(parsed.errors)) return parsed.errors.join('; ');
            if (typeof parsed.errors === 'object')
              return Object.values(parsed.errors).flat().join('; ');
          }
          return JSON.stringify(parsed);
        } catch (e) {
          // fall through
        }
      }
      return err;
    }
    return String(err);
  };

  return (
    <div className='max-w-md mx-auto p-6'>
      <h1 className='text-2xl mb-4'>Log in</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm'>Email</label>
          <input
            type='email'
            className='w-full border rounded px-3 py-2'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className='block text-sm'>Password</label>
          <input
            type='password'
            className='w-full border rounded px-3 py-2'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <div className='mt-2'>
            <div className='border border-red-200 bg-red-50 text-red-700 p-3 rounded-md'>
              <strong className='block font-medium'>Error</strong>
              <div className='mt-1 text-sm'>{formatError(error)}</div>
            </div>
          </div>
        )}
        <div>
          <button
            className='px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700'
            type='submit'
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
