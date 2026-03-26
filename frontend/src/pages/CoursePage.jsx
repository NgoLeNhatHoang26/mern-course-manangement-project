import CourseLayout from '../components/courses/CourseLayout'
import { useCourseDetail } from '../hooks/useCoursesDetail.js';
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