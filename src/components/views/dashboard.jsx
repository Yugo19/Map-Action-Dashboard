import { faAngleDown, faBarChart, faCalendarPlus, faEye, faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { Grid, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet'
import '../../assets/css/global.css'
import { Link, useNavigate, useLocation } from "react-router-dom"
import Chart from "chart.js/auto"
import { config } from "../../config";
import L from "leaflet"
import axios from "axios";
import ReactDOMServer from 'react-dom/server';
import Select from 'react-select'
import { components } from "react-select";

L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

function Dashboard(props) {
    const navigate = useNavigate()
    const chartRef = useRef();
    const [countIncidents, setCountIncidents] = useState('');
    // const [incidentsByMonth, setIncidentsByMonth] = useState([]);
    const [data, setData] = useState([]);
    const [resolus, setResolus] = useState('');
    const [taken_into, setTaken] = useState('');
    // const [markers, setMarkers] = useState([[14.716677, -17.467686]]);
    const [showIncidentModal, setShowIncidentModal] = useState(false);
    const [incident, setIncident] = useState([]);
    const [userType, setUserType] = useState(sessionStorage.getItem('user_type'));
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [percentageAnonymous, setAnonymousPercentage] = useState(0);
    const [registeredPercentage, setRegisteredPercentage] = useState(0);
    const [percentageVs, setPercentageVs] = useState(0)
    const [percentageVsTaken, setPercentageVsTaken] = useState(0)
    const [percentageVsResolved, setPercentageVsResolved] = useState(0)
    useEffect(() => {
        _getIncidents();
        _getIndicateur();
        _getIncidentsResolved();
        _getAnonymous();
        _getPercentage();
        _getPercentageVsPreviousMonth();
        _getPercentageVsTaken();
        _getPercentageVsResolved();
        _getZone();
        _getRegistered();
    }, [selectedMonth]);

    const handleMonthChange = (selectedOption) => {
        console.log("Selected month:", selectedOption); 
        const monthValue = selectedOption.value;
        if (monthValue >= 1 && monthValue <= 12) {
            setSelectedMonth(monthValue);
        } else {
            console.error("Invalid month value:", monthValue);
        }
    };
    const monthsOptions = [
        { value: 1, label: 'Janvier' },
        { value: 2, label: 'Février' },
        { value: 3, label: 'Mars' },
        { value: 4, label: 'Avril' },
        { value: 5, label: 'Mai' },
        { value: 6, label: 'Juin' },
        { value: 7, label: 'Juillet' },
        { value: 8, label: 'Août' },
        { value: 9, label: 'Septembre' },
        { value: 10, label: 'Octobre' },
        { value: 11, label: 'Novembre' },
        { value: 12, label: 'Decembre' },
    ];
    // user not registered
    const _getAnonymous = async () =>{
        var url = `${config.url}/MapApi/incidentByMonth/?month=${selectedMonth}`
        try {
            let res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer${sessionStorage.token}`,
                    'Content-Type': 'application/json',
                },
            })
            let totalIncidents = res.data.data.length;
            let anonymousIncidents = res.data.data.filter(incident => incident.user_id === null).length;
            let percentageAnonymous = totalIncidents !== 0 ? ((anonymousIncidents / totalIncidents) * 100).toFixed(2) : 0;
            setAnonymousPercentage(percentageAnonymous);
            return percentageAnonymous;
        } catch (error) {
            console.log(error.message)
            setAnonymousPercentage(0);
        }
    }
    // User Registried
    const _getRegistered = async () =>{
        var url = `${config.url}/MapApi/incidentByMonth/?month=${selectedMonth}`;
        try {
            let res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer${sessionStorage.token}`,
                    'Content-Type': 'application/json',
                },
            });
            let totalIncidents = res.data.data.length;
            let registeredIncidents = res.data.data.filter(incident => incident.user_id !== null).length;
            let percentageRegistered = totalIncidents !== 0 ? ((registeredIncidents / totalIncidents) * 100).toFixed(2) : 0;
            setRegisteredPercentage(percentageRegistered);
            return percentageRegistered;
        } catch (error) {
            console.log(error.message);
            setRegisteredPercentage(0); 
        };
    }
    // Chart of users
    const _getIndicateur = async () => {
      const userChartRef = chartRef.current.getContext('2d');
      if (window.myChart !== undefined) {
          window.myChart.destroy(); 
      }
      try {
        const anonymousPercentage = await _getAnonymous();
        const registerdPercent = await _getRegistered();
        window.myChart = new Chart(userChartRef, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [anonymousPercentage, registerdPercent],
                    backgroundColor: ['purple', 'orange']
                }]
            },
            options: {}
        });
      } catch (error) {
        console.log(error.message)
      }
     
    }
    // Retrieve percentage of incident taken into account
    const _getPercentage = async () => {
        var url = `${config.url}/MapApi/incidentByMonth/?month=${selectedMonth}`
        try {
            let res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer${sessionStorage.token}`,
                    'Content-Type': 'application/json',
                },
            })
            let totalIncidents = res.data.data.length;
            let taken = res.data.data.filter(incident => incident.etat === "taken_into_account").length;
            let percentageTaken = totalIncidents !== 0 ? ((taken / totalIncidents) * 100).toFixed(2) : 0;
            setTaken(percentageTaken)
            console.log("Incidents pris en comptes", percentageTaken)
        } catch (error) {
            console.log(error.message)
        }
    }
    // Chart of zone by users
    const _getZone = async () => {
        try {
            const data = [
                { zone: "Zone A", user: "Anonyme", incidents: 10 },
                { zone: "Zone A", user: "Inscrit", incidents: 15 },
                { zone: "Zone B", user: "Anonyme", incidents: 8 },
                { zone: "Zone B", user: "Inscrit", incidents: 12 },
            ];
    
            const aggregatedData = {};
            data.forEach(entry => {
                if (!aggregatedData[entry.zone]) {
                    aggregatedData[entry.zone] = { Anonyme: 0, Inscrit: 0 };
                }
                aggregatedData[entry.zone][entry.user] += entry.incidents;
            });
    
            const chartData = {
                labels: Object.keys(aggregatedData),
                datasets: [
                    {
                        label: 'Anonyme',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        data: Object.values(aggregatedData).map(zoneData => zoneData.Anonyme)
                    },
                    {
                        label: 'Inscrit',
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        data: Object.values(aggregatedData).map(zoneData => zoneData.Inscrit)
                    }
                ]
            };
    
            const chartConfig = {
                type: 'bar',
                data: chartData,
                options: {
                    indexAxis: 'y',
                    scales: {
                        x: {
                            beginAtZero: true
                        }
                    }
                }
            };
    
            const existingChart = window.myConfig;
            if (existingChart) {
                existingChart.destroy(); 
            }
    
            const ctx = document.getElementById('myConfig').getContext('2d');
            window.myConfig = new Chart(ctx, chartConfig);
        } catch (error) {
            console.error(error.message);
        }
    };
    
    // Retrieve Incident
    const _getIncidents = async () => {
        var url = `${config.url}/MapApi/incidentByMonth/?month=${selectedMonth}`
        try {
            let res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer${sessionStorage.token}`,
                    'Content-Type': 'application/json',
                },
            })
            setCountIncidents(res.data.data.length);
            setData(res.data.data);
        } catch (error) {
            console.log(error.message)
        }
    }
    // Resolved Incidents
    const _getIncidentsResolved = async () => {
        var url = `${config.url}/MapApi/incidentByMonth/?month=${selectedMonth}`
        try {
            let res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer${sessionStorage.token}`,
                    'Content-Type': 'application/json',
                },
            })
            let totalIncidents = res.data.data.length;
            let resolve = res.data.data.filter(incident => incident.etat === "resolved").length;
            let percentageTaken = totalIncidents !== 0 ? ((resolve / totalIncidents) * 100).toFixed(2): 0;
            setResolus(percentageTaken)
        } catch (error) {
            console.log(error.message)
        }
    }
    // Percentage previous 
    const _getPercentageVsPreviousMonth = async () => {
        const previousMonth = selectedMonth - 1;
        const currentMonthUrl = `${config.url}/MapApi/incidentByMonth/?month=${selectedMonth}`;
        const previousMonthUrl = `${config.url}/MapApi/incidentByMonth/?month=${previousMonth}`;
        try {
            const [currentMonthRes, previousMonthRes] = await Promise.all([
                axios.get(currentMonthUrl, {
                    headers: {
                        Authorization: `Bearer${sessionStorage.token}`,
                        'Content-Type': 'application/json',
                    },
                }),
                axios.get(previousMonthUrl, {
                    headers: {
                        Authorization: `Bearer${sessionStorage.token}`,
                        'Content-Type': 'application/json',
                    },
                })
            ]);
    
            const incidentsCurrentMonth = currentMonthRes.data.data.length;
            const incidentsPreviousMonth = previousMonthRes.data.data.length;
            const percentageVsPreviousMonth = incidentsPreviousMonth !== 0 ? ((incidentsCurrentMonth / incidentsPreviousMonth) * 100).toFixed(2) : 0;
            setPercentageVs(percentageVsPreviousMonth)
        } catch (error) {
            console.log(error.message);
        }
    };
    // Percentage previous 
    const _getPercentageVsResolved = async () => {
        const previousMonth = selectedMonth - 1;
        const currentMonthUrl = `${config.url}/MapApi/incidentByMonth/?month=${selectedMonth}`;
        const previousMonthUrl = `${config.url}/MapApi/incidentByMonth/?month=${previousMonth}`;
        try {
            const [currentMonthRes, previousMonthRes] = await Promise.all([
                axios.get(currentMonthUrl, {
                    headers: {
                        Authorization: `Bearer${sessionStorage.token}`,
                        'Content-Type': 'application/json',
                    },
                }),
                axios.get(previousMonthUrl, {
                    headers: {
                        Authorization: `Bearer${sessionStorage.token}`,
                        'Content-Type': 'application/json',
                    },
                })
            ]);
    
            const incidentsCurrentMonth = currentMonthRes.data.data.filter(incident => incident.etat === "resolved").length;
            const incidentsPreviousMonth = previousMonthRes.data.data.filter(incident => incident.etat === "resolved").length;
            const percentageVsPreviousMonth = incidentsPreviousMonth !== 0 ? ((incidentsCurrentMonth / incidentsPreviousMonth) * 100).toFixed(2) : 0;
            setPercentageVsResolved(percentageVsPreviousMonth)
        } catch (error) {
            console.log(error.message);
        }
    };

    const [showOnlyTakenIntoAccount, setShowOnlyTakenIntoAccount] = useState(false);
    const [showOnlyResolved, setShowOnlyResolved] = useState(false);
    const [showOnlyDeclared, setShowOnlyDeclared] = useState(false);

    // Percentage previous 
    const _getPercentageVsTaken = async () => {
        const previousMonth = selectedMonth - 1;
        const currentMonthUrl = `${config.url}/MapApi/incidentByMonth/?month=${selectedMonth}`;
        const previousMonthUrl = `${config.url}/MapApi/incidentByMonth/?month=${previousMonth}`;
        try {
            const [currentMonthRes, previousMonthRes] = await Promise.all([
                axios.get(currentMonthUrl, {
                    headers: {
                        Authorization: `Bearer${sessionStorage.token}`,
                        'Content-Type': 'application/json',
                    },
                }),
                axios.get(previousMonthUrl, {
                    headers: {
                        Authorization: `Bearer${sessionStorage.token}`,
                        'Content-Type': 'application/json',
                    },
                })
            ]);
    
            const incidentsCurrentMonth = currentMonthRes.data.data.filter(incident => incident.etat === "taken_into_account").length;
            const incidentsPreviousMonth = previousMonthRes.data.data.filter(incident => incident.etat === "taken_into_account").length;
            const percentageVsPreviousMonth = incidentsPreviousMonth !== 0 ? ((incidentsCurrentMonth / incidentsPreviousMonth) * 100).toFixed(2) : 0;
            setPercentageVsTaken(percentageVsPreviousMonth)
        } catch (error) {
            console.log(error.message);
        }
    };
    
    // Retrieving incident by id
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
    const TakenOnMap = async () => {
        setShowOnlyTakenIntoAccount(!showOnlyTakenIntoAccount);
        setShowOnlyResolved(false);
    }
    const ResolvedOnMap = async () => {
        setShowOnlyResolved(!showOnlyResolved);
        setShowOnlyTakenIntoAccount(false);
    }
    const DeclaredOnMap = async () => {
        setShowOnlyResolved(!showOnlyDeclared);
        setShowOnlyTakenIntoAccount(false);
        setShowOnlyResolved(false);
    }
    const location = useLocation();

    function CustomOption (props) {
        return (
          <components.Option {...props}>
            <FontAwesomeIcon icon={faCalendarPlus} />
            {props.children}
          </components.Option>
        );
    };
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
                img: incident.photo,
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
    const iconHTMLOrange = ReactDOMServer.renderToString(<FontAwesomeIcon icon={faMapMarkerAlt} color="orange" size="2x"/>)
    const customMarkerIconOrange = new L.DivIcon({
        html: iconHTMLOrange,
    });
        const map = (
            <MapContainer center={position} zoom={5}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {positions.map((mark, idx) => (
                ((showOnlyTakenIntoAccount && mark.etat !== "taken_into_account") ||
                    (showOnlyResolved && mark.etat !== "resolved") ||
                    (showOnlyDeclared && mark.etat !== "declared")) ? null : (
                <Marker
                  className="icon-marker"
                  key={`marker-${idx}`}
                  icon={
                    mark.etat === "resolved"
                      ? customMarkerIconBlue
                      : mark.etat === "taken_into_account"
                        ? customMarkerIconOrange
                        : customMarkerIconRed
                  }
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
                )
              ))}
            </MapContainer>
          )
        return (
            <div className="body">
                <div className="">
                    <div className="title">
                        <h3 style={{fontSize:"30px", fontWeight:"700"}}>Tableau de Bord</h3>
                    </div> 
                    <div className="monthChoice">
                        <Select
                            components={{CustomOption}}
                            value={monthsOptions.find(option => option.value === selectedMonth)}
                            onChange={handleMonthChange}
                            options={monthsOptions}
                            styles={{
                                control: (provided, state) => ({
                                    ...provided,
                                    border: '1px solid #ccc',
                                    borderRadius: '15px',
                                    width:'150px',
                                    height:'40px',
                                    justifyContent:'space-around',
                                    paddingLeft: '3px',
                                }),
                                indicatorSeparator: (provided, state) => ({
                                    ...provided,
                                    display: 'none'
                                }),
                            }}
                        />
                    </div>
                    <div>
                        <div className="dash">
                            <ul className="dash_ul">
                                <li style={{ textDecoration: 'none'}}>
                                    <Link 
                                        to="/dashboard"
                                        className={location.pathname === "/dashboard" ? "selected-link" : "link"}
                                    >
                                        Vue d'ensemble
                                    </Link>
                                </li>
                                <li><Link to="/incident_view" className="link non-clickable">Vue incident</Link></li>
                                <li><Link to="/analyze" className="link non-clickable">Analyses Avancées</Link></li>
                                <li><Link to="/colaboration" className="link">Collaboration</Link></li>
                            </ul>
                        </div>
                    </div>
                    <hr className="dash_line"/>
                </div>
                <div>
                    <Row>
                        <Col className="colle col-3">
                            <div>
                                <div>
                                    <h3 className="titleCard">Nombre d'incidents</h3>
                                    <p className="percentage">{percentageVs}%</p>
                                </div>
                                <div className="percent">
                                    <p>{countIncidents}</p>
                                    <FontAwesomeIcon icon={faBarChart} className="stat-icon"/>
                                </div>
                                <div>
                                </div>
                            </div>
                        </Col>
                        <Col className="compte col-3" onClick={TakenOnMap}>
                            <div>
                                <div>
                                    <h3 className="titleCard">Pourcentage pris en compte</h3>
                                    <p className="percentage">{percentageVsTaken}%</p>
                                </div>
                                <div className="percent">
                                    <p>{taken_into}%</p>
                                    <FontAwesomeIcon icon={faBarChart} className="statistic-icon"/>
                                </div>
                                <div>
                                </div>
                            </div>
                        </Col>
                        <Col className="resolu col-3" onClick={ResolvedOnMap}>
                            <div>
                                <div>
                                    <h3 className="titleCard">Pourcentage résolu</h3>
                                    <p className="resolve-percent">{percentageVsResolved}%</p>
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
                                    <h5 style={{marginLeft:"350px", marginBottom:"5px", fontWeight:"500", marginTop:"-48px", fontSize:"18px"}}>Code Couleur</h5>
                                    <div className="codeColor">
                                        <div>
                                            <div className="hr_blue" onClick={ResolvedOnMap}/>
                                            <p>Declaré <br/> résolu</p>
                                        </div>
                                        <div>
                                            <div className="hr_orange" onClick={TakenOnMap}/>
                                            <p>Pris en <br/> compte</p>
                                        </div>
                                        <div>
                                            <div className="hr_red" onClick={DeclaredOnMap}/>
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
                                                    <p style={{fontWeight:"600", fontSize:"32px", lineHeight:"48px"}}>{percentageAnonymous}%</p>
                                                    <div style={{display:"flex"}}>
                                                        <div className="dotpurple"></div>
                                                        <p className="doghnut_p">Anonymes</p>
                                                    </div>
                                                </div>
                                                <hr className="separate"/>
                                            </Col>
                                            
                                            <Col>
                                                <div style={{}}>
                                                    <p style={{fontWeight:"600", fontSize:"32px", lineHeight:"48px"}}>{registeredPercentage}%</p>
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
                                    <div>
                                        <canvas id="myConfig" width="300" height="100"></canvas>
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
