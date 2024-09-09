import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../../Member/api';
import MeetUpdate from './MeetUpdate';

const ModalOverlay = styled.div`
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
`;

const ModalContent = styled.div`
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

const ImageSection = styled.div`
  flex: 1;
  margin-right: 20px;
`;

const MeetImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 20px;
`;

const InfoSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

const InfoItem = styled.p`
  margin-bottom: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
`;

const DeleteButton = styled(Button)`
  background-color: #d9534f;
`;

const MeetApply = ({ meeting, onClose, isLoggedIn, userData }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [comment, setComment] = useState('');
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    fetchComments();
    checkIsAuthor();
  }, [currentPage, meeting.meetId, userData]);

  const checkIsAuthor = () => {
    if (userData && meeting) {
      setIsAuthor(userData.mnick === meeting.meetWriter);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/api/meetreplyes/list/${meeting.meetId}`, {
        params: {
          page: currentPage,
          size: 10
        }
      });
      setComments(response.data.dtoList || []);
      setTotalPages(response.data.totalPage || 1);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleUpdate = () => {
    if (isAuthor) {
      setShowUpdateModal(true);
    } else {
      alert('게시글 작성자만 수정할 수 있습니다.');
    }
  };

  const handleDelete = async () => {
    if (isAuthor) {
      if (window.confirm('정말로 이 모집글을 삭제하시겠습니까?')) {
        try {
          await api.delete(`/api/meet/delete/${meeting.meetId}`);
          alert('모집글이 성공적으로 삭제되었습니다.');
          onClose();
        } catch (error) {
          console.error('Error deleting meeting:', error);
          alert('모집글 삭제 중 오류가 발생했습니다.');
        }
      }
    } else {
      alert('게시글 작성자만 삭제할 수 있습니다.');
    }
  };

  const handleUpdateComplete = async (updatedMeeting) => {
    try {
      await api.put(`/api/meet/${meeting.meetId}`, updatedMeeting);
      setShowUpdateModal(false);
      // Refresh the meeting details or close the modal
      onClose();
    } catch (error) {
      console.error('Error updating meeting:', error);
      alert('모임 수정 중 오류가 발생했습니다.');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('댓글을 작성하려면 로그인이 필요합니다.');
      return;
    }
    try {
      await api.post(`/api/meetreplyes/register`, {
        meetId: meeting.meetId,
        replyText: comment,
        replyer: userData.mnick
      });
      setComment('');
      fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        <ImageSection>
          {meeting.imageUrls && meeting.imageUrls.length > 0 && (
            <MeetImage src={meeting.imageUrls[0]} alt="미팅 이미지" />
          )}
        </ImageSection>
        <InfoSection>
          <Title>{meeting.meetTitle}</Title>
          <InfoItem>작성자: {meeting.meetWriter}</InfoItem>
          <InfoItem>모임 시간: {new Date(meeting.meetTime).toLocaleString()}</InfoItem>
          <InfoItem>모집 인원: {meeting.personnel}</InfoItem>
          <InfoItem>모임 내용: {meeting.meetContent}</InfoItem>
          <div>
            {/* <Button onClick={handleUpdate} disabled={!isAuthor}>수정하기</Button> */}
            <DeleteButton onClick={handleDelete} disabled={!isAuthor}>삭제하기</DeleteButton>
          </div>
          
          {/* Comment section */}
          <h3>댓글</h3>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
            />
            <Button type="submit">댓글 등록</Button>
          </form>
          {comments.map((comment) => (
            <div key={comment.meetRid}>
              <p>{comment.replyText}</p>
              <small>{comment.replyer} - {new Date(comment.regDate).toLocaleString()}</small>
            </div>
          ))}
          {totalPages > 1 && (
            <div>
              <Button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
              >
                이전
              </Button>
              <span>{currentPage} / {totalPages}</span>
              <Button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages}
              >
                다음
              </Button>
            </div>
          )}
        </InfoSection>

        {showUpdateModal && (
          <MeetUpdate
            meeting={meeting}
            onClose={() => setShowUpdateModal(false)}
            onUpdate={handleUpdateComplete}
          />
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default MeetApply;