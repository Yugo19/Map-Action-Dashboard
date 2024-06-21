import '../../App.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../config';
import Incident from './Incident';

function Chat() {
    let { incidentId, userId } = useParams();
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [chatMessagesHistory, setChatMessagesHistory] = useState([]);
    const [ws, setWs] = useState(null);

    const sendMessage = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            const messageToSend = {
                incident_id: incidentId.toString(),
                session_id: userId.toString(),
                question: message, // The message content you are sending
                answer: "" // Assuming you want to display the question as the message in the chat
            };
            ws.send(JSON.stringify(messageToSend));
            setChatMessages(prevMessages => [...prevMessages, messageToSend]); // Add the message to the chat display
            setMessage(''); // Clear the input after sending
        }
    };

    const getChatHistory = async () => {
        const chatHistory = await axios.get(`${config.url}/MapApi/history/${userId+incidentId}`);
        setChatMessagesHistory(chatHistory.data);
        console.log(chatHistory.data);
        
    }




    useEffect(() => {
        const websocket = new WebSocket('ws://51.159.141.113:8002/ws/chat');

        const connectWebSocket = () => {
            console.log('WebSocket Connected');
            setWs(websocket);
        };

        const closeWebSocket = () => {
            console.log('WebSocket Disconnected');
            setTimeout(() => {
                if ([WebSocket.CLOSED, WebSocket.CLOSING].includes(websocket.readyState)) {
                    console.log('Reconnecting WebSocket...');
                    setWs(new WebSocket('ws://0.0.0.0:8002/ws/chat'));
                }
            }, 3000); // Attempt to reconnect every 3 seconds
        };

        websocket.onopen = connectWebSocket;
        getChatHistory();
        websocket.onmessage = event => {
            const data = JSON.parse(event.data);
            console.log('Received data : ', data)
            setChatMessages(prev => [...prev, data]);
        };
        websocket.onclose = closeWebSocket;
        websocket.onerror = error => {
            console.error('WebSocket Error: ', error);1
        };

        return () => {
            websocket.close();
        };
    }, []);



    return ( < div className = "container" >
        <
        h1 > Map Action Chat < /h1> <
        div className = "chat-container" >
        <
        div className = "chat" > 

        {
            chatMessagesHistory.map((value, index) => {
                    return (
                          <div key={index}>
                <div className="another-message-container">
                    <div className="another-message">
                        <p className="client"><strong>Vous:</strong></p>
                        <p className="message">{value.question}</p>
                    </div>
                </div>
                <div className="my-message-container">
                    <div className="my-message">
                        <p className="client"><strong>MapChat:</strong></p>
                        <p className="message">{value.answer}</p>
                    </div>
                </div>
            </div>
                    );

                
            })
        }

        {
            chatMessages.map((value, index) => {
                if (value.session_id == (userId+incidentId) && value.answer) {
                    return ( <
                        div key = { index }
                        className = "my-message-container" >
                        <
                        div className = "my-message" >
                        <
                        p className = "client" > < strong > MapChat: < /strong></p >
                        <
                        p className = "message" > { value.answer } < /p> < /
                        div > <
                        /div>
                    );

                } else {
                    return ( <
                        div key = { index }
                        className = "another-message-container" >
                        <
                        div className = "another-message" >
                        <
                        p className = "client" > < strong > Vous: < /strong></p >
                        <
                        p className = "message" > { value.question } < /p> < /
                        div > <
                        /div>
                    );
                }

            })
        }



        <
        /div> <
        div className = "input-chat-container" >
            <input className = "input-chat"
            type = "text"
            placeholder = "Chat message ..."
            onChange = {
                (e) => setMessage(e.target.value)
            }
            value = { message } >
            </input> 
            <button className = "submit-chat"
                     onClick = { sendMessage }
                    disabled = {!ws || ws.readyState !== WebSocket.OPEN } >
        Send </button> < /
        div > <
        /div> < /
        div >
    );
}

export default Chat;