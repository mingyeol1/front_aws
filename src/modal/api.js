import axios from 'axios';

const api = axios.create({
  baseURL: 'http://tft-back01.ap-northeast-2.elasticbeanstalk.com',
});

export const setAuthToken = token => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    //토큰이 없으면 권한 삭제
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
