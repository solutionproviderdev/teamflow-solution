
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

 
const isAuthenticated = () => {
    console.log(
			'here ist he token man from frontend------->',
			localStorage.getItem('token')
		);

	return !!localStorage.getItem('token');
};
  
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const location = useLocation();
	if (!isAuthenticated()) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}
	return <>{children}</>;
};

export default RequireAuth;
