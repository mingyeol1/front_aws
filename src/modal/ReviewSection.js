import React, { useCallback, useRef, useState, useEffect } from 'react';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import { Cookies } from 'react-cookie';
import api from '../Member/api';

import 
{ ActionButton,
  ActionButtons,
  EmptyReviewMessage,
  LoadingSpinner,
MovieReview,
  MovieReviewCount,
  ReviewAuthor,
  ReviewContent,
ReviewHeader,
ReviewInput,
ReviewInputContainer,
ReviewItem,
ReviewList,
ReviewRating,
StarRating,
StyledReviewSection, 
SubmitReview}
 from './ReviewSectionStyles';

const cookies = new Cookies();

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
  handleDeleteReview,
  userHasReviewed
}) => {

  const [currentUser, setCurrentUser] = useState(null);
  const [editingStates, setEditingStates] = useState({});

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

      {!userHasReviewed ? (
        <>

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
        </>
      ) : (
        <p>이미 이 영화에 대한 리뷰를 작성하셨습니다.</p>
      )}

      <ReviewList>
        {reviews.length > 0 ? (
          reviews.map((item, index) => (
            <ReviewItem 
              key={item.review_id || index} 
              ref={index === reviews.length - 1 ? lastReviewElementRef : null}
            >
              <ReviewAuthor>{item.mnick}</ReviewAuthor>
              {editingStates[item.review_id]?.isEditing ? (
                <>
                  <ReviewInput 
                    value={editingStates[item.review_id].text}
                    onChange={(e) => handleEditTextChange(item.review_id, e.target.value)}
                  />
                  <StarRating>
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        color={i < editingStates[item.review_id].rating ? "#ffc107" : "#e4e5e9"}
                        onClick={() => handleEditRatingChange(item.review_id, i + 1)}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </StarRating>
                  <ActionButton onClick={() => submitEdit(item.review_id)}>저장</ActionButton>
                  <ActionButton onClick={() => cancelEditing(item.review_id)}>취소</ActionButton>
                </>
              ) : (
                <>
                  <ReviewContent>{item.text}</ReviewContent>
                  <ReviewRating>
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} color={i < item.rating ? "#ffc107" : "#e4e5e9"} />
                    ))}
                  </ReviewRating>
                  <ActionButtons>
                    {canEditOrDelete(item.mnick) && (
                      <>
                        <ActionButton onClick={() => startEditing(item.review_id)}><FaEdit /></ActionButton>
                        <ActionButton onClick={() => handleDeleteReview(item.review_id)}><FaTrash /></ActionButton>
                      </>
                    )}
                  </ActionButtons>
                </>
              )}
            </ReviewItem>
          ))
        ) : (
          <EmptyReviewMessage>
            아직 이 영화에 대한 리뷰는 존재하지 않습니다.
          </EmptyReviewMessage>
        )}
      </ReviewList>
      {loading && <LoadingSpinner />}
    </StyledReviewSection>
  );
};

export default ReviewSection;