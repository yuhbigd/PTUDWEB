import React, { useState } from 'react'
import CityzenTable from './../cityzenTable/CitizenTable'
import './infoLog.css'

const InfoLog = (props) => {
    const {data} = props
    const handleCloseInfo = () => {
        props.setKeyIndex(null)
    }
    const [areaId, setAreaId] = useState(null)
    
    return (
        <div id='unit-info-container'>
            <div>
                <div className='info-item'>
                    <span className='item-title'>Mã:</span>
                    <span>{data.id}</span>
                </div>
                <div className='info-item'>
                    <span className='item-title'>Tên:</span>
                    <span>{data.name}</span>
                </div>
                <div className='info-item'>
                    <span className='item-title'>ĐV Cấp dưới:</span>
                    <span>{data.count? data.count : '0'}</span>
                </div>
                <div className='info-item'>
                    <span className='item-title'>Tổng dân:</span>
                    <span>{data.soDan}</span>
                </div>
            </div>
            <div>
                <div className='info-item'>
                    <span className='item-title'>Số nam:</span>
                    <span>{data.soNam}</span>
                </div>
                <div className='info-item'>
                    <span className='item-title'>Số nữ:</span>
                    <span>{data.soNu}</span>
                </div>
                <div className='info-item'>
                    <span className='item-title'>(0-15):</span>
                    <span>{data.nhoHon15}</span>
                </div>
                <div className='info-item'>
                    <span className='item-title'>(15-64):</span>
                    <span>{data.tu15_64}</span>
                </div>
                <div className='info-item'>
                    <span className='item-title'> {'(>64)'}:</span>
                    <span>{data.hon64}</span>
                </div>
            </div>
            <div className='close-button'>
                <button onClick={() => {handleCloseInfo()}}> 
                    <i className='bx bxs-x-circle'></i>
                </button>
            </div>
            {/* <div>
                <button onClick={() => showCityzen(props.data.id)}>xem dan so</button>
                {
                    areaId ? 
                    <button onClick={() => handleClose(props.data.id)}>Dong</button>
                    :
                    null
                }
            </div> */}
            <div>
                {
                    areaId === props.data.id ? <CityzenTable></CityzenTable>: null
                }
            </div>
        </div>
    )
}

export default InfoLog
