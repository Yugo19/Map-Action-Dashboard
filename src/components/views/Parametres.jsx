import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FormGroup, Form, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { config } from '../../config';
import face from '../../assets/img/faces/face-0.jpg';
import "../../assets/css/profile.css";
import ProfileHeader from "../ProfileHeader.jsx";


function Parametres() {
  const [user, setUser] = useState({});
  const [inProgress, setProgress] = useState(false);
  const [changePWD, setChangePWD] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showChangePwdModal, setShowChangePwdModal] = useState(false);
  useEffect(() => {
    fetchUserData();
  }, []);
  
  const avatar = config.url + user.avatar;
  
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${config.url}/MapApi/user_retrieve/`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.token}`,
        },
      });
      console.log("User information", response.data.data);
      setUser(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur :', error.message);
    }
  };

  const OnUpdateUser = async (e) => {
    e.preventDefault();
    setProgress(true);

    const new_data = {
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      adresse: user.address
    };

    const url = config.url + '/MapApi/user/' + user.id + '/';

    try {
      const response = await axios.put(url, new_data, {
        headers: {
          Authorization: `Bearer ${sessionStorage.token}`,
        },
      });
      console.log("Update response", response.data);
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
          console.log("Password change response", response.data);
          setProgress(false);
          setChangePWD(false);
          setOldPassword('');
          setNewPassword('');
          setConfirmPwd('');
          setShowChangePwdModal(false);
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

  const handleModalOpen = () => {
    setChangePWD(true);
    setShowChangePwdModal(true); 
  };

  const handleModalClose = () => {
    setShowChangePwdModal(false); 
  };
  return (
    <div className="profile">
      <Modal show={showChangePwdModal} onHide={handleModalClose}>
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
              <Button className="btn btn-primary" disabled>
                Chargement...
              </Button>
            )}
            <Button className="btn btn-danger" onClick={handleModalClose}>
              Annuler
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
      <ProfileHeader OnUpdateUser={OnUpdateUser} />
      <div className="user-profile">
        <div className="user-detail">
          <img 
            src={avatar || face} 
            alt='' 
            className='user_logo' 
            onError={(e) => { e.target.onerror = null; e.target.src = face; }}
          />
          <h3 className="email">{user.email}</h3>
          <span className="organisation">{user.first_name}</span>
        </div>
        <div className="user-info">
          <Form>
            <div className="row">
              <FormGroup className='col-sm-6'>
                <label htmlFor='first_name'>Prenom:</label>
                <input 
                  className='form-control'
                  type='text'
                  id='first_name'
                  data-testid='first_name'
                  value={user.first_name || ''}
                  onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                />
              </FormGroup>
              <FormGroup className='col-sm-6'>
                <label htmlFor='last_name'>Nom:</label>
                <input 
                  className='form-control'
                  type='text'
                  id='last_name'
                  data-testid='last_name'
                  value={user.last_name || ''}
                  onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                />
              </FormGroup>
            </div>
            <div className="row">
              <FormGroup className='col-sm-6'>
                <label htmlFor='email'>Email:</label>
                <input 
                  className='form-control'
                  type='text'
                  id='email'
                  data-testid='email'
                  value={user.email || ''}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </FormGroup>
              <FormGroup className='col-sm-6'>
                <label htmlFor='adresse'>Adresse:</label>
                <input 
                  className='form-control'
                  type='text'
                  id='adresse'
                  data-testid='adresse'
                  value={user.address || ''}
                  onChange={(e) => setUser({ ...user, adresse: e.target.value })}
                />
              </FormGroup>
            </div>
            <div className="row">
              <FormGroup className='col-sm-6'>
                <label htmlFor='phone'>Telephone:</label>
                <input 
                  className='form-control'
                  type='text'
                  id='phone'
                  data-testid='phone'
                  value={user.phone || ''}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                />
              </FormGroup>
              <FormGroup className='col-sm-6'>
                <label htmlFor='organisation'>Organisation:</label>
                <input 
                  className='form-control'
                  type='text'
                  id='organisation'
                  data-testid='organisation'
                  value={user.organisation || ''}
                  onChange={(e) => setUser({ ...user, organisation: e.target.value })}
                />
              </FormGroup>
            </div>
            <Button 
              className='btn btn-warning btn-fill pws'
              onClick={handleModalOpen}
            >
              Modifier votre mot de passe
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Parametres;
