const SimpleLessonCard = ({ lesson }) => {
  const ts = lesson?.lesson_time ? Date.parse(lesson.lesson_time) : null;
  const dateObj = ts ? new Date(ts) : null;
  const formattedDate = dateObj
    ? dateObj.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : 'Date TBD';
  const formattedTime = dateObj
    ? dateObj.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'Time TBD';

  const studentName =
    [lesson?.first_name, lesson?.last_name].filter(Boolean).join(' ') ||
    'Student';
  const teacher = lesson?.teacher || 'TBA';

  return (
    <article className='bg-white rounded-lg shadow-sm hover:shadow-md transition p-4'>
      <div className='flex items-start justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-purple-700'>
            {studentName}
          </h3>
          <p className='text-gray-600 text-sm mt-1'>
            Teacher:{' '}
            <span className='text-gray-800 font-medium'>{teacher}</span>
          </p>
        </div>
        <div className='text-right'>
          <div className='text-sm text-gray-500'>{formattedDate}</div>
          <div className='text-sm text-gray-700 font-medium'>
            {formattedTime}
          </div>
        </div>
      </div>
    </article>
  );
};

export default SimpleLessonCard;
