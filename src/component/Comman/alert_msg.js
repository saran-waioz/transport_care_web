import { message } from 'antd';
export const Alert_msg = (data) => {
  if (data.status) {
    return (message.loading('Please Wait ....', 1).then(() => message.success(data.message, [1])));
  } else {
    return (message.loading('Please Wait ....', 1).then(() => message.error(data.message, [1])));
  }
};