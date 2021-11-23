import * as types from './../constants/constantType'
 
var initialState = [
    {id: 0, name: 'Viet Nam'}, null, null, null, null
];

var districtRe = (state = initialState, actions) => {
    switch(actions.type) {
        case types.SET_DIR:
            state = actions.district
            return  [...state] 
        default:
            return[...state]
    }
}

export default districtRe