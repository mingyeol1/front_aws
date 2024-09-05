import styled from "styled-components";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useEffect, useState } from "react";
import MovieModal from "../../modal/MovieModal";
import { Cookies } from 'react-cookie';
import api, { setAuthToken } from "../../Member/api";
import { useNavigate } from "react-router-dom";

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

// API base URL for images
const baseImageUrl = 'https://image.tmdb.org/t/p/w500';

// API Key
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// Access Token Auth
const cookies = new Cookies();

const getAuthHeaders = () => {
  return {
    accept: 'application/json',
    Authorization: `Bearer ${cookies.get("accessToken")}`
  };
};

// Function to fetch movie data
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

  //현재 상영작 20
  const [row1, setRow1] = useState([]);
  //개봉 예정작 20
  const [row2, setRow2] = useState([]);
  //인기영화 20
  const [row3, setRow3] = useState([]);
  //최고 평점 20
  const [row4, setRow4] = useState([]);

  useEffect(() => {
    //현재 상영작 20
    fetchMovies({
      method: 'GET',
      url: 'https://api.themoviedb.org/3/movie/now_playing',
      params: { api_key: API_KEY, language: 'ko', page: '1' },
      headers: getAuthHeaders()
    }, (data) => {
      setRow1(data);
    });
  
    //개봉 예정작 20
    fetchMovies({
      method: 'GET',
      url: 'https://api.themoviedb.org/3/movie/upcoming',
      params: { api_key: API_KEY, language: 'ko', page: '1' },
      headers: getAuthHeaders()
    }, (data) => {
      setRow2(data);
    });
  
    //인기영화 20
    fetchMovies({
      method: 'GET',
      url: 'https://api.themoviedb.org/3/movie/popular',
      params: { api_key: API_KEY, language: 'ko', page: '1' },
      headers: getAuthHeaders()
    }, (data) => {
      setRow3(data);
    });
  
    //최고평점 20
    fetchMovies({
      method: 'GET',
      url: 'https://api.themoviedb.org/3/movie/top_rated',
      params: { api_key: API_KEY, language: 'ko', page: '1' },
      headers: getAuthHeaders()
    }, (data) => {
      setRow4(data);
    });
  }, []);

  const handleGenreClick = useCallback((genreId, genreName) => {
    setSelectedMovie(null);
    navigate(`/search?genre=${genreId}`, { state: { genreName } });
  }, [navigate]);

  const handleKeywordClick = useCallback((keyword) => {
    setSelectedMovie(null);
    navigate(`/search?keyword=${keyword}`);
  }, [navigate]);

  return (
    <MainBodyMovieListSectionStyle>
      <SectionTitle>현재 상영작 20</SectionTitle>
      <MovieListSwiper
        slidesPerView="auto"
        spaceBetween={20}
        freeMode={true}
        modules={[FreeMode]}
      >
        {Array.isArray(row1) && row1.length > 0
          ? row1.map((movie, index) => (
            <MovieListSwiperSlide key={index} onClick={() => setSelectedMovie(movie)}>
              {movie.poster_path ? (
                <SectionImg 
                  src={`${baseImageUrl}${movie.poster_path}`}
                  alt={movie.title || `Now Playing 20 Movie ${index + 1}`}
                />
              ) : (
                <NoPosterImage src='img/NoPosterImage.jpg' alt="No Poster Available" />
              )}
            </MovieListSwiperSlide>
          ))
          : null}
      </MovieListSwiper>

      <SectionTitle>개봉 예정작 20</SectionTitle>
      <MovieListSwiper
        slidesPerView="auto"
        spaceBetween={20}
        freeMode={true}
        modules={[FreeMode]}
      >
        {Array.isArray(row2) && row2.length > 0
          ? row2.map((movie, index) => (
            <MovieListSwiperSlide key={index} onClick={() => setSelectedMovie(movie)}>
              {movie.poster_path ? (
                <SectionImg 
                  src={`${baseImageUrl}${movie.poster_path}`}
                  alt={movie.title || `Upcoming 20 Movie ${index + 1}`}
                />
              ) : (
                <NoPosterImage src='img/NoPosterImage.jpg' alt="No Poster Available" />
              )}
            </MovieListSwiperSlide>
          ))
          : null}
      </MovieListSwiper>

      <SectionTitle>인기영화 20</SectionTitle>
      <MovieListSwiper
        slidesPerView="auto"
        spaceBetween={20}
        freeMode={true}
        modules={[FreeMode]}
      >
        {Array.isArray(row3) && row3.length > 0
          ? row3.map((movie, index) => (
            <MovieListSwiperSlide key={index} onClick={() => setSelectedMovie(movie)}>
              {movie.poster_path ? (
                <SectionImg 
                  src={`${baseImageUrl}${movie.poster_path}`}
                  alt={movie.title || `Popular Movie 20 ${index + 1}`}
                />
              ) : (
                <NoPosterImage src='img/NoPosterImage.jpg' alt="No Poster Available" />
              )}
            </MovieListSwiperSlide>
          ))
          : null}
      </MovieListSwiper>

      <SectionTitle>최고평점 20</SectionTitle>
      <MovieListSwiper
        slidesPerView="auto"
        spaceBetween={20}
        freeMode={true}
        modules={[FreeMode]}
      >
        {Array.isArray(row4) && row4.length > 0
          ? row4.map((movie, index) => (
            <MovieListSwiperSlide key={index} onClick={() => setSelectedMovie(movie)}>
              {movie.poster_path ? (
                <SectionImg 
                  src={`${baseImageUrl}${movie.poster_path}`}
                  alt={movie.title || `Top Rated 20 Movie ${index + 1}`}
                />
              ) : (
                <NoPosterImage src='img/NoPosterImage.jpg' alt="No Poster Available" />
              )}
            </MovieListSwiperSlide>
          ))
          : null}
      </MovieListSwiper>

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