import React, {useState, useRef, useEffect} from 'react'
import TablePage from '../appPages/TablePage';
import { Link, Route, Routes, useNavigate} from 'react-router-dom'
import CreateUnitPage from './../appPages/CreateUnitPage';
import CreatAccountPage from '../appPages/CreatAccountPage';
import CreateCityZenPage from '../appPages/CreateCityZenPage';
import * as actions from './../actions/index'
import  './appRouter.css'
import {useDispatch} from 'react-redux'
import {useAsyncFn, useMountedState} from 'react-use'
import ChartPage from '../appPages/ChartPage';
import ManageCityzenPage from '../appPages/ManageCityzenPage';

const B1Router = () => {
    const navigate = useNavigate()
    const userPop = useRef(null)
    const [isPopup, setIsPopup] = useState(false)
    const dispatch = useDispatch()
    const isMounted = useMountedState()
    const popupNav = useRef(null)

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

    const [logOutRequest, setLogOutRequest] = useAsyncFn(async() => {
        const res = await fetch('http://localhost:3001/logout', {
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
        if(isMounted()) {
            setLoginRequest()        
        }
    }, [])

    useEffect(() => {
        const value = loginRequest.value;
        if (value) {
            const user = JSON.parse(value).user;
            if(JSON.parse(value).error) {
                navigate('/login')
            }if(user) {
                if(user.tier === 3) {                    
                    const action = actions.set_user(user);
                    dispatch(action);
                }else {
                    if(isMounted()) {
                        setLogOutRequest()
                    }
                }
            }
        }
    }, [loginRequest.value])

    const handleUserPopup = () => {
        if(!isPopup) {
            userPop.current.classList.add('active')    
        }else{
            userPop.current.classList.remove('active')    
        }
        setIsPopup(!isPopup)
    }

    useEffect(() => {
        if(logOutRequest.value) {
            window.location.reload();
        } 
    }, [logOutRequest.value])
    
    const handleLogOut = (e) => {
        if(isMounted()) {
            setLogOutRequest()
        }
    }

    const handlePopupNav = () => {
        if(popupNav.current.classList.contains('active')) {
            popupNav.current.classList.remove('active')
        }else{
            popupNav.current.classList.add('active')
        }
    }

    return (
        <div id='main-container'>
            <div id='top-nav'>
                <div className='top-nav-container'>
                    <div className='app-nav'>
                        <div>
                            <span>
                                <Link to='/B1/' className='nav-app-item'>
                                        Home  
                                </Link>
                            </span>
                        </div>
                        <div>
                            <span>
                                <Link to='/B1/create-unit' className='nav-app-item'>
                                    Đơn vị hành chính
                                </Link>
                            </span>
                        </div>
                        <div>
                            <span>
                                <Link to='/B1/create-account' className='nav-app-item'>
                                    Tài khoản
                                </Link>
                            </span>
                        </div>
                        <div>
                            <span>
                                <Link to='/B1/create-cityzen-info' className='nav-app-item'>
                                    Người dân
                                </Link>
                            </span>
                        </div>
                    </div>
                    <div className='user-nav'>
                        <div className='user-nav-container'>
                            <div className='user-icon' onClick={(e) => handleUserPopup(e)}>
                                <i className='bx bxs-user-circle'></i>
                            </div>
                            <ul className='user-popup' ref={userPop}>
                                <li>
                                    <span className='popup-title'>USER</span>
                                    <div className='line-break'></div>
                                </li>
                                <li onClick={(e) => {handleLogOut(e)}}>
                                    <div>
                                        <i className='bx bx-log-out'></i>
                                        <span>logout</span>
                                    </div> 
                                </li>
                                <li>
                                    <div>
                                        <i className='bx bxs-user-account' ></i>
                                        <span>account</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div id='top-nav-mobile' ref={popupNav}>
                    <div className='top-nav-mobile-container'>
                        <div className='redirect-button-container'>
                            <div>
                                <span>
                                    <Link to='/B1' className='nav-app-item'>
                                        <i className='bx bxs-dashboard' ></i>
                                        Dashboard
                                    </Link>
                                </span>
                            </div>
                            <div>
                                <span>
                                    <Link to='/B1/create-unit' className='nav-app-item'>
                                        <i className='bx bxs-city'></i>
                                        Đơn vị
                                    </Link>
                                </span>
                            </div>
                            <div>
                                <span>
                                    <Link to='/B1/create-account' className='nav-app-item'>
                                        <i className='bx bxs-user-account' ></i>   
                                        Tài khoản
                                    </Link>
                                </span>
                            </div>
                            <div>
                                <div  className='nav-app-item' onClick={() => {handleLogOut()}}>
                                    <i className='bx bx-log-out'></i>
                                    <span>
                                        Đăng xuất
                                    </span>
                                 </div>
                            </div>
                            <div>
                                <div  className='nav-app-item'>
                                    <i className='bx bx-key' ></i>
                                    <span>
                                        Cá nhân
                                    </span>
                                </div>
                            </div>
                            <div>
                                <span>
                                    <Link to='/B1/create-cityzen-info' className='nav-app-item'>
                                        <i className='bx bx-male'></i>
                                        Người dân
                                    </Link>
                                </span>
                            </div>
                        </div>
                        <div className='nav-popup-button'  onClick={(e) => handlePopupNav(e)}>
                            <i className='bx bx-chevron-down'></i>
                        </div>
                    </div>
                </div>
            <div id='app-router'>
                <Routes>
                    <Route path='/' element={<TablePage></TablePage>}></Route>
                    <Route path='/create-account' element={<CreatAccountPage></CreatAccountPage>}></Route>
                    <Route path='/create-unit' element={<CreateUnitPage></CreateUnitPage>}></Route>
                    <Route path='/create-cityzen-info' element={<CreateCityZenPage></CreateCityZenPage>}></Route>
                    <Route path='/charts' element={<ChartPage></ChartPage>}></Route>
                    <Route path='/manage-cityzen' element={<ManageCityzenPage></ManageCityzenPage>}></Route>
                </Routes>
            </div>
        </div>
    )
}

export default B1Router
