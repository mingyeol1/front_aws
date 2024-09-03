import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaFilm, FaTags, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const SidebarOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1010;

  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const SidebarContent = styled.aside`
  position: fixed;
  left: ${props => props.$isOpen ? '0' : '-500px'};
  top: 0;
  bottom: 0;
  width: 500px;
  background: #1a1a1a;
  color: #fff;
  transition: left 0.3s ease-in-out;
  z-index: 1011;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0,0,0,0.5);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 25px;  
  cursor: pointer;
  transition: color 0.3s;
  padding: 10px;

  &:hover {
    color: #e50914;
  }
`;

const Logo = styled.h1`
  font-size: 1.5em;
  text-align: center;
  padding: 20px 0;
  background: #2c2c2c;
  margin: 0;

  a {
    color: #fff;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #e50914;
    }
  }
`;

const NavSection = styled.nav`
  padding: 15px;
`;

const NavTitle = styled.h2`
  margin-top: 20px;
  font-size: 1.2em;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  padding-left: 10px;

  svg {
    margin-right: 10px;
  }
`;

const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0 0 30px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const NavItem = styled.li`
  width: 30%;
  margin-bottom: 10px;
`;

const NavLink = styled.a`
  color: #bbb;
  text-decoration: none;
  font-size: 0.9em;
  transition: color 0.2s ease;
  display: block;
  padding: 5px 10px;
  border-radius: 5px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: #fff;
    background: rgba(255,255,255,0.1);
  }
`;

const ErrorMessage = styled.p`
  color: #e50914;
  padding: 10px 20px;
  background: rgba(229,9,20,0.1);
  border-radius: 5px;
  margin: 20px;
`;

const Sidebar = ({ isOpen, onClose, clearSearchValue }) => {
  const [genres, setGenres] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  useEffect(() => {
    const fetchGenresAndKeywords = async () => {
      try {
        const genresResponse = await api.get('/genre/movie/list', {
          params: { language: 'en', api_key: API_KEY }
        });
        setGenres(genresResponse.data.genres);

        const moviesResponse = await api.get('/movie/popular', {
          params: { language: 'en', api_key: API_KEY }
        });

        const movieIds = moviesResponse.data.results.slice(0, 5).map(movie => movie.id);
        const keywordsPromises = movieIds.map(id => 
          api.get(`/movie/${id}/keywords`, {
            params: { api_key: API_KEY }
          })
        );

        const keywordsResponses = await Promise.all(keywordsPromises);
        const allKeywords = keywordsResponses.flatMap(response => response.data.keywords);
        const uniqueKeywords = [...new Set(allKeywords.map(k => k.name))].slice(0, 21);
        setKeywords(uniqueKeywords);

      } catch (error) {
        console.error('Error fetching genres and keywords:', error);
        setError('Failed to load genres and keywords. Please try again later.');
      }
    };

    fetchGenresAndKeywords();
  }, []);

  const handleGenreClick = (genreId, genreName) => {
    clearSearchValue();
    navigate(`/search?genre=${genreId}`, { state: { genreName } });
    onClose();
  };

  const handleKeywordClick = (keyword) => {
    clearSearchValue();
    navigate(`/search?keyword=${keyword}`);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <SidebarOverlay $isOpen={isOpen} onClick={onClose}>
          <SidebarContent $isOpen={isOpen} onClick={e => e.stopPropagation()}>
            <CloseButton onClick={onClose}><FaTimes /></CloseButton>
            <Logo>
              <a href="/">🍿TFT<span style={{ color: '#e50914' }}>DB🍿</span></a>
            </Logo>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <NavSection>
              <NavTitle><FaFilm /> Genres</NavTitle>
              <NavList>
                {genres.map(genre => (
                  <NavItem key={genre.id}>
                    <NavLink href="#" onClick={(e) => { e.preventDefault(); handleGenreClick(genre.id, genre.name); }}>
                      {genre.name}
                    </NavLink>
                  </NavItem>
                ))}
              </NavList>
            </NavSection>

            <NavSection>
              <NavTitle><FaTags /> Top 21's Keywords</NavTitle>
              <NavList>
                {keywords.map((keyword, index) => (
                  <NavItem key={index}>
                    <NavLink href="#" onClick={(e) => { e.preventDefault(); handleKeywordClick(keyword); }}>
                      {keyword}
                    </NavLink>
                  </NavItem>
                ))}
              </NavList>
            </NavSection>
          </SidebarContent>
        </SidebarOverlay>
      )}
    </>
  );
};

export default Sidebar;