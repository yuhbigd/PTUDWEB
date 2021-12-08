import React, {useEffect, useRef}from 'react'

const ContinueModal = (props) => {
    const overlay = useRef(null)
    const {messagePac, setMessagePac} = props
    useEffect(() => {
        if(messagePac.dataId) {
            overlay.current.classList.add('active')
        }else {
            overlay.current.classList.remove('active')
        }
    }, [messagePac.dataId])

    const handleSetServerErr = () => {
        overlay.current.classList.remove('active')
        setTimeout(() => {
            setMessagePac({
                message: messagePac.message,
                dataId: messagePac.dataId,
                action: true,
                method: messagePac.method
            })
        }, 100)
    }

    const cancelHandle = () => {
        overlay.current.classList.remove('active')
        setTimeout(() => {
            setMessagePac({
                message: null,
                dataId: null,
                action: false
            })
        }, 100)
    }

    return (
        <div id='warning-modal-overlay' ref={overlay}>
            <div className='w-modal-container' ref={overlay}>
                <div>
                    <div>
                        <span className='modal-title'>Warning Log</span>
                    </div>
                    <div className='modal-bound'>
                        <div className='w-modal-content'>
                            <span className='warning-content'>
                                {
                                    messagePac.message ? messagePac.message : 'something wrong happen!'
                                }
                            </span>
                        </div>
                    </div>
                </div>
                <div className='button-modal'>
                    <span className='ok-button' onClick={(e) => handleSetServerErr(e)}>OK</span>
                    <span className='cancel-button' onClick={(e) => cancelHandle(e)}>Cancel</span>
                </div>
            </div>
        </div>
    )
}

export default ContinueModal
