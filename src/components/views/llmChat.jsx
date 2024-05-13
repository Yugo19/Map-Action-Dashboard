import '../../App.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Incident from './Incident';

function Chat(){
    let { incidentId } = useParams();
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [ws, setWs] = useState(null);

    const [clientId, setClientId] = useState(
        Math.floor(new Date().getTime() / 1000)
    );

    const sendMessage = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
        const messageToSend = {
            incident_id: incidentId.toString(),
            session_id: clientId.toString(),
            question: message, // The message content you are sending
            answer: ""  // Assuming you want to display the question as the message in the chat
        };
        ws.send(JSON.stringify(messageToSend));
        setChatMessages(prevMessages => [...prevMessages, messageToSend]); // Add the message to the chat display
        setMessage(''); // Clear the input after sending
    }
    };

    useEffect(() => {
        const websocket = new WebSocket('ws://0.0.0.0:8002/ws/chat');

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
        websocket.onmessage = event => {
            const data = JSON.parse(event.data);
            console.log('Received data : ',data)
            setChatMessages(prev => [...prev, data]);
        };
        websocket.onclose = closeWebSocket;
        websocket.onerror = error => {
            console.error('WebSocket Error: ', error);
        };

        return () => {
            websocket.close();
        };
    }, []);

    

    return (
        <div className="container">
      <h1>Map Action Chat</h1>
     <div className="chat-container">
        <div className="chat">
          {chatMessages.map((value, index) => {
            if (value.session_id == clientId && value.answer) {
              return (
                <div key={index} className="my-message-container">
                <div className="my-message">
                  <p className="client"><strong> MapChat :</strong></p>
                  <p className="message">{value.answer}</p>
                </div>
              </div>
              );
   
            }
            else {
              return (
                <div key={index} className="another-message-container">
                  <div className="another-message">
                    <p className="client"><strong>Vous :</strong></p>
                    <p className="message">{value.question}</p>
                  </div>
                </div>
              );
            }

          })}
          
        </div>
        <div className="input-chat-container">
        <input
            className="input-chat"
            type="text"
            placeholder="Chat message ..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          ></input>
          <button className="submit-chat" onClick={sendMessage} disabled={!ws || ws.readyState !== WebSocket.OPEN}>
            Send
          </button>
        </div>
      </div>
    </div>
    );
}

export default Chat
