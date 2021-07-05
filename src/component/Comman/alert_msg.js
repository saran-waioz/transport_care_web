import { message } from 'antd';
export const Alert_msg = (data) => {
  console.log(data);
  if (data.status === 'success') {
    return (message.loading('Please Wait ....', 1).then(() => message.success(data.msg, [1])));
  } else {
    return (message.loading('Please Wait ....', 1).then(() => message.error(data.msg, [1])));
  }
};