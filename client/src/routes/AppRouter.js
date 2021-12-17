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
import ViewCityzenPage from '../appPages/ViewCityzenPage';
import ThemeFunction from './ThemeFunction';
import NoteFoundPage from '../pages/NoteFoundPage';

const AppRouter = () => {
    const navigate = useNavigate()
    const userPop = useRef(null)
    const [isPopup, setIsPopup] = useState(false)
    const dispatch = useDispatch()
    const isMounted = useMountedState()
    const popupNav = useRef(null)
    const popupThemeRef = useRef(null)
    const [themeNum, setThemeNum] = useState( parseInt(localStorage.getItem('theme')))
    
    const [loginRequest, setLoginRequest] = useAsyncFn(async() => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
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
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/logout`, {
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
            popupThemeRef.current.classList.remove('active')
        }else{
            popupNav.current.classList.add('active')
        }
    }

    const handlePopupTheme = () => {
        if(popupThemeRef.current.classList.contains('active')) {
            popupThemeRef.current.classList.remove('active')
        }else{
            popupThemeRef.current.classList.add('active')
        }
    }

    
    ThemeFunction(themeNum)
    const setTheme = (theme) => {
        popupThemeRef.current.classList.remove('active')
        ThemeFunction(theme)
        setThemeNum(theme)
        localStorage.setItem('theme', theme)
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
                                            Dashboard
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
                                                <span>Logout</span>
                                            </div> 
                                        </li>
                                        <li onClick={() => handlePopupTheme()}>
                                            <div>
                                                <i className='bx bx-palette' ></i>
                                                <span>Theme</span>
                                            </div>
                                        </li>
                                    </ul>
                                    <ul className='theme-popup' ref={popupThemeRef}>
                                        <li onClick={() => {setTheme(1)}}>
                                            <div>
                                                <span>theme-1</span>
                                                {themeNum === 1 ? <i className='bx bx-check'></i> : null}
                                                
                                            </div> 
                                        </li>
                                        <li onClick={() => {setTheme(2)}}>
                                            <div>
                                                <span>theme-2</span>
                                                {themeNum === 2 ? <i className='bx bx-check'></i> : null}
                                            </div>
                                        </li> 
                                        <li onClick={() => {setTheme(3)}}>
                                            <div>
                                                <span>theme-3</span>
                                                {themeNum === 3 ? <i className='bx bx-check'></i> : null}
                                            </div>
                                        </li>
                                        <li onClick={() => {setTheme(4)}}>
                                            <div>
                                                <span>theme-4</span>
                                                {themeNum === 4 ? <i className='bx bx-check'></i> : null}
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
                        <Route path='/view-cityzen' element={<ViewCityzenPage/>}></Route>
                        <Route path='*' element={<NoteFoundPage/>}></Route>
                    </Routes>
                </div>
            </div>     
    )
}

export default AppRouter
