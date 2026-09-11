import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="container nav-wrap">
        <Link className="brand" to="/">CargoConnect</Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/">Services</Link>
          <Link to="/">How It Works</Link>
          <Link to="/shipper/tracking">Track Shipment</Link>
          <Link to="/">About</Link>
          <Link to="/">Contact</Link>
          {!user ? (
            <>
              <Link to="/login" className="nav-btn">Login</Link>
              <Link to="/register" className="nav-btn primary">Register</Link>
            </>
          ) : (
            <button className="nav-btn primary" onClick={logout}>Logout</button>
          )}
        </nav>
      </div>
    </header>
  );
}
