// Package imports.
import React, {useState} from "react";
import {IconContext} from "react-icons";
import {FaArrowLeft} from "react-icons/fa";
import {useHistory} from "react-router-dom";

// Context imports.
import {useAuthContext} from "../../contexts/auth";

// Module imports.
import api from "../../services/api";
import {celebrateErrorContent} from "../../utils/celebrate";
import {formatCelebrateMessage, isCelebrateError} from "../../utils/celebrate";

// Style imports.
import "./styles.scss";

// Component.
export default function Register() {

  // Variables.
  const authContext = useAuthContext();
  const defaultRoleId = 2;
  const history = useHistory();
  const [confirmPassword, setConfirmPassword] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const [formErrors, setFormErrors] = useState({});
  const [fullName, setFullName] = useState(undefined);
  const [password, setPassword] = useState(undefined);

  // Functions.
  async function handleRegister(e) {
    e.preventDefault();     // Prevent default page submit behavior.

    const responseCelebrateErrors = {};

    try {
      const data = {
        email: email,
        password: password,
        confirm_password: confirmPassword,
        full_name: fullName,
        role_id: defaultRoleId
      };

      const response = await api.post("auth/register", data);
      authContext.login(response);

      alert("Registration successfull! Taking you to the home page.");
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

  function returnToLogin() {
    history.push("/login");
  }

  // JSX returned.
  return(
    <div className="register-container">
      <div className="form-title">
        <h1>Registration page</h1>
      </div>
      <div className="register-form">
        <form onSubmit={handleRegister}>
          <div className="form-input-with-title">
            <p className="input-title">Email</p>
            <input
              className="form-input"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <p className="form-error">{formErrors.email}</p>
          </div>
          <div className="form-input-with-title">
            <p className="input-title">Full name</p>
            <input
              className="form-input"
              placeholder="Full name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
            <p className="form-error">{formErrors.fullName}</p>
          </div>
          <div className="form-input-with-title">
            <p className="input-title">Password</p>
            <input
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
            />
            <p className="form-error">{formErrors.password}</p>
          </div>
          <div className="form-input-with-title">
            <p className="input-title">Confirm password</p>
            <input
              className="form-input"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              type="password"
            />
            <p className="form-error">{formErrors.confirmPassword}</p>
          </div>
          <button className="submit-button success-button" type="submit">
            Complete registration
          </button>
        </form>
      </div>
      <div className="cancel-row">
        <button className="submit-button info-button" onClick={returnToLogin}>
          <div className="button-row">
            <IconContext.Provider value={{ className: "left-button-icon" }}>
              <FaArrowLeft/> Login page
            </IconContext.Provider>
          </div>
        </button>
      </div>
    </div>
  );
}
