import * as types from './../constants/constantType'
import { useSelector } from 'react-redux'

export const set_province = (province) => {
    return {
        type: types.SET_PROVINCE,
        province: province
    }
}

export const set_user = (user) => {
    return {
        type: types.SET_USER,
        user: user
    }
}

export const set_user_auth_false = () => {
    return {
        type: types.SET_AUTH_FALSE
    }
}

export const drop_user = () => {
    return {
        type: types.DROP_USER
    }
}

export const set_multi = (payload) => {
    return {
        type: types.SET_MULTI,
        payload: payload
    }
}

export const drop_multi = (payload) => {
    return {
        type: types.DROP_MULTI
    }
}