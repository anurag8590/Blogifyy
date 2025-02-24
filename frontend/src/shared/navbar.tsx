import { useState } from 'react';
import { useNavigate, useLocation } from "@tanstack/react-router";
import { clearAuthData } from "@/services/auth";
import { Menu, X, BookOpen} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logout = () => {
    navigate({ to: "/login", replace: true });
    clearAuthData();
  };

  const isDefaultPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/";

  const navLinks = [
    { name: "Categories", path: "/categories" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  if (isDefaultPage) return null;

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <button
              onClick={() => navigate({ to: "/homepage" })}
              className="flex items-center space-x-2 text-gray-800 hover:text-purple-600 transform hover:scale-105 transition duration-300"
            >
              <BookOpen className="h-6 w-6" />
              <span className="font-bold text-xl">Blogifyy</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
           
            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => navigate({ to: link.path })}
                  className="text-gray-600 hover:text-purple-600 font-medium transition duration-300 hover:-translate-y-0.5"
                >
                  {link.name}
                </button>
              ))}
              
              {/* Logout Button */}
              <button
                onClick={logout}
                className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition duration-300 hover:opacity-90"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-purple-600 transition duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    navigate({ to: link.path });
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-purple-600 hover:bg-gray-50 transition duration-300"
                >
                  {link.name}
                </button>
              ))}
              <button
                onClick={logout}
                className="block w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;