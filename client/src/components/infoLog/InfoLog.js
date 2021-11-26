import React, { useState } from 'react'
import CityzenTable from './../cityzenTable/CitizenTable'

const InfoLog = (props) => {
    const showCityzen = (id) => {
        setAreaId(id)
        setClose(null)
    }   
    const handleClose = (id) => {
        setClose(id)
        setAreaId(null)
    }

    const handleCloseInfo = () => {
        props.setKeyIndex(null)
    }

    const [areaId, setAreaId] = useState(null)
    const [close, setClose] = useState(null)
    
    return (
        <div>
            <div>
                <span>Ma</span>
                <span>{props.data.id}</span>
            </div>
            <div>
                <span>Ten</span>
                <span>{props.data.name}</span>
            </div>
            <div>
                <span>Tong</span>
                <span>{props.data.count}</span>
            </div>
            <div>
                <span>Ghi chu</span>
                <span>tuyet voi</span>
            </div>
            <div>
                <button onClick={() => {handleCloseInfo()}}> 
                    dong
                </button>
            </div>
            <div>
                <button onClick={() => showCityzen(props.data.id)}>xem dan so</button>
                {
                    areaId ? 
                    <button onClick={() => handleClose(props.data.id)}>Dong</button>
                    :
                    null
                }
            </div>
            <div>
                {
                    areaId === props.data.id ? <CityzenTable></CityzenTable>: null
                }
            </div>
        </div>
    )
}

export default InfoLog
