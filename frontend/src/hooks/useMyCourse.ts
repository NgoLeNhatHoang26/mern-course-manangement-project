import { useEffect, useState, useRef} from "react";
import { EnrollmentService, IEnrollment } from "../service/EnrollmentService.ts";

export const useMyEnrollments = () => {
    const [enrollments, setEnrollments] = useState<IEnrollment[]>([]);
    const [loading, setLoading] = useState(true);
    let isMounted = useRef(true);
    useEffect(() => {

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
        return () => { isMounted.current = false; };
    }, []);

    return { enrollments, loading };
};