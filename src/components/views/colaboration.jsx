import React,{useState, useEffect} from 'react'
import { Grid, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, useMap, Popup, Marker } from 'react-leaflet'
import '../../assets/css/global.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown,faBarChart, faCalendarPlus, faMapMarkerAlt, faEye} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from 'react-router-dom';
import { config } from '../../config';
import ReactDOMServer from 'react-dom/server'
import axios from 'axios';
import Select from 'react-select'

function Colaboration () {
    const navigate = useNavigate()
    const [countIncidents, setCountIncidents] = useState('');
    const [data, setData] = useState([]);
    const [incident, setIncident] = useState([]);
    const [showIncidentModal, setShowIncidentModal] = useState(false);
    const [percentageVsTaken, setPercentageVsTaken] = useState(0)

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

    useEffect(() => {
        _getIncidents();
        _getPercentageVsTaken();
        
    }, [selectedMonth]);
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
        navigate(`/askCollaboration/${id}`, { incident: item }, () => {
          console.log('State updated:', location.state); 
          setIncident(item);
        });
        if (item) {
            console.log('element à afficher ', item)
            setIncident(item);
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
                video: config.url + incident.video,
                audio: config.url + incident.audio
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
              ))}
            </MapContainer>
          )
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
                                <li><Link to="/incident_view" className="link non-clickable">Vue incident</Link></li>
                                <li><Link to="/analyze" className="link non-clickable">Analyses Avancées</Link></li>
                                <li><Link to="/colaboration" className={location.pathname === "/colaboration" ? "selected-link" : "link"}>Collaboration</Link></li>
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
                                {map}
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
                                
                                </Col>
                                </Row>
                                
                                
                            </div>
                        </div>
                </div>
            </div>
        )
}
export default Colaboration;