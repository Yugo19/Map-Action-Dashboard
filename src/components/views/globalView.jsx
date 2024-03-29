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


function GlobalView (){
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate(`/analyze/${incident.id}`);
    };
    const [showModal, setShowModal] = useState(false);
    const [newEtat, setNewEtat] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleChangeEtat = () => {
        console.log('Nouvel état sélectionné :', newEtat);
        handleClose();
    };
    const { incidentId } = useParams(); 
    const [incident, setIncident] = useState({});
    const [videoIsLoading, setVideoIsLoading] = useState(false);
    console.log('Incident updated:', incident);
    useEffect(() => {
        const fetchIncident = async () => {
            try {
                const response = await axios.get(`http://192.168.1.26/MapApi/incident/${incidentId}`);
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
        var new_data = new FormData();
        new_data.append('etat', EditIncident.etat);
        new_data.append('zone', incident.zone);
        var url = config.url + '/MapApi/incident/' + incidentId;
        try {
            const response = await axios.put(url, new_data);
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
            setSuccessMessage('Changement d\'état effectué avec succès.');
        } catch (error) {
            setProgress(false);
            setState(false);
            setisChanged(false);
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            } else if (error.request) {
                console.log(error.request.data);
            } else {
                console.log(error.message);
            }
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
                        <Col lg={6} sm={9} className="map-grid-view">
                            <div className="col_header">
                                <h4>Carte Interactive</h4>
                            </div>
                            <div id="map"> 
                            {/* && typeof longitude=="number" && typeof latitude=="number"  */}
                                {latitude !== null && longitude !== null && typeof longitude=="number" && typeof latitude=="number"  ? (
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
                                    <h5 style={{marginLeft:"350px", marginBottom:"5px", fontWeight:"500", marginTop:"-35px", fontSize:"18px"}}>Code Couleur</h5>
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
                                        <Player fluid={false} width={537} height={400}>
                                            <source src={videoUrl} />
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
                            </Col>
                            <Col lg={3} sm={9}>
                                <Col>
                                    <Col lg={12} sm={9} className="chart-grid" style={{paddingTop:'5px'}}>
                                        <div className="col_header">
                                            <h4>Image de l'incident</h4>
                                            <img src={imgUrl} alt="" style={{height:"300px"}}/>{' '}
                                            <div style={{display:"flex", justifyContent:"space-between"}}>
                                                <p>Date: {date}</p>
                                                <p >Heure: {heure}</p>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={12} sm={9} className='action-grid' style={{paddingTop:'5px', textAlign:'center'}}>
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
                                                        // Styles de la zone de contrôle (sélection)
                                                        control: (provided, state) => ({
                                                            ...provided,
                                                            border: '1px solid #ccc',
                                                            borderRadius: '15px',
                                                            boxShadow: state.isFocused ? '0 0 0 1px #2684FF' : null,
                                                            margin:'15px'
                                                        }),
                                                    }}
                                                />
                                                {successMessage && <p>{successMessage}</p>}
                                            </div>
                                            <div>
                                                <button className='etat' onClick={handleChangeStatus}>Valider</button>
                                            </div>
                                        </div>
                                    </Col>
                                </Col>
                            </Col>
                            <Modal show={showModal} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Changer l'état de l'incident</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {/* Vous pouvez remplacer ce select avec les différents types d'état disponibles */}
                                    <select value={newEtat} onChange={(e) => setNewEtat(e.target.value)}>
                                        <option value="nouvel_etat_1">Nouvel état 1</option>
                                        <option value="nouvel_etat_2">Nouvel état 2</option>
                                        {/* Ajoutez d'autres options d'état si nécessaire */}
                                    </select>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Annuler
                                    </Button>
                                    <Button variant="primary" onClick={handleChangeEtat}>
                                        Changer l'état
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                    </Row>
                </div>
            </div>
        )
    }
export default GlobalView;