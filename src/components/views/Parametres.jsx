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
// import avatar from '../../assets/img/faces/face-0.jpg';
import "../../assets/css/profile.css"
import ProfileHeader from "../ProfileHeader.jsx"

function Parametres() {
  const [user, setUser] = useState({});
  const [inProgress, setProgress] = useState(false);
  const [changePWD, setChangePWD] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);
  const avatar = config.url + user.avatar
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
    <div className="profile">
      <ProfileHeader />
      <div className="user-profile">
        <div className="user-detail">
          <img src={avatar} alt='' />
          <h3 className="email">{user.email} </h3>
          <span className="organisation">{user.first_name}</span>
        </div>
        <div className="user-info">
          <Form onSubmit={OnUpdateUser}>
            <div className="row">
              <FormGroup className='col-sm-6'>
                <label htmlFor='first_name'>Prenom:</label>
                <input 
                  className='form-control'
                  type='text'
                  id='first_name'
                  data-testid='first_name'
                  value={user.first_name || ''}
                  onChange={(e) => setUser({...user, first_name: e.target.value})}
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
                  onChange={(e) => setUser({...user, last_name: e.target.value})}
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
                  onChange={(e) => setUser({...user, email: e.target.value})}
                />
              </FormGroup>
              <FormGroup className='col-sm-6'>
                <label htmlFor='adresse'>Adresse:</label>
                <input 
                  className='form-control'
                  type='text'
                  id='adresse'
                  data-testid='adresse'
                  value={user.adresse || ''}
                  onChange={(e) => setUser({...user, adresse: e.target.value})}
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
                  onChange={(e) => setUser({...user, phone: e.target.value})}
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
                  onChange={(e) => setUser({...user, organisation: e.target.value})}
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
