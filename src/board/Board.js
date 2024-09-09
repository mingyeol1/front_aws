import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Board.css";
import api from "../Member/api";
import { Link, NavLink, useParams } from "react-router-dom";
import LinkButton from "../components/LinkButton";
import { useCookies } from "react-cookie";      // 3-1. 로그인한 유저의 ID를 가져오기 위해 필요한 import 추가

function Board() {
  const [boardData, setBoardData] = useState([]);
  let {page} = useParams();
  console.log("동작 전..currentPage: ", page);

  useEffect(() => {
    if(page) {
      fetchBoardData(page);
    }else{
      fetchBoardData(1);
    }
  }, [page]);

  const {size,total,start,end,prev,next,dtoList } = boardData;

  let pageNumbers = [];
  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }

  const fetchBoardData = async (page) => {
    try {
      const response = await api.get(`/board/list?page=${page}&size=10`, {});
      const data = response.data;      console.log("response: ", response.data);      console.log("data: ", data);
      if (response.status === 200 && Array.isArray(data.dtoList)) {
        setBoardData(data);
      } else {
        console.error("Expected an array but got:", data);
      }
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
  };

  const [cookies] = useCookies(['accessToken']);      // 3-2. 로그인한 유저의 ID를 가져오기 위해 컴포넌트 내부에 다음 상태와 쿠키 사용 추가
  const isLoggedIn = () => {          // 9-2. 로그인 보안 기능 추가
    return !!cookies.accessToken; // accessToken이 있으면 로그인 상태로 간주
  };
  const handleUpdateClick = (e) => {      // 9-2. 로그인 보안 기능 추가
    console.log(e);
    console.log(isLoggedIn());
    
    if (!isLoggedIn()) {
      
      e.preventDefault(); // 링크 이동 방지
      alert("로그인 해주세요");
    }
    // 로그인 상태라면 기본 동작 (링크 이동) 실행
  };
    
  return (
    <div className="listBackground">
      <div className="board-container">
        <form className="board-form">
          <div className="nav-tabs">
            <LinkButton size="md" onClick={handleUpdateClick}>글작성</LinkButton>
          </div>

          <div className="table-container">
          <table>
            <thead>
            <tr>
                <th>Bno</th>
                <th>Title</th>
                <th>Writer</th>
                <th>RegDate</th>
            </tr>
            </thead>
            <tbody>
              {dtoList && dtoList.map((item) => (
                <tr key={item.bno}>
                    <td>{item.bno}</td>
                    <td><Link to={`/boardread/${item.bno}`}>{item.title}</Link></td>
                    <td>{item.writer}</td>
                    <td>{new Date(item.regDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <div className="pagination">
          {prev && (
              <NavLink 
                to={`/board/${start - 1}`}
                className='button'>
                이전
              </NavLink>
            )}
            {pageNumbers.map((pageNumber, index) => (
              <NavLink 
                to={`/board/${pageNumber}`} 
                key={index} 
                className={({ isActive }) => (isActive ? 'button active' : 'button')} >
                {pageNumber}
              </NavLink>
            ))}
            {next && (
              <NavLink 
                to={`/board/${end + 1}`}
                className='button'>
                다음
              </NavLink>
            )}
          </div>
        </form>
      </div>
    </div>
  );

}

export default React.memo(Board); // Memoize the Board;