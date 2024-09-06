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

const CommentSection = styled.div`
  margin-top: 20px;
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const CommentInput = styled.textarea`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #333;
  background-color: #222;
  color: white;
  margin-bottom: 10px;
  min-height: 100px;
  resize: vertical;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  align-self: flex-end;
`;

const CommentList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CommentItem = styled.li`
  background-color: #222;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CommentContent = styled.div`
  flex-grow: 1;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    color: #e50914;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  button {
    background-color: #e50914;
    color: white;
    border: none;
    padding: 5px 10px;
    margin: 0 5px;
    border-radius: 3px;
    cursor: pointer;

    &:disabled {
      background-color: #888;
      cursor: not-allowed;
    }
  }

  span {
    margin: 0 10px;
  }
`;

const EditInput = styled.input`
  width: 100%;
  padding: 5px;
  margin-top: 5px;
  border: 1px solid #333;
  background-color: #222;
  color: white;
`;

const ErrorMessage = styled.p`
  color: #e50914;
  margin-top: 10px;
`;

const SuccessMessage = styled.p`
  color: #4CAF50;
  margin-top: 10px;
`;

const MeetApply = ({ meeting, onClose, isLoggedIn, userData }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isAuthor, setIsAuthor] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchComments();
    checkIsAuthor();
  }, [currentPage, meeting.meetId]);

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
      setComments([]);
      setErrorMessage('댓글을 불러오는데 실패했습니다.');
    }
  };

  const checkIsAuthor = async () => {
    try {
      const response = await api.get(`/api/meet/${meeting.meetId}/isAuthor`);
      setIsAuthor(response.data.isAuthor);
    } catch (error) {
      console.error('Error checking author status:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setErrorMessage('로그인이 필요한 서비스입니다.');
      return;
    }
    try {
      const response = await api.post(`/api/meetreplyes/register`, {
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

  const handleCommentUpdate = async (meetRid) => {
    try {
      await api.put(`/api/meetreplyes/${meetRid}`, {
        replyText: editContent
      });
      setEditingComment(null);
      fetchComments();
      setSuccessMessage('댓글이 성공적으로 수정되었습니다.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating comment:', error);
      setErrorMessage('댓글 수정에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleUpdate = () => {
    setShowUpdateModal(true);
  };

  const handleUpdateComplete = async (updatedMeeting) => {
    try {
      await api.put(`/api/meet/${meeting.meetId}`, updatedMeeting);
      setShowUpdateModal(false);
      fetchMeetingDetails();
    } catch (error) {
      console.error('Error updating meeting:', error);
      alert('모임 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 모임을 삭제하시겠습니까?')) {
      try {
        await api.delete(`/api/meet/${meeting.meetId}`);
        onClose();
      } catch (error) {
        console.error('Error deleting meeting:', error);
      }
    }
  };

  const fetchMeetingDetails = async () => {
    try {
      const response = await api.get(`/api/meet/${meeting.meetId}`);
      // Update the meeting details in the parent component or state
    } catch (error) {
      console.error('Error fetching meeting details:', error);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        <ImageSection>
          {meeting.meetBoardImages && meeting.meetBoardImages.length > 0 && (
            meeting.meetBoardImages.map((image) => (
              <MeetImage
                key={image.uuid}
                src={`/view/${image.uuid}_${image.fileName}`}
                alt={image.fileName}
              />
            ))
          )}
        </ImageSection>
        <InfoSection>
          <Title>{meeting.meetTitle}</Title>
          <InfoItem>모집 영화: {meeting.movieTitle}</InfoItem>
          <InfoItem>모임 시간: {new Date(meeting.meetTime).toLocaleString()}</InfoItem>
          <InfoItem>모집 인원: {meeting.personnel}</InfoItem>
          <InfoItem>모임 내용: {meeting.meetContent}</InfoItem>
          {isAuthor && (
            <div>
              <Button onClick={handleUpdate}>수정하기</Button>
              <Button onClick={handleDelete}>삭제하기</Button>
            </div>
          )}
          
          <CommentSection>
            <h3>댓글</h3>
            <CommentForm onSubmit={handleCommentSubmit}>
              <CommentInput
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
              />
              <Button type="submit">댓글 등록</Button>
            </CommentForm>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
            <CommentList>
              {comments.map((comment) => (
                <CommentItem key={comment.meetRid}>
                  <CommentContent>
                    <p>{comment.replyText}</p>
                    <small>{comment.replyer} - {new Date(comment.regDate).toLocaleString()}</small>
                  </CommentContent>
                  {isLoggedIn && userData.mnick === comment.replyer && (
                    <CommentActions>
                      <ActionButton onClick={() => handleCommentDelete(comment.meetRid)}><FaTrash /></ActionButton>
                      <ActionButton onClick={() => {
                        setEditingComment(comment.meetRid);
                        setEditContent(comment.replyText);
                      }}><FaEdit /></ActionButton>
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
          </CommentSection>
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
