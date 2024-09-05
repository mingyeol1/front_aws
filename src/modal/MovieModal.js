import React, { useCallback, useEffect, useState } from 'react';
import styled, { css, keyframes } from "styled-components";
import { FaTimes } from 'react-icons/fa';
import YoutubeIframe from './YoutubeModal';
import useMovieDetails from './useMovieDetails';
import useReviews from './useReviews';
import useTrailer from './useTrailer';
import ContentSection from './ContentSection';
import TitleSection from './TitleSection';
import api from './api';
import ReviewSection from './ReviewSection';

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
  ${scrollbarStyle}
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
  ${scrollbarStyle}
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 95%;
    height: 95%;
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

const PosterImage = styled.img`
  width: auto;
  height: auto;
  margin-right: 20px;
  border-radius: 20px;
`;

const MovieInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  max-height: 100%;
`;

const NoPosterImage = styled.div`
  width: auto;
  height: auto;
  min-width: 510px;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #666;
  border: 1px solid #ddd;
  margin-right: 20px;
  border-radius: 20px;
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
  width: 50px;
  height: 50px;
  animation: ${rotate} 1s linear infinite;
  margin: auto;
`;

const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const MovieModal = ({ movie, onClose, onGenreClick, onKeywordClick, clearSearchValue }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { cast, director, genres, runtime, productionCompanies, error } = useMovieDetails(movie.id);
  const { 
    rating, setRating, review, setReview, reviews, 
    handleSubmitReview, fetchReviews, loading, hasMore, 
    total, allStars, handleEditReview, handleDeleteReview 
  } = useReviews(movie.id, movie.title);
  const { showTrailer, setShowTrailer, trailerId } = useTrailer(movie.id);
  const [keywords, setKeywords] = useState([]);
  const [keywordsError, setKeywordsError] = useState(null);

  useEffect(() => {
    if (cast && director && genres && runtime && productionCompanies) {
      setIsLoading(false);
    }
  }, [cast, director, genres, runtime, productionCompanies]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
        const response = await api.get(`https://api.themoviedb.org/3/movie/${movie.id}/keywords`,{
          params: {
            api_key: `${API_KEY}`,
          }
        });
        setKeywords(response.data.keywords);
        setKeywordsError(null);  // 성공 시 에러를 null로 설정
      } catch (error) {
        console.error("Error fetching keywords:", error);
        setKeywordsError("키워드를 불러오는 데 실패했습니다.");  // 에러 메시지 설정
      }
    };
  
    fetchKeywords();
  }, [movie.id]);

  const handleGenreClick = useCallback((genreId, genreName) => {
    if (typeof onGenreClick === 'function') {
      onGenreClick(genreId, genreName);
    }
    if (typeof clearSearchValue === 'function') {
      clearSearchValue();
    }
    onClose();
  }, [onGenreClick, clearSearchValue, onClose]);

  const handleKeywordClick = useCallback((keyword) => {
    if (typeof onKeywordClick === 'function') {
      onKeywordClick(keyword);
    }
    if (typeof clearSearchValue === 'function') {
      clearSearchValue();
    }
    onClose();
  }, [onKeywordClick, clearSearchValue, onClose]);

  if (!movie) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        {isLoading ? (
          <LoadingOverlay>
            <LoadingSpinner />
          </LoadingOverlay>
        ) : error ? (
          <p>{error}</p>
        ) : keywordsError ? (
          <p>{keywordsError}</p>
        ) : (
          <>
            {movie.poster_path ? (
              <PosterImage src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            ) : (
              <NoPosterImage>
                <div>No</div>
                <div>Poster</div>
                <div>Image</div>
              </NoPosterImage>
            )}
            <MovieInfo>
              <TitleSection title={movie.title} />
              <ContentSection 
                movie={movie}
                director={director}
                runtime={runtime}
                genres={genres}
                cast={cast}
                productionCompanies={productionCompanies}
                trailerId={trailerId}
                setShowTrailer={setShowTrailer}
                onKeywordClick={handleKeywordClick}
                onGenreClick={handleGenreClick}
                keywords={keywords}
                setKeywords={setKeywords}
                clearSearchValue={clearSearchValue}
              />
             <ReviewSection 
                reviews={reviews}
                rating={rating}
                setRating={setRating}
                review={review}
                setReview={setReview}
                handleSubmitReview={handleSubmitReview}
                fetchReviews={fetchReviews}
                loading={loading}
                hasMore={hasMore}
                total={total}
                allStars={allStars}
                handleEditReview={handleEditReview}
                handleDeleteReview={handleDeleteReview}
              />
            </MovieInfo>
            </>
        )}
      </ModalContent>

      {showTrailer && trailerId && (
        <YoutubeIframe videoId={trailerId} onClose={() => setShowTrailer(false)} />
      )}
    </ModalOverlay>
  );
};

export default MovieModal;