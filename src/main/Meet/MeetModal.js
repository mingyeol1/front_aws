import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaSearch } from 'react-icons/fa';
import api, { setAuthToken } from '../../Member/api';
import { useCookies } from 'react-cookie';
import MeetCreate from './MeetCreate';
import MeetApply from './MeetApply';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
`;

const ModalContent = styled.div`
  position: relative;
  width: 80%;
  height: 80%;
  background-color: #141414;
  border-radius: 20px;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #2b2b2b;
  border-radius: 30px;
  padding: 10px 20px;
  width: 60%;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  &:focus {
    outline: none;
  }
`;

const CloseButton = styled.button`
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

const MeetingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  flex-grow: 1;
  margin-bottom: 20px;
`;

const MeetItem = styled.div`
  background-color: #2b2b2b;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 280px;
`;

const MeetInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const MeetImage = styled.img`
  width: 100%;
  height: 200px; 
  object-fit: cover; 
  border-radius: 8px;
  margin-bottom: 8px;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const MeetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const MeetTitle = styled.h3`
  font-size: 14px;
  margin: 0 0 5px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const MeetDetails = styled.div`
  text-align: right;
`;

const MeetDetail = styled.p`
  font-size: 12px;
  margin: 0 0 3px 0;
`;

const ApplyButton = styled.button`
  padding: 8px;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 5px;
`;

const Paginationsection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  position: relative;  // 추가: CreateButton의 절대 위치 지정을 위해
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;  // 변경: 전체 너비를 사용하도록 설정
  padding: 10px 0;
`;

const CreateButton = styled.button`
  padding: 10px 20px;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  position: absolute;  // 변경: 절대 위치로 설정
  right: 20px;  // 변경: 오른쪽에서 20px 떨어진 위치에 고정
  top: 50%;  // 추가: 세로 중앙 정렬을 위해
  transform: translateY(-50%);  // 추가: 세로 중앙 정렬을 위해
`;

const PageButton = styled.button`
  background-color: #2b2b2b;
  color: white;
  border: none;
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover {
    color: #e50914;
  }
`;

const MeetModal = ({ onClose }) => {
  const [cookies] = useCookies(['accessToken']);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMeetCreate, setShowMeetCreate] = useState(false);
  const [showMeetApply, setShowMeetApply] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    checkLoginStatus();
    if (!isNaN(currentPage) && currentPage > 0) {
      fetchMeetings();
    }
  }, [cookies.accessToken, currentPage]); // currentPage 추가

  const handleCloseModal = () => {
    setShowApplyModal(false);
    setSelectedMeeting(null);
  };

  const handleMeetingDeleted = () => {
    setShowMeetApply(false);
    setSelectedMeeting(null);
    fetchMeetings(); // 게시글 목록을 새로고침
  };

  const checkLoginStatus = async () => {
    if (cookies.accessToken) {
      setAuthToken(cookies.accessToken);
      try {
        const response = await api.get("/api/auth/modify");
        setIsLoggedIn(true);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  const fetchMeetings = async () => {
    try {
      const token = cookies.accessToken;
      if (token) {
        setAuthToken(token);
      }
      
      const endpoint = token ? '/api/meet/list' : '/api/public/review/list';
  
      console.log('Fetching meetings for page:', currentPage);
  
      const response = await api.get(endpoint, {
        params: { page: currentPage, size: 6 }
      });
  
      console.log('API response:', response.data);
  
      if (response.data && response.data.dtoList) {
        setMeetings(response.data.dtoList);
        setTotalPages(response.data.totalPage);
      } else {
        console.error('Unexpected data structure:', response.data);
        setMeetings([]);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error.response?.data || error.message);
      setMeetings([]);
    }
  };

  // 페이지 변경 함수 수정
  const changePage = (newPage) => {
    if (!isNaN(newPage) && newPage > 0) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMeetCreateClick = () => {
    if (isLoggedIn) {
      setShowMeetCreate(true);
    } else {
      alert('로그인이 필요한 서비스입니다.');
    }
  };

  const handleMeetCreateClose = (dataChanged = false) => {
    setShowMeetCreate(false);
    if (dataChanged) {
      fetchMeetings();
    }
  };

  const handleMeetApplyClick = (meeting) => {
    if (isLoggedIn) {
      setSelectedMeeting(meeting);
      setShowMeetApply(true);
      setIsApplyOpen(true);
    } else {
      alert('로그인이 필요한 서비스입니다.');
    }
  };

  const handleMeetApplyClose = () => {
    setShowMeetApply(false);
    setSelectedMeeting(null);
    setIsApplyOpen(false);
  };

  const filteredMeetings = meetings.filter(meeting =>
    meeting.meetTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <ModalOverlay onClick={onClose}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <TopSection>
            <CloseButton onClick={onClose}><FaTimes /></CloseButton>
          </TopSection>

          <MeetingsGrid>
            {filteredMeetings.map(meeting => (
              <MeetItem key={meeting.meetId}>
                {meeting.imageUrls && meeting.imageUrls.length > 0 && (
                  <MeetImage
                    src={meeting.imageUrls[0]}  // S3에서 불러온 첫 번째 이미지 사용
                    alt="미팅 이미지"
                  />
                )}
                <MeetInfo>
                  <MeetHeader>
                    <MeetTitle>{meeting.meetTitle}</MeetTitle>
                    <MeetDetails>
                      <MeetDetail>모집인원: {meeting.personnel}</MeetDetail>
                      <MeetDetail>
                        모임시간: {new Date(meeting.meetTime).toLocaleString('ko-KR', {
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true
                        })}
                      </MeetDetail>
                    </MeetDetails>
                  </MeetHeader>
                </MeetInfo>
                <ApplyButton onClick={() => handleMeetApplyClick(meeting)}>신청하기</ApplyButton>
              </MeetItem>
            ))}
          </MeetingsGrid>

          <Paginationsection>

            <Pagination>
              <PageButton 
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                이전
              </PageButton>
              <span>{currentPage}  {totalPages}</span>
              <PageButton 
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                다음
              </PageButton>
              <CreateButton onClick={handleMeetCreateClick}>모집하기</CreateButton>
            </Pagination>
          </Paginationsection>
        </ModalContent>
      </ModalOverlay>

      {showMeetCreate && (
        <MeetCreate 
          show={showMeetCreate}
          onClose={handleMeetCreateClose}
          userData={userData}
          authToken={cookies.accessToken}
        />
      )}

      {showMeetApply && selectedMeeting && (
        <MeetApply
          meeting={selectedMeeting}
          onClose={() => setShowMeetApply(false)}
          isLoggedIn={isLoggedIn}
          userData={userData}
          onMeetingDeleted={handleMeetingDeleted}
        />
      )}
    </>
  );
};

export default MeetModal;