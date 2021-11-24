import { combineReducers } from "redux";
import provinceRe from "./provinceRe";
import districtRe from "./districtRe";
import townRe from './townRe'
import userRe from './userRe'

const appReducers = combineReducers({
  provinceRe: provinceRe,
  districtRe: districtRe,
  townRe: townRe,
});

export default appReducers;