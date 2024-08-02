import React,{useState, useEffect} from 'react'
import { Grid, Row, Col, Modal, Button } from 'react-bootstrap';
import { MapContainer, TileLayer, useMap, Popup, Marker, Circle } from 'react-leaflet'
import '../../assets/css/global.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCalendarPlus, faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { config } from '../../config';
import { Player } from 'video-react';
import "video-react/dist/video-react.css";
import axios from 'axios';
import ReactDOMServer from 'react-dom/server';
import Select from 'react-select'
import Swal from 'sweetalert2';


function GlobalView (){
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [newEtat, setNewEtat] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [user, setUser] = useState({});
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    

    const handleChangeEtat = () => {
        console.log('Nouvel état sélectionné :', newEtat);
        handleClose();
    };
    const { incidentId } = useParams(); 
    const [incident, setIncident] = useState({});
    const [videoIsLoading, setVideoIsLoading] = useState(false);
    const [predictions, setPredictions] = useState([]);
    console.log('Incident updated:', incident);

   


    const fetchUserData = async () => {
        try {
          const response = await axios.get(`${config.url}/MapApi/user_retrieve/`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.token}`,
            },
          });
          console.log("User information", response.data.data)
          setUser(response.data.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des informations utilisateur :', error.message);
        }
  };


    useEffect(() => {
        fetchUserData();
        const fetchIncident = async () => {
            try {
                const response = await axios.get(`${config.url}/MapApi/incident/${incidentId}`);
                console.log("reponse", response)
                setIncident(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails de l\'incident :', error);
            }
        };

        

        if (incidentId) {
            fetchIncident(); 
        }
    }, [incidentId]);


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


    const handleNavigate = async () => {
        const userId = user.id;
        const pictUrl = incident.photo
        navigate(`/analyze/${incident.id}/${userId}`,{ state: { pictUrl, nearbyPlaces}});

    };

     

    const imgUrl = incident ? config.url + incident.photo : '';
    console.log("photo del'incident", imgUrl)
    const audioUrl = incident ? config.url + incident.audio : '';
    const videoUrl = incident ? config.url + incident.video : '';
    console.log(videoUrl)
    const latitude = incident?.lattitude || 0;
    const longitude = incident?.longitude || 0;
    console.log(latitude)
    console.log(longitude)
    const description = incident ? incident.description: '';
    const position = [latitude,longitude];
    const dataTostring = incident ? incident.created_at :'';
    const dateObject = new Date(dataTostring)
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const date = dateObject.toLocaleDateString();
    const heure = dateObject.toLocaleTimeString();
    const [isChanged, setisChanged]= useState(false)
    const [inProgress, setProgress]= useState(false)
    const [changeState, setState] = useState(false)
    const data =[]
    const [EditIncident, setEditIncident] = useState({
        title: '',
        zone: '',
        description: '',
        lattitude: '',
        longitude: '',
        user_id: '',
        etat: '',
        indicateur_id: '',
        category_ids: [],
    });

    const optionstype = [
        { label: 'En attente', value: 'declared' },
        { label: 'Prendre en compte', value: 'taken_into_account' },
        { label: 'Résolu', value: 'resolved' },
    ];

    const handleSelectChange = (selectedOption) => {
        console.log(selectedOption.value);
        setEditIncident({ ...EditIncident, etat: selectedOption.value });
        console.log(EditIncident);
    };
    
    
    const handleChangeStatus = async (e) => {
        e.preventDefault();
        setState(true);
    
        const action = EditIncident.etat;
        const url = config.url + '/MapApi/hadleIncident/' + incidentId;
        const token = sessionStorage.getItem('token');
    
        if (!token) {
            Swal.fire("Token not found. Please log in.");
            setState(false);
            setisChanged(false);
            return;
        }
    
        try {
            const response = await axios.post(url, { action }, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                }
            });
            console.log(response);
            setState(false);
            setisChanged(false);
            setEditIncident({
                title: '',
                zone: '',
                description: '',
                lattitude: '',
                longitude: '',
                user_id: '',
                etat: '',
                indicateur_id: '',
                category_ids: [],
            });
            Swal.fire('Changement de status effectué avec succès');
        } catch (error) {
            if (error.response && error.response.data.code === 'token_not_valid') {
                try {
                    const refreshToken = localStorage.getItem('refresh_token');
                    const refreshResponse = await axios.post(config.url + '/api/token/refresh/', { refresh: refreshToken });
                    localStorage.setItem('token', refreshResponse.data.access);
                    const retryResponse = await axios.post(url, { action }, {
                        headers: {
                            Authorization: `Bearer ${refreshResponse.data.access}`, 
                        }
                    });
                    console.log(retryResponse);
                    setState(false);
                    setisChanged(false);
                    setEditIncident({
                        title: '',
                        zone: '',
                        description: '',
                        lattitude: '',
                        longitude: '',
                        user_id: '',
                        etat: '',
                        indicateur_id: '',
                        category_ids: [],
                    });
                    Swal.fire('Changement de status effectué avec succès');
                } catch (refreshError) {
                    console.log(refreshError);
                    Swal.fire("Session expired. Please log in again.");
                }
            } else {
                setState(false);
                setisChanged(false);
                if (error.response) {
                    console.log(error.response.status);
                    console.log(error.response.data);
                    Swal.fire("Désolé",
                        "Cet incident est déjà pris en compte."
                    );
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log(error.message);
                }
            }
        }
    };
    
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
    function RecenterMap({ lat, lon }) {
        const map = useMap();
        useEffect(() => {
          if (lat && lon) {
            map.setView([lat, lon], 13);
          }
        }, [lat, lon, map]);
        return null;
    }


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
    }; 
    return(
            <div className='body'>
                <div>
                    <div className="head">
                        <div>
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
                                <li><Link to={`/incident_view/${incident.id}`} className={location.pathname === `/incident_view/${incident.id}` ? "selected-link" : "link"}>Vue incident</Link></li>
                                <li><Link to="/analyze" className="link non-clickable">Analyses Avancées</Link></li>
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
                            <div>
                                <h6>Vidéo</h6>
                                <div  className='videoIncident'>
                                    <Player
                                     fluid={false} 
                                     width={537} 
                                     height={400}
                                     onLoadStart={() => setVideoIsLoading(true)}
                                     onLoadedData={() => setVideoIsLoading(false)}
                                     onError={() => setVideoIsLoading(false)}
                                    //  src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
                                     src={videoUrl} 
                                    >
                                    </Player>
                                    {videoIsLoading ? <Loader /> : null}
                                </div>
                            </div>
                                <div>
                                    <h6>Note Vocal</h6>
                                    <div className='audioIncident'>
                                        <label htmlFor="code" className="map-color fs-18">
                                            {' '}
                                        </label>
                                        <br />
                                        <audio controls src={audioUrl}>
                                            Your browser does not support the
                                            <code>audio</code> element.
                                        </audio>
                                    </div>
                                </div>
                                <div>
                                    <h6>Description</h6>
                                    <div className='descriptionIncident'>
                                        <p>{description}</p>
                                    </div>
                                </div>
                                <div>
                                    <button onClick={handleNavigate} className='boutonAnalyse' style={{border:'none', color:'white'}}>
                                        Analyses Avancées
                                    </button>
                                </div>
                            </div>
                    </div>
                    <div className='charts-view'>
                            <div className="chart-grids" style={{paddingTop:'5px', display:'flex'}}>
                                <div className="col_header">
                                    <h4>Image de l'incident</h4>
                                    <img src={imgUrl} alt="" className='incident-image'/>{' '}
                                    <div style={{display:"flex", justifyContent:"space-between"}}>
                                        <p>Date: {date}</p>
                                        <p >Heure: {heure}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='action-grid' style={{paddingTop:'5px', textAlign:'center'}}>
                                <div className='col_header'>
                                    <h4>Actions</h4>
                                    <div>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            value={
                                                optionstype.filter(
                                                (option) => option.value === EditIncident.etat,
                                                )[0]
                                            }
                                            name="etat"
                                            options={optionstype}
                                            onChange={handleSelectChange}
                                            styles={{
                                                control: (provided, state) => ({
                                                    ...provided,
                                                    border: '1px solid #ccc',
                                                    borderRadius: '15px',
                                                    boxShadow: state.isFocused ? '0 0 0 1px #2684FF' : null,
                                                    margin:'15px'
                                                }),
                                            }}
                                        />
                                        {/* {successMessage && <p>{successMessage}</p>} */}
                                    </div>
                                    <div>
                                        <button className='etat' onClick={handleChangeStatus}>Valider</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        )
}
export default GlobalView;