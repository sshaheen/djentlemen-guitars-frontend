import { Link, useNavigate } from 'react-router';
import DisplayLessons from '../components/DisplayLessons';
import { useAuth } from '../AuthContext';

const HomePage = ({ lessons, loading, error }) => {
  const { token, logout, userInfo } = useAuth() || {};

  return (
    <div className='max-w-5xl mx-auto mt-6 p-4'>
      <h2 className='text-2xl font-semibold text-purple-700 mb-4'>
        {lessons.length > 0 ? (
          `${userInfo.first_name}'s lessons`
        ) : (
          <Link to='/book'>
            Hi {userInfo.first_name}! Click here to book your first lesson.
          </Link>
        )}
      </h2>
      {loading && <p className='text-gray-600'>Loading...</p>}
      {error && <p className='text-red-600'>Error occurred: {error}</p>}
      {!loading && !error && <DisplayLessons lessons={lessons} />}
    </div>
  );
};

export default HomePage;
