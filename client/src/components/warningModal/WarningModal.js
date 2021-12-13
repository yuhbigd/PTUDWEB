import React, {useEffect, useRef}from 'react'
import './warningModal.css'

const WarningModal = (props) => {
    const overlay = useRef(null)
    const {serverErr, setServerErr} = props
    
    useEffect(() => {
        if(serverErr) {
            overlay.current.classList.add('active')
        }else {
            overlay.current.classList.remove('active')
        }
    }, [serverErr])

    const handleSetServerErr = () => {
        overlay.current.classList.remove('active')
        setTimeout(() => {
            setServerErr(null)
        }, 100)
    }

    return (
        <div id='warning-modal-overlay' ref={overlay}>
            <div className='w-modal-container' ref={overlay}>
                <div>
                    <div>
                        <span className='modal-title'>Cảnh báo</span>
                    </div>
                    <div className='modal-bound'>
                        <div className='w-modal-content'>
                            <span className='warning-content'>
                                {
                                    serverErr ? serverErr : 'something wrong happen!'
                                }
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <span className='verify-button' onClick={(e) => handleSetServerErr(e)}>OK</span>
                </div>
            </div>
        </div>
    )
}

export default WarningModal
