import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CiShoppingBasket } from "react-icons/ci";
import { FiUser, FiMail, FiPhone, FiLogOut } from "react-icons/fi";
import "./NavBar.css";

const NavBar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  // Закрываем окно при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
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

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    navigate("/");
  };

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

      {/* Правая часть - профиль */}
      <div className="navbar-profile" ref={profileRef}>
        {isAuthenticated ? (
          <div className="profile-container">
            <div
              className="profile-info"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="profile-avatar">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="profile-email">{user?.email}</span>
            </div>

            {/* Выпадающее окно профиля */}
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <FiUser className="dropdown-icon" />
                  <span>Информация о пользователе</span>
                </div>

                <div className="dropdown-info">
                  <div className="info-item">
                    <FiMail className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Email</span>
                      <span className="info-value">
                        {user?.email || "Не указан"}
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <FiPhone className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Телефон</span>
                      <span className="info-value">
                        {user?.phone || "Не указан"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="dropdown-footer">
                  <button className="logout-btn" onClick={handleLogout}>
                    <FiLogOut className="logout-icon" />
                    Выйти из аккаунта
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button className="login-btn" onClick={() => navigate("/login")}>
            Войти
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
