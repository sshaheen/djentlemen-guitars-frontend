import SimpleLessonCard from './SimpleLessonCard';

const DisplayLessons = ({ lessons }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4'>
      {lessons.map((lesson, idx) => (
        <div key={idx}>
          <SimpleLessonCard lesson={lesson} />
        </div>
      ))}
    </div>
  );
};

export default DisplayLessons;
