// Package imports.
import React, {useState} from "react";
import {IconContext} from "react-icons";
import {FaBrain, FaHeartbeat, FaLock, FaRegClipboard} from "react-icons/fa";
import {FaRegUser, FaUser, FaWallet} from "react-icons/fa";
import {Link, useHistory} from "react-router-dom";

// Context imports.
import {useAuthContext} from "../../contexts/auth";

// Module imports.
import api from "../../services/api";
import {celebrateErrorContent} from "../../utils/celebrate";
import {formatCelebrateMessage, isCelebrateError} from "../../utils/celebrate";
// import {userLoggedIn} from "../../utils/user";

// Style imports.
import "./styles.scss";

// Component.
export default function Login() {

  // Variables.
  const authContext = useAuthContext();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [password, setPassword] = useState("");

  // Handler functions.
  async function handleLogin(e) {
    e.preventDefault();     // Prevent default page submit behavior.

    const responseCelebrateErrors = {};

    try {
      const response = await api.post("auth/authenticate", {email, password});
      authContext.login(response);

      history.push("/home");
    } catch(err) {
      if(isCelebrateError(err)) {
        const errorContent = celebrateErrorContent(err);
        responseCelebrateErrors[errorContent.key] = formatCelebrateMessage(
          errorContent.message
        );
        setFormErrors(responseCelebrateErrors);
      }
      else if(err.response.data.message != null) {
        setFormErrors({});
        alert(err.response.data.message);
      }
      else {
        setFormErrors({});
        alert("Internal server error! Please contact an administrator.");
      }
    }
  }

  // JSX returned.
  return(
    <div className="login-container">
      <div className="service-info">
        <div className="service-info-title">
          <IconContext.Provider value={{ className: "react-icons" }}>
            <FaHeartbeat/>
          </IconContext.Provider>
          <h1>Heart failure prediction</h1>
        </div>
        <p>
          Heart failure prediction is a prototype created for a graduation
          thesis with the goal of accurately predicting the possibility of heart
          failure by using machine learning and some health measurements from
          the pacient.
        </p>
        <p>
          This is a working prototype intended only for demonstrations, so be
          warned that <b>some of the predictions given may be innaccurate!</b>
        </p>
        <ul>
          <IconContext.Provider value={{ className: "li-icon user-icon" }}>
            <li><FaRegUser/> Easy registration process.</li>
          </IconContext.Provider>
          <IconContext.Provider value={{ className: "li-icon clipboard-icon" }}>
            <li><FaRegClipboard/> Quick results.</li>
          </IconContext.Provider>
          <IconContext.Provider value={{ className: "li-icon brain-icon" }}>
            <li><FaBrain/> Powered by machine learning.</li>
          </IconContext.Provider>
          <IconContext.Provider value={{ className: "li-icon wallet-icon" }}>
            <li><FaWallet/> Completey free of charge!</li>
          </IconContext.Provider>
        </ul>
      </div>
      <div className="login-credentials">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <IconContext.Provider value={{ className: "react-icons" }}>
            <div className="form-input-with-item">
              <FaUser/>
              <input
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <span className="form-error">{formErrors.email}</span>
            <div className="form-input-with-item">
              <FaLock/>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <span className="form-error">{formErrors.password}</span>
            <button className="success-button" type="submit">Login</button>
          </IconContext.Provider>
        </form>
        <div>
          <Link to="/register">
            <button className="success-button" type="button">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
