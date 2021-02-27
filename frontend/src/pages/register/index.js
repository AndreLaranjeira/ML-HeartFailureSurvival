// Package imports.
import React, {useState} from "react";
import {IconContext} from "react-icons";
import {FaArrowLeft, FaEnvelope, FaKey, FaUser} from "react-icons/fa";
import {Link, useHistory} from "react-router-dom";

// Module imports.
import api from "../../services/api";
import {celebrateErrorContent} from "../../utils/celebrate";
import {formatCelebrateMessage, isCelebrateError} from "../../utils/celebrate";

// Style imports.
import "./styles.scss";

// Component.
export default function Register() {

  // Variables.
  const defaultRoleId = 2;
  const history = useHistory();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  // Handler functions.
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

      localStorage.setItem("authorization", `Bearer ${response.data.token}`);
      localStorage.setItem("userFullName", response.data.user["FULL_NAME"]);

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

  // JSX returned.
  return(
    <div className="register-container">
      <div className="register-title">
        <h1>Registration page</h1>
      </div>
      <div className="register-form">
        <form onSubmit={handleRegister}>
          <div className="form-input-with-item">
            <FaEnvelope />
            <input
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <span className="form-error">{formErrors.email}</span>
          <div className="form-input-with-item">
            <FaUser />
            <input
              placeholder="Full name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
          </div>
          <span className="form-error">{formErrors.fullName}</span>
          <div className="form-input-with-item">
            <FaKey />
            <input
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
            />
          </div>
          <span className="form-error">{formErrors.password}</span>
          <div className="form-input-with-item">
            <FaKey />
            <input
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              type="password"
            />
          </div>
          <span className="form-error">{formErrors.confirmPassword}</span>
          <button className="success-button" type="submit">
            Complete registration
          </button>
        </form>
      </div>
      <div className="return-to-login">
        <Link className="link" to="/login">
          <button className="info-button">
            <IconContext.Provider value={{ className: "react-icons" }}>
              <FaArrowLeft/> Login page
            </IconContext.Provider>
          </button>
        </Link>
      </div>
    </div>
  );
}
