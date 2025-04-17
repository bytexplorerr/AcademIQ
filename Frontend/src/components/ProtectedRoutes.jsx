import { useGetPurchaseStatusQuery } from "@/app/apis/purchaseApi";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux"
import { Navigate, useParams } from "react-router-dom";


export const ProtectedRoute = ({children}) => {

    const {isAuthenticated} = useSelector((state)=> state.auth);

    if(!isAuthenticated) {
        return <Navigate to = '/signin' />
    }

    return children;
}

export const AuthenticatedUser = ({children}) => {

    const {isAuthenticated} = useSelector((state)=> state.auth);

    if(isAuthenticated) {
        return <Navigate to = '/' />
    }

    return children;
}

export const AdminRoutes = ({children}) => {
    const {user,isAuthenticated} = useSelector((state)=>state.auth);

    if(!isAuthenticated) {
        return <Navigate to='/signin' />
    }

    if(user?.role !== 'instructor') {
        return <Navigate to ='/' />
    }

    return children;
}

export const PurchasedCourseRoute = ({children}) => {
    const {courseID} = useParams();
    const {data,isLoading} = useGetPurchaseStatusQuery(courseID);

    if(isLoading) {
        return <div className="flex justify-center my-8"><Loader2 className="w-8 h-8 animate-spin text-gray-800 dark:text-white" /></div>
    }

    return data?.status === 'completed' ? children : <Navigate to={`/course-details/${courseID}`} />
}