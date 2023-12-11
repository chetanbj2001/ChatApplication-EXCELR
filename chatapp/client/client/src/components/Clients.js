import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './css/ClientChat/client.css';
import Cookies from 'js-cookie';
const socket = io('http://localhost:3001');

const Clients = () => {
  const [clientName, setClientName] = useState('');
  const [showFeatures, setShowFeatures] = useState(false);
  const [agentToConnect, setAgentToConnect] = useState('');
  const [waitingClients, setWaitingClients] = useState([]);
  const [inWaitingQueue, setInWaitingQueue] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [joinMsgShow , setJoinMsgShow] = useState(false);
  // Messaging
  const [inputValue, setInputValue] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  const handleDisconnect = () => {
    socket.emit('client_disconnected', clientName, agentToConnect);
    setJoinMsgShow(true);
    setShowFeatures(false);
  };

  const handleJoin = () => {
   
   
   
    console.log(waitingClients)
    console.log(clientName);
    socket.emit('client_joined', clientName, agentToConnect);
    setShowFeatures(true);
  };
  


  useEffect(() => {
    socket.on('waiting_clients', (waitingClients) => {
      if (waitingClients.includes(clientName)) {
        setShowFeatures(false);
        setInWaitingQueue(true);
        setWaitingClients(waitingClients);
      }
      else{
        setInWaitingQueue(false);
      }
    });
    let agentCookie = Cookies.get('agent');
    let setAgentNameFromCookies = agentCookie;
    setAgentToConnect(setAgentNameFromCookies);
    let myCookieValue = Cookies.get('user');
    console.log(myCookieValue+ ' is the cookie value');
    let setclientNamefromCookies = myCookieValue;
    console.log("Waiting clients queue"+ waitingClients.join(', '));
    setClientName(setclientNamefromCookies);
    socket.on('waiting_roommsg', (grabbedClientName, grabbedAgentName) => {
      setJoinMessage('now client ' + grabbedClientName + ' can join  ' + grabbedAgentName);
    });

    // Receive message
    socket.on('recieve', handleReceive);

    return () => {
      socket.off('recieve', handleReceive);
    };
  });

  const handleReceive = (data) => {
    console.log(data);
    const newMessage = { sender: 'Agent', message: data.message };
    setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    console.log(`received message: ${data.message}`);
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

      <h1> How can we help you? </h1>
      <label className='name-label'>
        {clientName}
        
      </label>


      <button className='connect-btn btn btn-dark' onClick={handleJoin}>Connect</button>
      {inWaitingQueue && (
        
            <div>
              <p>You are in the waiting queue. Be calm you will be redirected in few minuits.</p>
              {joinMsgShow && 
              {joinMessage}
              }
             
            </div>
            
          )}
      {showFeatures && (
        <div className='show-features'> 
        <p>Connected to <strong> {agentToConnect}</strong> </p>
          

         <div className='msg-container'>
            Message:&nbsp;&nbsp;&nbsp;
            <input type="text" className='form-control' value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
         
          <button className='send-btn btn btn-dark' onClick={sendMessage}>Send</button>
          </div>
          
          <h1> Chat: </h1>
          <div className="chat-container">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${
                      message.sender === 'you' ? 'agent-message' : 'client-message'
                    }`}
                  >
                    <strong>{message.sender}:</strong> {message.message}
                  </div>
                ))}
              </div>

          <button className='disconnect-btn btn btn-danger' onClick={handleDisconnect}>Disconnect</button>
       </div>
      )}
    </div>
  );
};

export default Clients;
