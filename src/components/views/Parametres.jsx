import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  FormGroup,
  Form,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button
} from 'react-bootstrap';
import Swal from 'sweetalert2';
import { config } from '../../config';
import { UserCard } from '../UserCard/UserCard.jsx';
import avatar from '../../assets/img/faces/face-0.jpg';

function Parametres() {
  const [user, setUser] = useState({});
  const [inProgress, setProgress] = useState(false);
  const [changePWD, setChangePWD] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  useEffect(() => {
    _getUser();
  }, []);

  const _getUser = async () => {
    const url = config.url + '/MapApi/user_retrieve';

    const configs = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    };

    try {
      const response = await axios.get(url, configs);
      setUser(response.data.data);
    } catch (error) {
      console.log('Erreur:', error);
    }
  };

  const OnUpdateUser = async (e) => {
    e.preventDefault();
    setProgress(true);

    const new_data = {
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      adresse: user.adresse
    };

    const url = config.url + '/MapApi/user/' + user.id + '/';

    try {
      const response = await axios.put(url, new_data);
      sessionStorage.setItem('user', JSON.stringify(response.data));
      setProgress(false);
      Swal.fire(
        'Succès',
        'Utilisateur mis à jour avec succès. Vos modifications seront prises en compte lors de la prochaine connexion',
        'success'
      );
    } catch (error) {
      setProgress(false);
      Swal.fire('Erreur', 'Veuillez réessayer', 'error');
      console.log('Erreur:', error);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setProgress(true);

    if (confirmPwd !== newPassword) {
      Swal.fire('Erreur', 'Les 2 mots de passe doivent être identiques', 'error');
    } else {
      const new_pwd = {
        old_password: oldPassword,
        new_password: newPassword
      };

      const url = config.url + '/MapApi/change_password/';

      axios
        .put(url, new_pwd, {
          headers: { Authorization: `Bearer ${sessionStorage.token}` }
        })
        .then((response) => {
          setProgress(false);
          setChangePWD(false);
          setOldPassword('');
          setNewPassword('');
          setConfirmPwd('');
          Swal.fire('Succès', 'Mot de passe modifié avec succès', 'success');
        })
        .catch((error) => {
          setProgress(false);
          setChangePWD(false);
          setOldPassword('');
          setNewPassword('');
          setConfirmPwd('');
          
          if (error.response) {
            Swal.fire('Erreur', error.response.data.old_password[0] || 'Veuillez réessayer', 'error');
          } else {
            Swal.fire('Erreur', 'Veuillez réessayer', 'error');
            console.log('Erreur:', error.message);
          }
        });
    }
  };

  const handleModalOpen = (e) => {
    e.preventDefault();
    setChangePWD(true);
  };

  return (
    <div className="content">
      <Modal show={changePWD} onHide={() => setChangePWD(false)}>
        <ModalHeader closeButton>Modifier Mot de passe</ModalHeader>
        <Form encType="multipart/form-data">
          <ModalBody className="col-sm-12">
            <div className="row">
              <div className="form-group col-md-8">
                <label>Mot de passe</label>
                <input
                  type="password"
                  name="old_password"
                  className="form-control"
                  placeholder="Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-8">
                <label>Nouveau Mot de passe</label>
                <input
                  type="password"
                  name="new_password"
                  className="form-control"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-8">
                <label>Confirmation Mot de passe</label>
                <input
                  type="password"
                  name="confirm_password"
                  className="form-control"
                  placeholder="Confirm password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            {!inProgress ? (
              <Button className="btn btn-primary" onClick={handleChangePassword}>
                Modifier
              </Button>
            ) : (
              <Button className="btn btn-primary">
                Loading...
                <i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
              </Button>
            )}{" "}
            <Button className="btn btn-danger" onClick={() => setChangePWD(false)}>
              Annuler
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      <Container fluid>
      <Row>
        <Col md={8}>
              <Form>
                <div className="row">
                  <FormGroup className="col-sm-6">
                    <label htmlFor="prenom">Prenom:</label>
                    <input
                      className="form-control"
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={user.first_name}
                      onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                    />
                  </FormGroup>
                  <FormGroup className="col-sm-6">
                    <label htmlFor="long">Nom:</label>
                    <input
                      className="form-control"
                      type="text"
                      id="long"
                      name="last_name"
                      value={user.last_name}
                      onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                    />
                  </FormGroup>
                </div>
                <div className="row">
                  <FormGroup className="col-sm-6">
                    <label>Adresse Email:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                  </FormGroup>
                  <FormGroup className="col-sm-6">
                    <label htmlFor="long">Adresse:</label>
                    <input
                      className="form-control"
                      type="text"
                      id="long"
                      name="adress"
                      value={user.adress}
                      onChange={(e) => setUser({ ...user, adress: e.target.value })}
                    />
                  </FormGroup>
                </div>
                <FormGroup className="col-sm-6">
                  <label htmlFor="long">Telephone:</label>
                  <input
                    className="form-control"
                    type="text"
                    id="long"
                    name="phone"
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  />
                </FormGroup>
                
                {!inProgress ? (
                  
                  <Button
                    bsStyle="info"
                    pullRight
                    fill
                    onClick={OnUpdateUser}
                    type="submit"
                  >
                    Mettre à jour
                  </Button>
                ) : (
                  <Button bsStyle="info" pullRight fill>
                    Loading...
                    <i
                      className="fa fa-spin fa-spinner"
                      aria-hidden="true"
                    ></i>
                  </Button>
                )}

                <div className="clearfix" />
              </Form>
          
          <Button
            className="btn-modal-change-password btn-fill btn btn-warning"
            bsStyle="warning"
            onClick={handleModalOpen}
            pullLeft
            fill
          >
            Modifier votre mot de passe
          </Button>
        </Col>
        <Col md={4}>
          <UserCard
            bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
            avatar={avatar}
            name={user.first_name}
            userName={user.email}
            description={
              <span>
                {user.user_type}
                <br />
                {user.adress}
                <br />
                {user.phone}
              </span>
            }
            
          />
        </Col>
      </Row>
    </Container>
    </div>
  );
}

export default Parametres;
