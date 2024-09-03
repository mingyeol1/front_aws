import styled from "styled-components";
import { useState } from "react";
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SearchIcon = styled(FaSearch)`
  position: relative;
  left: -35px;
  color: white;
  cursor: pointer;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  padding-right: 40px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

function SearchInputComponent({ searchValue, setSearchValue, clearSearchValue }) {
    const navigate = useNavigate();

    const handleChange = (event) => {
        setSearchValue(event.target.value);
    }

    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            performSearch();
        }
    }

    const handleSearchClick = () => {
        performSearch();
    };

    const performSearch = () => {
        if(searchValue !== ''){
            navigate(`/search?searchParam=${searchValue}`);
            clearSearchValue();
        } else {
            alert("타이틀을 입력해 주세요.");
        }
    };

    return(
        <>
            <SearchInput
                type="text"
                value={searchValue}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="타이틀을 입력해 주세요."
            />
            <SearchIcon onClick={handleSearchClick} />
        </>
    );
}

export default SearchInputComponent;