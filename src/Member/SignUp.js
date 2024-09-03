import React, { useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";
import "./Member.css";

function SignUp() {
  const [signUpData, setSignUpData] = useState({
    mid: '',
    mpw: '',
    checkMpw: '',
    mname: '',
    mnick: '',
    memail: '',
    mphone: ''
  });

  const handleSignUpChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const { mid, mpw, checkMpw, mname, mnick, memail, mphone } = signUpData;

    // 빈 값 확인
    if (!mid) {
      alert("아이디를 입력해주세요");
      return;
    }
    if (!mpw) {
      alert("비밀번호를 입력해주세요");
      return;
    }
    if (!mname) {
      alert("이름을 입력해주세요");
      return;
    }
    if (!mnick) {
      alert("닉네임을 입력해주세요");
      return;
    }
    if (!memail) {
      alert("이메일을 입력해주세요");
      return;
    }
    if (!mphone) {
      alert("번호를 입력해주세요");
      return;
    }

    // 비밀번호 확인
    if (mpw !== checkMpw) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // 회원가입 요청.
      const response = await api.post('/api/auth/signUp', signUpData);
      console.log(response.data);
      // 회원가입 성공 처리
      alert("가입에 성공하셨습니다.");
      navigate('/login');
    } catch (error) {
      if (error.response) {
        console.log(error.response)
        alert("이미 존재하는 아이디 및 닉네임입니다.");
      } else {
        console.error('회원가입 실패:', error);
        alert("회원가입에 실패하셨습니다.");
      }
    }
  };

  return (
    <div className="mainBackground">
      <div className="main-container">
        <form className="main-form" onSubmit={handleSignUp}>
          <h2>회원가입</h2>
          <input name="mname" value={signUpData.mname} onChange={handleSignUpChange} placeholder="이름" />
          <input name="mid" value={signUpData.mid} onChange={handleSignUpChange} placeholder="아이디" />
          <input name="mpw" type="password" value={signUpData.mpw} onChange={handleSignUpChange} placeholder="비밀번호" />
          <input name="checkMpw" type="password" value={signUpData.checkMpw} onChange={handleSignUpChange} placeholder="비밀번호 확인" />
          <input name="mnick" value={signUpData.mnick} onChange={handleSignUpChange} placeholder="닉네임" />
          <input name="memail" type="email" value={signUpData.memail} onChange={handleSignUpChange} placeholder="이메일" />
          <input name="mphone" value={signUpData.mphone} onChange={handleSignUpChange} placeholder="핸드폰번호" />
          <button type="submit" className="danger">회원가입</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
