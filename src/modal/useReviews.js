import { useCallback, useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import api from '../Member/api';

const cookies = new Cookies();

const useReviews = (movie_id, movie_title) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [allStars, setAllStars] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const getCurrentUser = async () => {
      const token = cookies.get("accessToken");
      if (token) {
        try {
          const response = await api.get('/api/auth/modify', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setCurrentUser(response.data);
          checkUserReview(response.data.mnick);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    getCurrentUser();
  }, [reviews]);

  // 사용자의 리뷰 존재 여부 확인
  const checkUserReview = (userNick) => {
    const userReview = reviews.find(review => review.mnick === userNick);
    setUserHasReviewed(!!userReview);
  };

  // 리뷰 데이터 가져오기
  const fetchReviews = useCallback(async () => {
    if (loading || !hasMore) return;
  
    setLoading(true);
    setError(null);
    try {
      const endpoint = cookies.get("accessToken")
        ? '/api/review/listOfReviewPaginated'
        : '/api/public/review/listOfReviewPaginated';
  
      const response = await api.post(endpoint, {
        movie_id: movie_id,
        page: page,
        size: 6
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': cookies.get("accessToken") ? `Bearer ${cookies.get("accessToken")}` : undefined
        }
      });
      
      console.log('Response:', response.data);
      const newReviews = (response.data.dtoList || []).map(review => ({
        review_id: review.review_id,
        text: review.review_text,
        rating: review.review_star,
        mnick: review.mnick
      }));
      
      setReviews(prevReviews => {
        const updatedReviews = [...prevReviews, ...newReviews];
        if (currentUser) {
          checkUserReview(currentUser.mnick);
        }
        return updatedReviews;
      });
      setTotal(response.data.total || 0);
      setAllStars(response.data.allStars || 0);
      setPage(prevPage => prevPage + 1);
      setHasMore(newReviews.length === 6);
    } catch (error) {
      console.error('Error fetching reviews:', error.response?.data || error.message);
      setError('Error fetching reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [movie_id, page, loading, hasMore]);

  // 영화 변경 시 리뷰 초기화
  useEffect(() => {
    setReviews([]);
    setPage(0);
    setHasMore(true);
    fetchReviews();
  }, [movie_id]);

  // 리뷰 제출
  const handleSubmitReview = async () => {
    if (!cookies.get("accessToken") || !currentUser) {
      alert("로그인 해주세요");
      return;
    }

    if (userHasReviewed) {
      alert("이미 이 영화에 대한 리뷰를 작성하셨습니다.");
      return;
    }

    if (review.trim() === '') return;

    try {
      const movieResponse = await api.post('/api/movie/register', {
        movie_id: movie_id,
        movie_title: movie_title
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get("accessToken")}`
        }
      });

      if (movieResponse.data.result === movie_id) {
        const reviewResponse = await api.post('/api/review/register', {
          movie_id: movie_id,
          review_text: review,
          review_star: rating
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.get("accessToken")}`
          }
        });

        const newReview = {
          review_id: reviewResponse.data.result,
          text: review,
          rating: rating,
          mnick: currentUser.mnick
        };
    
        setReviews(prevReviews => [newReview, ...prevReviews]);
        setUserHasReviewed(true);
        setTotal(prevTotal => prevTotal + 1);
        setAllStars(prevAllStars => prevAllStars + rating);
        setReview('');
        setRating(0);
      } else if(movieResponse.data.result === 0){
        alert("댓글이 이미 작성되어 있습니다.");
      }
      else{
        alert("영화 정보가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Error submitting review. Please try again later.');
    }
  };

  // 리뷰 수정
  const handleEditReview = async (reviewId, newText, newRating) => {
    if (!cookies.get("accessToken")) {
      alert("로그인 해주세요");
      return;
    }

    try {
      const response = await api.put('/api/review/modify', {
        review_id: reviewId,
        review_text: newText,
        review_star: newRating,
        movie_id: movie_id
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get("accessToken")}`
        }
      });

      if (response.data.result === 'success') {
        setReviews(prevReviews => 
          prevReviews.map(review => 
            review.review_id === reviewId 
              ? { ...review, text: newText, rating: newRating }
              : review
          )
        );
        const oldReview = reviews.find(review => review.review_id === reviewId);
        setAllStars(prevAllStars => prevAllStars - oldReview.rating + newRating);
      } else {
        setError('Failed to update review in the database.');
      }
    } catch (error) {
      console.error('Error editing review:', error);
      setError('Error editing review. Please try again later.');
    }
  };

  // 리뷰 삭제
  const handleDeleteReview = async (reviewId) => {
    if (!cookies.get("accessToken")) {
      alert("로그인 해주세요");
      return;
    }

    try {
      const response = await api.delete(`/api/review/${reviewId}`, {
        headers: {
          'Authorization': `Bearer ${cookies.get("accessToken")}`
        }
      });

      if (response.data.result === 'success') {
        const deletedReview = reviews.find(review => review.review_id === reviewId);
        setReviews(prevReviews => prevReviews.filter(review => review.review_id !== reviewId));
        setTotal(prevTotal => prevTotal - 1);
        setAllStars(prevAllStars => prevAllStars - deletedReview.rating);
        
        if (reviews.length <= 3) {
          fetchReviews();
        }
      } else {
        setError('Failed to delete review from the database.');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      setError('Error deleting review. Please try again later.');
    }
  };

  return { 
    rating, setRating, review, setReview, reviews, 
    handleSubmitReview, fetchReviews, loading, hasMore, 
    total, allStars, error, handleEditReview, handleDeleteReview,
    userHasReviewed, currentUser
  };
};

export default useReviews;