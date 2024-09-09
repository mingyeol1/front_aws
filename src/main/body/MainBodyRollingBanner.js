import styled from "styled-components";
import "swiper/css";
import "swiper/css/effect-coverflow";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import MovieModal from "../../modal/MovieModal";

const MainBodyRollingBannerAreaStyle = styled.div`
  height: 60vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const RollingImgArea = styled.div`
  width: 100%;
  height: 100%;
`;

const StyledSwiper = styled(Swiper)`
  width: 100%;
  height: 100%;
  .swiper-slide {
    transition: all 0.5s ease;
    opacity: 0.4;
    filter: brightness(50%) blur(3px);
  }

  .swiper-slide-active {
    opacity: 1;
    filter: brightness(100%) blur(0);
    z-index: 2;
  }

  .swiper-slide-prev,
  .swiper-slide-next {
    opacity: 0.7;
    filter: brightness(70%) blur(2px);
    z-index: 1;
  }
`;

const StyledSwiperSlide = styled(SwiperSlide)`
  text-align: center;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
`;

const SlideImage = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: ${props => (props.src ? `url(${props.src})` : "none")};
  transition: all 0.5s ease;
`;

const MovieTitle = styled.div`
  position: absolute;
  bottom: 30px;
  left: 40px;
  color: white;
  font-size: 48px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 
    3px 3px 0 #000,
    -1px -1px 0 #000,  
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000;
  transform: perspective(500px);
  transition: all 0.3s ease;

  &:hover {
    transform: perspective(500px) rotateX(0deg) scale(1.05);
    text-shadow: 
      4px 4px 0 #000,
      -1px -1px 0 #000,  
      1px -1px 0 #000,
      -1px 1px 0 #000,
      1px 1px 0 #000;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  font-size: 18px;
  padding: 20px;
`;

const baseImageUrl = 'https://image.tmdb.org/t/p/original';
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

function MainBodyRollingBanner({ clearSearchValue = () => {}, onKeywordClick = () => {} }) {
  const [popularMovies, setPopularMovies] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  const fetchPopularMovies = useCallback(async () => {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
        params: { language: 'ko', page: '1', api_key: API_KEY },
      });

      const moviesWithBackdrops = response.data.results.filter(movie => movie.backdrop_path);
      setPopularMovies(moviesWithBackdrops.slice(0, 10));
      setIsLoaded(true);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      setError("영화 데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }, []);

  useEffect(() => {
    fetchPopularMovies();
  }, [fetchPopularMovies]);

  const handleGenreClick = useCallback((newGenreId, newGenreName) => {
    setSelectedMovie(null);
    clearSearchValue();
    navigate(`/search?genre=${newGenreId}`, { state: { genreName: newGenreName } });
  }, [clearSearchValue, navigate]);

  const handleKeywordClick = useCallback((keyword) => {
    setSelectedMovie(null);
    clearSearchValue();
    navigate(`/search?keyword=${keyword}`);  // 이 부분을 수정
  }, [clearSearchValue, navigate]);

  const handleSlideClick = useCallback((index) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;
      if (index === activeIndex) {
        // 클릭한 슬라이드가 현재 활성(중앙) 슬라이드인 경우
        const movie = popularMovies[index];
        setSelectedMovie(movie);
        setIsModalOpen(true);
        swiper.autoplay.stop();  // 모달이 열릴 때 자동 재생 중지
      } else {
        // 클릭한 슬라이드가 중앙이 아닌 경우
        swiper.slideToLoop(index, 500);
      }
    }
  }, [activeIndex, popularMovies]);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
    setIsModalOpen(false);
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.autoplay.start();  // 모달이 닫힐 때 자동 재생 재개
    }
  }, []);

  const swiperParams = useMemo(() => ({
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 1.5,
    coverflowEffect: {
      rotate: 0,
      stretch: 100,
      depth: 200,
      modifier: 1.5,
      slideShadows: false,
    },
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    speed: 1000,
    modules: [Autoplay, EffectCoverflow],
    onSlideChange: (swiper) => {
      setActiveIndex(swiper.realIndex);
      if (!isModalOpen) {
        setSelectedMovie(null);  // 모달이 열려있지 않을 때만 선택된 영화 초기화
      }
    },
  }), [isModalOpen]);

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <MainBodyRollingBannerAreaStyle>
      <RollingImgArea>
        {isLoaded && (
          <StyledSwiper {...swiperParams} ref={swiperRef}>    
            {popularMovies.map((movie, index) => (
              <StyledSwiperSlide 
                key={movie.id} 
                onClick={() => handleSlideClick(index)}
              >
                <SlideImage 
                  src={`${baseImageUrl}${movie.backdrop_path}`}
                  alt={`영화 ${movie.title}의 배경 이미지`}
                  aria-label={`영화 ${movie.title} 선택`}
                />
                <MovieTitle>{movie.title}</MovieTitle>
              </StyledSwiperSlide>
            ))}
          </StyledSwiper>
        )}
      </RollingImgArea>
      {isModalOpen && selectedMovie && (
        <MovieModal
          movie={selectedMovie} 
          onClose={handleCloseModal}
          onGenreClick={handleGenreClick}
          onKeywordClick={handleKeywordClick}
          clearSearchValue={clearSearchValue}
        />
      )}
    </MainBodyRollingBannerAreaStyle>
  );
}

export { MainBodyRollingBanner };