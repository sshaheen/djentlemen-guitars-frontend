import { Link } from 'react-router';

const NotFoundPage = () => {
  return (
    <div className='min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-purple-50 to-white'>
      <div className='max-w-xl text-center p-8'>
        <div className='inline-flex items-center justify-center w-24 h-24 rounded-full bg-purple-100 text-purple-700 mx-auto mb-6'>
          <span className='text-3xl font-bold'>404</span>
        </div>
        <h2 className='text-2xl font-semibold text-purple-700 mb-2'>
          Page not found
        </h2>
        <p className='text-gray-600 mb-6'>
          Sorry — we couldn't find the page you're looking for. It may have been
          moved or deleted.
        </p>
        <Link
          to='/'
          className='inline-block px-5 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700'
        >
          Return home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
