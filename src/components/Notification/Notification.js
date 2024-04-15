// NotificationsComponent.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from '../../config';

const NotificationsComponent = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`${config.url}/MapApi/notifications/`);
                console.log('reponse notification', response)
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className='container notification'>
            <h6>Notifications</h6>
            <ul>
                {notifications.map(notification => (
                    <li key={notification.id}>
                        {notification.message}
                        {notification.created_at}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationsComponent;
