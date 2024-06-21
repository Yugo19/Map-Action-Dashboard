import React, {useState, useEffect} from 'react';
import './sidebar.scss'; 
import logo from '../../assets/logo.png'
import face from '../../assets/img/faces/face-0.jpg'
import {Link, useLocation} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { config } from '../../config';
import axios from 'axios';
import { 
  faExclamationCircle, 
  faHistory,
  faFileCsv, 
  faCog, 
  faBarChart, 
  faQuestionCircle, 
  faLifeRing, 
  faSearch, 
  faBell, 
  faAngleDown,
  faAngleLeft,
  faAngleRight,
  faSignOutAlt,
  faUsers,
  faBars,
  faCalendarDay,
  faMessage,
  faImages,
  faChartSimple
} from '@fortawesome/free-solid-svg-icons';
import NotificationsComponent from '../Notification/Notification';

const Sidebar = ({ isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allIncidents, setAllIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const photo_user = userData ? config.url + userData.avatar : "";

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    document.body.classList.toggle('collapsed', !isCollapsed);
  };

  const openSidebar = () => {
    setIsOpen(true);
    document.body.classList.add('open');
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${config.url}/MapApi/user_retrieve/`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.token}`,
        },
      });
      console.log("User information", response.data.data);
      setUserData(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur :', error.message);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const fetchData = async (searchTerm) => {
    setLoading(true);
    setError(null);
    const url = `${config.url}/MapApi/Search/`;
    const params = { search_term: searchTerm };

    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${sessionStorage.token}`,
          'Content-Type': 'application/json',
        },
        params,
      });
      setAllIncidents(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des incidents :', error.message);
      setError('Une erreur s\'est produite lors de la récupération des incidents.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    setShowUserInfo(!showUserInfo);
  };

  useEffect(() => {
    fetchData(searchTerm);
    fetchUserData();
  }, [searchTerm]);

  const filteredIncidents = allIncidents.filter(incident => {
    return incident.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const logOut = () => {
    sessionStorage.clear();
    window.location.pathname = "/";
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isOpen ? 'open' : ''}`}>
      <div className="header">
        <div>
          <FontAwesomeIcon icon={faSearch} className="icon" color='#84818A' />
          <input 
            type="text" 
            placeholder="Recherche" 
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <ul>
              {filteredIncidents.map(incident => (
                <li key={incident.id}>{incident.title}</li>
              ))}
            </ul>
          )}
        </div>
        <div className='activity'>
          <div onClick={handleNotificationClick}>
            <FontAwesomeIcon icon={faBell} className="notifi" color='#84818A' />        
          </div>
          {showNotifications && <NotificationsComponent />}
          <div>
            <img src={photo_user} alt='' className='user_logo' />
          </div>
          <div onClick={logOut} className="logout-button">
            <FontAwesomeIcon icon={faSignOutAlt} color='#38a0db' title="Déconnexion" />
          </div>
        </div>
      </div>
      <div>
        <img className={`logo ${isCollapsed ? 'collapsed' : ''}`} src={logo} alt="logo_image" />
      </div>
      <div className={`profil ${isCollapsed ? 'collapsed' : ''}`} onClick={handleProfileClick}>
        <img className={`profil_img ${isCollapsed ? 'collapsed' : ''}`} src={photo_user} alt="" />
        <div className='profil_info'>
          <p><strong>{userData ? `@${userData.last_name}` : ''}</strong></p>
          <p className='elu_info'>
            <span>{userData ? `${userData.first_name}` : ''}</span>
            <FontAwesomeIcon icon={faAngleDown} className='angle' />
          </p>
        </div>
        {showUserInfo && (
          <div className='user_info'>
            <p><strong>Nom : </strong>{userData ? userData.last_name : ''}</p>
            <p><strong>Phone : </strong>{userData ? userData.phone : ''}</p>
            <p><strong>Email : </strong>{userData ? userData.email : ''}</p>
          </div>
        )}
      </div>
      <ul className={`menu-list ${isCollapsed ? 'collapsed' : ''}`}>
        <li className="hidden">Menu</li>
        <li className='item'>
          <Link
            to="/dashboard"
            className={
              useLocation().pathname === "/dashboard" ? "selected-link" : "link"
            }
          >
            <FontAwesomeIcon icon={faChartSimple} color='#84818A' className='menu_icon'/>   
            <span>Tableau de Bord</span> 
          </Link>
        </li>
        <li className='item'>
          <Link to="/incident" className='link_style'>
            <FontAwesomeIcon icon={faCalendarDay} color='#84818A' className='menu_icon'/> 
            <span>Incident</span>
          </Link>
        </li>
        {userData && userData.user_type === "admin" && (
          <li className='item'>
            <Link to="/users" className='link_style'>
              <FontAwesomeIcon icon={faUsers} color='#84818A' className='menu_icon'/>
              <span>Utilisateurs</span>
            </Link>
          </li>
        )}
        <li className='item'>
          <Link to="/historique" className='link_style'>
            <FontAwesomeIcon icon={faMessage} color='#84818A' className='menu_icon'/>   
            <span>Historique des actions</span>
          </Link>
        </li>
        <li className='item'>
          <Link to="/export" className='link_style'>
            <FontAwesomeIcon icon={faImages} color='#84818A' className='menu_icon'/> 
            <span>Exporter les données</span>
          </Link>
        </li>
        <li className='item'>
          <Link to="/parametres" className='link_style'>
            <FontAwesomeIcon icon={faCog} color='#84818A' className='menu_icon'/> 
            <span>Paramètres</span>
          </Link>
        </li>
      </ul>
      <ul className='menu-list'>
        <li className="hidden">Support</li>
        <li className='item'>
          <Link to="/faq" className='link_style'>
            <FontAwesomeIcon icon={faQuestionCircle} color='#84818A' className='menu_icon'/>
            <span>FAQ</span>
          </Link>
        </li>
        <li className='item'>
          <Link to="/help" className='link_style'>
            <FontAwesomeIcon icon={faLifeRing} color='#84818A' className='menu_icon'/> 
            <span>Aide en Ligne</span>
          </Link>
        </li>
      </ul>
      <div className="collapse-button" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={isCollapsed ? faBars : faBars} />
      </div>
    </div>
  );
};

export default Sidebar;
