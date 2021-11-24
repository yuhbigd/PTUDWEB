import * as types from './../constants/constantType'
import { useSelector } from 'react-redux'

export const set_province = (province) => {
    return {
        type: types.SET_PROVINCE,
        province: province
    }
}

export const set_district = (district) => {
    return {
        type: types.SET_DISTRICT,
        district: district
    }
}

export const set_town = (town) => {
    return {
        type: types.SET_TOWN,
        town: town
    }
}

export const set_user = (user) => {
    return {
        type: types.SET_USER,
        user: user
    }
}

export const drop_user = (user) => {
    return {
        type: types.DROP_USER
    }
}

