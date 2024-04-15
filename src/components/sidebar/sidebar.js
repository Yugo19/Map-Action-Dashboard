import React, {useState, useEffect} from 'react';
import './sidebar.scss'; 
import logo from '../../assets/logo.png'
import sidebar from '../../assets/img/sidebar-1.jpg'
import {Link, useLocation} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { config } from '../../config';
import axios from 'axios';
import { faExclamationCircle, faHistory,faFileCsv, faCog, faBarChart, faQuestionCircle, faLifeRing, faSearch, faBell, faAngleDown} from '@fortawesome/free-solid-svg-icons';
import NotificationsComponent from '../Notification/Notification';

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allIncidents, setAllIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchData(searchTerm);
  }, [searchTerm]);

  // Si vous prévoyez de filtrer côté client, assurez-vous d'utiliser filteredIncidents plutôt que allIncidents dans votre composant.
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
          {/* {loading && <p>Chargement...</p>}
          {error && <p>{error}</p>} */}
          <ul>
            {filteredIncidents.map(incident => (
              <li key={incident.id}>{incident.title}</li>
            ))}
          </ul>
        </div>
        <div onClick={handleNotificationClick}>
          <FontAwesomeIcon icon={faBell} className="notifi" color='#84818A'/>        
        </div>
        {showNotifications && <NotificationsComponent />}
      </div>
      <div >
        <img className="logo" src={logo} alt="logo_image" />
      </div>
      <div className='profil'>
        <img className="profil_img" src={sidebar} alt="side" />
        <div className='profil_info'>
          <p><strong>@ForestGir</strong></p>
          <p className='elu_info'>
            <span>Gestion intégrée <br /> des forets</span>
            <FontAwesomeIcon icon={faAngleDown} className='angle'/>
          </p>

        </div>
      </div>
      <ul>
        <li className="hidden">Menu</li>
        <li>
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
        <li><Link to="/incident" className='link_style'><FontAwesomeIcon icon={faExclamationCircle} color='#84818A'/> Incident</Link></li>
        <li><Link to="/historique" className='link_style'><FontAwesomeIcon icon={faHistory} color='#84818A'/>   Historique des actions</Link></li>
        <li><Link to="/export" className='link_style'><FontAwesomeIcon icon={faFileCsv} color='#84818A'/> Exporter les données</Link></li>
        <li><Link to="/parametres" className='link_style'><FontAwesomeIcon icon={faCog} color='#84818A'/>   Paramètres</Link></li>
      </ul>
      <ul>
        <li className="hidden">Support</li>
        <li><Link to="/faq" className='link_style'><FontAwesomeIcon icon={faQuestionCircle} color='#84818A'/>   FAQ</Link></li>
        <li><Link to="/help" className='link_style'><FontAwesomeIcon icon={faLifeRing} color='#84818A'/>   Aide en Ligne</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
