import React, {useState, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { config } from "../config";
import Swal from "sweetalert2";
import axios from "axios";


const ProfileHeader = ({OnUpdateUser}) => {
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