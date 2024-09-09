import React, { useCallback, useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import ContentSection from './ContentSection';
import TitleSection from './TitleSection';
import ReviewSection from './ReviewSection';
import YoutubeIframe from './YoutubeModal';
import useMovieDetails from './useMovieDetails';
import useTrailer from './useTrailer';

import 
{ CloseButton, LoadingOverlay, LoadingSpinner, ModalContent, ModalOverlay, MovieInfo, NoPosterImage, PosterImage }
 from './MovieModalStyles';
import useReviews from './useReviews';
import useMovieKeywords from './useMovieKeywords';


const MovieModal = ({ movie, onClose, onGenreClick, onKeywordClick, clearSearchValue }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { cast, director, genres, runtime, productionCompanies, error: detailsError } = useMovieDetails(movie.id);
  const { 
    rating, setRating, review, setReview, reviews, 
    handleSubmitReview, fetchReviews, loading, hasMore, 
    total, allStars, handleEditReview, handleDeleteReview,
    userHasReviewed
  } = useReviews(movie.id, movie.title);
  const { showTrailer, setShowTrailer, trailerId } = useTrailer(movie.id);
  const { keywords, error: keywordsError } = useMovieKeywords(movie.id);

  // 영화 상세 정보 로딩 완료 시 로딩 상태 업데이트
  useEffect(() => {
    if (cast && director && genres && runtime && productionCompanies) {
      setIsLoading(false);
    }
  }, [cast, director, genres, runtime, productionCompanies]);

  // 모달 열릴 때 스크롤 방지 및 ESC 키 이벤트 리스너 추가
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

  // 장르 클릭 핸들러
  const handleGenreClick = useCallback((genreId, genreName) => {
    if (typeof onGenreClick === 'function') {
      onGenreClick(genreId, genreName);
    }
    if (typeof clearSearchValue === 'function') {
      clearSearchValue();
    }
    onClose();
  }, [onGenreClick, clearSearchValue, onClose]);

  // 키워드 클릭 핸들러
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
        ) : detailsError ? (
          <p>{detailsError}</p>
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
                userHasReviewed={userHasReviewed}
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