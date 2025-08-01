import { Link, NavLink, useNavigate } from "react-router-dom";
import jwt_decode from 'jwt-decode';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const isStaff = user?.isStaff;

  let username = "";
  try {
    if (token && token !== "undefined") {
      const decoded = jwt_decode(token);
      username = decoded.username;
    } else {
      localStorage.removeItem("token");
    }
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    localStorage.removeItem("token");
  }


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };


  return (
    <nav className="container rounded shadow navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/dashboard">Interview Reviewer</Link>

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          {!token ? (
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>

          ) : (
            <>
              {isStaff && (
                <li className="nav-item">
                  <Link className="nav-link" to="/staff-dashboard">Staff</Link>
                </li>
              )}
              <li className="nav-item">
                <NavLink
                  to="/questions"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  Questions
                </NavLink>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/history">History</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/feedback">Feedback</Link>
              </li>

              <li className="nav-item nav-link text-light">
                {user?.name}
              </li>

              <li className="nav-item">
                <button className="btn btn-outline-light ms-2" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
