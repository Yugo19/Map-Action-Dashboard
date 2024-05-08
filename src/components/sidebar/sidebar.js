import React, {useState, useEffect} from 'react';
import './sidebar.scss'; 
import logo from '../../assets/logo.png'
import face from '../../assets/img/faces/face-0.jpg'
import {Link, useLocation} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { config } from '../../config';
import axios from 'axios';
import { faExclamationCircle, faHistory,faFileCsv, faCog, faBarChart, faQuestionCircle, faLifeRing, faSearch, faBell, faAngleDown} from '@fortawesome/free-solid-svg-icons';
import NotificationsComponent from '../Notification/Notification';

const Sidebar = ({ isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allIncidents, setAllIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${config.url}/MapApi/user_retrieve/`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.token}`,
        },
      });
      setUserData(response.data);
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
    const params = {
      search_term: searchTerm,
    };

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
    console.log(userData);
  };

  useEffect(() => {
    fetchData(searchTerm);
  }, [searchTerm]);

  const filteredIncidents = allIncidents.filter(incident => {
    return incident.title.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className={`sidebar`}>
      <div className="header">
        <div>
          <FontAwesomeIcon icon={faSearch} className="icon" color='#84818A'/>
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
        <div onClick={handleNotificationClick}>
          <FontAwesomeIcon icon={faBell} className="notifi" color='#84818A'/>        
        </div>
        {showNotifications && <NotificationsComponent />}
      </div>
      <div >
        <img className="logo" src={logo} alt="logo_image" />
      </div>
      <div className='profil' onClick={handleProfileClick}>
        <img className="profil_img" src={face} alt="side" />
        <div className='profil_info'>
        <p><strong>{userData ? `@${userData.organisation}` : ''}</strong></p>
          <p className='elu_info'>
            <span>Gestion intégrée <br /> des forets</span>
            <FontAwesomeIcon icon={faAngleDown} className='angle'/>
          </p>

        </div>
      </div>
      <ul className='menu-list'>
        <li className="hidden">Menu</li>
        <li className='item'>
          <Link
            to="/dashboard"
            className={
              location.pathname === "/dashboard" ? "selected-link" : "link"
            }
          >
            <FontAwesomeIcon icon={faBarChart} color='#39A1DD'/>   
              Tableau de Bord 
          </Link>
        </li>
        <li className='item'><Link to="/incident" className='link_style'><FontAwesomeIcon icon={faExclamationCircle} color='#84818A'/> Incident</Link></li>
        {isAdmin && (
          <li><Link to="/incident" className='link_style'><FontAwesomeIcon icon={faExclamationCircle} color='#84818A'/> Utilisateurs</Link></li>
        )}
        <li className='item'><Link to="/historique" className='link_style'><FontAwesomeIcon icon={faHistory} color='#84818A'/>   Historique des actions</Link></li>
        <li className='item'><Link to="/export" className='link_style'><FontAwesomeIcon icon={faFileCsv} color='#84818A'/> Exporter les données</Link></li>
        <li className='item'><Link to="/parametres" className='link_style'><FontAwesomeIcon icon={faCog} color='#84818A'/>   Paramètres</Link></li>
      </ul>
      <ul className='menu-list'>
        <li className="hidden">Support</li>
        <li className='item'>
          <Link to="/faq" className='link_style'>
            <FontAwesomeIcon icon={faQuestionCircle} color='#84818A'/>
            FAQ
          </Link>
        </li>
        <li className='item'><Link to="/help" className='link_style'><FontAwesomeIcon icon={faLifeRing} color='#84818A'/>   Aide en Ligne</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
