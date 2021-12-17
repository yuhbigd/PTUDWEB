import { combineReducers } from "redux";
import provinceRe from "./provinceRe";
import userRe from './userRe'
import multiRe from "./mutiRe";

const appReducers = combineReducers({
    provinceRe: provinceRe,
    userRe: userRe,
    multiRe: multiRe

});

export default appReducers;