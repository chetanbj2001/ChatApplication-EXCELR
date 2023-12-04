const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
   
  },
});




//variables 
let agentName = '';
let clientName = '';

let freeAgent = [];
let waitingClients = [];
let agentsArray = []; //used to check if agent exits or not




// agent client array 
let agentClientArray = [ ];



//connection
io.on('connection', (socket) => {
    


//AGENTS

    //handle agent join

socket.on('agent_joined',(agentNameGrabbed)=>{
    agentName = agentNameGrabbed; //using agentName everywhere here ;
    freeAgent.push(agentName);
    agentsArray.push(agentName);
    socket.join(agentName);
    //cl
    console.log('free agents array : [' + freeAgent+ ']');
    console.log('occupied agents array :  ['+ agentsArray+ ']');

})

socket.on('agent_disconnect' , (agentName)=>{
    agentsArray.splice(agentName,1);  //remove agent from agent array   this also indicates if agent is busy or not
    

    //cl
    console.log('free agents array after disconnection : [' + freeAgent+ ']');
    console.log('occupied agents array after disconnection : [' + agentsArray+']');
});









//CLIENTS

    //handle clients
socket.on('client_joined', (clientNameGrabbed , agentNameGrabbed)=>{
    let clientNameToJoin = clientNameGrabbed;
    let agentToJoin  = agentNameGrabbed;

    if (agentsArray.includes(agentToJoin)){

        if(freeAgent.includes(agentToJoin)) //checking if agent is free 
        
        {
        console.log(`client ${clientNameToJoin} will join the agent ${agentName}`);
        console.log('before splice :'+  freeAgent);
        freeAgent.splice(freeAgent.indexOf(agentToJoin),1);
     
        //array for send specific message to a specific agent 
        let agentClientPair  = {
            agentName: agentToJoin,
            clientName :clientNameToJoin
        }
        agentClientArray.push(agentClientPair);
        agentClientArray.forEach(arr=>{
            console.log( '  [ agentName: ' + arr.agentName  + ' ,  clientName : ' + arr.clientName+ ']'  ) ;
        })
       



        //joining here
        socket.join(agentName);
       
        
        }

        else
        {
            waitingClients.push(clientNameToJoin);
            //waiting clients room
            socket.join('waiting_room');
            
            

            console.log('Waiting clients in waiting room : [' + waitingClients+']');

            //now emiting the connect button to waiting clients:
            socket.emit('waiting_clients' , waitingClients);
        }
    }
    else{
        console.log('No agent found... plaese enter a vlaid agent name');
    }
});





    //handle client disconnection 

    socket.on('client_disconnected' , (clientName , agentName )=>{
    freeAgent.push(agentName);
    let canJoinClient = waitingClients[0]; //assigining a vriable to whom to send can join message
    console.log('can join client : '+ canJoinClient);
    
    //messaging to waiting clients 
    socket.to('waiting_room').emit('waiting_roommsg', canJoinClient, agentName);

    //shifting array so that client can connect
    waitingClients.shift();
    })






// MESSAGING

socket.on('message_from_client', (data , grabbedAgentToConnect , grabbedClient)=>{
        let targetAgent = agentClientArray.find(array=>{return array.agentName == grabbedAgentToConnect});
        targetAgentFromArray = targetAgent.agentName;
        const message = data.inputValue;
        socket.to(targetAgentFromArray).emit('recieve', {message}); 
        console.log('message from client  '+grabbedClient + ':  {' + message + '} to room '+ targetAgentFromArray );
})

socket.on('messge_from_agent', (data, grabbedAgentName)=>{
    const message = data.inputValue;
    console.log('agent :'+ grabbedAgentName + ' send message :' +data.inputValue);
    
    socket.to(grabbedAgentName).emit('recieve',{message});
})












    


});


























//port no..
server.listen(3001, () => {
    console.log('Server is running on port 3001');
  });
  