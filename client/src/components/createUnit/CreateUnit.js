import React, { useState, useEffect } from 'react'
import {useAsyncFn} from 'react-use'
import {useMountedState} from 'react-use'

const CreateUnit = () => {
    const [unitName, setUnitName] = useState(null)
    const [unitCode, setUnitCode] = useState(null)
    const isMounted = useMountedState()
    const [request, setRequest] = useAsyncFn(async(name, code) => {
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

    const submitForm = (e) => {
        e.preventDefault()
        if(isMounted) {
            setRequest(unitName, unitCode)
        }
    }

    useEffect(() => {
        console.log(request)
    }, [request])
    return (
        <div>
            <form onSubmit={(e) => submitForm(e)}>
                <div>
                    <span>
                        Tên đơn vị
                    </span>
                    <input type='text' value={unitName ? unitName: ''} onChange={e => setUnitName(e.target.value)}></input>
                </div>
                <div>
                    <span>
                        Mã đơn vị
                    </span>
                    <input type='text' value={unitCode ? unitCode: ''} onChange={e => setUnitCode(e.target.value)}></input>
                </div>
                <div>
                    <button type='submit'>lưu kết quả</button>
                </div>
            </form>
        </div>
    )
}

export default CreateUnit
