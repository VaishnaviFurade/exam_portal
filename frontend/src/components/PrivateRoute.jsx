import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user && allowedRoles.includes(user.role)) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, [allowedRoles]);

  if (authenticated === null) {
    return <div>Checking authentication...</div>;
  }

  return authenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
