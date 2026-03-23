import CourseLayout from '../components/courses/CourseLayout'
import { useCourseDetail } from '../hooks/useCoursesDetail';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
const CoursePage = ({courseId}) => {
    const {id} = useParams()

    const {course, refetch} = useCourseDetail(id)
    return (
        <div>
            <CourseLayout course={course} refetch = {refetch} />
        </div>
    )
}

export default CoursePage;