import React, {useState} from 'react'
import CityzenTable from './../cityzenTable/CitizenTable'
import CreateUnit from './../createUnit/CreateUnit'

const Alog = (props) => {
    const [createUnit, setCreateUnit] = useState(null)
    const [close, setClose] = useState(null)

    const showCreateUnit = (id) => {
        console.log(id)
        setCreateUnit(id)
        setClose(null)
    }
    const handleClose = (id) => {
        console.log(id)
        setClose(id)
        setCreateUnit(null)
    }

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
                <button onClick={() => showCreateUnit(props.data.id)}>Tạo đơn vị cho {props.data.name}</button>            
                {
                    createUnit ||createUnit === 0? 
                    <button onClick={() => handleClose(props.data.id)}>Dong</button>
                    :
                    null
                }
            </div>
            <div>
                {
                    createUnit === props.data.id ? <CreateUnit></CreateUnit>: null
                }
            </div>
        </div>
    )
}

export default Alog
