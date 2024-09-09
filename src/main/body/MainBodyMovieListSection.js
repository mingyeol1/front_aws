import React, { useCallback, useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from 'swiper/modules';
import { Cookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import api from "../../Member/api";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import styled from "styled-components";
import MovieModal from "../../modal/MovieModal";

// Style definitions
const MainBodyMovieListSectionStyle = styled.div`
  width: 100%;
  margin-top: 40px;
`;

const SectionTitle = styled.h1`
  margin-left: 3em;
  margin-top: 1em;
  margin-bottom: 15px;
  height: 60px;
  display: flex;
  align-items: center;
`;

const MovieListSwiper = styled(Swiper)`
  width: 90%;
  cursor: pointer;
  .swiper-slide {
    width: auto;
    height: auto;
  }
  .swiper-scrollbar {
    display: none;
  }
`;

const MovieListSwiperSlide = styled(SwiperSlide)`
  width: auto !important;
`;

const SectionImg = styled.img`
  height: 250px;
  width: auto;
`;

const NoPosterImage = styled.img`
  height: 250px;
  width: 167px;
  cursor: pointer;
`;

const SwiperContainer = styled.div`
  position: relative;
  width: 90%;
  margin: 0 auto;
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  cursor: pointer;
  z-index: 10;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  padding: 0;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  &.swiper-button-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrevButton = styled(NavigationButton)`
  left: 10px;
`;

const NextButton = styled(NavigationButton)`
  right: 10px;
`;

const baseImageUrl = 'https://image.tmdb.org/t/p/w500';
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const cookies = new Cookies();

const getAuthHeaders = () => {
  return {
    accept: 'application/json',
    Authorization: `Bearer ${cookies.get("accessToken")}`
  };
};

const fetchMovies = async (options, setData) => {
  try {
    const response = await api.request(options);
    setData(response.data.results);
  } catch (error) {
    console.error(error);
  }
};

function MainBodyMovieListSection() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();
  const [row1, setRow1] = useState([]);
  const [row2, setRow2] = useState([]);
  const [row3, setRow3] = useState([]);
  const [row4, setRow4] = useState([]);
  const swiperRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    fetchMovies({
      method: 'GET',
      url: 'https://api.themoviedb.org/3/movie/now_playing',
      params: { api_key: API_KEY, language: 'ko', page: '1' },
      headers: getAuthHeaders()
    }, setRow1);

    fetchMovies({
      method: 'GET',
      url: 'https://api.themoviedb.org/3/movie/upcoming',
      params: { api_key: API_KEY, language: 'ko', page: '1' },
      headers: getAuthHeaders()
    }, setRow2);

    fetchMovies({
      method: 'GET',
      url: 'https://api.themoviedb.org/3/movie/popular',
      params: { api_key: API_KEY, language: 'ko', page: '1' },
      headers: getAuthHeaders()
    }, setRow3);

    fetchMovies({
      method: 'GET',
      url: 'https://api.themoviedb.org/3/movie/top_rated',
      params: { api_key: API_KEY, language: 'ko', page: '1' },
      headers: getAuthHeaders()
    }, setRow4);
  }, []);

  const handleGenreClick = useCallback((genreId, genreName) => {
    setSelectedMovie(null);
    navigate(`/search?genre=${genreId}`, { state: { genreName } });
  }, [navigate]);

  const handleKeywordClick = useCallback((keyword) => {
    setSelectedMovie(null);
    navigate(`/search?keyword=${keyword}`);
  }, [navigate]);

  const handlePrev = (index) => {
    if (swiperRefs[index].current && swiperRefs[index].current.swiper) {
      swiperRefs[index].current.swiper.slidePrev();
    }
  };

  const handleNext = (index) => {
    if (swiperRefs[index].current && swiperRefs[index].current.swiper) {
      swiperRefs[index].current.swiper.slideNext();
    }
  };

  const renderMovieList = (movies, title, index) => (
    <>
      <SectionTitle>{title}</SectionTitle>
      <SwiperContainer>
        <PrevButton onClick={() => handlePrev(index)}>◀️</PrevButton>
        <MovieListSwiper
          ref={swiperRefs[index]}
          slidesPerView="auto"
          spaceBetween={20}
          freeMode={true}
          navigation={{
            prevEl: `.swiper-button-prev-${index}`,
            nextEl: `.swiper-button-next-${index}`,
          }}
          modules={[FreeMode, Navigation]}
        >
          {Array.isArray(movies) && movies.length > 0
            ? movies.map((movie, movieIndex) => (
              <MovieListSwiperSlide key={movieIndex} onClick={() => setSelectedMovie(movie)}>
                {movie.poster_path ? (
                  <SectionImg 
                    src={`${baseImageUrl}${movie.poster_path}`}
                    alt={movie.title || `Movie ${movieIndex + 1}`}
                  />
                ) : (
                  <NoPosterImage src='img/NoPosterImage.jpg' alt="No Poster Available" />
                )}
              </MovieListSwiperSlide>
            ))
            : null}
        </MovieListSwiper>
        <NextButton onClick={() => handleNext(index)}>▶️</NextButton>
      </SwiperContainer>
    </>
  );

  return (
    <MainBodyMovieListSectionStyle>
      {renderMovieList(row1, "현재 상영작 20", 0)}
      {renderMovieList(row2, "개봉 예정작 20", 1)}
      {renderMovieList(row3, "인기영화 20", 2)}
      {renderMovieList(row4, "최고평점 20", 3)}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)}
          onGenreClick={handleGenreClick}
          onKeywordClick={handleKeywordClick}
        />
      )}
    </MainBodyMovieListSectionStyle>
  );
}

export { MainBodyMovieListSection };