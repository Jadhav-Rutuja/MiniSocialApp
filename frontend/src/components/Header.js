import React from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ username, profilePhoto, onProfileClick }) => {
  const navigate = useNavigate();

  // ✅ Generate initials for avatar fallback
  const getAvatarInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = ["#FF6B6B","#4ECDC4","#45B7D1","#FFA07A","#98D8C8","#F7DC6F","#BB8FCE","#85C1E2","#F8B88B","#A9DFBF"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  // ✅ Silhouette fallback (optional, keeps your current logic)
  const silhouetteDataUri = (size = 35) => {
    const bg = "#ececec";
    const fg = "#999";
    const headR = Math.round(size * 0.28);
    const headCx = Math.round(size / 2);
    const headCy = Math.round(size * 0.34);
    const shoulderW = Math.round(size * 0.9);
    const shoulderH = Math.round(size * 0.48);
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>
        <rect fill='${bg}' width='${size}' height='${size}' rx='${size/6}'/>
        <circle cx='${headCx}' cy='${headCy}' r='${headR}' fill='${fg}' />
        <path d='M ${Math.round((size-shoulderW)/2)} ${Math.round(size*0.78)} a ${Math.round(shoulderW/2)} ${Math.round(shoulderH/2)} 0 1 0 ${shoulderW} 0 z' fill='${fg}' />
      </svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };

  // ✅ Logout logic
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        backgroundColor: "#158aa8",
        color: "white",
      }}
    >
      {/* App Title */}
      <h2 style={{ margin: 0 }}>SocialSphere</h2>

      {/* Right Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Profile + Welcome */}
        <div
          onClick={() => (onProfileClick ? onProfileClick() : navigate('/profile'))}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              style={{
                borderRadius: "50%",
                width: "35px",
                height: "35px",
                objectFit: "cover"
              }}
            />
          ) : (
            <div
              style={{
                width: 35,
                height: 35,
                borderRadius: "50%",
                backgroundColor: getAvatarColor(username || "User"),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {getAvatarInitials(username)}
            </div>
          )}
          <span>Welcome, <b>{username}</b></span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            padding: "6px 12px",
            backgroundColor: "#e53935",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
