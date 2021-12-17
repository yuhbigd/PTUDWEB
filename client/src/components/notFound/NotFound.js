import React from 'react'
import './notFound.css'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate()
    const handleRedirectLogin = () => {
        navigate('/login')
    }
    const handleTurnBack = () => {
        navigate(-1)
    }

    return (
        <div id='not-found-section'>
            <div className="moon"></div>
            <div className="crater crater1"></div>
            <div className="crater crater2"></div>
            <div className="crater crater3"></div>

            <div className="star star1"></div>
            <div className="star star2"></div>
            <div className="star star3"></div>
            <div className="star star4"></div>
            <div className="star star5"></div>

            <div className="error">
            <div className="title">404</div>
            <div className="subtitle">Hmmm...</div>
            <div className="decription">Không thấy trang tìm kiếm vui lòng quay lại hoặc đăng nhập</div>
            <button className="button button--active" onClick={() => handleRedirectLogin()}>Đăng nhập</button>
            <button className="button" onClick={() => handleTurnBack()}>Trở lại</button>
            </div>

            <div className="astronaut">
            <div className="backpack"></div>
            <div className="body"></div>
            <div className="body__chest"></div>
            <div className="arm-left1"></div>
            <div className="arm-left2"></div>
            <div className="arm-right1"></div>
            <div className="arm-right2"></div>
            <div className="arm-thumb-left"></div>
            <div className="arm-thumb-right"></div>
            <div className="leg-left"></div>
            <div className="leg-right"></div>
            <div className="foot-left"></div>
            <div className="foot-right"></div>
            <div className="wrist-left"></div>
            <div className="wrist-right"></div>
            <div className="cord">
                <canvas id="cord" height="500px" width="500px"></canvas>
            </div>
            <div className="head">
                <canvas id="visor" width="60px" height="60px"></canvas>
                <div className="head-visor-flare1"></div>
                <div className="head-visor-flare2"></div>
            </div>
            </div>
        </div>
    )
}

export default NotFound
