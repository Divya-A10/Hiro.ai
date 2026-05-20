'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export function useNavigate() {
  const router = useRouter();
  return (to: string | number) => {
    if (typeof to === 'number') {
      window.history.go(to);
    } else {
      router.push(to);
    }
  };
}

export function Link({ to, children, className, ...props }: any) {
  return React.createElement('a', { href: to, className, ...props }, children);
}

export const BrowserRouter = ({ children }: any) => React.createElement(React.Fragment, null, children);
export const Routes = ({ children }: any) => React.createElement(React.Fragment, null, children);
export const Route = ({ children }: any) => React.createElement(React.Fragment, null, children);
