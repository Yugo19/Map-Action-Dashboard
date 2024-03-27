import React from 'react';
import './sidebar.scss'; 
import logo from '../../assets/logo.png'
import sidebar from '../../assets/img/sidebar-1.jpg'
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faHistory,faFileCsv, faCog, faBarChart, faQuestionCircle, faLifeRing, faSearch, faBell, faAngleDown} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {


  return (
    <div className={`sidebar`}>
      <div className="header">
        <div>
          <FontAwesomeIcon icon={faSearch} className="icon" color='#84818A'/>
          <input type="text" placeholder="Recherche" />
        </div>
        <FontAwesomeIcon icon={faBell} className="notifi" color='#84818A'/>        
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
        <li><Link to="/dashboard" className='link_style'><FontAwesomeIcon icon={faBarChart} color='#39A1DD'/>   Tableau de Bord </Link></li>
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
