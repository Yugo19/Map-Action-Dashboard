import {React, Component} from 'react'
import { Grid, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, useMap, Popup, Marker } from 'react-leaflet'
import '../../assets/css/global.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCalendarPlus} from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

class Analyze extends Component {
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
                <div style={{marginTop:"50px"}}>
                <Row>
                        <Col lg={6} sm={9} className="map-grid-view">
                            <div className="col_header">
                                <h4>Carte Interactive</h4>
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
                                <h4 style={{fontSize:"small", marginLeft:"10px"}}>Base Cartographique : Leaflet / OpenStreetMap</h4>
                                <div>
                                    <h5 style={{marginLeft:"350px", marginBottom:"-5px", fontWeight:"600", marginTop:"-45px", fontSize:"14px"}}>Code Couleur</h5>
                                    <div className="codeColor">
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
                                </div>
                                <div class="dashed-line"></div>
                                <div style={{marginLeft:'10px'}}>
                                    <div style={{marginBottom:'40px'}}>
                                        <h6>Context & Description</h6>
                                        <div className='descriptionIncident'>
                                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo, eius non? Tempore velit veritatis beatae et voluptatem eum blanditiis consequatur recusandae! Sed dolores rerum amet quos, nobis repellendus voluptatibus nostrum!</p>
                                        </div>
                                    </div>
                                    <div style={{marginBottom:'40px'}}>
                                        <h6>Impacts Potentiels</h6>
                                        <div className='descriptionIncident'>
                                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo, eius non? Tempore velit veritatis beatae et voluptatem eum blanditiis consequatur recusandae! Sed dolores rerum amet quos, nobis repellendus voluptatibus nostrum!</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h6>Pistes de solutions envisageables</h6>
                                        <div className='descriptionIncident'>
                                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo, eius non? Tempore velit veritatis beatae et voluptatem eum blanditiis consequatur recusandae! Sed dolores rerum amet quos, nobis repellendus voluptatibus nostrum!</p>
                                        </div>
                                    </div>
                                    <div className='boutonAnalyse'>
                                        <Link style={{color:"white", textDecoration:"none"}}>Discussion LLM</Link>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={3} sm={9}>
                                <Col>
                                    <Col lg={12} sm={9} className="chart-grid" style={{paddingTop:'25px'}}>
                                        <div className="col_header">
                                            <div style={{marginTop:"-28px", marginLeft:"20px"}}>
                                                <h4 style={{textAlign:"justify"}}>Image de l'incident</h4>
                                                <img src='' alt='incident image'/>
                                            </div>
                                            
                                            <div style={{display:"flex", justifyContent:"space-between"}}>
                                                <p>Date: {}</p>
                                                <p >Heure: {}</p>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={12} sm={9} className="chart-grid-ia" style={{paddingTop:'3px'}}>
                                        <div className="col_header">
                                            <h4>Type d'incident</h4>
                                            <div className='typeIncident'>
                                                <img src='' alt='type incident'/>
                                            </div>
                                        </div>
                                        <div className="col_header">
                                            <h4>Gravité d'incident</h4>
                                            <div className='typeIncident'>
                                                <img src='' alt='type incident'/>
                                            </div>
                                        </div>
                                        <div className="col_header">
                                            <h4>Code Couleur*</h4>
                                            <div style={{display:"flex"}}>
                                                <div>
                                                    <hr className="hr_yellow"/>
                                                    <p>Faible <br/>Impact</p>
                                                </div>
                                                <div>
                                                    <hr className="hr_orange_gr"/>
                                                    <p>Potentiellement <br/>Grave</p>
                                                </div>
                                                <div>
                                                    <hr className="hr_red_gr"/>
                                                    <p>Potentiellement<br/>Dangereux</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className='alerts'>
                                            <span>*</span> L'évaluation de la gravité des incidents
                                              est réalisée par notre système d'intelligence
                                              artificielle qui analyse conjointement certains 
                                              éléments tels que la proximité des incidents aux zones sensibles, 
                                              les populations vulnérables, les données environnementales contextuelles 
                                              et les tendences historiques. 
                                              Cette estimation repose sur les données actuellement accessibles et, 
                                              bien que précise dans la majorité des cas, 
                                              peut parfois être sujette à erreur ou à mauvaise interprétation. 
                                              Nous recommandons toujours une vérification sur le terrain pour confirmer 
                                              les détails de chaque incident.
                                            </p>
                                            <p></p>
                                        </div>
                                    </Col>
                                </Col>
                               
                            </Col>
                    </Row>
                </div>
            </div>
        )
    }
}
export default Analyze;