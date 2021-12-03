import React from 'react'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import * as actions from './../../actions/index'
import './multiOption.css'

const MultiOption = (props) => {
    const {MultiOption, selectedUnit} = props
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleContextOnclick = () => {
        if(selectedUnit.length > 0) {
            console.log(selectedUnit.length)
            dispatch(actions.set_multi(selectedUnit))
            navigate('/B1/charts')
        }
    }

    return (
        <div id='option-button-container'>
            <div onClick={() => handleContextOnclick()} className='option-button'>
                <i className={selectedUnit.length ? 'bx bxs-extension' : 'bx bxs-extension blur'} ></i>
            </div>
            <div className='option-button'>
                <i className={selectedUnit.length ? 'bx bxs-user-rectangle' : 'bx bxs-user-rectangle blur'}></i>
            </div>
            <div className='option-button'>
                <i className={selectedUnit.length ? 'bx bxs-bar-chart-alt-2' : 'bx bxs-bar-chart-alt-2 blur'}></i>
            </div>
            <div className='select-title'>
                <span>
                    {selectedUnit.length ? ' (' + selectedUnit.length + ')' : '()'}
                </span>
            </div>
        </div>
    )
}

export default MultiOption
