import styled, { keyframes } from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { MainBody } from '../Main';
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import MovieModal from "../../modal/MovieModal";
import axios from "axios";
import { debounce } from 'lodash';

// 스타일 정의 (변경 없음)
const SearchResultListAreaStyle = styled.div`
  width: 100%;
  margin-top: 40px;
`;

const SectionTitle = styled.h1`
  margin-left: 3em;
  margin-bottom: 15px;
  height: 60px;
  display: flex;
  align-items: center;
`;

const SearchResultListArea = styled.ul`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
  justify-content: center;
  margin-left: 3em;
  margin-right: 3em;
`;

const SearchResultListImgLi = styled.li`
  text-align: center;
  margin: 5px;
  width: 167px;
  height: 250px;
`;

const SearchResultListImg = styled.img`
  height: 250px;
  width: 167px;
  cursor: pointer;
`;

const NoPosterImage = styled.img`
  height: 250px;
  width: 167px;
  cursor: pointer;
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: ${rotate} 1s linear infinite;
  margin: 20px auto;
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.2em;
  margin-top: 20px;
`;

const LoadingEndMessage = styled.div`  // p를 div로 변경
  text-align: center;
  font-size: 1.2em;
  margin-top: 20px;
`;

// 이미지 베이스 URL
const baseImageUrl = 'https://image.tmdb.org/t/p/w500';

// 환경 변수를 통한 API 키
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

