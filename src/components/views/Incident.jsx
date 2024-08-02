import React,{useState, useEffect} from 'react'
import MUIDataTable from "mui-datatables"
import {createTheme, ThemeProvider} from "@mui/material/"
import {Button} from "react-bootstrap"
import axios from "axios";
import { config } from '../../config';
import {useNavigate} from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faT, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Audio } from 'react-loader-spinner';
function Incident(){
    const navigate = useNavigate()
    const [dataReady, setDataReady] = useState(false);
    const [data, setData] = useState([]);
    const [inProgress, setInProgress] = useState(false)
    const [newIncident, setNewIncident] = useState({
        title: "",
        zone: "",
        description: "",
        photo: "",
        video: "",
        audio: "",
        latitude: "", 
        longitude: "",
        user_id: "",
        indicateur_id: "",
        category_ids: [],
        etat: "",
    });
    const [show, setShow] = useState(false);
    const [error, setError]= useState(false)
    const [message, setMessage] = useState()
    const [categories, setCategories] = useState([])
    const [dateFilter, setDataFilter] = useState(false)
    const [incident, setIncident] = useState([]);

    // Retrieve Incidents
    const _getIncidents = async () => {
        var url = config.url + "/MapApi/incident/";
        try {
          let res = await axios.get(url, {
            headers: {
              Authorization: `Bearer${sessionStorage.token}`,
    
              "Content-Type": "application/json",
            },
          });
          setData(res.data.results);
          setDataReady(true);
        } catch (error) {
            console.log(error.message);
            setError(true);
        }
    };
    useEffect(() => {
        _getIncidents();
        
    }, []);
    
    const deleteIncident = (incidentId) => {
      setInProgress(true);
      var url = config.url + "/MapApi/incident/";
      axios
        .delete(url + incidentId)
        .then((response) => {
          setInProgress(false);
          setShow(false);
          Swal.fire("Succès", "Incident supprimé", "warning");
          _getIncidents();
          console.log(response);
          setNewIncident({
            title: "",
            zone: "",
            description: "",
            photo: "",
            video: "",
            audio: "",
            lattitude: "",
            longitude: "",
            user_id: "",
          });
        })
        .catch((error) => {
          setInProgress(false);
          if (error.response) {
            Swal.fire("Erreur", "Veuillez réessayer", "error");
            console.log(error.response.status);
            console.log(error.response.data);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log(error.message);
          }
        });
  };
    


    // Data Tables
    const options = {
        filter: true,
        filterType: "dropdown",
        responsive: "stacked",
        search: true,
  
        hasIndex: true /* <-- use numbers for rows*/,
        emptyTable: "No data available in table",
    };
    const getMuiTheme = () =>
        createTheme({
            overrides: {
                MuiTypography: {
                h6: {
                    fontSize: "1.5rem",
                },
                },
                MUIDataTableHeadCell: {
                root: {
                    fontSize: "16px",
                    color: "#38A0DB",
                },
                },
                MUIDataTableBodyCell: {
                root: {
                    fontSize: "13px",
                },
                },
                MuiInputLabel: {
                animated: {
                    fontSize: "21px",
                },
                },
                MuiTablePagination: {
                caption: {
                    fontSize: '15px',
                },
                },
                MuiMenuItem: {
                root: {
                    fontSize: "15px",
                },
                },
                MUIDataTableToolbar: {
                iconActive: {
                    color: "#38A0DB",
                },
                },
            },
        });
    const onShowIncident = (id) => {
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
    const formatDate = (date) => {
        var d = new Date(date),
          month = "" + (d.getMonth() + 1),
          day = "" + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;
        return [day, month, year].join("-");
    };
    const donnees = data.map((item, i) => {
        let us = "";
        {
          item.user_id != null
            ? (us = item.user_id.first_name + " " + item.user_id.last_name)
            : (us = "indefini");
        }
        return [
            item.title,
            item.zone,
            item.description,
            us,
            item.category_ids,
            item.etat,
            formatDate(item.created_at),
            <div className="btn-group"> 
                <a
                  onClick={(e) => onShowIncident(item.id)}
                  className="map-color "
                  style={{backgroundColor:"transparent", border:"none"}}
                  data-id={item.id}
                >
                    <FontAwesomeIcon icon={faEye} />
                </a>
                <Button
                  style={{ backgroundColor: "transparent", border: "none" }}
                  onClick={() => {
                    if (item && item.id) {
                      deleteIncident(item.id);
                    } else {
                      console.error("L'ID de l'incident est indéfini ou non valide.");
                    }
                  }}
                > 
                  <FontAwesomeIcon icon={faTrash} color="red" />
                </Button>

            </div>,
        ];
    });
    const getCategoryById = (ids) => {
        let names = [];
    
        if (ids) {
            ids.forEach((cat_id) => {
                for (let index = 0; index < categories.length; index++) {
                    const element = categories[index];
                    if (element.id === cat_id) {
                        names.push(element.name + " ");
                    }
                }
            });
        }
    
        return names;
    }
    
        
        
    const onShowAlert = () => {
        this.setState({ visible: true }, () => {
          window.setTimeout(() => {
            this.setState({ visible: false, message: [] });
          }, 5000);
        });
    };
    const columns = [
        {
          name: "title",
          label: "Titre",
          options: {
            filter: true,
            filterType: "dropdown",
            sort: true,
          },
        },
        {
          name: "zone",
          label: "Zone",
          options: {
            filter: true,
            filterType: "dropdown",
            sort: false,
          },
        },
        {
          name: "description",
          label: "Description",
          options: {
            filter: false,
            sort: false,
          },
        },
        {
          name: "user_id",
          label: "Utilisateur",
          options: {
            filter: false,
            sort: false,
          },
        },
        {
          name: "categories",
          label: "Categorie",
          options: {
            filter: true,
            filterType: "dropdown",
            sort: true,
          },
        },
        {
          name: "status",
          label: "Etat",
          options: {
            filter: true,
            filterType: "custom",
            sort: true,
            customBodyRender: (value, tableMeta, updateValue) =>
              value === "resolved" ? (
                <label className="admin-s"> Résolu</label>
              ) : value === "declared" ? (
                <label className="reporter-s">Pas d'action</label>
              ) : value === "in_progress" ? (
                <label className="business-s">En cours</label>
              ) : value === "taken_into_account" ? (
                <label className="encharge-s">Pris en compte</label>
              ) : null,
            customFilterListOptions: {
              render: (v) => v,
              update: (filterList, filterPos, index) => {
                filterList[index] = [];
                return filterList;
              },
            },
            filterOptions: {
              logic: (etat, filters, row) => {
                if (filters.length && filters.length > 1)
                  return !filters.includes(etat);
                return false;
              },
              display: (filterList, onChange, index, column) => {
                const etatstype = [
                  { label: "Déclaré", value: "declared" },
                  { label: "Pris en compte", value: "taken_into_account" },
                  { label: "En cours de résoluton", value: "in_progress" },
                  { label: "Résolu", value: "resolved" },
                ];
                return (
                  <div className="form-group pos-relative mb-4">
                    <label className="label-state" htmlFor="etat">
                      Etat
                    </label>
                    <select
                      className="form-control select-state"
                      name="etat"
                      id="etat"
                      multiple={false}
                      value={filterList[index] || []}
                      onChange={(event) => {
                        filterList[index] = event.target.value;
                        onChange(filterList[index], index, column);
                      }}
                    >
                      <option value="">All</option>
                      {etatstype.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              },
            },
          },
        },
        {
          name: "created_at",
          label: "Date Creation",
          options: {
            sort: true,
            filter: true,
            filterType: "dropdown",
          },
        },
  
        {
          name: "actions",
          label: "Action",
          options: {
            filter: false,
            sort: false,
            export: false,
          },
        },
    ];
  
    return(
        <div className='body incidentView' >
            <div className='incident-data'>
                { dataReady ?(
                    <ThemeProvider theme={getMuiTheme}>
                        <MUIDataTable
                            title={"Table des incidents"}
                            data={donnees}
                            columns={columns}
                            options={options}
                        />
                    </ThemeProvider>
                ):(
                  <Audio
                  color="#00BFFF"
                  height={100}
                  width={100}
                  timeout={3000} //3 secs
                  />

                )}
                
            </div>
        </div>
    )
}
export default Incident;