import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:3001');

const Clients = () => {
  const [clientName, setClientName] = useState('');
  const [showFeatures, setShowFeatures] = useState(false);
  const [agentToConnect, setAgentToConnect] = useState('');
  const [waitingClients, setWaitingClients] = useState([]);

  // Messaging
  const [inputValue, setInputValue] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  const handleDisconnect = () => {
    socket.emit('client_disconnected', clientName, agentToConnect);
    setShowFeatures(false);
  };

  useEffect(() => {
    socket.on('waiting_clients', (waitingClients) => {
      if (waitingClients.includes(clientName)) {
        setShowFeatures(false);
      }
    });

    socket.on('waiting_roommsg', (grabbedClientName, grabbedAgentName) => {
      console.log('now client ' + grabbedClientName + ' can join  ' + grabbedAgentName);
    });

    // Receive message
    socket.on('recieve', handleReceive);

    return () => {
      socket.off('recieve', handleReceive);
    };
  }, []);

  const handleReceive = (data) => {
    console.log(data);
    const newMessage = { sender: 'Agent', message: data.message };
    setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    console.log(`received message: ${data.message}`);
  };

  const handleJoin = () => {
    console.log('in handle join  array of waiting clients: ' + waitingClients);
    console.log(clientName);
    socket.emit('client_joined', clientName, agentToConnect);
    setShowFeatures(true);
  };

  const sendMessage = () => {
    const newMessage = { sender: 'you', message: inputValue };
    socket.emit('message_from_client', { inputValue }, agentToConnect, clientName);
    console.log(`message sent: ${inputValue}`);
    setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputValue('');
  };

  return (
    <div>
      <label>
        Name:
        <input value={clientName} onChange={(e) => setClientName(e.target.value)}></input>
      </label>

      <label>
        Agent Name:
        <input value={agentToConnect} onChange={(e) => setAgentToConnect(e.target.value)}></input>
      </label>

      <button onClick={handleJoin}>Connect</button>

      {showFeatures && (
        <div>
          <br />
          <br />
          <label>
            Message Box:
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
          </label>
          <button onClick={sendMessage}>Send</button>
          <h1> Chat: </h1>
          <div>
            {chatMessages.map((message, index) => (
              <p key={index}>
                <strong>{message.sender}:</strong> {message.message}
              </p>
            ))}
          </div>
          <button onClick={handleDisconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
};

export default Clients;
