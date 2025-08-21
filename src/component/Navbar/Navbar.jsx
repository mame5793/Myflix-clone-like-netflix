// Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, signOutUser } from '../../Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { FaCamera } from 'react-icons/fa';
import { useToast } from '../../hooks/useToast.jsx';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [genresOpen, setGenresOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutCard, setShowLogoutCard] = useState(false);
  const logoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 watch route changes
  const { showSuccessToast, showErrorToast } = useToast();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleLangMenu = () => setLangOpen(!langOpen);
  const toggleGenresMenu = () => setGenresOpen(!genresOpen);

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian',
    'Korean', 'Japanese', 'Hindi', 'Arabic', 'Portuguese',
    'Chinese', 'Russian', 'Turkish'
  ];

  const genres = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Romance'
  ];

  // keep user auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // click outside closes logout card
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (logoutRef.current && !logoutRef.current.contains(event.target)) {
        setShowLogoutCard(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ reset menu state on route change (prevents "stuck" bug)
  useEffect(() => {
    setMenuOpen(false);
    setLangOpen(false);
    setGenresOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOutUser();
      showSuccessToast("Logged out successfully!");
      navigate("/login");
    } catch (err) {
      showErrorToast("Error logging out. Please try again.");
      console.error(err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar_container">
        <div className="navbar_left">
          <div className="hamburger" onClick={toggleMenu}>☰</div>
          <div className="logo">MyFlix</div>
        </div>

        <div className="navbar_center">
          <ul className="nav_links desktop">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/category/tv">TV Show</Link></li>
            <li><Link to="/category/popular">Movies</Link></li>
            <li className="lang_item">
              Genres <span className="dropdown_icon">▼</span>
              <ul className="lang_dropdown desktop_lang">
                {genres.map((genre) => (
                  <li key={genre}>
                    <Link to={`/genre/${genre.toLowerCase()}`}>{genre}</Link>
                  </li>
                ))}
              </ul>
            </li>
            <li><Link to="/category/children">Children</Link></li>
            <li className="lang_item">
              Browse by Language <span className="dropdown_icon">▼</span>
              <ul className="lang_dropdown desktop_lang">
                {languages.map((lang) => (
                  <li key={lang}>
                    <Link to={`/language/${lang.toLowerCase()}`}>{lang}</Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>

        <div className="navbar_right">
          {user ? (
            <div className="user-profile" ref={logoutRef}>
              <div
                className="circle-avatar"
                onClick={() => setShowLogoutCard(!showLogoutCard)}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="avatar-img" />
                ) : (
                  <span>{user.displayName ? user.displayName[0].toUpperCase() : 'U'}</span>
                )}
              </div>
              {showLogoutCard && (
                <div className="logout-card">
                  <div className="logout-card-header">
                    <div className='email'>
                      <small>{user.email}</small>
                    </div>
                    <div className="circle-avatar-large">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="avatar-img-large" />
                      ) : (
                        <span>{user.displayName ? user.displayName[0].toUpperCase() : 'U'}</span>
                      )}
                      <div className="camera-icon-large">
                        <FaCamera />
                      </div>
                    </div>
                    <div>
                      <p>Hi, {user.displayName}</p>
                    </div>
                  </div>
                  <button className="logout-button" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="login-button">Login</button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <ul className={`nav_links mobile ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/category/tv">TV Show</Link></li>
        <li><Link to="/category/popular">Movies</Link></li>
        <li onClick={toggleGenresMenu}>
          Genres <span className="dropdown_icon">▼</span>
          {genresOpen && (
            <ul className="lang_dropdown mobile_lang">
              {genres.map((genre) => (
                <li key={genre}>
                  <Link to={`/genre/${genre.toLowerCase()}`}>{genre}</Link>
                </li>
              ))}
            </ul>
          )}
        </li>
        <li><Link to="/category/children">Children</Link></li>
        <li onClick={toggleLangMenu}>
          Browse by Language <span className="dropdown_icon">▼</span>
          {langOpen && (
            <ul className="lang_dropdown mobile_lang">
              {languages.map((lang) => (
                <li key={lang}>
                  <Link to={`/language/${lang.toLowerCase()}`}>{lang}</Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
