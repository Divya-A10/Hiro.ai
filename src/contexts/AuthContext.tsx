'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ClerkProvider, useUser, useClerk } from '../clerk-wrapper';

interface AuthUser {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  user_metadata?: {
    avatar_url?: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  session: any | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUser?: (updated: { firstName?: string; lastName?: string; avatarUrl?: string }) => Promise<void>;
  isMock?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CLERK_PUBLISHABLE_KEY = typeof process !== 'undefined' && process.env.VITE_CLERK_PUBLISHABLE_KEY
  ? process.env.VITE_CLERK_PUBLISHABLE_KEY
  : (typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
    : '');
const isValidClerkKey = typeof CLERK_PUBLISHABLE_KEY === 'string' && CLERK_PUBLISHABLE_KEY.trim() !== '' && CLERK_PUBLISHABLE_KEY.startsWith('pk_');

const ClerkAuthConsumer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut: clerkSignOut, openSignIn } = useClerk();

  const user = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress,
    firstName: clerkUser.firstName || '',
    lastName: clerkUser.lastName || '',
    user_metadata: {
      avatar_url: clerkUser.imageUrl
    }
  } : null;

  const signInWithGoogle = async () => {
    openSignIn({});
  };

  const signOut = async () => {
    await clerkSignOut();
  };

  const updateUser = async (updated: { firstName?: string; lastName?: string; avatarUrl?: string }) => {
    if (clerkUser) {
      await clerkUser.update({
        firstName: updated.firstName,
        lastName: updated.lastName,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session: clerkUser ? { id: clerkUser.id } : null, 
      loading: !isLoaded, 
      signInWithGoogle, 
      signOut,
      updateUser,
      isMock: false
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hiro_mock_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('hiro_mock_user');
      }
    }
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockUser: AuthUser = {
      id: 'mock_user_clerk_123',
      email: 'investor@example.com',
      firstName: 'Demo',
      lastName: 'User',
      user_metadata: {
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop'
      }
    };
    setUser(mockUser);
    localStorage.setItem('hiro_mock_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('hiro_mock_user');
  };

  const updateUser = async (updated: { firstName?: string; lastName?: string; avatarUrl?: string }) => {
    const newUserData = user ? {
      ...user,
      firstName: updated.firstName !== undefined ? updated.firstName : user.firstName,
      lastName: updated.lastName !== undefined ? updated.lastName : user.lastName,
      user_metadata: {
        ...user.user_metadata,
        avatar_url: updated.avatarUrl !== undefined ? updated.avatarUrl : user.user_metadata?.avatar_url,
      }
    } : null;
    setUser(newUserData);
    if (newUserData) {
      localStorage.setItem('hiro_mock_user', JSON.stringify(newUserData));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session: user ? { id: user.id } : null, 
      loading, 
      signInWithGoogle, 
      signOut,
      updateUser,
      isMock: true
    }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 bg-zinc-950/90 border border-zinc-800 text-zinc-200 px-4 py-3 rounded-2xl shadow-2xl max-w-sm backdrop-blur-md flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">💡 Clerk Demo Auth</p>
        <p className="text-[11px] leading-relaxed opacity-90 text-zinc-400">
          Running in demo mode. Configure <code>VITE_CLERK_PUBLISHABLE_KEY</code> in environment settings to enable live production Clerk sign-ins.
        </p>
      </div>
    </AuthContext.Provider>
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (isValidClerkKey) {
    return (
      <ClerkProvider>
        <ClerkAuthConsumer>{children}</ClerkAuthConsumer>
      </ClerkProvider>
    );
  }

  return <MockAuthProvider>{children}</MockAuthProvider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
