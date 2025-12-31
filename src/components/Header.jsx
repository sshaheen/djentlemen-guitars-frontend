import { Link, useNavigate } from 'react-router';
import { useAuth } from '../AuthContext';

const Header = () => {
  const { token, logout, userInfo } = useAuth() || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className='bg-purple-100 border-b border-purple-200'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-14'>
          <div className='flex items-center'>
            <Link to='/' className='text-xl font-bold text-purple-700'>
              Djentlemen Guitars
            </Link>
            <div className='hidden md:flex ml-8 space-x-4'>
              <Link to='/' className='text-purple-600 hover:text-purple-800'>
                Home
              </Link>
              <Link
                to='/about'
                className='text-purple-600 hover:text-purple-800'
              >
                About
              </Link>
              <Link
                to='/book'
                className='text-purple-600 hover:text-purple-800'
              >
                Book
              </Link>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            {token ? (
              <>
                {userInfo && (
                  <div className='text-sm text-purple-700 mr-2'>
                    {`${userInfo.first_name || userInfo.firstName || ''} ${
                      userInfo.last_name || userInfo.lastName || ''
                    }`.trim() || userInfo.email}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className='px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700'
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to='/login'
                  className='px-3 py-1 bg-white text-purple-700 border border-purple-300 rounded hover:bg-purple-50'
                >
                  Login
                </Link>
                <Link
                  to='/register'
                  className='px-3 py-1 text-purple-700 hover:text-purple-900'
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
