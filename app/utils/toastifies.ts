import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
// @ts-expect-error" ssss
import { TypeOptions } from 'react-toastify/dist/types';

export const ToastifyRoot = {
  toast: (text: string, type: TypeOptions) => {
    return toast(text, { type: type });
  },
};
