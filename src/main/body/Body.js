import React, { useState } from 'react';
import styled from "styled-components";
import { FaUsers } from 'react-icons/fa';
import { MainBody } from '../Main';
import { MainBodyMovieListSection } from './MainBodyMovieListSection';
import { MainBodyRollingBanner } from "./MainBodyRollingBanner";
import MeetModal from '../Meet/MeetModal';



const MainBodyMovieListArea = styled.div`
  width: 100%;
`;

const RecruitmentIcon = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #e50914;
  color: white;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 10px rgba(229, 9, 20, 0.5);
  }
`;

function Body() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVersion, setModalVersion] = useState(1);

  const handleRecruitmentClick = () => {
    setIsModalOpen(true);
    // 랜덤하게 모달 버전 선택 (1 또는 2)
    setModalVersion(Math.floor(Math.random() * 2) + 1);
  };

  return (
    <MainBody>
      <MainBodyRollingBanner/>
      <MainBodyMovieListArea>
        <MainBodyMovieListSection />
      </MainBodyMovieListArea>
      <RecruitmentIcon onClick={handleRecruitmentClick}>
        <FaUsers size={50} />
      </RecruitmentIcon>
      {isModalOpen && (
        <MeetModal 
          onClose={() => setIsModalOpen(false)} 
          version={modalVersion}
        />
      )}
    </MainBody>
  );
}

export default Body;