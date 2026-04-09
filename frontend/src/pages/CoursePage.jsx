import CourseLayout from '../layout/CourseLayout.jsx';
import { useCourseDetail } from '@features/courses';
import { useParams } from 'react-router-dom';
const CoursePage = () => {
    const {id} = useParams()

    const {course, refetch} = useCourseDetail(id)
    return (
        <div>
            <CourseLayout course={course} refetch = {refetch} />
        </div>
    )
}

export default CoursePage;