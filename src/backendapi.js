let type = 0;
export const API = type
  ? "http://3.138.149.12:8990/api"
  : "http://localhost:8990/api";
const SOCKET = type ? "http://3.138.149.12:8990" : "http://localhost:8990";
export default SOCKET;
