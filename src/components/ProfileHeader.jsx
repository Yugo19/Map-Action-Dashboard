import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const ProfileHeader = () => {
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
    return (
        <div className="profile-header">
            <h2 className="header-title">Profile utilisateur</h2>
            <div className="edit" onClick={OnUpdateUser}>
                <FontAwesomeIcon icon={faEdit} className='icon'/>
            </div>
        </div>
    );
};
export default ProfileHeader