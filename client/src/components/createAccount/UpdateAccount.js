import React, {useState, useEffect} from 'react'
import moment from 'moment'
import { useAsyncFn } from 'react-use'

const UpdateAccount = (props) => {
    const {currentAcc, account, setAccount, setServerErr, setIsUpdateAccount, setSuccessMessage, successRef_} = props
    const [newAccount, setNewAccount] = useState([
        {name: currentAcc.name},
        {password: ''},
        {userTimeOut: (currentAcc.userTimeOut ? moment(currentAcc.userTimeOut).utcOffset("+0700").format("YYYY-MM-DD") : '')},
        {isBanned: currentAcc.isBanned ? currentAcc.isBanned : false}
    ])
    const [error, setError] = useState(['', 'should not be empty'])

    const [request, setRequest] = useAsyncFn(async(id, name, password, timeOut, isBanned) => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/account/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "data":{
                    "name": name,
                    "password": password,
                    "userTimeOut": timeOut,
                    "isBanned": isBanned
                }
            }),
            credentials: 'include'
        })
        const result = await res.text()
        if(JSON.parse(result).error) {
            setServerErr(JSON.parse(result).error)
            return
        }else if(JSON.parse(result)) {
            setSuccessMessage('Tạo thành công 1 tài khoản mới')
            successRef_.current.classList.add('active')
            setTimeout(() => {
                if(successRef_.current) {
                    successRef_.current.classList.remove('active') 
                }
            }, 4000)
        }
        return result
    })

    const handleNameOnchange = (e) => {
        let newState = [...newAccount]
        newState[0].name = e.target.value
        setNewAccount(newState)
        if(e.target.value.length) {
            setError(['', error[1]])
        }else {
            setError(['should not be empty', error[1]])
        }   
    }

    const handlePasswordOnchange = (e) => {
        let newState = [...newAccount]
        newState[1].password = e.target.value
        setNewAccount(newState)
        if(e.target.value.length) {
            setError([error[0], ''])
        }else {
            setError([error[0], 'should not be empty'])
        }       
    }

    const handleTimeOutOnchange = (e) => {
        let newState = [...newAccount]
        newState[2].userTimeOut = e.target.value
        setNewAccount(newState)    
    }

    const handleIsBannedOnchange = (e) => {
        let newState = [...newAccount]
        newState[3].isBanned = e.target.checked
        setNewAccount(newState)    
    }

    const handleSubmitAcc = (e) => {
        e.preventDefault()
        setRequest(currentAcc.userName, newAccount[0].name, newAccount[1].password, newAccount[2].userTimeOut, newAccount[3].isBanned)
    }

    useEffect(() => {
        if(request.value){
            const acc = JSON.parse(request.value).user
            const temp = [acc, ...account.filter((item) => { return item.userName !== currentAcc.userName})]
            setAccount(temp.sort((a, b) => (a.userName - b.userName)))

            setIsUpdateAccount(null)
        }
    }, [request.value])

    return (
       <div className='update-form-container'>
            <form onSubmit={(e) => handleSubmitAcc(e)}>
                <div>
                    <span className='input-title'>
                        Tên
                    </span>
                    <div className='input-container'>
                        <input 
                            type='text' 
                            value={newAccount[0].name ? newAccount[0].name : ''} 
                            onChange={(e) => handleNameOnchange(e)}
                        ></input>
                        <div className='error-container'>
                            {
                                error[0] ? <span className='input-error'>{error[0]}</span> : null
                            }
                        </div>
                    </div>
                </div>
                <div>
                    <span className='input-title'>
                        password
                    </span>
                    <div className='input-container'>
                        <input 
                            type='password' 
                            value={newAccount[1].password ? newAccount[1].password : ''} 
                            onChange={(e) => handlePasswordOnchange(e)}
                        ></input>
                        <div className='error-container'>
                            {
                                error[1] ? <span className='input-error'>{error[1]}</span> : null
                            }
                        </div>
                    </div>
                </div>
                <div>
                    <span className='input-title'>
                        userTimeOut
                    </span>
                    <div className='input-container'>
                        <input 
                            type='date' 
                            value={newAccount[2].userTimeOut ? newAccount[2].userTimeOut : ''}
                            onChange={(e) => handleTimeOutOnchange(e)}
                        ></input>
                        <div className='error-container'>
                        </div>
                    </div>
                </div>
                <div>
                    <span className='input-title'>
                        Bị cấm
                    </span>
                    <div className='input-container'>
                        <input type='checkbox' checked={newAccount[3].isBanned} onChange={(e) => handleIsBannedOnchange(e)}></input>
                        <div className='error-container'>
                            <span className='input-error'></span>
                        </div>
                    </div>
                </div>
                <div className='submit-container'>
                    {
                        newAccount[0].name && newAccount[1].password ?
                            <button className='ok-button' type='submit'>
                                lưu
                            </button>
                        : null
                    }
                </div>
            </form>
        </div>
    )
}

export default UpdateAccount
