import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        SwapCell
      </Link>
      <nav>
        <Link to="/buy">Buy</Link>
        {user && <Link to="/sell">Sell</Link>}
        {user ? (
          <>
            <Link to="/profile">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="navbar-avatar" />
              ) : (
                user.name.split(" ")[0]
              )}
            </Link>
            <button className="link-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="cta-btn small">
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
