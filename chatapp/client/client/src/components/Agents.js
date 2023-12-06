import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Cookies from 'js-cookie';
import './css/AgentChat/agent.css'

const socket = io('http://localhost:3001');
// const baseUrl = 'http://localhost:8080/api/v1/names';
const Agents = () => {
  const [agentName, setAgentName] = useState('');
  const [showFeatures, setShowFeatures] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [chatMessages, setChatMessages] = useState([]);


  










  

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

    let myCookieValue = Cookies.get('agent');
    console.log(myCookieValue+ ' is the cookie value');
    let setagentNamefromCookies = myCookieValue;
    setAgentName(setagentNamefromCookies);


    socket.on('recieve', handleReceive);

    return () => {
      socket.off('recieve', handleReceive);
    };
  }, [agentName]);

  const handleAgentJoin = () => {
    
    console.log(agentName + 'is agentNmae')
    socket.emit('agent_joined', agentName);
    setShowFeatures(true);
  };




  return (
    <div>
      <h1> Agents </h1>
      <label className='name-label'>
        {agentName}
        
      </label>
      <br/><br/>
      <button className='connect-btn btn btn-dark' onClick={handleAgentJoin}>Connect</button>

      {showFeatures && (
        <div>
          <p className='connected-text'> connected as agent </p>
          <div className='message-div'>
         
              Message Box:&nbsp;&nbsp;
              <input
                type="text"
                className='ipbox form-control'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            
            <button className='btn btn-dark' onClick={sendMessage}>
              Send
            </button>
          </div>
          <h1> Chat: </h1>
          <div className="chat-container">
            {chatMessages.map((chat, index) => (
              <div
                key={index}
                className={`message ${
                  chat.sender === 'you' ? 'agent-message' : 'client-message'
                }`}
              >
                <strong>{chat.sender}:</strong> {chat.message}
              </div>
            ))}
          </div>
          <button  className='disconnect-btn btn btn-danger' onClick={handleDisconnect}>disconnect</button>
        </div>
      )}
    </div>
  );
};

export default Agents;
