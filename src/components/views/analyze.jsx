import React, {useState, useEffect} from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, Circle, Popup, Marker, useMap } from 'react-leaflet';
import '../../assets/css/global.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCalendarPlus, faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons";
import { Link, useParams, useLocation } from 'react-router-dom';
import { config } from '../../config';
import ReactDOMServer from 'react-dom/server';
import Select from 'react-select';
import axios from 'axios';

function ExpandableContent({ content }) {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <div>
            <p>
                {expanded ? content : content.substring(0, 300)}
                {!expanded && content.length > 100 && (
                    <button onClick={toggleExpanded}>Voir plus</button>
                )}
            </p>
        </div>
    );
}

function Analyze (){
    const { incidentId, userId} = useParams(); 
    const [incident, setIncident] = useState({});
    const [videoIsLoading, setVideoIsLoading] = useState(false);
    const [prediction, setPredictions] = useState([]);
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const predictionId = userId+incidentId;
    const location = useLocation();
    const pictUrl = location.state.pictUrl;
    const nearbyPlacesDic = location.state.nearbyPlaces;


    useEffect(() => {

        const fetchIncident = async () => {
            try {
                const response = await axios.get(`${config.url}/MapApi/incident/${incidentId}`);
                console.log('Incident data', response.data)
                setIncident(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails de l\'incident :', error);
            }
        };
        const fetchPredictions = async () => {
            try {
                const response = await axios.get(`${config.url}/MapApi/prediction/${predictionId}`);
                console.log("les reponses du serveur", response.data)
                setPredictions(response.data[0]);

            } catch (error) {
                console.error('Erreur lors de la récupération des prédictions :', error);
            }
        };
        

        if (incidentId) {
            fetchIncident();
            fetchPredictions(); 
        }

        sendPrediction();
        
    }, [incidentId]);

    const imgUrl = incident ? config.url + incident.photo : '';
    const audioUrl = incident ? config.url + incident.audio : '';
    const videoUrl = incident ? config.url + incident.video : '';
    const latitude = incident ?.lattitude || 0;
    const longitude = incident ?.longitude || 0;
    const description = incident ? incident.description: '';
    const position = [latitude,longitude];
    const dataTostring = incident ? incident.created_at :'';
    const piste_solution = prediction ? prediction.piste_solution: '';
    const context = prediction ? prediction.context: '';
    const impact_potentiel = prediction ? prediction.impact_potentiel: '';
    const type_incident =prediction ? prediction.incident_type: "";
    console.log(impact_potentiel)
    const dateObject = new Date(dataTostring)
    const date = dateObject.toLocaleDateString();
    const heure = dateObject.toLocaleTimeString()
    const iconHTML = ReactDOMServer.renderToString(<FontAwesomeIcon icon={faMapMarkerAlt} color="blue" size="2x"/>)
    const customMarkerIconBlue = new L.DivIcon({
        html: iconHTML,
    });

    useEffect(() => {
        if (incident.lattitude && incident.longitude) {
            const apiUrl = `${config.url}/MapApi/overpass/?latitude=${incident.lattitude}&longitude=${incident.longitude}`;
            
            axios.get(apiUrl)
                .then(response => {
                    console.log(response.data);
                    setNearbyPlaces(response.data); 
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [incident.lattitude, incident.longitude]);
 

    const sendPrediction = async () => {
        try {

        const fastapiUrl = config.url2;

        let sensitiveStructures = [];

        for (let i = 0; i < nearbyPlacesDic.length; i++) {
            if (nearbyPlacesDic[i].amenity == 'school') {
                sensitiveStructures.push('ecole');
            }else if (nearbyPlacesDic[i].amenity == 'clinic') {
                sensitiveStructures.push('Clinique');
            } else if (nearbyPlacesDic[i].amenity == 'river') {
                sensitiveStructures.push('Rivière');
            } else if (nearbyPlacesDic[i].amenity == 'marigot') {
                sensitiveStructures.push('marigot');
            }else{
                sensitiveStructures.push(nearbyPlacesDic[i].amenity);
            }
            
        }

        const payload = {
            image_name: pictUrl,
            sensitive_structures: sensitiveStructures,
            incident_id: incidentId,
            user_id: userId,
            };    

        try {

            console.log("payload", payload);
            const response = await axios.post(fastapiUrl, payload);

        } catch (error) {
            throw new Error('Internal Server Error');
        }

        

    } catch (error) {
        console.error('Error sending prediction:', error);
        
    }
        
    }
    

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
    // Selection des Mois
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
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
    function RecenterMap({ lat, lon }) {
        const map = useMap();
        useEffect(() => {
          if (lat && lon) {
            map.setView([lat, lon], 13);
          }
        }, [lat, lon, map]);
        return null;
    }
        return(
            <div className='body'>
                <div>
                    <div className="head">
                        <div >
                            <h3 className="title">Tableau de Bord</h3>
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
                    </div>
                    
                    <div>
                        <div className="dash">
                            <ul className="dash_ul">
                                <li style={{ textDecoration: 'none'}}>
                                    <Link 
                                        to="/dashboard"
                                        className="link"
                                    >
                                        Vue d'ensemble
                                    </Link>
                                </li>
                                <li><Link to="/incident_view" className="link non-clickable">Vue incident</Link></li>
                                <li><Link to={`/analyze/${incident.id}`} className={location.pathname === `/analyze/${incident.id}` ? "selected-link" : "link"}>Analyses Avancées</Link></li>
                                <li><Link to="/colaboration" className="link">Collaboration</Link></li>
                            </ul>
                        </div>
                    </div>
                    <hr className="dash_line"/>
                </div>
                <div className='static-card'>
                    <div className="map-grid-view">
                        <div className="col_header">
                            <h4>Carte Interactive</h4>
                        </div>
                        <div id="map">
                            {latitude !== 0 && longitude !== 0 ? (
                            <MapContainer center={position} zoom={13} style={{ height: '600px', width: '100%' }}>
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
                        <div style={{marginLeft:'10px'}}>
                            <div style={{marginBottom:'40px'}}>
                                <h6>Contexte & Description</h6>
                                <div className='descriptionIncident'>
                                    <ExpandableContent content={context || ""} />
                                </div>
                            </div>
                            <div style={{marginBottom:'40px'}}>
                                <h6>Impacts Potentiels</h6>
                                <div className='descriptionIncident'>
                                    <ExpandableContent content={impact_potentiel || ""} />
                                </div>
                            </div>
                            <div>
                                <h6>Pistes de solutions envisageables</h6>
                                <div className='descriptionIncident'>
                                    <ExpandableContent content={piste_solution || ""} />
                                    <h6>Lieux à proximité:</h6>
                                    <div>
                                        {nearbyPlaces.map(place => (
                                            <div key={place.id} style={{ marginBottom: '10px' }}>
                                                <p>{place.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className='boutonAnalyse'>
                                <Link to={`/llm_chat/${incident.id}/${userId}`} style={{color:"white", textDecoration:"none"}}>Discussion LLM</Link>
                            </div>
                        </div>
                    </div>
                        <div className='charts-view analyze'>
                            <div className="chart-grids" style={{paddingTop:'5px', display:'flex' }}>
                                <div className="col_header">
                                    <div>
                                        <h4 style={{textAlign:"justify"}}>Image de l'incident</h4>
                                        <img src={imgUrl} alt="" className='incident-image'/>{' '}
                                    </div>
                                    <div style={{display:"flex", justifyContent:"space-between"}}>
                                        <p>Date: {date}</p>
                                        <p>Heure: {heure}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="chart-grid-ia" style={{paddingTop:'3px'}}>
                                <div className="col_header">
                                    <h4>Type d'incident</h4>
                                    <div className='typeIncident'>
                                        <img src='' alt=''/>
                                    </div>
                                    <p>{type_incident || ""}</p>
                                </div>
                                <div className="col_header">
                                    <h4>Gravité d'incident</h4>
                                    <div className='typeIncident'>
                                        <img src='' alt=''/>
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
                                            Nous recommandons toujours une vérification sur le terrain pour confirmer 
                                            les détails de chaque incident.
                                    </p>
                                    <p></p>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        )
    }

export default Analyze;