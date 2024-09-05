import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import PropTypes from 'prop-types';
import { MainHeader } from "../Main";
import SearchInputComponent from "../body/SearchInputComponent";

const MainHeaderLogoArea = styled.div`
  width: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: red;
  font-size: 32px;
  font-weight: bold;
  cursor: pointer;
`;

const MainHeaderSearchArea = styled.div`
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MainHeaderButtonArea = styled.div`
  width: 20%;
  display: flex;
  margin-left: 50px;
  align-items: center;
`;

const Button = styled.button`
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  
  &:hover {
    background-color: transparent;
    color: red;
    border-color: white;
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 6px 10px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 4px 8px;
  }

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const SidebarToggle = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
  margin-right: 10px;
  z-index: 1000;

  &:hover {
    color: red;
  }
`;

function Header({ toggleSidebar }) {
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'refreshToken']);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const clearSearchValue = () => {
    setSearchValue('');
  };

  const handleLogoClick = () => {
    clearSearchValue();
    navigate('/');
  };

  const handleLogout = () => {
    try {
      removeCookie('accessToken', { path: '/' });
      removeCookie('refreshToken', { path: '/' });
      setIsAuthenticated(false);
      navigate('/');
      alert("로그아웃 되었습니다.");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      alert("로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    if (cookies.accessToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [cookies.accessToken]);

  return (
    <MainHeader>
      <SidebarToggle onClick={toggleSidebar} aria-label="사이드바 열기">
        ☰
      </SidebarToggle>

      <MainHeaderLogoArea>
        <div onClick={handleLogoClick}>TFT</div>
      </MainHeaderLogoArea>

      <MainHeaderSearchArea>
        <SearchInputComponent 
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          clearSearchValue={clearSearchValue}
        />
      </MainHeaderSearchArea>

      <MainHeaderButtonArea>
        {isAuthenticated ? (
          <>
            <Button onClick={handleLogout} aria-label="로그아웃">로그아웃</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Link to="/mypage"><Button aria-label="내계정">내계정</Button></Link>
          </>
        ) : (
          <>
            <Link to="/login"><Button aria-label="로그인">로그인</Button></Link>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Link to="/signup"><Button aria-label="회원가입">회원가입</Button></Link>
          </>
        )}
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Link to="/board"><Button>게시판</Button></Link>
      </MainHeaderButtonArea>
    </MainHeader>
  );
}

Header.propTypes = {
  searchValue: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
  clearSearchValue: PropTypes.func.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default React.memo(Header);