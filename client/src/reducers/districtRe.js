import * as types from './../constants/constantType'
 
var initialState = [];

var districtRe = (state = initialState, actions) => {
    switch(actions.type) {
        case types.SET_DISTRICT:
            state = actions.district
            return  [...state] 
        default:
            return[...state]
    }
}

export default districtRe