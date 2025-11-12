import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { auth } from "./firebase.config";
import { useEffect, useState } from "react";

const GoogleProvider = new GoogleAuthProvider();

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbUser, setDbuser] = useState();

  const SiginupUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signout = () => signOut(auth);

  const loginUser = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signupWithGoogle = () => signInWithPopup(auth, GoogleProvider);

  const ubdateUser = (user, displayName, photoURL) => {
    if (!user) return;
    return updateProfile(user, { displayName, photoURL });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };
  // fetch db user from database
  useEffect(() => {
    const fetchDBuser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/user/${
            currentUser?.email
          }`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch challenge data.");
        }
        const dbuser = await res.json();
        setDbuser(dbuser);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDBuser();
  }, [currentUser]);

  const authinfo = {
    dbUser,
    SiginupUser,
    currentUser,
    signout,
    loginUser,
    loading,
    setLoading,
    signupWithGoogle,
    ubdateUser,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={authinfo}>{children}</AuthContext.Provider>
  );
}
