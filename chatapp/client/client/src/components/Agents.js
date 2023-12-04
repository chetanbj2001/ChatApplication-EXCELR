import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:3001');

const Agents = () => {
  const [agentName, setAgentName] = useState('');
  const [showFeatures, setShowFeatures] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  const handleAgentJoin = () => {
    socket.emit('agent_joined', agentName);
    setShowFeatures(true);
  };

  const handleDisconnect = () => {
    socket.emit('agent_disconnect', agentName);
    setShowFeatures(false);
  };

  const sendMessage = () => {
    const newMessage = { sender: 'you', message: inputValue };
    socket.emit('messge_from_agent', {inputValue}, agentName);
    console.log(`message sent: ${inputValue}`);
    setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputValue(''); // Clear the input after sending the message
  };

  const handleReceive = (data) => {
    console.log(data);
    setChatMessages((prevMessages) => [...prevMessages, { sender: 'Client', message: data.message }]);
    console.log(`received message: ${data.message}`);
  };

  useEffect(() => {
    socket.on('recieve', handleReceive);

    return () => {
      socket.off('recieve', handleReceive);
    };
  }, []);

  return (
    <div>
      <h1> Agents </h1>
      <label>
        agent name :
        <input value={agentName} onChange={(e) => setAgentName(e.target.value)}></input>
      </label>

      <button onClick={handleAgentJoin}>Connect</button>

      {showFeatures && (
        <div>
          <p> connected as agent :</p>
          <label>
            Message Box:
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
          </label>
          <button onClick={sendMessage}>send</button>
          <h1> Chat: </h1>
          <div>
            {chatMessages.map((chat, index) => (
              <p key={index}>
                <strong>{chat.sender}:</strong> {chat.message}
              </p>
            ))}
          </div>
          <button onClick={handleDisconnect}>disconnect</button>
        </div>
      )}
    </div>
  );
};

export default Agents;
