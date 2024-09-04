import axios from 'axios';

// Axios 인스턴스를 생성할 때 withCredentials 옵션을 설정
const api = axios.create({
  baseURL: 'https://dev.tft.p-e.kr',
});

// 전역 설정 추가: 쿠키 기반 인증 정보를 요청 시 함께 전송
axios.defaults.withCredentials = true;

export const setAuthToken = token => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // 토큰이 없으면 권한 삭제
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
