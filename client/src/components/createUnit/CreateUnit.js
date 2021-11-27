import React, { useState, useEffect } from 'react'
import {useAsyncFn} from 'react-use'
import {useMountedState} from 'react-use'
import { useSelector } from 'react-redux'
import './createUnit.css'

const CreateUnit = () => {
    const [unitName, setUnitName] = useState(null)
    const [unitCode, setUnitCode] = useState(null)
    const [unit, setUnit] = useState([])
    const [addUnit, setAddUnit] = useState(false)
    const [updateUnit, setUpdateUnit] = useState(null)
    const user = useSelector(state => state)
    const isMounted = useMountedState()
    const [unitNameUpdate, setUnitNameUpdate] = useState(null)
    const [error, setError] = useState(['should not empty', 'should not empty'])

    const [request1, setRequest1] = useAsyncFn(async(name, code) => {
        const res = await fetch('http://localhost:3001/country/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "data":{
                    "id" : code,
                    "name" : name
                }
            }),
            credentials: 'include'
        })
        const result = await res.text()
        return result
    })

    const [request, setRequest] = useAsyncFn(async() => {
        const res = await fetch('http://localhost:3001/country/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        const result = await res.text()
        return result
    })

    const [request2, setRequest2] = useAsyncFn(async(id, name) => {
        const res = await fetch('http://localhost:3001/country/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        const result = await res.text()
        return result
    })

    const submitForm = (e) => {
        e.preventDefault()
        if(isMounted) {
            setRequest1(unitName, unitCode)
        }
    }

    const handleUpdateName = (id, name) => {
        setRequest2(id, name)
    }

    useEffect(() => {
        if(request.value){
            setUnit([...JSON.parse(request.value).data])
        }
    }, [request])

    useEffect(() => {
        if(isMounted) {
            setRequest()
        }
    },[])

    const handleAddUnit = () => {
        setAddUnit(true)
    }

    const handleShowUpdate = (index) => {
        setUpdateUnit(index)
        setUnitNameUpdate(null)
    }

    const unitCodeOnchange = (e) => {
        setUnitCode(e.target.value)
        setError([error[0], e.target.value.length < 2 ? 'require 2 number' : null])

        unit.map((item, index) => {
            if(item.id === e.target.value){
                setError([error[0], 'code duplicate'])
                return
            }
        })
        // setError([error[0], null])
    }

    const unitNameOnchange = (e) => {
        setUnitName(e.target.value)
        if(e.target.value.length) {
            setError([null, error[1]])
        }else {
            setError(['should not empty', error[1]])
        }
    }

    const restrictMaxLength = (e) => {
        if (e.target.value.length > e.target.maxLength) {
            e.target.value = e.target.value.slice(0, e.target.maxLength)
        }
    }

    

    return (
        <div id='create-unit'>
            <div>
                <button onClick={() => {handleAddUnit()}}>
                    them moi
                </button>
            </div>
            {
                addUnit ?
                    <div className='form-container'>
                        <form onSubmit={(e) => submitForm(e)} className='create'>
                            <div>
                                <span className='input-title'>
                                    Tên đơn vị
                                </span>
                                <div>
                                    <input 
                                        type='text' 
                                        value={unitName ? unitName: ''} 
                                        onChange={(e) => unitNameOnchange(e)}
                                    ></input>
                                    <div className='error-container'>
                                        <span className='error-title'>
                                            {error[0] ? error[0] : null}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span className='input-title'>
                                    Mã đơn vị
                                </span>
                                <div>
                                    <input 
                                        className='code-input' 
                                        type='number'
                                        maxLength = '2' 
                                        value={unitCode ? unitCode: ''} 
                                        onChange={(e) => unitCodeOnchange(e)}
                                        onInput={(e) => restrictMaxLength(e)}
                                    ></input>
                                    <div className='error-container'>
                                        <span className='error-title'>
                                            {error[1] ? error[1] : null}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='submit'>
                                {
                                    !error[0] && !error[1] ? <button type='submit'>lưu kết quả</button> : null
                                }
                            </div>
                        </form>
                    </div> 
                    
                :
                null
            }
            <div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>ma</th>
                            <th>ten</th>
                            <th></th>
                        </tr>
                    </thead>
                        {unit.map((item, index) => {
                            return(
                                <tbody key={index}>
                                    <tr>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>
                                            <button onClick={() => handleShowUpdate(index)}>
                                                cap nhat
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        {index === updateUnit ? 
                                            <td>
                                                <div className='update-title'>
                                                    <span>Cập nhật tên đơn vị</span>
                                                </div>
                                                <div className='update-input-container'>
                                                    <div>
                                                        <span className='input-title'>Tên đơn vị</span>
                                                        <div>
                                                            <input type='text' onChange={(e) => setUnitNameUpdate(e.target.value)}></input>
                                                            <div className='error-container'>
                                                                <span className='error-title'>
                                                                    {!unitNameUpdate ? 'should not be empty' : null}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className='input-title'>Mã đơn vị</span>
                                                        <span className='input-title'>01</span>
                                                    </div>
                                                    <div className='submit'>
                                                        {
                                                            unitNameUpdate? <button onClick={(e) => handleUpdateName(e)} >cập nhật kết quả</button> : null
                                                        }
                                                    </div>
                                                </div>
                                            </td>  
                                            : null
                                        }
                                    </tr>
                                 </tbody>    
                            )
                        })}
                </table> 
            </div>
        </div>
    )
}

export default CreateUnit
