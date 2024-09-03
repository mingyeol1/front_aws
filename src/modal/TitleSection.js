import React from 'react';
import styled from 'styled-components';

const StyledMovieTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  position: sticky;
  top: 0;
  background-color: #141414;
  padding: 20px 20px 10px 20px;
  z-index: 1;
  font-size: 45px;
  font-weight: 900;
`;

const TitleSection = ({ title }) => {
  return <StyledMovieTitle>{title}</StyledMovieTitle>;
};

export default TitleSection;