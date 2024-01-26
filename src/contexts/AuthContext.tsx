import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { User, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// AuthContext.tsx}
const AuthContext = createContext({
  currentUser: null as User | null,
  signInWithGoogle: signInWithGoogle,
  signOut: signOut,
});

// AuthProvider.tsx

export function useAuth() {
  return useContext(AuthContext);
}
export function signInWithGoogle() {
  signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOut() {
  auth.signOut();
}

// AuthProvider.tsx

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(() => {
      console.log("Auth State Changed", auth.currentUser?.displayName);
      setCurrentUser(auth.currentUser);
    });
    return () => {
      unsubscribeAuth();
    };
  }, []);

  const value = {
    currentUser: currentUser,
    signInWithGoogle: signInWithGoogle,
    signOut: signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
