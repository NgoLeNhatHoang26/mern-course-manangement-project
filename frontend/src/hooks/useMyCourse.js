import { useEffect, useState } from "react";
import { EnrollmentService } from "../service/enrollmentService.js";

export const useMyEnrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetch = async () => {
            try {
                const res = await EnrollmentService.getMyEnrollments();
                if (isMounted) setEnrollments(res);
            } catch (err) {
                console.error(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetch();
        return () => { isMounted = false; };
    }, []);

    return { enrollments, loading };
};