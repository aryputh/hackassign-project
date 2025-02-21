import { Navigate } from 'react-router-dom';

// This component ensures that pages aren't accessiuble unless you're logged in.
const PrivateRoute = ({ user, children }) => {
    return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
