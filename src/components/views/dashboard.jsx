import { faAngleDown, faBarChart, faCalendarPlus, faEye, faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { Grid, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet'
import '../../assets/css/global.css'
import { Link, useNavigate } from "react-router-dom"
import Chart from "chart.js/auto"
import { config } from "../../config";
import L from "leaflet"
import axios from "axios";
import ReactDOMServer from 'react-dom/server';

L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

function Dashboard(props) {
    const navigate = useNavigate()
    const chartRef = useRef();
    const [countIncidents, setCountIncidents] = useState('');
    const [countRapports, setCountRapports] = useState('');
    const [countZones, setCountZones] = useState('');
    const [countElus, setCountElus] = useState('');
    const [rapportsDispo, setRapportsDispo] = useState(0);
    const [rapportsNondispo, setRapportsNondispo] = useState(0);
    const [incidentsByMonth, setIncidentsByMonth] = useState([]);
    const [incidentsByWeek, setIncidentsByWeek] = useState([]);
    const [data, setData] = useState([]);
    const [indicateurs, setIndicateurs] = useState({});
    const [resolus, setResolus] = useState('');
    const [nonResolus, setNonResolus] = useState('');
    const [markers, setMarkers] = useState([[14.716677, -17.467686]]);
    const [showIncidentModal, setShowIncidentModal] = useState(false);
    const [incident, setIncident] = useState([]);
    const [userType, setUserType] = useState(sessionStorage.getItem('user_type'));

    useEffect(() => {
        _getIncidents();
        _getIndicateur();
        _getIncidentsNotResolved();
        _getIncidentsResolved();
    }, []);

    const _getIndicateur = async () => {
      const userChartRef = chartRef.current.getContext('2d');
      if (window.myChart !== undefined) {
          window.myChart.destroy(); // Détruit le graphique existant s'il existe
      }
      window.myChart = new Chart(userChartRef, {
          type: 'doughnut',
          data: {
              datasets: [{
                  data: [40, 20],
                  backgroundColor: ['purple', 'orange']
              }]
          },
          options: {}
      });
  }

    const _getIncidents = async () => {
        var url = config.url + '/MapApi/incident/'
        try {
            let res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer${sessionStorage.token}`,
                    'Content-Type': 'application/json',
                },
            })
            setCountIncidents(res.data.count);
            setData(res.data.results);
        } catch (error) {
            console.log(error.message)
        }
    }

    const _getIncidentsNotResolved = async () => {
        var url = config.url + '/MapApi/incidentNotResolved/'
        try {
            let res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer${sessionStorage.token}`,
                    'Content-Type': 'application/json',
                },
            })
            setNonResolus(res.data.count);
        } catch (error) {
            console.log(error.message)
        }
    }

    const _getIncidentsResolved = async () => {
        var url = config.url + '/MapApi/incidentResolved/'
        try {
            let res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer${sessionStorage.token}`,
                    'Content-Type': 'application/json',
                },
            })
            setResolus(res.data.count);
        } catch (error) {
            console.log(error.message)
        }
    }

    const getIcon = async (mark) => {
        console.log(mark.etat)
        if (mark.etat == 'declared') {
            return L.Icon.Default.mergeOptions({
                iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
            })
        } else {
            return L.Icon.Default.mergeOptions({
                iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
            })
        }
    }

    const getIncidentById = (id) => {
        let incident = ''
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            if (element.id === id) {
                incident = element
            }
        }
        return incident
    }

    const onShowIncident = (id) => {
        setShowIncidentModal(!showIncidentModal);
        const item = getIncidentById(id)
        console.log("Données d'incident dans onShowIncident :", item); 
        navigate(`/incident_view/${id}`, { incident: item }, () => {
          console.log('State updated:', location.state); 
          setIncident(item);
        });
        if (item) {
            console.log('element à afficher ', item)
            setIncident(item);
        }
    }

    let positions =[]
    data.map((incident, idx) => {
        if (incident.lattitude !== null && incident.longitude !== null && !isNaN(incident.longitude) && !isNaN(incident.lattitude)) {
            let pos = {
                id: incident.id,
                lat: incident.lattitude,
                lon: incident.longitude,
                tooltip: incident.title,
                desc: incident.description,
                etat: incident.etat,
                img: config.url + incident.photo,
            }
            positions.push(pos);
        }
    })
    const position = [16.2833, -3.0833]

    const iconHTML = ReactDOMServer.renderToString(<FontAwesomeIcon icon={faMapMarkerAlt} color="blue" size="2x"/>)
    const customMarkerIconBlue = new L.DivIcon({
        html: iconHTML,
    });

    const iconHTMLRed = ReactDOMServer.renderToString(<FontAwesomeIcon icon={faMapMarkerAlt} color="red" size="2x"/>)
    const customMarkerIconRed = new L.DivIcon({
        html: iconHTMLRed,
    });
        const map = (
            <MapContainer center={position} zoom={5}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {positions.map((mark, idx) => (
                <Marker
                  className="icon-marker"
                  key={`marker-${idx}`}
                  icon={mark.etat == "resolved" ? customMarkerIconBlue : customMarkerIconRed}
                  position={[mark.lat, mark.lon]}
                >
                  <Popup>
                    <span className="icon-marker-tooltip">
                      <ul>
                        <div className="row">
                          <div className="col-md-6">
                            <p>Voir l'incident</p>
                          </div>
                          <div className="col-md-6">
                            <img src={mark.img} alt="" />
                            <div>
                            <button
                              className="boutton  button--round-l"
                              onClick={(e) => onShowIncident(mark.id)}
                            >
                              <FontAwesomeIcon icon={faEye} color="#ccc"/>
                            </button>
                            </div>
                          </div>
                        </div>
                      </ul>
                    </span>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )
        return (
            <div className="body">
                <div>
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
                                    <h3 className="titleCard">Nombre d'incidents</h3>
                                    <p className="percentage">+3,19%</p>
                                </div>
                                <div className="percent">
                                    <p>{countIncidents}</p>
                                    <FontAwesomeIcon icon={faBarChart} className="stat-icon"/>
                                </div>
                                <div>
                                </div>
                            </div>
                        </Col>
                        <Col lg={3} sm={9} className="compte">
                            <div>
                                <div>
                                    <h3 className="titleCard">Pourcentage pris en compte</h3>
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
                                    <h3 className="titleCard">Pourcentage résolu</h3>
                                    <p className="resolve-percent">-3,19%</p>
                                </div>
                                <div className="percent">
                                    <p>{resolus}%</p>
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
                        <Col lg={6} sm={9} className="map-grid">
                            <div className="col_header">
                                <h4>Carte Interactive</h4>
                                <p>Carte interactive avec les points reportés par les utilisateurs de l'application mobile</p>
                            </div>
                            <div id="map"> 
                              {map}
                            </div>
                            <div>
                                <h4 style={{fontSize:"small", marginLeft:"10px"}}>Base Cartographique : Leaflet / OpenStreetMap</h4>
                                <div>
                                    <h5 style={{marginLeft:"350px", marginBottom:"-5px", fontWeight:"600", marginTop:"-48px", fontSize:"14px"}}>Code Couleur</h5>
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
                            <div className="dashed-line"></div>
                            <div>
                                <h4 className="repartionText">Repartition des incidents par catégories</h4>
                                <Row>
                                    <Col lg={6} >
                                        <div className="repartition">
                                            <p style={{fontSize:"14px"}}>Déchet Solides</p>
                                            <p style={{float:"right", marginTop:"-25px"}}>25%</p>
                                            <hr/>
                                        </div>
                                        <div className="repartition">
                                            <p style={{fontSize:"14px"}}>Déchet Solides</p>
                                            <p style={{float:"right", marginTop:"-25px",}}>25%</p>
                                            <hr/>
                                        </div>
                                    </Col>
                                    <Col lg={6} >
                                        <div className="repartition">
                                            <p style={{fontSize:"14px"}}>Déchet Solides</p>
                                            <p style={{float:"right", marginTop:"-25px"}}>25%</p>
                                            <hr/>
                                        </div>
                                        <div className="repartition">
                                            <p style={{fontSize:"14px"}}>Déchet Solides</p>
                                            <p style={{float:"right", marginTop:"-25px"}}>25%</p> 
                                            <hr/>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col lg={3} sm={9}>
                            <Col>
                                <Col lg={12} sm={9} className="chart-grid" style={{paddingTop:'5px'}}>
                                    <div className="col_header">
                                        <h4>Incidents par type d’utilisateurs</h4>
                                        <p>Mar 21 - Apr 21</p>
                                        <div style={{width:"164px", height:"164px", justifyItems:"center", marginLeft:"60px"}}>
                                            <canvas ref={chartRef} width="300" height="100"></canvas>
                                        </div>
                                        <Row style={{marginTop:'40px'}}>
                                            <Col lg={6}>
                                                <div style={{marginLeft:"35px"}}>
                                                    <p style={{fontWeight:"600", fontSize:"32px", lineHeight:"48px"}}>75%</p>
                                                    <div style={{display:"flex"}}>
                                                        <div className="dotpurple"></div>
                                                        <p className="doghnut_p">Anonymes</p>
                                                    </div>
                                                </div>
                                                <hr className="separate"/>
                                            </Col>
                                            
                                            <Col>
                                                <div style={{}}>
                                                    <p style={{fontWeight:"600", fontSize:"32px", lineHeight:"48px"}}>15%</p>
                                                    <div style={{display:"flex"}}>
                                                        <div className="dotorange"></div>
                                                        <p className="doghnut_p">Inscrits</p>
                                                    </div>
                                                    
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                               <Col lg={12} sm={9} className="chart-grid" style={{paddingTop:'5px'}}>
                                    <div className="col_header">
                                        <h4>Incidents par Zones</h4>
                                    </div>
                                </Col> 
                            </Col>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }

export default Dashboard;
