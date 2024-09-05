import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Board.css";
import api from "../Member/api";
import { Link, NavLink, useParams } from "react-router-dom";

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
    
  return (
    <div className="listBackground">
      <div className="board-container">
        <form className="board-form">
        <div className="nav-tabs">
          <button className="active">핫게시판</button>
          <button>영화리뷰</button>
          <button>영화정보</button>
          <button>자유게시판</button>
          <button 
            style={{position: "absolute", right: "0", marginRight: "10px"}}><Link to={`/boardcreate`}>글 작성</Link></button>
        </div>
          <h2>board List</h2>
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