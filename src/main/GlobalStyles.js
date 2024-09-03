// GlobalStyles.js
import { createGlobalStyle, css } from "styled-components";

// 스크롤바 스타일 정의
const scrollbarStyle = css`
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

// GlobalStyle 정의
const GlobalStyle = createGlobalStyle`
  body {
    overflow: auto; /* 스크롤 가능하게 설정 */
    ${scrollbarStyle} /* 스크롤바 스타일 적용 */
  }
`;

export default GlobalStyle;
