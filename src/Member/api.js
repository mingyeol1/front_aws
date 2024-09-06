import axios from 'axios';

// 환경 변수에서 baseURL 값을 가져옴
const api = axios.create({
  baseURL: 'https://dev.tft.p-e.kr'
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