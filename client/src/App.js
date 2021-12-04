import React from 'react'
import LoginPage from './pages/LoginPage' 
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import AppRouter from './routes/AppRouter'
import B1Router from './routes/B1Router'
import NoteFoundPage from './pages/NoteFoundPage'
import B2Router from './routes/B2Router'

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path='/A/*' element={<AppRouter></AppRouter>}></Route>
                    <Route path='/B1/*' element={<B1Router></B1Router>}></Route>
                    <Route path='/B2*' element={<B2Router></B2Router>}></Route>
                    <Route exact path='/login' element={<LoginPage/>}></Route>
                    <Route path='*' element={<NoteFoundPage></NoteFoundPage>}></Route>
                </Routes>
            </div>
        </Router>
    )
}

export default App
