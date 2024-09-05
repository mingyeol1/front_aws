import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { FaPlay } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


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

const Wrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 20px 20px;
  ${scrollbarStyle}
`;

const MovieDetailsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 20px;
  margin-bottom: 10px;
`;

const MovieDetailsColumn = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 5px 10px;
  align-items: start;
`;

const MovieDetailsLabel = styled.span`
  font-weight: bold;
  white-space: nowrap;
`;

const MovieDetailsContent = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CompanyList = styled.div`
  display: flex;
  flex-direction: column;
`;

const CompanyItem = styled.span`
  &:not(:first-child) {
    padding-left: 0;
    margin-left: 0;
  }
`;

const GenreList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  cursor: pointer;
`;

const GenreItem = styled.li`
  background-color: #e50914;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
`;

const MovieDescriptionContainer = styled.div`
  position: relative;
  margin-bottom: 10px;
`;

const MovieDescriptionContent = styled.p`
  margin-bottom: 10px;
  padding: 10px 0;
  font-size: 15px;
`;

const MoreButton = styled.span`
  color: #e50914;
  cursor: pointer;
  font-size: 14px;
  display: inline-block;
   margin-left: 5px;
`;

const TrailerButton = styled.button`
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-bottom: 10px;
  width: fit-content;
`;

const CastList = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 5px;
  ${scrollbarStyle}
`;

const CastItem = styled.div`
  text-align: center;
  width: 80px;
`;

const CastImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
`;

const KeywordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
  align-items: center;
  margin-bottom: 10px;
`;

const KeywordItem = styled.span`
  background-color: transparent;
  color: white;
  padding: 0;
  font-size: 14px;
  cursor: pointer;
  font-weight: bolder;

  &:hover {
    text-decoration: underline;
  }
`;

const ContentSection = ({ 
  movie, 
  director, 
  runtime, 
  genres, 
  cast, 
  productionCompanies, 
  trailerId, 
  setShowTrailer,
  onKeywordClick,
  onGenreClick,
  clearSearchValue
}) => {
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_KEY = process.env.REACT_APP_TMDB_API_KEY; // API 키를 환경 변수로 관리하는 것이 좋습니다

  const truncateOverview = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength);
  };

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
        console.log('Fetching keywords for movie ID:', movie.id);
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/keywords`, {
          params: {
            api_key: `${API_KEY}`,
          }
        });
        console.log('Keywords response:', response.data);
        setKeywords(response.data.keywords);
        setError(null);
      } catch (error) {
        console.error("Error fetching keywords:", error);
        setError("키워드를 불러오는 데 실패했습니다.");
      }
    };
  
    fetchKeywords();
  }, [movie.id]);

  const handleGenreClick = (genreId, genreName) => {
    if (typeof onGenreClick === 'function') {
      onGenreClick(genreId, genreName);
    }
    if (typeof clearSearchValue === 'function') {
      clearSearchValue();
    }
  };

  const handleKeywordClick = (keyword) => {
    if (typeof onKeywordClick === 'function') {
      onKeywordClick(keyword);
    }
    if (typeof clearSearchValue === 'function') {
      clearSearchValue();
    }
  };

  return (
    <Wrapper>
      <MovieDetailsContainer>
        <MovieDetailsColumn>
            <MovieDetailsLabel>개봉일:</MovieDetailsLabel>
            <MovieDetailsContent>{movie.release_date}</MovieDetailsContent>
            <MovieDetailsLabel>평점:</MovieDetailsLabel>
            <MovieDetailsContent>{Number(movie.vote_average).toFixed(1)}</MovieDetailsContent>
            <MovieDetailsLabel>러닝타임:</MovieDetailsLabel>
            <MovieDetailsContent>{runtime}분</MovieDetailsContent>
        </MovieDetailsColumn>
        <MovieDetailsColumn>
            <MovieDetailsLabel>감독:</MovieDetailsLabel>
            <MovieDetailsContent>{director}</MovieDetailsContent>
            <MovieDetailsLabel>제작사:</MovieDetailsLabel>
            <CompanyList>
            {productionCompanies.slice(0, 2).map((company, index) => (
                <CompanyItem key={company.id}>
                {index === 0 ? company.name + ',' : company.name}
                </CompanyItem>
            ))}
            </CompanyList>
        </MovieDetailsColumn>
      </MovieDetailsContainer>

      <GenreList>
        장르 :
        {genres && genres.map(genre => (
          <GenreItem 
            key={genre.id}
            onClick={() => handleGenreClick(genre.id, genre.name)}
          >
            {genre.name}
          </GenreItem>
        ))}
      </GenreList>

      <MovieDescriptionContainer>
        <MovieDescriptionContent>
          {showFullOverview ? movie.overview : truncateOverview(movie.overview, 400)}
          {movie.overview.length > 400 && (
            <MoreButton onClick={() => setShowFullOverview(!showFullOverview)}>
              {showFullOverview ? '접기' : '더보기'}
            </MoreButton>
          )}
        </MovieDescriptionContent>
      </MovieDescriptionContainer>

      {trailerId && (
        <TrailerButton onClick={() => setShowTrailer(true)}>
          <FaPlay style={{ marginRight: '10px' }} /> 예고편 보기
        </TrailerButton>
      )}

      <CastList>
        {(cast.slice(0, 7)).map(actor => (
            <CastItem key={actor.id}>
            <CastImage 
                src={actor.profile_path 
                ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                : '../../img/NoActorImage.png'} 
                alt={actor.name} 
            />
            <p>{actor.name}</p>
            </CastItem>
        ))}
      </CastList>

      {error ? (
        <p>{error}</p>
      ) : (
        <KeywordList>
          키워드:
          {keywords.slice(0, 10).map((keyword, index, array) => (
            <KeywordItem 
              key={keyword.id} 
              onClick={() => handleKeywordClick(keyword.name)}
            >
              {keyword.name}
              {index < array.length - 1 ? ',' : ''}
            </KeywordItem>
          ))}
        </KeywordList>
      )}
    </Wrapper>
  );
};

export default ContentSection;