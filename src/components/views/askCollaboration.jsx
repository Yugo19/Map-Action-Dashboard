import React,{useState, useEffect} from 'react'
import { Grid, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, useMap, Popup, Marker, Circle } from 'react-leaflet'
import '../../assets/css/global.css'
import face from '../../assets/img/faces/face-0.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown,faBarChart, faCalendarPlus, faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactDOMServer from 'react-dom/server';
import { config } from '../../config';
import Select from "react-select";
import Swal from 'sweetalert2';

function Colaborate (){
    const navigate = useNavigate();
    const { incidentId } = useParams(); 
    const [incident, setIncident] = useState({});
    const [videoIsLoading, setVideoIsLoading] = useState(false);
    console.log('Incident updated:', incident);
    const [collaborations, setCollaborations] = useState([]);
    const imgUrl = incident ? config.url + incident.photo : '';
    const audioUrl = incident ? config.url + incident.audio : '';
    const videoUrl = incident ? config.url + incident.video : '';
    const latitude = incident.lattitude || 0;
    const longitude = incident.longitude || 0;
    const description = incident ? incident.description: '';
    const position = [latitude,longitude];
    const dataTostring = incident ? incident.created_at :'';
    const dateObject = new Date(dataTostring)
    const [selectedFilter, setSelectedFilter] = useState("all"); 
    const date = dateObject.toLocaleDateString();
    const heure = dateObject.toLocaleTimeString()
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [actions, setActions] = useState([]);
    const [percentageVsTaken, setPercentageVsTaken] = useState(0)
    const [countIncidents, setCountIncidents] = useState('');
    const [data, setData] = useState([]);
    const [incidentDetails, setIncidentDetails] = useState({});
    const [userDetails, setUserDetails] = useState({});
    const [actionDetails, setActionDetails] = useState({});
    const userId = sessionStorage.getItem('user_id');

    const [newCollaborationData, setNewCollaborationData] = useState({
        incident: incidentId,
        user: userId,
        end_date: '2024-06-25'
    });

    const fetchCollaborations = async () => {
        try {
            const response = await axios.get(`${config.url}/MapApi/collaboration`);
            setCollaborations(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des collaborations : ', error);
        }
    };

    const createCollaboration = async () => {
        try {
            const response = await axios.post(`${config.url}/MapApi/collaboration/`, newCollaborationData, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            fetchCollaborations();
            setNewCollaborationData({
                incident: incidentId,
                user: userId,
            });
        } catch (error) {
            console.error('Erreur lors de la création de la collaboration : ', error);
            throw error;
        }
    };

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
        fetchCollaborations();
        _getPercentageVsTaken();
        _getIncidents();
        getIncidentDetails();

        if (incidentId) {
            fetchIncident(); 
        }
    }, [incidentId]);
    const _getIncidents = async () => {
        var url = `${config.url}/MapApi/incidentByMonth/?month=${selectedMonth}`
        try {
            let res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer${sessionStorage.token}`,
                    'Content-Type': 'application/json',
                },
            })
            setCountIncidents(res.data.data.filter(incident => incident.etat === "taken_into_account").length);
            setData(res.data.data.filter(incident => incident.etat === "taken_into_account"));
        } catch (error) {
            console.log(error.message)
        }
    }

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
            const percentageVsPreviousMonth = incidentsPreviousMonth !== 0 ? (incidentsCurrentMonth / incidentsPreviousMonth) * 100 : 0;
            setPercentageVsTaken(percentageVsPreviousMonth)
            console.log(`Pourcentage des incidents en ${selectedMonth} par rapport à ${previousMonth}: ${percentageVsPreviousMonth}%`);
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleCollaborationRequest = async () => {
        const confirmation = window.confirm("Voulez-vous faire une demande de collaboration sur cet incident ?");
        if (confirmation) {
            try {
                await createCollaboration();
                Swal.fire("Succès","La demande de collaboration a été envoyée !");
            } catch (error) {
                console.error('Erreur lors de la création de la collaboration : ', error);
                Swal.fire("Erreur",
                    "Une erreur s'est produite lors de l'envoi de la demande de collaboration. Veuillez réessayer plus tard.");
            }
        }
    };
    
    
    const getIncidentDetails = async () => {
        try {
            const url = `${config.url}/MapApi/incidentDetail/${incidentId}`;
            const token = sessionStorage.getItem("token");
            console.log("Requesting URL:", url);
            console.log("Using token:", token);

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setIncidentDetails(response.data);
            setUserDetails(response.data.user);
            setActionDetails(response.data.action)
            console.log("Incident details", response.data);
        } catch (error) {
            console.error('Error fetching incident details:', error);
            throw error;
        }
    };
    
    const filterIncidents = async () => {
        var url = config.url + "/MapApi/incident"
        try {
            let response = axios.get(url,{
                headers: {
                    Authorization: `Bearer${sessionStorage.token}`,
                    'Content-Type': 'application/json',
                },
            })
            const incidents = await response.data;
            console.log('innnicin', incidents)
            switch (selectedFilter) {
                case "resolved":
                  return incidents.filter((incident) => incident.etat === "resolved");
                case "taken_into_account":
                  return incidents.filter((incident) => incident.etat === "taken_into_account");
                case "no_action":
                  return incidents.filter((incident) => incident.etat !== "resolved" && incident.etat !== "taken_into_account");
                default:
                  return incidents;
            }
        } catch (error) {
            console.log('erreur de récupération', error)
            throw error;
        }
        
    };
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
    // Selection des Mois
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
    function CustomOption (props) {
        return (
          <components.Option {...props}>
            <FontAwesomeIcon icon={faCalendarPlus} />
            {props.children}
          </components.Option>
        );
    };

    const Loader = () => {
        return (
            <div className="loader">
                <h2>Loading video...</h2>
            </div>
        )
    }
    function RecenterMap({ lat, lon }) {
        const map = useMap();
        useEffect(() => {
          if (lat && lon) {
            map.setView([lat, lon], 13);
          }
        }, [lat, lon, map]);
        return null;
    }
    const avatar = config.url + userDetails.avatar
    return(
        <div className='body'>
            <div style={{backgroundColor:"#f4f7f7"}}>
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
                            <li><Link to="/dashboard" className="link">Vue d'ensemble</Link></li>
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
                    <Col lg={3} sm={9} className="colle">
                        <div>
                            <div>
                                <h3 className="titleCard">Nombre d'incidents <br/> pris en compte</h3>
                                <p className="percentage">{percentageVsTaken}%</p>
                            </div>
                            <div className="percent">
                                <p>{countIncidents}</p>
                                <FontAwesomeIcon icon={faBarChart} className="stat-icon"/>
                            </div>
                        </div>
                    </Col>

                    <Col lg={3} sm={9} className="compte">
                        <div>
                            <div>
                                <h3 className="titleCard">Nombre d'incidents <br/> avec collaboration</h3>
                                <p className="percentage">0%</p>
                            </div>
                            <div className="percent">
                                <p>0%</p>
                                <FontAwesomeIcon icon={faBarChart} className="statistic-icon"/>
                            </div>
                        </div>
                    </Col>

                    <Col lg={3} sm={9} className="resolu">
                        <div>
                            <div>
                                <h3 className="titleCard">Pourcentage <br/> de collaboration</h3>
                                <p className="resolve-percent">0%</p>
                            </div>
                            <div className="percent">
                                <p>0%</p>
                                <FontAwesomeIcon icon={faBarChart} className="statist-icon"/>
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
                            {latitude !== 0 && longitude !== 0 ? (
                                <MapContainer center={position} zoom={13}>
                                    <RecenterMap lat={latitude} lon={longitude} />
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
                                <h5 className='colorCode'>Code Couleur</h5>
                                <div className="codeColor">
                                    <div>
                                        <div className="hr_blue" onClick={() => setSelectedFilter("resolved")}/>
                                        <p>Declaré <br/> résolu</p>
                                    </div>
                                    <div>
                                        <div className="hr_orange" onClick={() => setSelectedFilter("taken_into_account")}/>
                                        <p>Pris en <br/> compte</p>
                                    </div>
                                    <div>
                                        <div className="hr_red" onClick={() => setSelectedFilter("no_action")}/>
                                        <p>Pas d'action</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="dashed-line"></div>
                        <Row className='organisation-info'>
                            <Col lg={3}>
                                <img src={avatar} alt='' className='organi_image'/>{''}
                            </Col>
                            <Col lg={6} className='alerts'>
                                <p style={{lineHeight:'28px'}}>Organisation ayant pris en compte: <span>{userDetails.organisation} </span><br/>
                                    Date de pris en compte: {} 11 <br/>
                                    Contacts: {userDetails.email} / {userDetails.phone}<br/>
                                    {/* En savoir plus sur <span>{}</span> */}
                                </p>
                            </Col>
                                
                        </Row>
                        <div className='ask'>
                            <Link style={{textDecoration:'none', color:"#ffff"}} onClick={handleCollaborationRequest}>Faire une demande de collaboration sur cet incident</Link>
                        </div>
                    </Col>
                    <Col lg={3} sm={9}>
                        <Col>
                            <Col lg={12} sm={9} className="chart-grids">
                                <div className="col_header">
                                    <div style={{marginTop:"-28px", paddingTop:'15px'}}>
                                        <h4 style={{textAlign:"justify"}}>Image de l'incident</h4>
                                        <img src={imgUrl} alt='' style={{height:"300px", width:'442px'}}/>{''}
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
                                            <p>Potentiellement<br/>Dangereux</p>                                            </div>
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