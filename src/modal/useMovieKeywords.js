import { useState, useEffect } from 'react';
import axios from 'axios';

const useMovieKeywords = (movieId) => {
  const [keywords, setKeywords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/keywords`, {
          params: {
            api_key: API_KEY,
          }
        });
        setKeywords(response.data.keywords);
        setError(null);
      } catch (error) {
        console.error("Error fetching keywords:", error);
        setError("키워드를 불러오는 데 실패했습니다.");
      }
    };
  
    fetchKeywords();
  }, [movieId]);

  return { keywords, error };
};

export default useMovieKeywords;