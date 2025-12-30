import DisplayLessons from '../components/DisplayLessons';

const HomePage = ({ lessons, loading, error }) => {
  const first = lessons && lessons.length > 0 ? lessons[0] : null;
  const userName = first
    ? [first.first_name, first.last_name].filter(Boolean).join(' ')
    : 'Your';

  return (
    <div className='max-w-5xl mx-auto mt-6 p-4'>
      <h2 className='text-2xl font-semibold text-purple-700 mb-4'>
        {userName === 'Your'
          ? 'Please book your first lesson!'
          : `${userName}'s lessons`}
      </h2>
      {loading && <p className='text-gray-600'>Loading...</p>}
      {error && <p className='text-red-600'>Error occurred: {error}</p>}
      {!loading && !error && <DisplayLessons lessons={lessons} />}
    </div>
  );
};

export default HomePage;
