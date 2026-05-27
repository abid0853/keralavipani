import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore'; // Added onSnapshot

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const MASTER_ADMIN_EMAIL = "abidts0853@gmail.com";

  const loginWithGoogle = async (isAdminAttempt = false) => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (isAdminAttempt && user.email !== MASTER_ADMIN_EMAIL) {
        await signOut(auth);
        throw new Error("UNAUTHORIZED: This email does not have Admin privileges.");
      }

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const newProfile = {
          uid: user.uid,
          name: user.displayName || 'User',
          email: user.email,
          role: isAdminAttempt ? 'admin' : 'user', 
          trustScore: 0,
          createdAt: new Date().toISOString()
        };
        await setDoc(docRef, newProfile);
      } else {
        const existingData = docSnap.data();
        if (isAdminAttempt && existingData.role !== 'admin') {
          await updateDoc(docRef, { role: 'admin' });
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
      throw error; 
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  // Upgraded to use Real-Time Listener (onSnapshot) for the User Profile
  useEffect(() => {
    let unsubUser = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      if (user) {
        // This listens to the database live. If Trust Points change, the UI updates instantly.
        unsubUser = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        });
      } else {
        setUserData(null);
        if (unsubUser) unsubUser(); // Clean up listener on logout
      }
      
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubUser) unsubUser();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userData, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};