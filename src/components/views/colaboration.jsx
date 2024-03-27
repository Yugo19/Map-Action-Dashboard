import {React, Component} from 'react'
import { Grid, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, useMap, Popup, Marker } from 'react-leaflet'
import '../../assets/css/global.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown,faBarChart, faCalendarPlus} from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

class Colaboration extends Component {
    render(){
        return(
            <div className='body'>
                <div style={{backgroundColor:"#f4f7f7"}}>
                    <div className="title">
                        <h3 style={{fontSize:"30px", fontWeight:"700"}}>Tableau de Bord</h3>
                    </div>
                    <div className="monthChoice">
                        <FontAwesomeIcon icon={faCalendarPlus} color='#84818A'/>
                        <p>ce mois</p>
                        <FontAwesomeIcon icon={faAngleDown} color='#84818A' className="angleDo"/>
                    </div>
                    <div>
                        <div className="dash">
                            <ul className="dash_ul">
                                <li style={{ textDecoration: 'none'}}><Link to="/dashboard" style={{ textDecoration: 'none', color:"#202020", fontWeight:"500", fontSize:"16px", lineHeight:"24px", fontStyle:"poppins" }}>Vue d'ensemble</Link></li>
                                <li><Link to="/incident_view" style={{ textDecoration: 'none', color:"#202020", fontWeight:"500", fontSize:"16px", lineHeight:"24px", fontStyle:"poppins" }}>Vue incident</Link></li>
                                <li><Link to="/analyze" style={{ textDecoration: 'none', color:"#202020", fontWeight:"500", fontSize:"16px", lineHeight:"24px", fontStyle:"poppins" }}>Analyses Avancées</Link></li>
                                <li><Link to="/colaboration" style={{ textDecoration: 'none', color:"#202020", fontWeight:"500", fontSize:"16px", lineHeight:"24px", fontStyle:"poppins" }}>Collaboration</Link></li>
                            </ul>
                        </div>
                    </div>
                    <hr className="dash_line"/>
                </div>
                <div>
                    <Row>
                        <Col lg={3} sm={9} className="colle">
                            <div>
                                <div>
                                    <h3 className="titleCard">Nombre d'incidents <br/> pris en compte</h3>
                                    <p className="percentage">+3,19%</p>
                                </div>
                                <div className="percent">
                                    <p>824</p>
                                    <FontAwesomeIcon icon={faBarChart} className="stat-icon"/>
                                </div>
                                <div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={3} sm={9} className="compte">
                            <div>
                                <div>
                                    <h3 className="titleCard">Nombre d'incidents <br/> avec collaboration</h3>
                                    <p className="percentage">+3,19%</p>
                                </div>
                                <div className="percent">
                                    <p>19%</p>
                                    <FontAwesomeIcon icon={faBarChart} className="statistic-icon"/>
                                </div>
                                <div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={3} sm={9} className="resolu">
                            <div>
                                <div>
                                    <h3 className="titleCard">Pourcentage <br/> de collaboration</h3>
                                    <p className="resolve-percent">-3,19%</p>
                                </div>
                                <div className="percent">
                                    <p>17%</p>
                                    <FontAwesomeIcon icon={faBarChart} className="statist-icon"/>
                                </div>
                                <div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div style={{marginTop:"15px"}}>
                        <div className="map-grid-colabor" style={{paddingTop:'5px'}}>
                            <div className="col_header">
                                <h4 style={{marginLeft:"30px"}}>Carte Interactive</h4>
                            </div>
                            <div id="map"> 
                                <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[51.505, -0.09]}>
                                        <Popup>
                                            Map Action <br /> voir l'incident 
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                            <div>
                                <Row>
                                    <Col lg={6} sm={6}>
                                        <h4 style={{fontSize:"small", marginLeft:"10px", lineHeight:"21px", fontWeight:"400"}}>Base Cartographique : Leaflet / OpenStreetMap</h4>
                                    </Col>
                                    <Col lg={6} sm={6}>
                                    <div>
                                        <h5 style={{marginLeft:'200px'}}>Code Couleur</h5>
                                        <div className="code">
                                            <div>
                                                <hr className="hr_blue"/>
                                                <p>Declaré <br/> résolu</p>
                                            </div>
                                            <div>
                                                <hr className="hr_orange"/>
                                                <p>Pris en <br/> compte</p>
                                            </div>
                                            <div>
                                                <hr className="hr_red"/>
                                                <p>Pas d'action</p>
                                            </div>
                                        </div>
                                    </div>
                                
                                </Col>
                                </Row>
                                
                                
                            </div>
                        </div>
                </div>
            </div>
        )
    }
}
export default Colaboration;