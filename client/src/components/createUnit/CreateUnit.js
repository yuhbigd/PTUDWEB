import React, { useState, useEffect, useRef} from 'react'
import {useAsyncFn} from 'react-use'
import {useMountedState} from 'react-use'
import './createUnit.css'
import WarningModal from '../warningModal/WarningModal'
import Loading from '../loading/Loading'

const CreateUnit = () => {
    const [unitName, setUnitName] = useState(null)
    const [unitCode, setUnitCode] = useState(null)
    const [unit, setUnit] = useState([])
    const [addUnit, setAddUnit] = useState(false)
    const [updateUnit, setUpdateUnit] = useState(null)
    const isMounted = useMountedState()
    const [unitNameUpdate, setUnitNameUpdate] = useState(null)
    const [error, setError] = useState(['should not empty', 'should not empty'])
    const [serverErr, setServerErr] = useState(null)
    const [successLog, setSuccessLog] = useState(null)
    const successRef = useRef(null)

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
        if(JSON.parse(result).error) {
            setServerErr(JSON.parse(result).error)
            return
        }
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
        if(JSON.parse(result).error) {
            setServerErr(JSON.parse(result).error)
            return
        }
        return result
    })

    const [request2, setRequest2] = useAsyncFn(async(id, name) => {
        const res = await fetch(`http://localhost:3001/country/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                "data":{
                    "name" : name
                }
            }),
        })
        const result = await res.text()
        if(JSON.parse(result).error) {
            setServerErr(JSON.parse(result).error)
            return
        }
        return result
    })

    const submitForm = (e) => {
        e.preventDefault()
        if(isMounted()) {
            setRequest1(unitName, unitCode)
            setSuccessLog(null)
        }
    }

    const handleUpdateName = (id, name) => {
        if(isMounted()) {
            setRequest2(id, unitNameUpdate)
            setSuccessLog(null)
        }
    }

    useEffect(() => {
        if(successLog) {
            successRef.current.classList.add('active')
            setTimeout(() => {
                successRef.current.classList.remove('active')
            }, 3000)
        }
    }, [successLog])

    useEffect(() => {
        if(request.value && isMounted()){
            setUnit([...JSON.parse(request.value).data])
        }
    }, [request.value])

    useEffect(() => {
        if(request1.value && isMounted()) {
            setUnitName(null)
            setUnitCode(null)
            setError(['should not empty', 'should not empty'])
            setUnit([...unit, JSON.parse(request1.value).data].sort((a, b) => {
                return a.id - b.id
            }))
            setSuccessLog('Thêm 1 đơn vị mới thành công')
        }        
    }, [request1.value])

    useEffect(() => {
        if(request2.value && isMounted()) {
            const data = JSON.parse(request2.value).data
            const temp = [...unit.filter((item) => {
                return item.id !== data.id
            }), data]
            
            setUnit([...temp].sort((a, b) => {
                return a.id - b.id
            }))
            setUpdateUnit(null)
            setSuccessLog('Cập nhật 1 đơn vị mới thành công')
        }
    }, [request2.value])


    useEffect(() => {
        if(isMounted()) {
            setRequest()
            return(() => {
                setRequest()
            })
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

    const handleCloseUpdate = () => {
        setUpdateUnit(null)        
    }

    return (
        <div id='create-unit'>
            {
                !(request.value && !request.loading) ? <Loading></Loading> : 
                <div>
                    <div className='form-container'>
                        <form onSubmit={(e) => submitForm(e)} className='create'>
                            <div className='form-title'>
                                <span>
                                    Thêm mới đơn vị
                                </span>
                            </div>
                            <div className='input-content'> 
                                <div className='input-wrapper'>
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
                                <div className='input-wrapper'>
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
                            </div>
                            
                            <div className='submit'>
                                {
                                    !error[0] && !error[1] ? <button className='button-add' type='submit'>lưu kết quả</button> : null
                                }
                            </div>
                        </form>
                    </div> 
                    <div className='unit-table-container'>
                        <div className='success-log' ref={successRef}>
                            <span className='success-log-title'>
                                {successLog}
                            </span>
                        </div>
                        <table className="table">
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
                                                    <button className='update-button' onClick={() => handleShowUpdate(index)}>
                                                        <i className='bx bx-pencil'></i>
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr>
                                                {index === updateUnit ? 
                                                    <td colSpan='3' className='unit-update-wrapper'>
                                                         <div className='close-update-button'>
                                                            <button onClick={(e) => handleCloseUpdate(e)}>
                                                                <i className='bx bxs-x-circle'></i>
                                                            </button>
                                                        </div>
                                                        <div>
                                                            {/* <div className='update-title'>
                                                                <span>Cập nhật tên đơn vị</span>
                                                            </div> */}
                                                            <div className='unit-update-content'>
                                                                <div className='update-input-container'>
                                                                    <div>
                                                                        <span className='input-title'>Tên đơn vị</span>
                                                                        <div>
                                                                            <input 
                                                                                type='text' 
                                                                                onChange={(e) => setUnitNameUpdate(e.target.value)}
                                                                            ></input>
                                                                            <div className='error-container'>
                                                                                <span className='error-title'>
                                                                                    {!unitNameUpdate ? 'should not be empty' : null}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <span className='input-title'>Mã đơn vị</span>
                                                                        <span className='input-title'>{item.id}</span>
                                                                    </div>
                                                                    <div className='submit'>
                                                                        {
                                                                            unitNameUpdate? <button className='button-add' onClick={(e) => handleUpdateName(item.id, item.name)} >cập nhật kết quả</button> : null
                                                                        }
                                                                    </div>
                                                                </div>
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
            }
            
            <WarningModal serverErr={serverErr} setServerErr={setServerErr}></WarningModal>
        </div>
    )
}

export default CreateUnit
