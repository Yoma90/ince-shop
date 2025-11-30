import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { 
  ShoppingCart, Search, Menu, X, Phone, Mail, 
  Facebook, Instagram, MapPin, Heart, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function App() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [settings, setSettings] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    loadSettings();
    updateCartCount();
    checkAdmin();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsList = await base44.entities.SiteSettings.list();
      if (settingsList.length > 0) {
        setSettings(settingsList[0]);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const checkAdmin = async () => {
    try {
      const user = await base44.auth.me();
      setIsAdmin(user.role === 'admin');
    } catch {
      setIsAdmin(false);
    }
  };

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  };

  useEffect(() => {
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  const isAdminPage = location.pathname.startsWith("/admin");

  if (isAdminPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <style>{`
          :root {
            --primary: ${settings?.primary_color || '#E8B4B8'};
            --secondary: ${settings?.secondary_color || '#D4AF37'};
          }
        `}</style>
        <Outlet />
      </div>
    );
  }

  const navigation = [
    { name: "Accueil", path: createPageUrl("Home") },
    { name: "Catalogue", path: createPageUrl("Catalog") },
    { name: "À propos", path: createPageUrl("About") },
    { name: "Contact", path: createPageUrl("Contact") }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <style>{`
        :root {
          --primary: ${settings?.primary_color || '#E8B4B8'};
          --secondary: ${settings?.secondary_color || '#D4AF37'};
        }
        
        .nav-link {
          position: relative;
          transition: color 0.3s ease;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--primary);
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        .header-scrolled {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'header-scrolled' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2 group">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt={settings.site_name} className="h-8 md:h-10 transition-transform duration-300 group-hover:scale-105" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                    {settings?.site_name || "Ince-Shop"}
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link text-sm font-medium ${
                    location.pathname === item.path ? 'active text-[var(--primary)]' : 'text-gray-700 hover:text-[var(--primary)]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3 md:gap-4">
              <Link to={createPageUrl("Search")}>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-[var(--primary)]/10">
                  <Search className="w-5 h-5" />
                </Button>
              </Link>
              
              <Link to={createPageUrl("Cart")} className="relative">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-[var(--primary)]/10">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[var(--primary)] border-2 border-white text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {isAdmin && (
                <Link to={createPageUrl("AdminDashboard")}>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-[var(--primary)]/10">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16 md:pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {settings?.site_name || "Ince-Shop"}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Votre destination pour l'équipement professionnel de beauté et coiffure de qualité supérieure.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li><Link to={createPageUrl("Catalog")} className="text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">Catalogue</Link></li>
                <li><Link to={createPageUrl("About")} className="text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">À propos</Link></li>
                <li><Link to={createPageUrl("CGV")} className="text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">CGV</Link></li>
                <li><Link to={createPageUrl("Shipping")} className="text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">Livraison</Link></li>
                <li><Link to={createPageUrl("Returns")} className="text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">Retours</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact</h3>
              <ul className="space-y-3">
                {settings?.contact_phone && (
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-[var(--primary)]" />
                    {settings.contact_phone}
                  </li>
                )}
                {settings?.contact_email && (
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-[var(--primary)]" />
                    {settings.contact_email}
                  </li>
                )}
                {settings?.contact_address && (
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-[var(--primary)] mt-0.5 flex-shrink-0" />
                    <span>{settings.contact_address}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Suivez-nous</h3>
              <div className="flex gap-3">
                {settings?.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-200 hover:bg-[var(--primary)] flex items-center justify-center transition-colors group">
                    <Facebook className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
                  </a>
                )}
                {settings?.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-200 hover:bg-[var(--primary)] flex items-center justify-center transition-colors group">
                    <Instagram className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} {settings?.site_name || "Ince-Shop"}. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}