import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import History from "../pages/History";

import { FaHome } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";

const Tabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: "/", label: "Главная", icon: FaHome },
    { path: "/history", label: "История", icon: FaRegClock },
  ];

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  if (isAuthPage) return null;

  return (
    <div>
      {/* Контент */}
      <div style={{ padding: "0px", marginBottom: "70px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>

      {/* Табы */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          backgroundColor: "white",
          borderTop: "1px solid #e5e7eb",
          height: "60px",
          zIndex: 7,
        }}
      >
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                backgroundColor: isActive ? "#2563eb" : "white",
                color: isActive ? "white" : "#6b7280",
                cursor: "pointer",
                fontSize: "12px",
                borderRight:
                  tabs.indexOf(tab) !== tabs.length - 1
                    ? "1px solid #e5e7eb"
                    : "none",
              }}
            >
              <span style={{ fontSize: "20px", marginBottom: "4px" }}>
                <IconComponent />
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default Tabs;
