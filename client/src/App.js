import React from 'react'
import LoginPage from './pages/LoginPage' 
import TablePage from './pages/TablePage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
const App = () => {
    return (
        <Router>
            <div className="overlay"></div>
            <div>
                <Routes>
                    <Route exact path="/login" element={<LoginPage/>}></Route>
                    <Route exact path="/table" element={<TablePage/>}></Route>
                </Routes>
            </div>
        </Router>
    )
}

export default App
