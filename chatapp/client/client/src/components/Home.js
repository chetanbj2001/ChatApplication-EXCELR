import React from "react";
import Navigationbar from "./NavigationBar";
import  './css/HomeComponent/home.css';



const Home = () => {
  return (
    <div>
    
    <Navigationbar></Navigationbar>
    
    <div className="container mt-5">
      <div className="text-center">
        <h1 className="heading display-4">Welcome to Chat Support</h1>
        <p className="lead">How can we help you?</p>
      </div>
    </div>
    
    </div>
  );
};

export default Home;
