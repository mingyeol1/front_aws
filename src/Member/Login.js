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
      // 서버에 로그인 요청
      const response = await api.post('/api/auth/login', loginData);
  
      const { accessToken, refreshToken } = response.data;
  
      // ✅ JWT 토큰이 올바르게 존재하는지 확인
      if (!accessToken || !refreshToken) {
        throw new Error("서버로부터 토큰을 받지 못했습니다.");
      }
  
      // 쿠키에 저장
      setCookie('accessToken', accessToken, { path: '/', sameSite: 'Lax' });
      setCookie('refreshToken', refreshToken, { path: '/', sameSite: 'Lax' });
  
      // ✅ 인증 헤더 설정
      setAuthToken(accessToken);
  
      // 성공 시 메인 페이지로 이동
      navigate('/');
      alert("로그인에 성공하셨습니다.");
    } catch (error) {
      console.error('로그인 실패:', error);
  
      // ✅ 서버 응답이 있는 경우
      if (error.response) {
        const errorMessage = error.response.data.message || "로그인 중 오류가 발생했습니다.";
  
        // 🚨 특정 에러 메시지 처리
        if (errorMessage.includes("이미 삭제된 아이디")) {
          alert("삭제된 아이디입니다.");
        } else if (error.response.status === 401) {
          alert("아이디 또는 비밀번호가 다릅니다.");
        } else {
          alert(errorMessage);
        }
      } else {
        // 서버 응답이 없는 경우
        alert("서버와 연결할 수 없습니다.");
      }
  
      // 🚨 실패 시 토큰 삭제
      setAuthToken(null);
      setCookie('accessToken', '', { path: '/' });
      setCookie('refreshToken', '', { path: '/' });
    }
  };
  

  const handleKakaoLogin = () => {
    // 카카오 로그인 페이지로 이동
    window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
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