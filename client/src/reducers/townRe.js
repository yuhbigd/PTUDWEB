import * as types from './../constants/constantType'
 
var initialState = [];

var townRe = (state = initialState, actions) => {
    switch(actions.type) {
        case types.SET_TOWN:
            state = actions.town
            return  [...state] 
        default:
            return[...state]
    }
}

export default townRe