import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import api from "./api";
import "./Member.css";

function Remove() {
  const [mpw, setMpw] = useState("");
  const [cookies, removeCookie] = useCookies(['accessToken', 'refreshToken']);
  const navigate = useNavigate();

  useEffect(() => {
    // 토큰이 없을 시 접근 불가.
    if (!cookies.accessToken) {
      alert("권한이 없습니다.");
      navigate("/login");
    }
  }, [cookies, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/api/auth/remove", { mpw })
      .then(response => {
        alert(response.data);
        removeCookie('accessToken');  //삭제시 엑세스토큰 삭제
        removeCookie('refreshToken'); // 삭제시 리프레쉬토큰 삭제
        navigate("/");  // 삭제 후 메인 페이지로 이동
      })
      .catch(error => {
        console.error(error);
        alert("비밀번호를 확인해주세요.");
      });
  };

  return (
    <div className="mainBackground">
      <div className="main-container">
        <form className="main-form" onSubmit={handleSubmit}>
          <h1>정말 탈퇴 하시겠습니까?</h1>
          <input 
            placeholder="비밀번호 입력" 
            type="password" 
            value={mpw} 
            onChange={(e) => setMpw(e.target.value)} 
          />
          <button type="submit" className="danger">탈퇴</button>
        </form>
      </div>
    </div>
  );
}

export default Remove;