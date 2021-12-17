import * as types from './../constants/constantType'
 
var initialState = {};

var userRe = (state = initialState, actions) => {
    switch(actions.type) {
        case types.SET_USER:
            const user = actions.user
            if(user) {
                state = {
                    user: user,
                    auth: true
                }
            }else {
                state = {
                    auth: false
                }
            }
            return {...state}
        case types.DROP_USER:
            state = {
                auth: false
            }
            return {...state}
        case types.SET_AUTH_FALSE:
            state = {
                auth: false
            }
            return {...state}
        default:
            return {...state}
    }
}

export default userRe