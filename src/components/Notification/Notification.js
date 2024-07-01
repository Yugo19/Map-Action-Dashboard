// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { config } from '../../config';
// import { Modal, ModalBody, ModalHeader } from 'react-bootstrap';

// const NotificationsComponent = () => {
//     const [notifications, setNotifications] = useState([]);
//     const [showModal, setShowModal] = useState(false);
//     useEffect(() => {
//         const fetchNotifications = async () => {
//             try {
//                 const response = await axios.get(`${config.url}/MapApi/notifications/`, {
//                     headers: {
//                         Authorization: `Bearer ${sessionStorage.getItem('token')}`,
//                         'Content-Type': 'application/json',
//                     },
//                 });
//                 console.log('response notification', response);
//                 setNotifications(response.data);
//             } catch (error) {
//                 console.error('Error fetching notifications:', error);
//             }
//         };

//         fetchNotifications();
//     }, []);

//     const handleAction = async (notificationId, collaborationId, action) => {
//         try {
//             await axios.post(`${config.url}/MapApi/collaboration/${collaborationId}/${action}/`, {}, {
//                 headers: {
//                     'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
//                     'Content-Type': 'application/json'
//                 }
//             });
//             setNotifications(notifications.filter(n => n.id !== notificationId));
//         } catch (err) {
//             console.error('Error handling action:', err.response ? err.response.data.error : 'Unknown error');
//         }
//     };

//     return (
//         <div >
            
//             <Modal show={showModal} onHide={() => setShowModal(false)}>
//                 <ModalHeader closeButton>
//                     <h6>Notifications</h6>
//                 </ModalHeader>
//                 <ModalBody>
//                 <div>
//                     {notifications.map(notification => (
//                         <div key={notification.id}>
//                             <p>{notification.message}</p>
//                             <p>{notification.created_at}</p>
//                             <button onClick={() => handleAction(notification.id, notification.collaboration_id, 'accept')}>Accept</button>
//                             <button onClick={() => handleAction(notification.id, notification.collaboration_id, 'reject')}>Reject</button>
//                         </div>
//                     ))}
//                 </div>
//                 </ModalBody>
//             </Modal>
           
//         </div>
//     );
// };

// export default NotificationsComponent;

import React from 'react';
import { Modal, ModalBody, ModalHeader, Button } from 'react-bootstrap';

const NotificationsComponent = ({ notifications, onClose }) => {
    const handleAction = async (notificationId, collaborationId, action) => {
        try {
            await axios.post(`${config.url}/MapApi/collaboration/${collaborationId}/${action}/`, {}, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (err) {
            console.error('Error handling action:', err.response ? err.response.data.error : 'Unknown error');
        }
    };

    return (
        <Modal show={true} onHide={onClose}>
            <ModalHeader closeButton>
                <h6>Notifications</h6>
            </ModalHeader>
            <ModalBody>
                <div>
                    {notifications.map(notification => (
                        <div key={notification.id}>
                            <p>{notification.message}</p>
                            <p>{notification.created_at}</p>
                            <Button variant="success" onClick={() => handleAction(notification.id, notification.collaboration_id, 'accept')}>Accept</Button>
                            <Button variant="danger" onClick={() => handleAction(notification.id, notification.collaboration_id, 'reject')}>Reject</Button>
                        </div>
                    ))}
                </div>
            </ModalBody>
        </Modal>
    );
};

export default NotificationsComponent;
