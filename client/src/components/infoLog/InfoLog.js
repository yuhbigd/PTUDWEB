import React, { useState } from 'react'

const InfoLog = (props) => {
    const showCityzen = (id) => {
        setAreaId(id)
    }   
    const [areaId, setAreaId] = useState(null)

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
                <span>Dan So</span>
                <span>9999999999</span>
            </div>
            <div>
                <span>Ghi chu</span>
                <span>tuyet voi</span>
            </div>
            <div>
                <button onClick={() => showCityzen(props.data.id)}>xem dan so</button>
            </div>
            <div>
                {areaId === props.data.id ? <div>this is table for dân số</div>: null}
            </div>
        </div>
    )
}

export default InfoLog
