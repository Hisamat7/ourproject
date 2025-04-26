import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    AuthError,
    UserCredential,
    User  // Import User type from firebase/auth
  } from 'firebase/auth';
  import { auth } from './firebase';
  
  type AuthResponse = {
    success: boolean;
    user?: User;  // Now properly typed with Firebase's User
    error?: AuthError;
  };
  
  export const AuthService = {
    async register(email: string, password: string): Promise<AuthResponse> {
      try {
        const userCredential: UserCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        return { 
          success: true, 
          user: userCredential.user 
        };
      } catch (error) {
        return { 
          success: false, 
          error: error as AuthError 
        };
      }
    },
  
    async login(email: string, password: string): Promise<AuthResponse> {
      try {
        const userCredential: UserCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        return { 
          success: true, 
          user: userCredential.user 
        };
      } catch (error) {
        return { 
          success: false, 
          error: error as AuthError 
        };
      }
    },
  
    async logout(): Promise<{ success: boolean; error?: Error }> {
      try {
        await signOut(auth);
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          error: error as Error 
        };
      }
    },
  };
  
  // Export types for use elsewhere in your application
  export type { AuthError, User };