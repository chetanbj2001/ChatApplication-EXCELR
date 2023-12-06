// Login.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navigationbar from "./NavigationBar";

fetch("http://localhost:8080/api/", {
  method: "GET",
  credentials: "include", // Include credentials in the request
  headers: {
    "Content-Type": "application/json",
    // Add any other headers as needed
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));

function UserLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/login/users",
        credentials
      );

      if (response && response.data) {
        // Store username in a user cookie
        document.cookie = `user=${credentials.username}; expires=`;

        console.log(response.data);
        navigate("/questionari");
      } else {
        console.error("Invalid response from the server");
        setErrorMessage("Invalid response from the server");
      }
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      setErrorMessage("Invalid user credentials");
    }
  };

  return (
    <div>
      <div>
      <Navigationbar></Navigationbar>
      </div>
      <div className="container my-5">
        <div className="card p-4" style={{ maxWidth: "400px", margin: "auto" }}>
          <h2 className="text-center mb-4">User Login</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username:
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <button
                type="button"
                onClick={handleLogin}
                className="btn btn-primary w-100"
              >
                Login
              </button>
            </div>
            {errorMessage && <div className="text-danger">{errorMessage}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
