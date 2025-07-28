import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/" },
    { id: "students", label: "Students", icon: "👥", path: "/students" },
    { id: "fees", label: "Fees", icon: "💰", path: "/fees" },
  ];

  return (
    <nav className="nav-container">
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.id} className="nav-item">
            <Link
              to={item.path}
              className={`nav-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span style={{ marginRight: "8px" }}>{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
