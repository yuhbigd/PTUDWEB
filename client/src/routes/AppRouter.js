import React from 'react'
import TablePage from '../appPages/TablePage';
import {  BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom'
import CreateUnitPage from './../appPages/CreateUnitPage';
import CreatAccountPage from '../appPages/CreatAccountPage';
import  './appRouter.css'

const AppRouter = () => {
    console.log('this')
    return (
        <div id='app-router'>
            <div className='nav-bar-container'>
                <div className='nav-bar'>
                    <button>
                        <Link to='/app'>bang</Link>
                    </button>
                    <button>
                        <Link to='/app/create-unit'>Tao don vi hanh chinh</Link>
                    </button>
                    <button>
                        <Link to='/app/create-account'>Tao tai khoan</Link>
                    </button>
                </div>
            </div>
            <div className='main-container'>
                <Routes>
                    <Route path='/' element={<TablePage></TablePage>}></Route>
                    <Route path='/create-account' element={<CreatAccountPage></CreatAccountPage>}></Route>
                    <Route path='/create-unit' element={<CreateUnitPage></CreateUnitPage>}></Route>
                </Routes>
            </div>
        </div>
    )
}

export default AppRouter
