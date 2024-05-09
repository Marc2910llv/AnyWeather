import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

//Import firebase functions
import { auth, onAuthStateChanged } from '../firebase/firebase'

// eslint-disable-next-line react/prop-types
const ProtectedRoutes = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => { //Set the actual user when the login is done
      setUser(user);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className='basic'>Loading...</div>;
  }

  if (user) {
    return children;
  } else {
    return <Navigate to='/login' />; //If the user is not loged stay in te Login page
  }
};

export default ProtectedRoutes;
