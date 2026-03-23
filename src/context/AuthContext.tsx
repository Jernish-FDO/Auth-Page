import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import {
  auth,
  db,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  googleProvider,
  githubProvider,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  type FirebaseUser
} from '../lib/firebase';

interface User {
  id: string;
  email: string | null;
  name: string | null;
  photoURL?: string | null;
  role?: string;
  status?: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | undefined;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);

        unsubscribeSnapshot = onSnapshot(userRef, async (snap) => {
          if (snap.exists()) {
            const data = snap.data();

            // Real-time suspension check
            if (data.status === 'suspended') {
              await signOut(auth);
              toast.error('Your account has been suspended by an administrator.');
              setUser(null);
              setLoading(false);
              return;
            }

            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || data.name,
              photoURL: firebaseUser.photoURL || data.photoURL,
              role: data.role || 'user',
              status: data.status || 'active',
              emailVerified: firebaseUser.emailVerified,
            });
          } else {
            // Fallback before doc is fully created
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: 'user',
              status: 'active',
              emailVerified: firebaseUser.emailVerified,
            });
          }
          setLoading(false);
        });
      } else {
        if (unsubscribeSnapshot) unsubscribeSnapshot();
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const handleOAuthLogin = async (provider: any) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userRef = doc(db, 'users', result.user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, {
          id: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          photoURL: result.user.photoURL,
          role: 'user',
          status: 'active',
          createdAt: serverTimestamp(),
          lastActive: serverTimestamp()
        });
      } else {
        await setDoc(userRef, { lastActive: serverTimestamp() }, { merge: true });
      }
    } catch (error) {
      console.error('OAuth Sign-In Error:', error);
      throw error;
    }
  };

  const loginWithGoogle = () => handleOAuthLogin(googleProvider);
  const loginWithGithub = () => handleOAuthLogin(githubProvider);

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      await setDoc(doc(db, 'users', result.user.uid), { lastActive: serverTimestamp() }, { merge: true });
    } catch (error) {
      console.error('Email Sign-In Error:', error);
      throw error;
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      if (userCredential.user) {
        try {
          await updateProfile(userCredential.user, { displayName: name });
          await sendEmailVerification(userCredential.user);
          await userCredential.user.getIdToken(true);

          // Create Firestore Doc
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            id: userCredential.user.uid,
            email: email,
            name: name,
            photoURL: null,
            role: 'user',
            status: 'active',
            createdAt: serverTimestamp(),
            lastActive: serverTimestamp()
          });
        } catch (profileError) {
          console.error('Profile update/verification failed during signup:', profileError);
        }
      }
    } catch (error) {
      console.error('Email Sign-Up Error:', error);
      throw error;
    }
  };

  const resendVerification = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      } else {
        throw new Error('No user is currently signed in.');
      }
    } catch (error) {
      console.error('Resend Verification Error:', error);
      throw error;
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password Reset Error:', error);
      throw error;
    }
  };

  const sendMagicLink = async (email: string) => {
    try {
      const actionCodeSettings = {
        // Redirect back to the login page
        url: `${window.location.origin}/login`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
    } catch (error) {
      console.error('Magic Link Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const value = useMemo(() => ({
    user,
    loading,
    loginWithGoogle,
    loginWithGithub,
    loginWithEmail,
    signupWithEmail,
    logout,
    sendPasswordReset,
    sendMagicLink,
    resendVerification
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
