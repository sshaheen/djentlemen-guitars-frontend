import { Link, useNavigate } from 'react-router';
import DisplayLessons from '../components/DisplayLessons';
import { useAuth } from '../AuthContext';

const HomePage = ({ lessons, loading, error }) => {
  const { userInfo } = useAuth() || {};

  return (
    <div className='max-w-5xl mx-auto mt-6 p-4'>
      <h2 className='text-2xl font-semibold text-purple-700 mb-4'>
        {lessons.length > 0 ? (
          `${userInfo.first_name}'s lessons`
        ) : (
          <Link to='/book'>
            <div className='flex items-center justify-center min-h-[60vh] p-6'>
              <div className='max-w-md w-full bg-white rounded-lg shadow p-8 text-center'>
                <h3 className='text-lg font-medium text-purple-700'>
                  Hi {userInfo.first_name}! Please click here to book your first
                  lesson!
                </h3>
              </div>
            </div>
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
