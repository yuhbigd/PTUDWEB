import React, { useEffect, useState } from 'react'
import './cityzenTable.css'
import { useAsyncFn, useMountedState } from 'react-use'

const CitizenTable = () => {
    const [serverErr, setServerErr] = useState(null)
    const [people, setPeople] = useState([])
    const [request, setRequest] = useAsyncFn(async(name, code) => {
        const res = await fetch('http://localhost:3001/residents?detail=1', {
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

    useEffect(() => {
        setRequest()
    }, [])

    console.log(request)
    return (
        <div id='cityzen-table'>

        </div>
    )
}

export default CitizenTable
