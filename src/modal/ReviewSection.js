import React, { useCallback, useRef, useState, useEffect } from 'react';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import { Cookies } from 'react-cookie';
import styled, { css, keyframes } from 'styled-components';
import api from '../Member/api';

const cookies = new Cookies();

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

const StyledReviewSection = styled.div`
  margin-bottom: 10px;
  margin-top: 20px;
  max-height: 40%;
  width: auto;
  ${scrollbarStyle}
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
`;

const MovieReview = styled.h3`
  font-size: 22px;
  color: white;
  margin: 0;
`;

const MovieReviewCount = styled.div`
  font-size: 16px;
  color: white;
`;

const StarRating = styled.span`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ReviewInputContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 10px;
`;

const ReviewInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  margin-right: 10px;
  border-radius: 5px;
`;

const SubmitReview = styled.button`
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  white-space: nowrap;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
  padding: 5px;
  &:hover {
    color: #e50914;
  }
`;

const ReviewText = styled.span`
  flex-grow: 1;
`;

const StarRatingDisplay = styled.div`
  display: flex;
  align-items: center;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: ${rotate} 1s linear infinite;
  margin: 10px auto;
`;

const EmptyReviewMessage = styled.div`
text-align: center;
padding: 70px;
color: #888;
font-style: italic;
`;

const ReviewList = styled.ul`
  margin-top: 20px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.1); 
  border-radius: 5px;
  max-height: 60%;
  overflow-y: auto;
  ${scrollbarStyle}
  list-style-type: none;
`;

const ReviewItem = styled.li`
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const ReviewAuthor = styled.span`
  font-weight: bold;
  width: 120px;
  margin-right: 20px;
`;

const ReviewContent = styled.span`
  flex: 1;
  margin-right: 20px;
`;

const ReviewRating = styled.span`
  display: flex;
  align-items: center;
  margin-right: 20px;
  min-width: 80px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ReviewSection = ({ 
  reviews, 
  rating, 
  setRating, 
  review, 
  setReview, 
  handleSubmitReview,
  fetchReviews,
  loading,
  hasMore,
  total,
  allStars,
  handleEditReview,
  handleDeleteReview
}) => {

  const [currentUser, setCurrentUser] = useState(null);
  const [editingStates, setEditingStates] = useState({});
  const [editingReview, setEditingReview] = useState(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(0);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = cookies.get("accessToken");
      if (token) {
        try {
          const response = await api.get('/api/auth/modify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setCurrentUser(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchCurrentUser();
  }, []);

  const handleRating = (value) => setRating(value);
  const handleReviewChange = (e) => setReview(e.target.value);

  const observer = useRef();
  const lastReviewElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchReviews();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, fetchReviews]);

  const startEditing = (reviewId) => {
    setEditingStates(prev => ({
      ...prev,
      [reviewId]: {
        isEditing: true,
        text: reviews.find(r => r.review_id === reviewId).text,
        rating: reviews.find(r => r.review_id === reviewId).rating
      }
    }));
  };

  const cancelEditing = (reviewId) => {
    setEditingStates(prev => ({
      ...prev,
      [reviewId]: { isEditing: false, text: '', rating: 0 }
    }));
  };

  const handleEditTextChange = (reviewId, newText) => {
    setEditingStates(prev => ({
      ...prev,
      [reviewId]: { ...prev[reviewId], text: newText }
    }));
  };

  const handleEditRatingChange = (reviewId, newRating) => {
    setEditingStates(prev => ({
      ...prev,
      [reviewId]: { ...prev[reviewId], rating: newRating }
    }));
  };

  const submitEdit = (reviewId) => {
    const { text, rating } = editingStates[reviewId];
    handleEditReview(reviewId, text, rating);
    cancelEditing(reviewId);
  };

  const canEditOrDelete = (reviewUser) => {
    return currentUser && currentUser.mnick === reviewUser;
  };

  console.log('Rendering reviews:', reviews);
  console.log("allStars" + allStars);
  console.log("total" + total);

  return (
    <StyledReviewSection>
      <ReviewHeader>
        <MovieReview>한 줄 리뷰</MovieReview>
        <MovieReviewCount>총 {total}건 | 평점 {total > 0 ? (allStars / total).toFixed(1) : '0'}</MovieReviewCount>
      </ReviewHeader>  

      <StarRating>
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            color={index < rating ? "#ffc107" : "#e4e5e9"}
            onClick={() => handleRating(index + 1)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </StarRating>

      <ReviewInputContainer>
        <ReviewInput 
          type="text" 
          placeholder="리뷰를 작성해주세요" 
          value={review}
          onChange={handleReviewChange}
        />
        <SubmitReview onClick={handleSubmitReview}>댓글</SubmitReview>
      </ReviewInputContainer>

      <ReviewList>
        {reviews.length > 0 ? (
          reviews.map((item, index) => (
            <ReviewItem 
              key={item.review_id || index} 
              ref={index === reviews.length - 1 ? lastReviewElementRef : null}
            >
              <ReviewAuthor>{item.mnick}</ReviewAuthor>
              <ReviewContent>{item.text}</ReviewContent>
              <ReviewRating>
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color={i < item.rating ? "#ffc107" : "#e4e5e9"} />
                ))}
              </ReviewRating>
              <ActionButtons>
                {canEditOrDelete(item.mnick) ? (
                  <>
                    <ActionButton onClick={() => startEditing(item.review_id)}><FaEdit /></ActionButton>
                    <ActionButton onClick={() => handleDeleteReview(item.review_id)}><FaTrash /></ActionButton>
                  </>
                ) : (
                  <div style={{ width: '60px' }}></div> // 빈 공간 유지
                )}
              </ActionButtons>
            </ReviewItem>
          ))
        ) : (
          <EmptyReviewMessage>
            아직 이 영화에 대한 리뷰는 존재하지 않습니다.
          </EmptyReviewMessage>
        )}
        {loading && <LoadingSpinner />}
      </ReviewList>
    </StyledReviewSection>
  );
};

export default ReviewSection;