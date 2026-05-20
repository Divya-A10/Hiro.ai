'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as ClerkReact from '@clerk/clerk-react';

const CLERK_PUBLISHABLE_KEY = typeof process !== 'undefined' && process.env.VITE_CLERK_PUBLISHABLE_KEY
  ? process.env.VITE_CLERK_PUBLISHABLE_KEY
  : (typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
    : '');

export const isValidClerkKey = typeof CLERK_PUBLISHABLE_KEY === 'string' && 
  CLERK_PUBLISHABLE_KEY.trim() !== '' && 
  CLERK_PUBLISHABLE_KEY.startsWith('pk_');

// Fallback user state for Mock Mode
const MockUserContext = createContext<any>({
  user: null,
  isLoaded: true,
  isSignedIn: false,
  signOut: () => {},
  openSignIn: () => {}
});

export function MockUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

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

  const openSignIn = () => {
    const mockUser = {
      id: 'mock_user_clerk_123',
      primaryEmailAddress: { emailAddress: 'investor@example.com' },
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop',
      firstName: 'Demo',
      lastName: 'User'
    };
    setUser(mockUser);
    localStorage.setItem('hiro_mock_user', JSON.stringify(mockUser));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('hiro_mock_user');
  };

  return React.createElement(MockUserContext.Provider, { value: { user, isLoaded: true, isSignedIn: !!user, signOut, openSignIn } }, children);
}

// Custom safe provider
export function ClerkProvider({ children, ...props }: any) {
  if (isValidClerkKey) {
    const defaultLocalization = {
      signIn: {
        start: {
          title: 'Sign in to Hiro',
        }
      },
      signUp: {
        start: {
          title: 'Create your Hiro account',
        }
      }
    };
    return React.createElement(ClerkReact.ClerkProvider, { 
      publishableKey: CLERK_PUBLISHABLE_KEY, 
      localization: props.localization || defaultLocalization,
      ...props 
    }, children);
  }
  return React.createElement(MockUserProvider, null, children);
}

// Custom hook wrappers
export function useAuth() {
  if (isValidClerkKey) {
    try {
      return ClerkReact.useAuth();
    } catch (e) {
      // safe fallback
    }
  }
  const mock = useContext(MockUserContext);
  return {
    isLoaded: mock.isLoaded,
    isSignedIn: mock.isSignedIn,
    userId: mock.user?.id || null,
    signOut: mock.signOut
  };
}

export function useUser() {
  if (isValidClerkKey) {
    try {
      return ClerkReact.useUser();
    } catch (e) {
      // safe fallback
    }
  }
  const mock = useContext(MockUserContext);
  return {
    isLoaded: mock.isLoaded,
    isSignedIn: mock.isSignedIn,
    user: mock.user
  };
}

export function useClerk() {
  if (isValidClerkKey) {
    try {
      return ClerkReact.useClerk();
    } catch (e) {
      // safe fallback
    }
  }
  const mock = useContext(MockUserContext);
  return {
    signOut: mock.signOut,
    openSignIn: mock.openSignIn
  };
}

// Safe layout components
export function SignInButton({ children, ...props }: any) {
  const { openSignIn } = useClerk();
  return React.createElement('button', { 
    onClick: openSignIn, 
    className: "hover:text-emerald-500 transition-colors cursor-pointer",
    ...props 
  }, children || 'Sign In');
}

export function SignUpButton({ children, ...props }: any) {
  const { openSignIn } = useClerk();
  return React.createElement('button', { 
    onClick: openSignIn, 
    className: "hover:text-emerald-500 transition-colors cursor-pointer",
    ...props 
  }, children || 'Sign Up');
}

export function UserButton() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return React.createElement('div', { className: 'relative inline-block text-left' },
    React.createElement('button', { 
      onClick: () => setOpen(!open),
      className: 'w-8 h-8 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 flex items-center justify-center cursor-pointer'
    }, 
      user.imageUrl 
        ? React.createElement('img', { src: user.imageUrl, className: 'w-full h-full object-cover', alt: 'User picture' })
        : React.createElement('span', { className: 'text-xs text-white' }, 'U')
    ),
    open && React.createElement('div', { className: 'absolute right-0 mt-2 w-48 rounded-xl bg-zinc-950 border border-zinc-800 p-2 shadow-2xl z-50 text-white font-sans' },
      React.createElement('div', { className: 'px-3 py-2 text-xs border-b border-zinc-800' },
        React.createElement('p', { className: 'text-zinc-500 font-bold uppercase' }, 'Account'),
        React.createElement('p', { className: 'truncate text-zinc-300 font-mono' }, user.primaryEmailAddress?.emailAddress)
      ),
      React.createElement('button', { 
        onClick: () => { signOut(); setOpen(false); },
        className: 'w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-950/20 rounded-lg mt-1 transition-colors flex items-center gap-2 cursor-pointer border-0'
      }, 'Sign Out')
    )
  );
}

export interface ShowProps {
  when: 'signed-in' | 'signed-out';
  children: React.ReactNode;
}

export function Show({ when, children }: ShowProps) {
  const { isLoaded, isSignedIn } = useAuth();
  
  if (!isLoaded) {
    return null;
  }
  
  if (when === 'signed-in' && isSignedIn) {
    return React.createElement(React.Fragment, null, children);
  }
  
  if (when === 'signed-out' && !isSignedIn) {
    return React.createElement(React.Fragment, null, children);
  }
  
  return null;
}
