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
        const tokenCaptcha = await window.getReCaptchaToken();
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "user": {
                    "userName": user,
                    "password": pass,
                },
                tokenCaptcha, 
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
            if(user.tier < 3) {
                navigate("/A");
            }else if(user.tier === 3) {
                navigate("/B1")
            }else {
                navigate("/B2/manage-cityzen")
            }
        }
    }
  }, [loginRequest]);

  return (
    <div id="login">
        <div className="wall-image">
            <img src="https://photo-cms-sggp.zadn.vn/Uploaded/2021/hgubgt/2021_09_23/nhaquochoi2_xyiw.jpg">

            </img>
        </div>
        <div className="form-container">    
            <form>
                <div className='login-title'>
                    <span>Đăng nhập</span>
                </div>
            <div>
                <input
                    type="text"
                    placeholder="Tài khoản"
                    name="username"
                    value={username ? username : ""}
                    onChange={(e) => setUsername(e.target.value)}
                ></input>
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    name="password"
                    value={password ? password : ""}
                    onChange={(e) => setPassword(e.target.value)}
                ></input>
            </div>
            <div className="login-button">
                <button onClick={(e) => handleLoginOnclick(e)}>Đăng nhập</button>
            </div>
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
