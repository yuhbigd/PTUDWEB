import * as types from './../constants/constantType'
 
var initialState = [];

var provinceRe = (state = initialState, actions) => {
    switch(actions.type) {
        case types.SET_PROVINCE:
            state = actions.province
            return  [...state] 
        default:
            return[...state]
    }
}

export default provinceRe