function SearchResultList({ clearSearchValue }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParam = searchParams.get('searchParam');
  const genreId = searchParams.get('genre');
  const genreName = location.state?.genreName;
  const [results, setResults] = useState([]);
  const keyword = searchParams.get('keyword');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const fetchMovies = useCallback(async (newSearch = false) => {
    if (loading || (!hasMore && !newSearch)) return;
    setLoading(true);

    console.log("Fetching movies...", { searchParam, genreId, keyword, page: newSearch ? 1 : page, newSearch });

    const startTime = Date.now();
    
    let url = '';
    let params = {};

    if (searchParam) {
      url = 'https://api.themoviedb.org/3/search/movie';
      params = { api_key: API_KEY, language: 'ko', include_adult: 'false', query: searchParam, page: newSearch ? 1 : page };
    } else if (genreId) {
      url = 'https://api.themoviedb.org/3/discover/movie';
      params = { api_key: API_KEY, language: 'ko', include_adult: 'false', with_genres: genreId, page: newSearch ? 1 : page };
    } else if (keyword) {
      try {
        const keywordResponse = await axios.get('https://api.themoviedb.org/3/search/keyword', {
          params: { query: keyword, api_key: API_KEY }
        });
        const keywordId = keywordResponse.data.results[0]?.id;
        if (keywordId) {
          url = 'https://api.themoviedb.org/3/discover/movie';
          params = { api_key: API_KEY, with_keywords: keywordId, page: newSearch ? 1 : page };
        } else {
          setLoading(false);
          setHasMore(false);
          return;
        }
      } catch (error) {
        console.error("Error fetching keyword ID:", error);
        setLoading(false);
        setHasMore(false);
        return;
      }
    }

    if (url) {
      try {
        const response = await axios.get(url, { params });
        console.log('API Response:', response.data);
        const newMovies = response.data.results;

        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < 1000) {
          await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
        }

        setResults(prevResults => newSearch ? newMovies : [...prevResults, ...newMovies]);
        setPage(prevPage => newSearch ? 2 : prevPage + 1);
        setHasMore(newMovies.length === 20);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setHasMore(false);
      }
    } else {
      console.log("No valid URL for API request");
    }

    setLoading(false);
    setIsAtBottom(false);
  }, [searchParam, genreId, keyword, loading, hasMore]); // page 제거됨

  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
    
    const fetchInitialMovies = async () => {
      if (loading) return;
      setLoading(true);

      console.log("Fetching initial movies...", { searchParam, genreId, keyword });

      const startTime = Date.now();
      
      let url = '';
      let params = {};

      if (searchParam) {
        url = 'https://api.themoviedb.org/3/search/movie';
        params = { api_key: API_KEY, language: 'ko', include_adult: 'false', query: searchParam, page: 1 };
      } else if (genreId) {
        url = 'https://api.themoviedb.org/3/discover/movie';
        params = { api_key: API_KEY, language: 'ko', include_adult: 'false', with_genres: genreId, page: 1 };
      } else if (keyword) {
        try {
          const keywordResponse = await axios.get('https://api.themoviedb.org/3/search/keyword', {
            params: { query: keyword, api_key: API_KEY }
          });
          const keywordId = keywordResponse.data.results[0]?.id;
          if (keywordId) {
            url = 'https://api.themoviedb.org/3/discover/movie';
            params = { api_key: API_KEY, with_keywords: keywordId, page: 1 };
          } else {
            setLoading(false);
            setHasMore(false);
            return;
          }
        } catch (error) {
          console.error("Error fetching keyword ID:", error);
          setLoading(false);
          setHasMore(false);
          return;
        }
      }

      if (url) {
        try {
          const response = await axios.get(url, { params });
          console.log('API Response:', response.data);
          const newMovies = response.data.results;

          const elapsedTime = Date.now() - startTime;
          if (elapsedTime < 1000) {
            await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
          }

          setResults(newMovies);
          setPage(2);
          setHasMore(newMovies.length === 20);
        } catch (error) {
          console.error("Error fetching movies:", error);
          setHasMore(false);
        }
      } else {
        console.log("No valid URL for API request");
      }

      setLoading(false);
    };

    fetchInitialMovies();
  }, [searchParam, genreId, keyword]);

  useEffect(() => {
    const handleScroll = debounce(() => {
      const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
      const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;
      const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

      if (scrolledToBottom) {
        setIsAtBottom(true);
      }
    }, 200);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel();
    };
  }, []);

  useEffect(() => {
    if (isAtBottom && !loading && hasMore && results.length > 0) {
      fetchMovies(false);
    }
  }, [isAtBottom, loading, hasMore, fetchMovies, results.length]);

  const handleGenreClick = useCallback((newGenreId, newGenreName) => {
    setSelectedMovie(null);
    clearSearchValue();
    navigate(`/search?genre=${newGenreId}`, { state: { genreName: newGenreName } });
  }, [clearSearchValue, navigate]);

  const handleKeywordClick = useCallback((keyword) => {
    setSelectedMovie(null);
    clearSearchValue();
    navigate(`/search?keyword=${keyword}`);
  }, [clearSearchValue, navigate]);

  useEffect(() => {
    setSelectedMovie(null);
  }, [searchParam, genreId, keyword]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchParam, genreId, keyword]);

  return (
    <MainBody>
      <SearchResultListAreaStyle>
        <SectionTitle>
          {searchParam 
            ? `타이틀 #${searchParam} 로 검색하신 결과입니다.` 
            : genreName 
            ? `장르 #${genreName} 로 검색하신 결과입니다.`
            : keyword
            ? `키워드 #${keyword} 로 검색하신 결과입니다.`
            : '검색 결과'}
        </SectionTitle>
        <SearchResultListArea>
          {results.map((movie, index) => (
            <SearchResultListImgLi key={`${movie.id}-${index}`} onClick={() => setSelectedMovie(movie)}>
              {movie.poster_path ? (
                <SearchResultListImg 
                  src={`${baseImageUrl}${movie.poster_path}`}
                  alt={movie.title || `Search Results Movie ${index + 1}`}
                />
              ) : (
                <NoPosterImage src='img/NoPosterImage.jpg' alt="NoPosterImage" />
              )}
            </SearchResultListImgLi>
          ))}
        </SearchResultListArea>
        {loading && (
          <>
            <LoadingSpinner />
            <LoadingMessage>추가 결과를 로딩 중입니다...</LoadingMessage>
          </>
        )}
        <LoadingEndMessage>
          {!loading && !hasMore && results.length > 0 && "모든 결과를 불러왔습니다."}
          {!loading && results.length === 0 && "검색 결과가 없습니다."}
        </LoadingEndMessage>
      </SearchResultListAreaStyle>
      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)}
          onGenreClick={handleGenreClick}
          onKeywordClick={handleKeywordClick}
          clearSearchValue={clearSearchValue}
        />
      )}
    </MainBody>
  );
}

export default SearchResultList;