import React from 'react';
import Header from './header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-charcoal-700 font-sans">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout; 