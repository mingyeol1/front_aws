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
  width: 50%;
  height: 80%;
  background-color: #141414;
  border-radius: 20px;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
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

const TopSection = styled.div`
  display: flex;
  margin-bottom: 20px;
  gap: 20px;
  height: 40%; // 상단 섹션 높이 조정
`;

const ImageSection = styled.div`
  flex: 1;
  height: 100%;
`;

const MeetImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const InfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 15px;
  color: #e50914;
`;

const InfoItem = styled.p`
  margin-bottom: 10px;
  font-size: 16px;
  color: #cccccc;
`;

const InfoLabel = styled.span`
  font-weight: bold;
  color: #ffffff;
  margin-right: 10px;
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: #333;
  margin: 20px 0;
`;

const BottomSection = styled.div`
  flex: 1;
  overflow-y: auto;
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

const CommentForm = styled.form`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const CommentInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #333;
  background-color: #222;
  color: white;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-left: 10px;
`;

const CommentList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CommentItem = styled.li`
  background-color: ${props => props.isEven ? '#2a2a2a' : '#222'};
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const CommentContent = styled.div`
  flex-grow: 1;
`;

const CommentAuthor = styled.span`
  font-weight: bold;
  margin-right: 10px;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 8px 15px;
  background-color: ${props => props.delete ? '#e50914' : '#e50914'};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const ErrorMessage = styled.p`
  color: #e50914;
  margin-top: 10px;
`;

const SuccessMessage = styled.p`
  color: #4CAF50;
  margin-top: 10px;
`;

const EditInput = styled.input`
  width: 100%;
  padding: 5px;
  margin-top: 5px;
  border: 1px solid #333;
  background-color: #222;
  color: white;
`;

const MeetApply = ({ meeting, onClose, isLoggedIn, userData }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isAuthor, setIsAuthor] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchComments();
    checkIsAuthor();

    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [currentPage, meeting.meetId, onClose]);

  const checkIsAuthor = () => {
    if (userData && meeting) {
      setIsAuthor(userData.mnick === meeting.meetWriter);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/api/meetreplyes/list/${meeting.meetId}`, {
        params: { page: currentPage, size: 10 }
      });
      setComments(response.data.dtoList || []);
      setTotalPages(response.data.totalPage || 1);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
      setErrorMessage('댓글을 불러오는데 실패했습니다.');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setErrorMessage('로그인이 필요한 서비스입니다.');
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
      setSuccessMessage('댓글이 성공적으로 등록되었습니다.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setErrorMessage('댓글 등록에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleCommentDelete = async (meetRid) => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        await api.delete(`/api/meetreplyes/${meetRid}`);
        fetchComments();
        setSuccessMessage('댓글이 성공적으로 삭제되었습니다.');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting comment:', error);
        setErrorMessage('댓글 삭제에 실패했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const handleUpdate = () => {
    setShowUpdateModal(true);
  };

  const handleUpdateComplete = async (updatedMeeting) => {
    try {
      await api.put(`/api/meet/${meeting.meetId}`, updatedMeeting);
      setShowUpdateModal(false);
      // Refresh the meeting details
      const response = await api.get(`/api/meet/${meeting.meetId}`);
      // Update the meeting state in the parent component or refresh the page
      onClose();
    } catch (error) {
      console.error('Error updating meeting:', error);
      setErrorMessage('모임 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 모임을 삭제하시겠습니까?')) {
      try {
        await api.delete(`/api/meet/${meeting.meetId}`);
        setSuccessMessage('모임이 성공적으로 삭제되었습니다.');
        setTimeout(() => {
          onClose();
          // You might want to add a callback to refresh the MeetModal
        }, 2000);
      } catch (error) {
        console.error('Error deleting meeting:', error);
        setErrorMessage('모임 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleCommentEdit = (commentId) => {
    const commentToEdit = comments.find(c => c.meetRid === commentId);
    if (commentToEdit) {
      setEditingComment(commentId);
      setEditContent(commentToEdit.replyText);
    }
  };

  const handleCommentUpdate = async () => {
    if (!editingComment) return;

    try {
      await api.put(`/api/meetreplyes/${editingComment}`, {
        replyText: editContent
      });
      setEditingComment(null);
      setEditContent('');
      fetchComments();
      setSuccessMessage('댓글이 성공적으로 수정되었습니다.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating comment:', error);
      setErrorMessage('댓글 수정에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        
        <TopSection>
          <ImageSection>
            {meeting.imageUrls && meeting.imageUrls.length > 0 && (
              <MeetImage src={meeting.imageUrls[0]} alt="미팅 이미지" />
            )}
          </ImageSection>
          <InfoSection>
            <div>
              <Title>{meeting.meetTitle}</Title>
              <InfoItem><InfoLabel>작성자:</InfoLabel> {meeting.meetWriter}</InfoItem>
              <InfoItem><InfoLabel>모임 시간:</InfoLabel> {formatDate(meeting.meetTime)}</InfoItem>
              <InfoItem><InfoLabel>모집 인원:</InfoLabel> {meeting.personnel}명</InfoItem>
              <InfoItem><InfoLabel>모임 내용:</InfoLabel> {meeting.meetContent}</InfoItem>
            </div>
            {isAuthor && (
              <div>
                <ActionButton delete onClick={handleDelete}>모집글 삭제</ActionButton>
              </div>
            )}
          </InfoSection>
        </TopSection>
        
        <Divider />
        
        <BottomSection>
          <CommentForm onSubmit={handleCommentSubmit}>
            <CommentInput
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글을 입력하세요"
            />
            <Button type="submit">댓글 등록</Button>
          </CommentForm>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
          
          <CommentList>
            {comments.map((comment, index) => (
              <CommentItem key={comment.meetRid} isEven={index % 2 === 0}>
                <CommentContent>
                  <CommentAuthor>{comment.replyer}</CommentAuthor>
                  {editingComment === comment.meetRid ? (
                    <EditInput
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                  ) : (
                    comment.replyText
                  )}
                </CommentContent>
                {isLoggedIn && userData.mnick === comment.replyer && (
                  <CommentActions>
                    {editingComment === comment.meetRid ? (
                      <>
                        <ActionButton onClick={handleCommentUpdate}>저장</ActionButton>
                        <ActionButton onClick={() => setEditingComment(null)}>취소</ActionButton>
                      </>
                    ) : (
                      <>
                        <ActionButton onClick={() => handleCommentEdit(comment.meetRid)}><FaEdit /></ActionButton>
                        <ActionButton onClick={() => handleCommentDelete(comment.meetRid)}><FaTrash /></ActionButton>
                      </>
                    )}
                  </CommentActions>
                )}
              </CommentItem>
            ))}
          </CommentList>
          {totalPages > 1 && (
            <Pagination>
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
            </Pagination>
        )}
      </BottomSection>

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