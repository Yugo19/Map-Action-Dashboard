import React, {useState, useEffect} from "react";
import { config } from "../../config";
import axios from "axios";
import "../../assets/css/global.css"
import Swal from "sweetalert2";
import {
    Button,
    Modal,
    Form,
    FormGroup,
} from "react-bootstrap";
import Select from "react-select";
import {Audio} from "react-loader-spinner";
import MUIDataTable from "mui-datatables";
import {createTheme, ThemeProvider} from "@mui/material/"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function User (){
    const [user, setUser] = useState(false)
    const [data, setData] = useState([])
    const [dataReady, setDataReady] = useState(false)
    const [inProgress, setInProgress] = useState(false)
    const [newUserModal, setNewUserModal] = useState()
    const [editUserModal, setEditUserModal] = useState()
    const [newUser, setNewUser] = useState({
        first_name : "",
        last_name : "",
        email : "",
        phone : "",
        address : "",
        user_type : "",
        password : ""
    })

    const onDeleteUser = (item) => {
        Swal.fire({
          title: "Etes vous sure?",
          text: "La suppression est definitive",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          if (willDelete) {
            var url = `${config.url}/MapApi/user/` + item.id + "/";
            console.log(item);
            axios
              .delete(url, item)
              .then((response) => {
                console.log(response);
    
                Swal.fire("Utilisateur Supprime!", {
                  icon: "success",
                });
                fetchUserData();
              })
              .catch((error) => {
                this.setState({ inProgress: !this.state.inProgress });
                if (error.response) {
                  Swal.fire("Erreur Suppression", "Veuillez reessayer", "error");
                  console.log(error.response.status);
                  console.log(error.response.data);
                } else if (error.request) {
                  console.log(error.request.data);
                  Swal.fire("erreur", "Veuillez reessayer", "error");
                } else {
                  Swal.fire("erreur", "Veuillez reessayer", "error");
                  console.log(error.message);
                }
              });
          } else {
            Swal.fire("Suppression annulee!");
          }
        });
    };

    const options = {
        filter: true,
        filterType: "dropdown",
        responsive: "stacked",
        hasIndex: true
    };

    const columns = [
        {
          name: "first_name",
          label: "Prenom",
          options: {
            filter: true,
            sort: true,
          },
        },
        {
          name: "last_name",
          label: "Nom",
          options: {
            filter: true,
            sort: false,
          },
        },
        {
          name: "email",
          label: "Email",
          options: {
            filter: false,
            sort: false,
          },
        },
        {
          name: "phone",
          label: "Telephone",
          options: {
            filter: false,
            sort: false,
          },
        },
        {
          name: "user_type",
          label: "Type",
          options: {
            filter: true,
            sort: false,
            display: false,
          },
        },
        {
          name: "user_type",
          label: "Type",
          options: {
            filter: false,
            sort: false,
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
    

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${config.url}/MapApi/user/`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.token}`,
          },
        });
        console.log("User information", response.data.results)
        setData(response.data.results);
        setDataReady(true); 
      } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur :', error.message);
      }
    };

    useEffect(() => {
      fetchUserData();
    }, []);
    

    const onUpdateUser = async (e) => {
      e.preventDefault();
      setInProgress(true);
  
      const new_data = {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        user_type: newUser.user_type,
        password: "mapaction2020",
      };
  
      const url = `${global.config.url}/MapApi/user/${newUser.id}/`;
  
      try {
        const response = await axios.put(url, new_data);
        setData((prevData) =>
          prevData.map((user) => (user.id === newUser.id ? response.data : user))
        );
        setInProgress(false);
        setNewUserModal(false);
        setEditUserModal(false);
        setNewUser({
          id: "",
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          address: "",
          user_type: "",
          password: "",
        });
        Swal.fire("Succès", "Utilisateur mis à jour avec succès", "success");
        fetchUserData();
      } catch (error) {
        setInProgress(false);
        handleError(error);
      }
    };
    
    const addUser = (e) => {
        e.preventDefault();
        setInProgress(true);
        const new_data = { ...newUser, password: "mapaction2020" };
        axios.post(`${config.url}/MapApi/user/`, new_data)
          .then((response) => {
            setData([...data, new_data]);
            setInProgress(false);
            setNewUserModal(false);
            setNewUser({
              first_name: "",
              last_name: "",
              email: "",
              phone: "",
              adress: "",
              user_type: "",
              password: "",
            });
            Swal.fire("Succes", "Utilisateur ajoute avec succes", "success");
          })
          .catch((error) => {
            setInProgress(false);
            handleError(error);
          });
      };

    
    const handleError = (error) => {
        if (error.response) {
          Swal.fire("Erreur Ajout", "Veuillez reessayer", "error");
          console.log(error.response.status);
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request.data);
          Swal.fire("erreur", "Veuillez reessayer", "error");
        } else {
          Swal.fire("erreur", "Veuillez reessayer", "error");
          console.log(error.message);
        }
    };

    const handleModalOpen = () => {
        setNewUserModal(!newUserModal);
    };

    const handleEditModal = () => {
        setEditUserModal(!editUserModal);
    };

    const handleSelectChange = (selectedOption) => {
        setNewUser({ ...newUser, user_type: selectedOption.value });
    };

    const renderNewUserModal = () => {
      return (
        <Modal show={newUserModal} onHide={handleModalOpen}>
          <Modal.Header closeButton>Nouveau Utilisateur</Modal.Header>
          <Form>
            <Modal.Body className="col-sm-12">
              <FormGroup className="col-sm-6">
                <label htmlFor="prenom">Prenom:</label>
                <input
                  className="form-control"
                  type="text"
                  id="prenom"
                  name="first_name"
                  value={newUser.first_name}
                  onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                />
              </FormGroup>
              <FormGroup className="col-sm-6">
                <label htmlFor="nom">Nom:</label>
                <input
                  className="form-control"
                  type="text"
                  id="nom"
                  name="last_name"
                  value={newUser.last_name}
                  onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                />
              </FormGroup>
              <FormGroup className="col-sm-6">
                <label htmlFor="email">Email:</label>
                <input
                  className="form-control"
                  type="text"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </FormGroup>
              <FormGroup className="col-sm-6">
                <label htmlFor="phone">Telephone:</label>
                <input
                  className="form-control"
                  type="text"
                  id="phone"
                  name="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                />
              </FormGroup>
              <FormGroup className="col-sm-6">
                <label htmlFor="adress">Adresse:</label>
                <input
                  className="form-control"
                  type="text"
                  id="adress"
                  name="adress"
                  value={newUser.address}
                  onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                />
              </FormGroup>
              <FormGroup className="col-sm-6">
                <label htmlFor="user_type">Type Utilisateur:</label>
                <Select
                  name="user_type"
                  options={[
                    { value: 'admin', label: 'Admin' },
                    { value: 'elu', label: 'Elu' },
                    { value: 'business', label: 'Business' },
                    { value: 'reporter', label: 'Reporter' },
                    { value: 'citizen', label: 'Citizen' },
                    { value: 'visitor', label: 'Visitor' }
                  ]}
                  value={newUser.user_type}
                  onChange={handleSelectChange}
                  classNamePrefix="select"
                />
              </FormGroup>
            </Modal.Body>
            <Modal.Footer>
              {!inProgress ? (
                <Button className="btn btn-primary" onClick={addUser}>
                  Ajouter
                </Button>
              ) : (
                <Button className="btn btn-primary">
                  Loading...
                  <i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
                </Button>
              )}{" "}
              <Button className="btn btn-danger" onClick={handleModalOpen}>
                Annuler
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      );
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };
  
  const renderEditUserModal = () => {
    const optionstype = [
      { value: 'admin', label: 'Admin' },
      { value: 'elu', label: 'Elu' },
      { value: 'business', label: 'Business' },
      { value: 'reporter', label: 'Reporter' },
      { value: 'citizen', label: 'Citizen' },
      { value: 'visitor', label: 'Visitor' }
    ]
      return (
        <Modal show={editUserModal} onHide={handleEditModal}>
          <Modal.Header closeButton>Modification</Modal.Header>
          <Form>
            <Modal.Body className="col-sm-12">
              <FormGroup className="col-sm-6">
                <label htmlFor="prenom">Prenom:</label>
                <input
                  className="form-control"
                  type="text"
                  id="prenom"
                  name="first_name"
                  value={newUser.first_name}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup className="col-sm-6">
                <label htmlFor="nom">Nom:</label>
                <input
                  className="form-control"
                  type="text"
                  id="nom"
                  name="last_name"
                  value={newUser.last_name}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup className="col-sm-6">
                <label htmlFor="email">Email:</label>
                <input
                  className="form-control"
                  type="text"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup className="col-sm-6">
                <label htmlFor="phone">Telephone:</label>
                <input
                  className="form-control"
                  type="text"
                  id="phone"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup className="col-sm-6">
                <label htmlFor="address">Adresse:</label>
                <input
                  className="form-control"
                  type="text"
                  id="address"
                  name="address"
                  value={newUser.address}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup className="col-sm-6">
                <label htmlFor="user_type">Type Utilisateur:</label>
                <Select
                  name="user_type"
                  options={optionstype}
                  className="basic-multi-select map-color mt-4 col-md-6 col-offset-4"
                  onChange={(selectedOption) =>
                    setNewUser((prevUser) => ({ ...prevUser, user_type: selectedOption.value }))
                  }
                  classNamePrefix="select"
                />
              </FormGroup>
            </Modal.Body>
            <Modal.Footer>
              {!inProgress ? (
                <Button className="btn btn-primary" onClick={onUpdateUser}>
                  Modifier
                </Button>
              ) : (
                <Button className="btn btn-primary">
                  Loading...
                  <i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
                </Button>
              )}{" "}
              <Button className="btn btn-danger" onClick={handleEditModal}>
                Annuler
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      );
  };

    const formatType = (type) => {
        if (type === "admin") {
          return <label className="admin-s">{type}</label>;
        } else if (type === "elu") {
          return <label className="elu-s">{type}</label>;
        } else if (type === "business") {
          return <label className="business-s">{type}</label>;
        } else if (type === "reporter") {
          return <label className="reporter-s">{type}</label>;
        } else if (type === "citizen") {
          return <label className="citizen-s">{type}</label>;
        } else {
          return <label className="visitor-s">{type}</label>;
        }
    }

    return(
       <div className="body">
        <h2 style={{marginTop: "5%"}}>La table des utilisateurs</h2>
        <Button className="pull-right map-color" onClick={handleModalOpen}>
            <i className="fa fa-download"></i>
            Nouveau Utilisateur
        </Button>
        <div style={{maxWidth:"163vh"}}>
          {dataReady ? (
            <ThemeProvider theme={getMuiTheme}>
            <MUIDataTable
                title={"Liste des Utilisateurs"}
                data={data.map((item, i) => [
                item.first_name,
                item.last_name,
                item.email,
                item.phone,
                item.user_type,
                formatType(item.user_type),
                <div className="btn-group">
                    <button
                    onClick={() => setEditUserModal(true)}
                    className="btn btn-default btn-xs map-color nb"
                    data-id={item.id}
                    >
                      <FontAwesomeIcon icon={faEdit} color="red" />
                    </button>
                    <Button
                    className="btn btn-danger btn-xs red-color nb"
                    onClick={() => {
                        onDeleteUser(item);
                        setInProgress(false);
                    }}
                    >
                      <FontAwesomeIcon icon={faTrash} color="white" />
                    </Button>
                </div>,
                ])}
                columns={columns}
                options={options}
            />
            </ThemeProvider>
        ) : (
            <Audio
            color="#00BFFF"
            height={100}
            width={100}
            timeout={3000} //3 secs
            />
        )}
        </div>
        
        {newUserModal && renderNewUserModal()}
        {editUserModal && renderEditUserModal()}
       </div>
    );
} export default User

