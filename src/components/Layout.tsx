import { NavLink, Outlet, useNavigate } from "react-router-dom";

export function Layout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("authToken");
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Library Management</h1>
          <p>React + TypeScript</p>
        </div>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </header>

      <nav className="nav">
        <NavLink to="/books">Books</NavLink>
        <NavLink to="/issue-book">Issue Book</NavLink>
        <NavLink to="/member-history">Member History</NavLink>
      </nav>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}