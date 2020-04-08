import { generateActionsByTypes, generateDispatchesByTypes } from '@/redux/actions';
import TYPES from '@/redux/types/home';

export const actions = generateActionsByTypes(TYPES);
export const dispatches = generateDispatchesByTypes(TYPES, actions);
export default actions;
