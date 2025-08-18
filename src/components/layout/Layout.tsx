import React from 'react';
import { RetirementNavigation } from '@/features/retirement';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans">
      <RetirementNavigation />
      <main className="pt-8">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout; 