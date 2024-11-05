import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';
import React, { useState } from 'react';

const Header = (props) => {
  const { updatesearch } = props;
  const navigate = useNavigate();
  
  // Use state to manage the search value
  const [searchValue, setSearchValue] = useState('');

  const onClickLogout = () => {
    Cookies.remove('jwt_token');
    navigate('/login');
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const onClickSearch = () => {
    if (typeof updatesearch === 'function') {
      updatesearch(searchValue || ''); // Default to an empty string if searchValue is empty
    }
  };

  const location = useLocation();
  const isHomeActive = location.pathname === '/';
  const isProfileActive = location.pathname === '/my-profile';

  return (
    <nav className="headercon1">
      <div className="headercon2">
        <Link to="/" className="linked">
          <img
            src="https://res.cloudinary.com/dxbf8wo2m/image/upload/q_100/v1729163351/logo_qv7elu.png"
            alt="website logo"
            className="headerimage"
          />
        </Link>
        <h1 className="headerlogo">Insta Share</h1>
      </div>
      <div className="headercon3">
        <div className="headercon4">
          <input
            type="search"
            placeholder="Search Caption"
            onChange={onChangeSearchInput}
            value={searchValue} // Controlled input
            className="headercon7"
          />
          <button
            data-testid="searchIcon" // Changed testid to data-testid for consistency
            type="button"
            className="headercon5"
            onClick={onClickSearch}
          >
            <FaSearch className="headercon6" />
          </button>
        </div>
        <Link to="/" className="linked">
          <p className={isHomeActive ? 'headerpara1' : 'headerpara2'}>Home</p>
        </Link>
        <Link to="/my-profile" className="linked">
          <p className={isProfileActive ? 'headerpara1' : 'headerpara2'}>Profile</p>
        </Link>
        <button type="button" onClick={onClickLogout} className="logoutbutton">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Header;
