import React from 'react'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import * as actions from './../../actions/index'

const MultiOption = (props) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleContextOnclick = () => {
        dispatch(actions.set_multi(props.selectedUnit))
        navigate('/context')
    }

    return (
        <div>
            <button onClick={() => handleContextOnclick()}>
                Xem tinh Trang
                {props.selectedUnit.length ? ' (' + props.selectedUnit.length + ')' : ' '}
            </button>
            <button>
                Xem dan so
                {props.selectedUnit.length ? ' (' +  props.selectedUnit.length + ')' : ' '}
            </button>
            <button>
                Phan tich
                {props.selectedUnit.length ? ' (' +  props.selectedUnit.length + ')' : ' '}
            </button>
        </div>
    )
}

export default MultiOption
