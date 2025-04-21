import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearUser, selectUser } from "../redux/features/auth/userSlice";
import authServices from "../services/authServices";
import { toast } from "react-toastify";
import { selectCart, setCart } from "../redux/features/home/cartSlice";
import userServices from "../services/userServices";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cart = useSelector(selectCart);
  const user = useSelector(selectUser);
  const totalCartCount = cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const countNumberUpdate = async () => {
      try {
        if (user) {
          const response = await userServices.GetAllCart();
          dispatch(setCart(response.data.cart));
        }
      } catch (err) {
        console.error("Error fetching cart:", err.message);
      }
    };

    countNumberUpdate();
  }, [dispatch, user]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await authServices.logout();
      if (response.status == 200) {
        toast.success("Logout successfully");
        localStorage.removeItem("user");
        dispatch(clearUser());
        setIsMobileMenuOpen(false);
        navigate("/");
      }
    } catch (err) {
      toast.error("logout error:", err.message);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Navbar */}
      <nav className="bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <Link 
                to="/home" 
                className="text-2xl md:text-3xl font-bold text-white hover:text-indigo-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trendy Cart
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {!user ? (
                <div className="flex space-x-6">
                  <Link 
                    to="/register" 
                    className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-lg font-medium transition-colors"
                  >
                    Register
                  </Link>
                  <Link 
                    to="/login" 
                    className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-lg font-medium transition-colors"
                  >
                    Login
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-6">
                  <Link 
                    to="/home" 
                    className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-lg font-medium transition-colors"
                  >
                    {user.name}
                  </Link>
                  <div className="relative">
                    <Link 
                      to="/cart" 
                      className="flex items-center text-white hover:text-indigo-200 transition-colors"
                    >
                      <span className="mr-2">Cart</span>
                      <i className="fa fa-shopping-cart text-xl"></i>
                      {totalCartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {totalCartCount}
                        </span>
                      )}
                    </Link>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-lg font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={toggleMobileMenu}
                className="text-white hover:text-gray-300 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Conditionally rendered */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-700 px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!user ? (
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/register" 
                  className="text-white hover:bg-gray-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
                <Link 
                  to="/login" 
                  className="text-white hover:bg-gray-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/home" 
                  className="text-white hover:bg-gray-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {user.name}
                </Link>
                <div className="relative">
                  <Link 
                    to="/cart" 
                    className="flex items-center text-white hover:bg-gray-600 px-3 py-2 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mr-2">Cart</span>
                    <i className="fa fa-shopping-cart"></i>
                    {totalCartCount > 0 && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalCartCount}
                      </span>
                    )}
                  </Link>
                </div>
                <button
                  onClick={(e) => {
                    handleLogout(e);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Main Content with padding to account for sticky navbar */}
      <main className="flex-grow container mx-auto px-4 pt-24 pb-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm md:text-base">
          © 2025 Trendy Cart. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Navbar;