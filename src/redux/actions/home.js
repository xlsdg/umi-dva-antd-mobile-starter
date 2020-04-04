import { generateActionsByTypes } from '@/redux/actions/index';
import TYPES from '@/redux/types/home';

export default {
  ...generateActionsByTypes(TYPES),
};
