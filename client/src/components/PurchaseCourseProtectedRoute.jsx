import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { Navigate, useParams } from "react-router-dom"

const PurchaseCourseProtectedRoute = ({children}) => {
    const {courseId} = useParams(); 
    const {data, isLoading} = useGetCourseDetailWithStatusQuery(courseId);

    if(isLoading) return <h1>Loading...</h1>

    return data?.purchased ? children : <Navigate to={`/course-detail/${courseId}`} />;
};

export default PurchaseCourseProtectedRoute;

