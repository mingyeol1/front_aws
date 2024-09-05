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
  const [currentUser, setCurrentUser] = useState(null); // currentUser 상태 추가
  const [error, setError] = useState(null);

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
          setCurrentUser(response.data); // 현재 사용자 정보를 상태로 설정
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchCurrentUser();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  const fetchReviews = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);  // Reset error state before new request
    try {
      const requestData = {
        "movie_id": movie_id,
        "page": page,
        "size": 6
      };
      console.log('Request data:', requestData);

      const response = await api.post('/api/review/listOfReviewPaginated', requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get("accessToken")}`
        }
      });

      console.log('Server response:', response);
      const newReviews = (response.data.dtoList || []).map(review => ({
        review_id: review.review_id,
        text: review.review_text,
        rating: review.review_star,
        mnick: review.mnick  // 리뷰의 작성자 닉네임 사용
      }));

      setTotal(response.data.total || 0);
      setAllStars(response.data.allStars || 0);
      setReviews(prevReviews => [...prevReviews, ...newReviews]);

      console.log('Fetched reviews:', newReviews);
      console.log('setAllStars', allStars);

      setPage(prevPage => prevPage + 1);
      setHasMore(newReviews.length === 6);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      console.error('Error response:', error.response);  // Log the full error response
      setError('Error fetching reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [movie_id, page, loading, hasMore]);

  useEffect(() => {
    setReviews([]); // 영화가 변경될 때 리뷰 목록 초기화
    setPage(0);
    setHasMore(true);
    fetchReviews();
  }, [movie_id]);

  const handleSubmitReview = async () => {
    //로그인되기 전이면
    if(cookies.get("accessToken") !== undefined && currentUser){
      if (review.trim() !== '') {
        setReviews([...reviews, { text: review, rating, mnick: currentUser.mnick }]);  // 사용자 닉네임 저장
        setReview('');
        setRating(0);

        try {
          const movieResponse = await api.post('/api/movie/register', {
            "movie_id": movie_id,
            "movie_title": movie_title
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${cookies.get("accessToken")}`
            }
          });

          if (movieResponse.data.result === movie_id) {
            await api.post('/api/review/register', {
              "movie_id": movie_id,
              "review_text": review,
              "review_star": rating
            }, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.get("accessToken")}`
              }
            });
          } else {
            alert("영화 정보가 일치하지 않습니다.");
          }
        } catch (error) {
          console.error('Error submitting review:', error);
          setError('Error submitting review. Please try again later.');
        }
      }
    }else{
      alert("login 해주세요");
    }
  };

  const handleEditReview = async (reviewId, newText, newRating) => {
    if(cookies.get("accessToken") !== undefined){
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
          // 전체 별점 업데이트
          setAllStars(prevAllStars => prevAllStars - review.rating + newRating);
        } else {
          setError('Failed to update review in the database.');
        }
      } catch (error) {
        console.error('Error editing review:', error);
        setError('Error editing review. Please try again later.');
      }
    } else {
      alert("로그인 해주세요");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if(cookies.get("accessToken") !== undefined){
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
          // 전체 별점 업데이트
          setAllStars(prevAllStars => prevAllStars - deletedReview.rating);
        } else {
          setError('Failed to delete review from the database.');
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        setError('Error deleting review. Please try again later.');
      }
    } else {
      alert("로그인 해주세요");
    }
  };

  return { 
    rating, setRating, review, setReview, reviews, 
    handleSubmitReview, fetchReviews, loading, hasMore, 
    total, allStars, error, handleEditReview, handleDeleteReview 
  };
};

export default useReviews;
