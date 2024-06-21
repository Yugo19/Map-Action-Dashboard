import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from '../../config';

const NotificationsComponent = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`${config.url}/MapApi/notifications/`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log('response notification', response);
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const handleAction = async (notificationId, collaborationId, action) => {
        try {
            await axios.post(`${config.url}/MapApi/collaboration/${collaborationId}/${action}/`, {}, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            setNotifications(notifications.filter(n => n.id !== notificationId));
        } catch (err) {
            console.error('Error handling action:', err.response ? err.response.data.error : 'Unknown error');
        }
    };

    return (
        <div className='container notification'>
            <h6>Notifications</h6>
            <ul>
                {notifications.map(notification => (
                    <li key={notification.id}>
                        <p>{notification.message}</p>
                        <p>{notification.created_at}</p>
                        <button onClick={() => handleAction(notification.id, notification.collaboration_id, 'accept')}>Accept</button>
                        <button onClick={() => handleAction(notification.id, notification.collaboration_id, 'reject')}>Reject</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationsComponent;
