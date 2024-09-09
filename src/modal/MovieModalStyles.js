import styled, { css, keyframes } from "styled-components";

// 스크롤바 스타일 정의
export const scrollbarStyle = css`
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

// 모달 오버레이 스타일 컴포넌트
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
  ${scrollbarStyle}
`;

// 모달 컨텐츠 스타일 컴포넌트
export const ModalContent = styled.div`
  position: relative;
  width: 70%;
  height: 80%;
  background-color: #141414;
  border-radius: 20px;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: row;
  overflow-y: hidden;
  cursor: auto;
  ${scrollbarStyle}
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 95%;
    height: 95%;
  }
`;

// 닫기 버튼 스타일 컴포넌트
export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 40px;  
  cursor: pointer;
  transition: color 0.3s;
  padding: 10px;
  z-index: 10;

  &:hover {
    color: #e50914;
  }
`;

// 포스터 이미지 스타일 컴포넌트
export const PosterImage = styled.img`
  width: auto;
  height: auto;
  margin-right: 20px;
  border-radius: 20px;
`;

// 영화 정보 컨테이너 스타일 컴포넌트
export const MovieInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  max-height: 100%;
`;

// 포스터 이미지가 없을 때 표시할 컴포넌트
export const NoPosterImage = styled.div`
  width: auto;
  height: auto;
  min-width: 510px;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #666;
  border: 1px solid #ddd;
  margin-right: 20px;
  border-radius: 20px;
`;

// 로딩 스피너 애니메이션
export const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// 로딩 스피너 스타일 컴포넌트
export const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${rotate} 1s linear infinite;
  margin: auto;
`;

// 로딩 오버레이 스타일 컴포넌트
export const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;