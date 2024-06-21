import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../../config';

function Historique() {
    const [actions, setActions] = useState([]);

    const getUserActions = async () => {
        const url = `${config.url}/MapApi/user_action/`;
    
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            });
    
            const uniqueActions = Array.from(new Set(response.data.map(action => action.id)))
                                      .map(id => response.data.find(action => action.id === id));
    
            console.log("user actions historique", uniqueActions);
            setActions(uniqueActions);
        } catch (error) {
            console.error('Error fetching user actions:', error);
            throw error;
        }
    };
    

    useEffect(() => {
        getUserActions();
    }, []);

    return (
        <div className='body'>
            <h2>Actions</h2>
            <div>
                {actions.map(action => (
                    <p key={action.id}>{action.action}</p>
                ))}
            </div>
        </div>
    );
}

export default Historique;
