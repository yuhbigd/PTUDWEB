import * as types from './../constants/constantType'
 var initialState = [];

var multiRe = (state = initialState, actions) => {
    switch(actions.type) {
        case types.SET_MULTI:
            state = actions.payload
            return  [...state]
        case types.DROP_MULTI:
            state = []
            return [...state]
        default:
            return[...state]
    }
}

export default multiRe