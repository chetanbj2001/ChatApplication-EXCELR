import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navigationbar from "./NavigationBar";

fetch("http://localhost:8080/api/", {
  method: "GET",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));

const AgentLogin = () => {
  const [credentials, setCredentials] = useState({
    agentname: "",
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
        "http://localhost:8080/api/login/agents",
        credentials
      );

      if (response && response.data) {
        // Store agentname in an agent cookie
        document.cookie = `agent=${credentials.agentname}; expires=`;

        console.log(response.data);
        navigate("/agent");
      } else {
        console.error("Invalid response from the server");
        setErrorMessage("Invalid response from the server");
      }
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      setErrorMessage("Invalid agent credentials");
    }
  };

  return (
    <div>
      <div>
      <Navigationbar></Navigationbar>
      </div>

      <div className="container my-5">
        <div className="card p-4" style={{ maxWidth: "400px", margin: "auto" }}>
          <h2 className="text-center mb-4">Agent Login</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="agentname" className="form-label">
                Agentname:
              </label>
              <input
                type="text"
                className="form-control"
                id="agentname"
                name="agentname"
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
};

export default AgentLogin;
