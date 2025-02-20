import { useNavigate, useLocation } from "@tanstack/react-router";
import { clearAuthData } from "@/services/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    navigate({ to: "/login", replace: true });
    clearAuthData();
  };

  const isdefaultPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/";

  return (
    <div>
      {!isdefaultPage && (
        <nav className="border-b p-4 flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => navigate({ to: "/homepage" })}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              Home
            </button>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
          >
            Logout
          </button>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
