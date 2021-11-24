import React, { useState, useEffect } from 'react'
import './login.css'
import axios from 'axios'
import { useAsync } from 'react-use'

s
const Login = () => {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const setting = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        data: {
            username: username,
            password: password
        }
    }
    
    const Request = () =>{
        const loginRequest = useAsync(async () => {
            const res = await fetch('https//:localhost:3001/login', setting)
            const result = await res.text()
            return result
        })
        return null
    }
    
    const handleLoginOnclick = (e) => {
        e.preventDefault()
        Request()
    }

    return (
        <div id="login" onSubmit={(e) => handleLoginOnclick(e)}>
            <div className="form-container">
                <form >
                    <div>
                        <span>Đăng nhập</span>
                    </div>
                    <div>
                        <input type="text" placeholder="username" name="username" value={username ? username: ''} onChange={e => setUsername(e.target.value)}></input>
                    </div>
                    <div>
                        <input type="password" placeholder="password" name="password" value={password ? password: ''} onChange={e => setPassword(e.target.value)}></input>
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login
