import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import api, { setAuthToken } from './api';
import "./Member.css";

function Login() {
  const [loginData, setLoginData] = useState({
    mid: '',
    mpw: ''
  });

  //쿠키값 설정.
  const [cookies, setCookie] = useCookies(['accessToken', 'refreshToken']);
  const navigate = useNavigate();



  //loginData상태 업데이트
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      //서버에 login 요청.
      const response = await api.post('/api/auth/login', loginData);


      const { accessToken, refreshToken } = response.data;

      // 쿠키에 저장
      setCookie('accessToken', accessToken, { path: '/', sameSite: 'Lax' });
      setCookie('refreshToken', refreshToken, { path: '/', sameSite: 'Lax' });


      //성공시 로그인 성공여부와 메인페이지로 이동
      navigate('/');
      alert("로그인에 성공하셨습니다.");
    } catch (error) {
      //로그인 실패알림
      console.error('로그인 실패:', error);
      alert("아이디 또는 비밀번호가 다릅니다.");
    }
  };

  const handleKakaoLogin = () => {
    // 카카오 로그인 페이지로 이동
    window.location.href = "https://dev.tft.p-e.kr/oauth2/authorization/kakao";
  };

  return (
    <div className="mainBackground">
      <div className="main-container">
        <form className="main-form" onSubmit={handleLogin}>
          <h2>로그인</h2>
          <input name="mid" value={loginData.mid} onChange={handleLoginChange} placeholder="아이디" />
          <input name="mpw" type="password" value={loginData.mpw} onChange={handleLoginChange} placeholder="비밀번호" />
          <button type="submit" className='danger'>로그인</button>
          <div className="kakao" onClick={handleKakaoLogin}>
            <img src="img/kakao_login.png" alt="카카오 로그인" />
          </div>
          <Link to="/SignUp"><p className='signUpBtn'>회원가입</p></Link>
        </form>
      </div>
    </div>
  );
}

export default Login;