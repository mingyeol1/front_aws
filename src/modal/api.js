import axios from 'axios';

// 환경 변수에서 baseURL 값을 가져옴123
const api = axios.create({
  baseURL: 'http://localhost:8080'
});

export const setAuthToken = token => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // 토큰이 없으면 권한 삭제
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;