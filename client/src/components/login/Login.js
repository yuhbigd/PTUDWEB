import React, { useState, useEffect } from "react";
import "./login.css";
import { useAsyncFn } from "react-use";
import * as actions from "./../../actions/index";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
   
    const [loginRequest, setLoginRequest] = useAsyncFn(async(user, pass) => {
        const res = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "user": {
                    "userName": user,
                    "password": pass,
                }
            }),
            credentials: 'include'
        })
        const result = await res.text()
        return result
    })

  const handleLoginOnclick = (e) => {
    e.preventDefault();
    setLoginRequest(username, password);
  };

  useEffect(() => {
    const value = loginRequest.value;
    if (value) {
      const user = JSON.parse(value).user;
      if (user) {
        const action = actions.set_user(user);
        dispatch(action);
        navigate("/app");
      }
    }
  }, [loginRequest]);

  return (
    <div id="login">
      <div className="form-container">
        <form>
          <div>
            <span>Đăng nhập</span>
          </div>
          <div>
            <input
              type="text"
              placeholder="username"
              name="username"
              value={username ? username : ""}
              onChange={(e) => setUsername(e.target.value)}
            ></input>
          </div>
          <div>
            <input
              type="password"
              placeholder="password"
              name="password"
              value={password ? password : ""}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <button onClick={(e) => handleLoginOnclick(e)}>Login</button>
          <div className="pop-err">
            <span>
              {loginRequest.value ? (
                <div>{JSON.parse(loginRequest.value).error}</div>
              ) : null}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
