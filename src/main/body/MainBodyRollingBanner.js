import styled from "styled-components";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import MovieModal from "../../modal/MovieModal";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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

  const handleMovieClick = useCallback((movie) => {
    setSelectedMovie(movie);
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
    modules: [Autoplay, EffectCoverflow]
  }), []);

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <MainBodyRollingBannerAreaStyle>
      <RollingImgArea>
        {isLoaded && (
          <StyledSwiper {...swiperParams}>    
            {popularMovies.map((movie) => (
              <StyledSwiperSlide key={movie.id} onClick={() => handleMovieClick(movie)}>
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
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)}
          onGenreClick={handleGenreClick}
          onKeywordClick={handleKeywordClick}
          clearSearchValue={clearSearchValue}  // 이 prop을 추가
        />
      )}
    </MainBodyRollingBannerAreaStyle>
  );
}

export { MainBodyRollingBanner };
