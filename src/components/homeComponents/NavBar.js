import { useRef, useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CiShoppingBasket } from "react-icons/ci";
// import { FiUser, FiMail, FiPhone, FiLogOut } from "react-icons/fi";
import "./NavBar.css";

const NavBar = () => {
  // const [isProfileOpen, setIsProfileOpen] = useState(false);
  // const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  // Закрываем окно при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        // setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      navigate(`/search?q=${encodeURIComponent(e.target.value.trim())}`);
      e.target.value = "";
    }
  };

  // const handleLogout = async () => {
  //   // await logout();
  //   // setIsProfileOpen(false);
  //   navigate("/");
  // };

  const handleInputClick = () => {
    navigate("/search");
  };

  return (
    <nav className="navbar">
      {/* Левая часть - логотип */}
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <span className="logo-icon">
          <CiShoppingBasket />
        </span>
        <span className="logo-text">MarketScan</span>
      </div>

      {/* Центральная часть - поиск */}
      <div className="navbar-search">
        <input
          type="text"
          className="search-input"
          placeholder="Поиск товаров..."
          onClick={handleInputClick}
          onKeyPress={handleSearch}
        />
      </div>
    </nav>
  );
};

export default NavBar;
