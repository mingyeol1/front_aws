import styled from "styled-components";

// container
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: ${props => props.color || 'black'};
  color: white;
  overflow: hidden;
  padding-top: 2vh;
`;

// header
const MainHeader = styled.div`
  display: flex;
  width: 100%;
  height: 8vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: black;
  z-index: 1001; 
`;

// body
const MainBody = styled.div`
  flex: 1;
  padding-top: 8vh; // margin-top 대신 padding-top 사용
  font-weight: bold;
`;

//footer
const MainFooter = styled.div`
  height: 18vh;
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 1em;
  justify-content: center;
`;

export {
  MainContainer, MainHeader, MainBody, MainFooter
};