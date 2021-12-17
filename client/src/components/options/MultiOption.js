import React from 'react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector} from 'react-redux'
import * as actions from './../../actions/index'
import './multiOption.css'

const MultiOption = (props) => {
    const {selectedUnit} = props
    const user = useSelector(state => state.userRe)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const handleContextOnclick = () => {
        if(selectedUnit.length > 0) {
            dispatch(actions.set_multi(selectedUnit))
            if(user) {
                if (user.user.tier < 3) {
                    navigate('/A/charts')
                }else{
                    navigate('/B1/charts')
                }
            }
        }
    }

    const handleShowProgress = () => {
        if(selectedUnit.length > 0) {
            dispatch(actions.set_multi(selectedUnit))
            if(user) {
                if (user.user.tier < 3) {
                    navigate('/A/progress')
                }else{
                    navigate('/B1/progress')
                }
            }
        }
    }

    const handleShowCityzen = () => {
        if(selectedUnit.length > 0) {
            dispatch(actions.set_multi(selectedUnit))
            if(user) {
                if (user.user.tier < 3) {
                    navigate('/A/view-cityzen')
                }else{
                    navigate('/B1/view-cityzen')
                }
            }
        }
    }

    return (
        <div id='option-button-container'>
            <div className='option-button' onClick={(e) => {handleShowProgress()}}>
                <i className={selectedUnit.length ? 'bx bx-line-chart-down' : 'bx bx-line-chart-down blur'} ></i>
            </div>
            <div className='option-button' onClick={(e) => handleShowCityzen()}>
                <i className={selectedUnit.length ? 'bx bxs-user-rectangle' : 'bx bxs-user-rectangle blur'}></i>
            </div>
            <div className='option-button' onClick={() => handleContextOnclick()} >
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
