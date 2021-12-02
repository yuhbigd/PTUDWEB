import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {useAsyncFn} from 'react-use'
import {useMountedState} from 'react-use'
import './createAccount.css'
import moment from 'moment'
import UpdateAccount from './UpdateAccount'
import Loading from './../loading/Loading'

const CreateAccount = () => {
    const [account, setAccount] = useState([])
    const [newAccount, setNewAccount] = useState([
        {userName: ''},
        {name: ''},
        {password: ''},
        {userTimeOut: ''},
        {isTimeout: false},
        {isBanned: false}
    ])

    const [error, setError] = useState(['require 2 number', 'should not be empty', 'should not be empty'])
    const [unit, setUnit] = useState([])
    const [targetUnit, setTargetUnit] = useState(null)
    const user = useSelector(state => state.userRe)
    const [isUpdateAccount, setIsUpdateAccount] = useState(null)
    const [serverErr, setServerErr] = useState(null)
    const isMounted = useMountedState()

    const [request1, setRequest1] = useAsyncFn(async(userName, name, password, timeOut, isBanned) => {
        const res = await fetch('http://localhost:3001/account/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "user":{
                    "userName" : userName,
                    "name": name,
                    "password": password,
                    "userTimeOut": timeOut,
                    "isBanned": isBanned
                }
            }),
            credentials: 'include'
        })
        const result = await res.text()
        return result
    })

    const [request, setRequest] = useAsyncFn(async() => {
        const res = await fetch('http://localhost:3001/account/children', {
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

    const [request2, setRequest2] = useAsyncFn(async(id) => {
        const res = await fetch(`http://localhost:3001/country`, {
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
        if(request.value) {
            if(!JSON.parse(request.value).error){
                setAccount([...JSON.parse(request.value).data])
            }else {
                setServerErr(JSON.parse(request.value).error)
            }
        }
    }, [request.value])

    useEffect(() => {
        if(isMounted) {
            setRequest2()
            setRequest()
        }
    }, [user])

    useEffect(() => {
        if(request2.value) {
            if(!JSON.parse(request2.value).error) {
                setUnit([...JSON.parse(request2.value).data])
            }else {
                setServerErr(JSON.parse(request2.value).error)
            }
        }
    }, [request2.value])

    useEffect(() => {
        if(request1.value) {
            if(JSON.parse(request1.value).error) {                
                setServerErr(JSON.parse(request1.value).error)
            }else {
                var temp 
                if(account.length) {
                    temp = [...account, JSON.parse(request1.value).user]
                }else {
                    temp = [JSON.parse(request1.value).user]
                }
                
                setAccount(temp.sort((a, b) => (a.userName - b.userName)))

                let newState = [...newAccount]
                newState[0].userName = ''
                newState[1].name = ''
                newState[2].password = ''
                newState[3].userTimeOut = ''
                newState[4].isTimeout = false
                newState[5].isBanned = false
                setNewAccount(newState)
                setError(['require 2 number', 'should not be empty', 'should not be empty'])
            }
        }
    }, [request1.value])

    const handleShowUpdate = (id) => {
        setIsUpdateAccount(id)
    }

    const handleUserNameOnchange = (e) => {
        let newState = [...newAccount]
        newState[0].userName = e.target.value
        setNewAccount(newState)
        
        const prId = user.user.userName === 'admin' ? '' : user.user.userName
        const fullId = `${prId}${e.target.value}`
        if(unit.length) {
            const find1 = unit.find((item) => item.id === fullId) 
            if(find1) {
                setTargetUnit(find1)
                setError([null, error[1], error[2]])

            }else{
                setTargetUnit(null)
                setError(['not found', error[1], error[2]])
            }
        }

        if(account.length) {
            const find = account.find((item) => item.userName === fullId)
            if(find) {
                setError(['duplicate username', error[1], error[2]]) 
            }
        }
    }

    const restrictMaxLength = (e) => {
        if (e.target.value.length > e.target.maxLength) {
            e.target.value = e.target.value.slice(0, e.target.maxLength)
        }
    }

    const handleNameOnchange = (e) => {
        let newState = [...newAccount]
        newState[1].name = e.target.value
        setNewAccount(newState)
        if(e.target.value.length) {
            setError([error[0], null, error[2]])
        }else{
            setError([error[0], 'should not be empty', error[2]])
        }
    }

    const handlePasswordOnchange = (e) => {
        let newState = [...newAccount]
        newState[2].password = e.target.value
        setNewAccount(newState)
        if(e.target.value.length) {
            setError([error[0], error[1], null])
        }else{
            setError([error[0], error[1], 'should not be empty'])
        }
    }

    const handleTimeOutOnchange = (e) => {
        let newState = [...newAccount]
        newState[3].userTimeOut = e.target.value
        setNewAccount(newState)
    }

    const showSetTimeOut = (e) => {
        e.preventDefault()
        let newState = [...newAccount]
        newState[4].isTimeout = !newAccount[4].isTimeout
        setNewAccount(newState) 
    }

    const handleSubmitAccount = (e) => {
        e.preventDefault()
        if(isMounted) {
            setRequest1(newAccount[0].userName, newAccount[1].name, newAccount[2].password, newAccount[3].userTimeOut, newAccount[5].isBanned)
        }
    }

    const handleIsBannedOnchange = (e) => {
        let newState = [...newAccount]
        newState[5].isBanned = e.target.checked
        setNewAccount(newState)        
    }

    const handleCloseUpdate = (e) => {
        setIsUpdateAccount(null)
    }

    return (
        <div id='create-account'>
            {request.loading || request1.loading || request2.loading ? <Loading></Loading> :         
                <div>
                    <div>
                        <button>
                            them moi
                        </button>
                    </div> 
                    <div className='form-container'>
                        <form>
                            <div>
                                <span className='input-title'>Tên Tài khoản</span>
                                <div className='input-container'>
                                    <input 
                                        type="number" 
                                        onChange={(e) => handleUserNameOnchange(e)}
                                        onInput={(e) => restrictMaxLength(e)}
                                        maxLength='2'
                                        value={newAccount[0].userName}
                                        />
                                    <div className='error-container'>
                                    <span className='input-ok'>
                                            {targetUnit && !error[0] ? `${targetUnit.id} - ${targetUnit.name}` : null}
                                    </span>
                                    <span className='input-error'>
                                        {
                                            error[0] ? error[0] : null
                                        }
                                    </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span className='input-title'>Tên</span>
                                <div className='input-container'>
                                    <input 
                                        type="text" 
                                        onChange={(e) => handleNameOnchange(e)}
                                        value={newAccount[1].name}
                                    />
                                    <div className='error-container'>
                                        <span className='input-error'>
                                            {
                                                error[1] ? error[1] : null
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                <span className='input-title'>Mật khẩu</span>
                                <div className='input-container'>
                                    <input 
                                        type="password" 
                                        onChange={(e) => handlePasswordOnchange(e)}
                                        value={newAccount[2].password}
                                    />
                                    <div className='error-container'>
                                        <span className='input-error'>
                                            {
                                                error[2] ? error[2] : null
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span className='input-title'>Bị cấm</span>
                                <div className='input-container'>
                                    <input type='checkbox' value={newAccount[5].isBanned} onChange={(e) => handleIsBannedOnchange(e)} ></input>
                                </div>      
                            </div>
                            <div>
                                {!newAccount[4].isTimeout ? 
                                    <button onClick={(e) => showSetTimeOut(e)}>
                                        Thêm hiệu lực
                                    </button> 
                                : 
                                    <button onClick={(e) => showSetTimeOut(e)}>
                                        Bỏ hiệu lực
                                    </button> 
                                }
                                
                            </div>
                            <div  className='time-out-container'>
                                {
                                    newAccount[4].isTimeout ? 
                                    <div>
                                        <span className='input-title'>
                                            Hiệu lực
                                        </span>
                                        <input 
                                            type="date" 
                                            onChange={(e) => handleTimeOutOnchange(e)}
                                            value={newAccount[3].isTimeout}
                                        ></input>
                                    </div>
                                    : null    
                                }
                            </div>
                            <div className='submit-container'>
                                {
                                    !error[0] && !error[1] && !error[2] ?  <button onClick={(e) => handleSubmitAccount(e)} type="submit">Thêm mới</button> : null
                                }
                            </div>
                        </form>
                    </div>
                    <div>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Tên tài khoản</th>
                                    <th>Tên</th>
                                    <th>Cấp</th>
                                    <th>Bị Cấm</th>
                                    <th>Hết hiệu lực</th>
                                    <th></th>
                                </tr>
                            </thead>
                                {account.map((item, index) => {
                                    return(
                                        <tbody key={index}>
                                            <tr>
                                                <td>{item.userName}</td>
                                                <td>{item.name}</td>
                                                <td>{item.tier}</td>
                                                <td>{item.isBanned ? 'Cấm' : ''}</td>
                                                <td>{item.userTimeOut ? moment(item.userTimeOut).utcOffset("+0700").format("HH:mm DD-MM-YYYY") : null}</td>
                                                <td>
                                                    <button onClick={() => handleShowUpdate(index)}>
                                                        cap nhat
                                                    </button>
                                                </td>
                                            </tr>
                                            {isUpdateAccount === index ? 
                                                <tr>
                                                    
                                                    <td colSpan='4'>
                                                        <div>
                                                            <button onClick={(e) => handleCloseUpdate(e)}>
                                                                Dong
                                                            </button>
                                                        </div>
                                                        <UpdateAccount setIsUpdateAccount={setIsUpdateAccount} currentAcc={item} account={account} setAccount={setAccount} setServerErr={setServerErr}></UpdateAccount>
                                                    </td>
                                                </tr>
                                                :null
                                            }
                                        </tbody>    
                                    )
                                })}
                        </table> 
                    </div>
            </div>  
            }
        </div>
    )
}

export default CreateAccount
