import CourseLayout from '../components/courses/CourseLayout'
import { useCourseDetail } from '../hooks/useCoursesDetail';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
const CoursePage = ({courseId}) => {
    const {id} = useParams()

    const {course} = useCourseDetail(id)
    return (
        <div>
            <CourseLayout course={course} />
        </div>
    )
}

export default CoursePage;