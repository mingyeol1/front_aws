import React, { useState, useEffect } from "react";
import api, { setAuthToken } from "./api";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./Member.css";

export function Modify() {

  //현재 수정중인 회원정보.
  const [memberData, setMemberData] = useState({
    mid: "",
    mnick: "",
    memail: "",
    mphone: "",
    mpw: "",
    checkMpw: "",
    currentPw: ""
  });

  //현재 회원의 닉네임과 이메일 값 중복 제거.
  const [originalData, setOriginalData] = useState({
    mnick: "",
    memail: ""
  });

  const [cookies] = useCookies(['accessToken']);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.accessToken) {
      alert("권한이 없습니다.");
      navigate("/login");
    } else {
      setAuthToken(cookies.accessToken);
      
      // 서버에서 회원 정보를 가져옴
      api.get("/api/auth/modify")
      .then(response => {
        const { mid, mnick, memail, mphone } = response.data;
        // 가져온 정보로 상태 업데이트
        setMemberData({ mid, mnick, memail, mphone, mpw: "", checkMpw: "", currentPw: "" });
       // 원래의 닉네임과 이메일을 상태에 저장 // 현재 회원의 이메일 닉네임 중복여부.
        setOriginalData({ mnick, memail });
      })
      .catch(error => {
        console.error(error);
        alert("유저 정보를 불러오는 데 실패했습니다.");
      });
    }
  }, [cookies, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { mnick, memail, mphone, mpw, checkMpw, currentPw } = memberData;

    // 빈 값 확인
    if (!mnick) {
      alert("닉네임을 입력해주세요");
      return;
    }
    if (!memail) {
      alert("이메일을 입력해주세요");
      return;
    }
    if (!mphone) {
      alert("핸드폰 번호를 입력해주세요");
      return;
    }

    // 비밀번호 변경을 시도하는 경우 비밀번호 검증
    if (mpw || checkMpw) {
      if (!mpw) {
        alert("새 비밀번호를 입력해주세요");
        return;
      }
      if (mpw !== checkMpw) {
        alert("새 비밀번호가 일치하지 않습니다.");
        return;
      }
      if (!currentPw) {
        alert("현재 비밀번호를 입력해주세요");
        return;
      }

      // 현재 비밀번호 확인을 서버에 요청
      try {
        const response = await api.post("/api/auth/checkPw", { mpw: currentPw });
        // if (response.status !== 200) {
        //    alert("현재 비밀번호가 일치하지 않습니다.");
        //   return;
        // }
      } catch (error) {
        console.error(error);
        alert("현재 비밀번호가 일치하지 않습니다.");
        return;
      }
    }

    const dataToSend = { ...memberData };
    delete dataToSend.checkMpw; // 확인 비밀번호 필드는 서버로 전송하지 않음
    delete dataToSend.currentPw; // 현재 비밀번호 필드는 서버로 전송하지 않음

    try {
      // 서버에 회원 정보 수정 요청
      const response = await api.put("/api/auth/modify", { ...dataToSend, originalMnick: originalData.mnick, originalMemail: originalData.memail });
      alert(response.data);
      navigate("/mypage");
    } catch (error) {
      if (error.response) {
        alert(error.response.data);
      } else {
        console.error(error);
        alert("수정 중 오류가 발생했습니다.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberData({ ...memberData, [name]: value });
  };

  return (
    <div className="mainBackground">
      <div className="main-container">
        <form className="main-form" onSubmit={handleSubmit}>
          <h2>회원정보수정</h2>
          <input type="hidden" name="mid" value={memberData.mid} />
          <input name="mnick" placeholder="닉네임" value={memberData.mnick} onChange={handleChange} />
          <input name="memail" placeholder="이메일" type="email" value={memberData.memail} onChange={handleChange} />
          <input name="mphone" placeholder="핸드폰번호" value={memberData.mphone} onChange={handleChange} />
          <input name="currentPw" placeholder="현재 비밀번호" type="password" value={memberData.currentPw} onChange={handleChange} />
          <input name="mpw" placeholder="새 비밀번호" type="password" value={memberData.mpw} onChange={handleChange} />
          <input name="checkMpw" placeholder="새 비밀번호 확인" type="password" value={memberData.checkMpw} onChange={handleChange} />
          <button type="submit" className="danger">완료</button>
        </form>
      </div>
    </div>
  );
}
