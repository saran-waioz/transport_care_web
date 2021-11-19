let type = 1;
export const API = type
  ? "https://tryout.waioz.com:8990/api"
  : "https://localhost:8990/api";
const SOCKET = type ? "https://tryout.waioz.com:8990" : "http://localhost:8990";
export default SOCKET;
