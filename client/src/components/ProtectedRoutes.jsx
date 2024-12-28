import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({children}) => {
    const {user, isAuthenticated} = useSelector(store => store.auth);

    if(!isAuthenticated){
        return <Navigate to="/login"/>
    }

    return children;
}

export const AuthenticatedUser = ({children}) => {
    const {user, isAuthenticated} = useSelector(store => store.auth);

    if(isAuthenticated){
        return <Navigate to="/"/>
    }

    return children;
}

export const AdminRoute = ({children}) => {
    const {user, isAuthenticated} = useSelector(store => store.auth);
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    if (user?.role !== "instructor") {  // Use optional chaining for safety
        return <Navigate to="/" />;
    }
    return children;
}