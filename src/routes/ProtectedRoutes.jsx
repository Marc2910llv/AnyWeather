/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/firebase';

const ProtectedRoutes = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className='basic'>Loading...</div>; // Otra opción sería mostrar un spinner de carga
  }

  if (user) {
    return children;
  } else {
    return <Navigate to='/login' />;
  }
};

export default ProtectedRoutes;
