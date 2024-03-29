import React,{useState, useEffect} from 'react'
import { Grid, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, useMap, Popup, Marker, Circle } from 'react-leaflet'
import '../../assets/css/global.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown,faBarChart, faCalendarPlus, faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactDOMServer from 'react-dom/server';
import { config } from '../../config';

function Colaborate (){
    const navigate = useNavigate();
    const { incidentId } = useParams(); 
    const [incident, setIncident] = useState({});
    const [videoIsLoading, setVideoIsLoading] = useState(false);
    console.log('Incident updated:', incident);
    useEffect(() => {
        const fetchIncident = async () => {
            try {
                const url = config.url + "/MapApi/incident/" + incidentId
                const response = await axios.get(url);
                setIncident(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails de l\'incident :', error);
            }
        };

        if (incidentId) {
            fetchIncident(); 
        }
    }, [incidentId]);

    const imgUrl = incident ? config.url + incident.photo : '';
    const audioUrl = incident ? config.url + incident.audio : '';
    const videoUrl = incident ? config.url + incident.video : '';
    const latitude = incident ? incident.lattitude: 0;
    const longitude = incident ?  incident.longitude: 0;
    const description = incident ? incident.description: '';
    const position = [latitude,longitude];
    const dataTostring = incident ? incident.created_at :'';
    const dateObject = new Date(dataTostring)
    const date = dateObject.toLocaleDateString();
    const heure = dateObject.toLocaleTimeString()
    const iconHTML = ReactDOMServer.renderToString(<FontAwesomeIcon icon={faMapMarkerAlt} color="blue" size="2x"/>)
    const customMarkerIconBlue = new L.DivIcon({
        html: iconHTML,
    });

    const iconHTMLRed = ReactDOMServer.renderToString(<FontAwesomeIcon icon={faMapMarkerAlt} color="red" size="2x"/>)
    const customMarkerIconRed = new L.DivIcon({
        html: iconHTMLRed,
    });
    const iconHTMLOrange = ReactDOMServer.renderToString(<FontAwesomeIcon icon={faMapMarkerAlt} color="orange" size="2x"/>)
    const customMarkerIconOrange = new L.DivIcon({
        html: iconHTMLOrange,
    });
    const Loader = () => {
        return (
            <div className="loader">
                <h2>Loading video...</h2>
            </div>
        )
    }
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
                    <Row>
                        <Col lg={6} sm={9} className="map-grid-view">
                            <div className="col_header">
                                <h4>Carte Interactive</h4>
                            </div>
                            <div id="map"> 
                            {/* && typeof longitude=="number" && typeof latitude=="number"  */}
                                {latitude !== null && longitude !== null ? (
                                    <MapContainer center={position} zoom={13}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <Marker
                                        className="icon-marker"
                                        icon={
                                            incident.etat === "resolved"
                                              ? customMarkerIconBlue
                                              : incident.etat === "taken_into_account"
                                                ? customMarkerIconOrange
                                                : customMarkerIconRed
                                          }
                                        position={position}
                                        >
                                            <Popup>{incident.title}</Popup>
                                            <Circle center={position} radius={500} color="red"></Circle>
                                        </Marker>
                                    </MapContainer>
                                ) : (
                                    <p className="danger">Coordonnees non renseignees</p>
                                )}
                            </div>
                            <div>
                                <h4 style={{fontSize:"small", marginLeft:"10px"}}>Base Cartographique : Leaflet / OpenStreetMap</h4>
                                <div>
                                    <h5 style={{marginLeft:"350px", marginBottom:"5px", fontWeight:"500", marginTop:"-45px", fontSize:"18px"}}>Code Couleur</h5>
                                    <div className="codeColor">
                                        <div>
                                            <div className="hr_blue"/>
                                            <p>Declaré <br/> résolu</p>
                                        </div>
                                        <div>
                                            <div className="hr_orange"/>
                                            <p>Pris en <br/> compte</p>
                                        </div>
                                        <div>
                                            <div className="hr_red"/>
                                            <p>Pas d'action</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="dashed-line"></div>
                            <Row className='organisation-info'>
                                <Col lg={3}>
                                    <img src='' alt=''/>{''}
                                </Col>
                                <Col lg={6} className='alerts'>
                                    <p style={{lineHeight:'28px'}}>Organisation ayant pris en compte: <span>{}</span><br/>
                                        Date de pris en compte: {} <br/>
                                        Contacts:{}/{} <br/>
                                        En savoir plus sur <span>{}</span>
                                    </p>
                                </Col>
                                
                            </Row>
                            <div className='ask'>
                                <Link style={{textDecoration:'none', color:"#ffff"}}>Faire une demande de collaboration sur cet incident</Link>
                            </div>
                        </Col>
                        <Col lg={3} sm={9}>
                            <Col>
                                <Col lg={12} sm={9} className="chart-grid">
                                    <div className="col_header">
                                        <div style={{marginTop:"-28px", paddingTop:'15px'}}>
                                            <h4 style={{textAlign:"justify"}}>Image de l'incident</h4>
                                            <img src={imgUrl} alt='' style={{height:"300px"}}/>{''}
                                        </div>
                                        <div style={{display:"flex", justifyContent:"space-between"}}>
                                            <p>Date: {date}</p>
                                            <p >Heure: {heure}</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={12} sm={9} className="chart-grid-ia">
                                    <div className="col_header" style={{paddingTop:'15px'}}>
                                        <h4>Type d'incident</h4>
                                        <div className='typeIncident'>
                                            <img src='' alt=''/>{''}
                                        </div>
                                    </div>
                                    <div className="col_header">
                                        <h4>Gravité d'incident</h4>
                                        <div className='typeIncident'>
                                            <img src='' alt=''/>{''}
                                        </div>
                                    </div>
                                    <div className="col_header">
                                        <h4>Code Couleur*</h4>
                                        <div style={{display:"flex"}}>
                                            <div>
                                                <div className="hr_yellow"/>
                                                <p>Faible <br/>Impact</p>
                                            </div>
                                            <div>
                                                <div className="hr_orange_gr"/>
                                                <p>Potentiellement <br/>Grave</p>
                                            </div>
                                            <div>
                                                <div className="hr_red_gr"/>
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
                                            Nous recommandons toujours une vérification sur le terrain pour confirmer                                                 les détails de chaque incident.
                                        </p>
                                    </div>
                                </Col>
                            </Col>
                        </Col>
                    </Row>
                </div>
            </div>
        );
}
export default Colaborate