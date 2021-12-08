import React, {useState, useRef, useEffect} from 'react'
import TablePage from '../appPages/TablePage';
import { Link, Route, Routes, useNavigate} from 'react-router-dom'
import CreateUnitPage from './../appPages/CreateUnitPage';
import CreatAccountPage from '../appPages/CreatAccountPage';
import { useDispatch } from 'react-redux';
import {useMountedState, useAsyncFn} from 'react-use'
import * as actions from '../actions/index'
import  './appRouter.css'
import ChartPage from '../appPages/ChartPage';
import ProgressPage from '../appPages/ProgressPage';

// --top-nav-height: 56px;
// --nav-item-gap: 20px;
// --nav-margin-left: 60px;
// --main-theme: blue;
// --sub-theme-1: white;
// --sub-theme-2: white;
// --nav-back-color: black;
// --nav-text-color: rgb(196, 196, 196);
// --nav-mobile-back: white;
// --nav-mobile-text: black;
// --box-shadow-1: 0 0 3px 3px rgba(100, 100, 100, 0.6)
// --disable-color: rgb(200, 200, 200);
// // --active-color: rgb(20, 20, 20);
// --close-button: rgb(30, 30, 30);
//     --close-button-hover: rgb(200, 200, 200);
// --loading-1: #383838;
//     --loading-2: white;
//     --loading-3: #2b2b2b;

const AppRouter = () => {
    const navigate = useNavigate()
    const userPop = useRef(null)
    const [isPopup, setIsPopup] = useState(false)
    const dispatch = useDispatch()
    const isMounted = useMountedState()
    const popupNav = useRef(null)
    document.documentElement.style.setProperty('--text-color-1', '#FEC260');
    document.documentElement.style.setProperty('--text-color-2', '#A12568');
    document.documentElement.style.setProperty('--main-theme', '#2A0944');
    document.documentElement.style.setProperty('--sub-theme-1', '#3B185F');
    document.documentElement.style.setProperty('--sub-theme-2', '#3B185F');
    document.documentElement.style.setProperty('--sub-theme-3', '#F43B86');
    document.documentElement.style.setProperty('--box-shadow-1', '0 0 4px 4px #F43B86');
    document.documentElement.style.setProperty('--disable-color', 'rgb(180, 180, 180)');
    document.documentElement.style.setProperty('--active-color', '#FEC260');
    document.documentElement.style.setProperty('--close-button', 'rgb(200, 200, 200)');
    document.documentElement.style.setProperty('--close-button-hover', 'white');
    document.documentElement.style.setProperty('--explorer-color', 'rgb(169, 169, 255)');
    document.documentElement.style.setProperty('--loading-1', 'rgb(169, 169, 255)');
    document.documentElement.style.setProperty('--loading-2', 'white');
    document.documentElement.style.setProperty('--loading-3', 'rgb(169, 169, 255)');
    document.documentElement.style.setProperty('--input-back', '#FAEDF0');
    document.documentElement.style.setProperty('--input-text', '#292C6D');    
    document.documentElement.style.setProperty('--span-error', '#FF5F7E');    
    
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
                if(user.tier < 3) {                    
                    const action= actions.set_user(user);
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
       loginRequest.loading ? null :
            <div id='main-container'>
                <div id='top-nav'>
                    <div className='top-nav-container'>
                        <div className='app-nav'>
                            <div>
                                <span>
                                    <Link to='/A' className='nav-app-item'>
                                            Home  
                                    </Link>
                                </span>
                            </div>
                            <div>
                                <span>
                                    <Link to='/A/create-unit' className='nav-app-item'>
                                        Đơn vị hành chính
                                    </Link>
                                </span>
                            </div>
                            <div>
                                <span>
                                    <Link to='/A/create-account' className='nav-app-item'>
                                        Tài khoản
                                    </Link>
                                </span>
                            </div>
                        </div>
                        <div className='user-nav'>
                            <div className='user-nav-container'>
                                <div className='user-icon' onClick={(e) => handleUserPopup(e)}>
                                    <i className='bx bxs-user-circle'></i>
                                </div>
                                <div>
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
                </div>
                <div id='top-nav-mobile' ref={popupNav}>
                    <div className='top-nav-mobile-container'>
                        <div className='redirect-button-container'>
                            <div>
                                <span>
                                    <Link to='/A' className='nav-app-item'>
                                        <i className='bx bxs-dashboard' ></i>
                                        Dashboard
                                    </Link>
                                </span>
                            </div>
                            <div>
                                <span>
                                    <Link to='/A/create-unit' className='nav-app-item'>
                                        <i className='bx bxs-city'></i>
                                        Đơn vị
                                    </Link>
                                </span>
                            </div>
                            <div>
                                <span>
                                    <Link to='/A/create-account' className='nav-app-item'>
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
                        <Route path='/charts' element={<ChartPage></ChartPage>}></Route>
                        <Route path='/progress' element={<ProgressPage/>}></Route>
                    </Routes>
                </div>
            </div>     
    )
}

export default AppRouter
