import * as types from './../constants/constantType'
 
var initialState = {};

var userRe = (state = initialState, actions) => {
    switch(actions.type) {
        case types.SET_USER:
            const user = actions.user
            if(user) {
                state = {
                    user: actions.user,
                    auth: true
                }
            }else {
                state = {
                    auth: false
                }
            }
            return state
        case types.DROP_USER:
            state = {}
            return state
        default:
            return {}
    }
}

export default userRe