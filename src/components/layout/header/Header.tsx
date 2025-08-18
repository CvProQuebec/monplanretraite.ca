import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { Image } from "@/utils/imageHandler";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/en";
  const isEnglish = location.pathname.startsWith("/en");
  const { user, signOut } = useAuth();
  
  // Logs de débogage
  useEffect(() => {
    console.log('🔍 Header - État de l\'authentification:', { user, loading: false });
    console.log('🔍 Header - Type de user:', typeof user);
    console.log('🔍 Header - Valeur exacte de user:', user);
    console.log('🔍 Header - Condition d\'affichage de l\'indicateur:', !!user);
  }, [user]);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('🔍 Header - Déconnexion réussie');
    } catch (error) {
      console.error('❌ Header - Erreur de déconnexion:', error);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white ${
        scrolled 
            ? "backdrop-blur-md py-2 shadow-md" 
            : "py-4"
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        <div className="flex items-center">
          <Link to={isEnglish ? "/en" : "/"}>
            <div className="flex items-center">
              <Image 
                src="/logo-ia.png" 
                alt="Gérald Doré Logo" 
                className="h-12 w-auto mr-3" 
              />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <DesktopNav isEnglish={isEnglish} isHomePage={isHomePage} />

        {/* Indicateur de connexion - déplacé vers les pages spécifiques */}
        {/* {user && (
          <div className="hidden md:flex items-center gap-3 mr-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
              <User className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">
                {isEnglish ? 'Connected as:' : 'Connecté en tant que:'}
              </span>
              <span className="text-sm font-medium text-green-800">
                {user.displayName || user.email}
              </span>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isEnglish ? 'Sign Out' : 'Déconnecter'}
            </Button>
          </div>
        )} */}

        {/* Menu button for mobile */}
        <Button
          variant="ghost"
          size="icon"
          className={`md:hidden text-charcoal-800`}
          onClick={toggleMenu}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && <MobileNav isEnglish={isEnglish} isHomePage={isHomePage} toggleMenu={toggleMenu} />}
    </header>
  );
};

export default Header;
