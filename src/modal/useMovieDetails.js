import { useState, useEffect } from 'react';

const useMovieDetails = (movieId) => {
  const [isLoading, setIsLoading] = useState(true);
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState('');
  const [genres, setGenres] = useState([]);
  const [runtime, setRuntime] = useState(0);
  const [productionCompanies, setProductionCompanies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiKey = process.env.REACT_APP_TMDB_API_KEY;
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,videos`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }

        const data = await response.json();

        setCast(data.credits.cast.slice(0, 7));
        const directorInfo = data.credits.crew.find(person => person.job === 'Director');
        setDirector(directorInfo ? directorInfo.name : 'Unknown');
        setGenres(data.genres);
        setRuntime(data.runtime);
        setProductionCompanies(data.production_companies || []);
      } catch (error) {
        console.error('Error fetching movie info:', error);
        setError('영화 정보를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  return { isLoading, cast, director, genres, runtime, productionCompanies, error };
};

export default useMovieDetails;