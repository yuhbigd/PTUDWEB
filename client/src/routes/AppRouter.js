import React, {useEffect, useState, useRef} from 'react'
import TablePage from '../appPages/TablePage';
import {  BrowserRouter as Router, Link, Route, Routes, useNavigate} from 'react-router-dom'
import CreateUnitPage from './../appPages/CreateUnitPage';
import CreatAccountPage from '../appPages/CreatAccountPage';
import  './appRouter.css'
import {useAsyncFn} from 'react-use'
import {useDispatch} from 'react-redux'
import * as actions from './../actions/index'

const AppRouter = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userPop = useRef(null)
    const [isPopup, setIsPopup] = useState(false)
    const [user, setUser] = useState()
    const [loginRequest, setLoginRequest] = useAsyncFn(async() => {
        const res = await fetch('http://localhost:3001/login', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        const result = await res.text()
        return result
    })

    useEffect(() => {
        setLoginRequest()        
    }, [])

    useEffect(() => {
        const value = loginRequest.value;
        if (value) {
            const user = JSON.parse(value).user;
            if (user) {
                const action = actions.set_user(user);
                dispatch(action);
                setUser(user)
            }
            if(JSON.parse(value).error) {
                navigate('/login')
            }
        }
    }, [loginRequest])

    const handleUserPopup = () => {
        if(!isPopup) {
            userPop.current.classList.add('active')    
        }else{
            userPop.current.classList.remove('active')    
        }
        setIsPopup(!isPopup)

    }

    return (
        <div>
            <div id='top-nav'>
                <div className='top-nav-container'>
                    <div className='app-nav'>
                        <div>
                            <span>
                                <Link to='/app' className='nav-app-item'>
                                        Home  
                                </Link>
                            </span>
                        </div>
                        <div>
                            <span>
                                <Link to='/app/create-unit' className='nav-app-item'>
                                    Đơn vị hành chính
                                </Link>
                            </span>
                        </div>
                        <div>
                            <span>
                                <Link to='/app/create-account' className='nav-app-item'>
                                    Tài khoản
                                </Link>
                            </span>
                        </div>
                    </div>
                    <div className='user-nav'>
                        <div className='user-nav-container'>
                            <div className='user-icon' onClick={(e) => handleUserPopup(e)}>
                                <i class='bx bxs-user-circle'></i>
                            </div>
                            <ul className='user-popup' ref={userPop}>
                                <li>
                                    <span className='popup-title'>USER</span>
                                    <div className='line-break'></div>
                                </li>
                                <li>
                                    <div>
                                        <i class='bx bx-log-out'></i>
                                        <span>logout</span>
                                    </div> 
                                </li>
                                <li>
                                    <div>
                                        <i class='bx bxs-user-account' ></i>
                                        <span>account</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div id='app-router'>
                <div className='main-container'>
                    <Routes>
                        <Route path='/' element={<TablePage></TablePage>}></Route>
                        <Route path='/create-account' element={<CreatAccountPage></CreatAccountPage>}></Route>
                        <Route path='/create-unit' element={<CreateUnitPage></CreateUnitPage>}></Route>
                    </Routes>
                </div>
            </div>
        </div> 
    )
}

export default AppRouter
