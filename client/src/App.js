import React from 'react'
import LoginPage from './pages/LoginPage' 
import CitizenListPage from './pages/CityzenListPage'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import AppRouter from './routes/AppRouter'
import NoteFoundPage from './pages/NoteFoundPage'


const App = () => {
    return (
        <Router>
            <div className="overlay"></div>
            <div>
                <Routes>
                    <Route path='/app/*' element={<AppRouter></AppRouter>}></Route>
                    <Route exact path='/login' element={<LoginPage/>}></Route>
                    <Route exact path='/context' element={<CitizenListPage></CitizenListPage>}></Route>
                    <Route path='*' element={<NoteFoundPage></NoteFoundPage>}></Route>
                </Routes>
            </div>
        </Router>
    )
}

export default App
