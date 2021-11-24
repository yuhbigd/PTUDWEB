import React from 'react'
import LoginPage from './pages/LoginPage' 
import TablePage from './pages/TablePage'
import AuthRoute from './routes/AuthRoute'
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom'
import { useSelector } from 'react-redux'
const App = () => {
    
    // console.log(Auth.auth)
    return (
        <Router>
            <div className="overlay"></div>
            <div>
                <Routes>
                    {/* <Route path='/' element={<AuthRoute/>}>
                        
                    </Route> */}
                    <Route exact path='/table' element={<TablePage/>}></Route>
                    <Route exact path='/login' element={<LoginPage/>}>
                    </Route>
                </Routes>
            </div>
        </Router>
    )
}

export default App
