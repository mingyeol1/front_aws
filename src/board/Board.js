import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Board.css";
import api from "../Member/api";
import { Link, NavLink, useParams } from "react-router-dom";

function Board() {
  const [boardData, setBoardData] = useState([]);
  let {page} = useParams();
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  console.log("동작 전..currentPage: ", page);

  useEffect(() => {
    if(page) {
      fetchBoardData(page);
    }else{
      fetchBoardData(1);
    }
  }, [page]);

  const {size,total,start,end,prev,next,dtoList } = boardData;
  // const {bno,title,writer,content,regDate} = dtoList;

  let pageNumbers = [];
  for (let i = start; i <= end; i++) {
    // console.log(i);
    pageNumbers.push(i);
  }

  
  // console.log("pageNumber: ", pageNumbers);
  // console.log("startPageNumber: ", start);
  const fetchBoardData = async (page) => {
    try {
      const response = await api.get(`/board/list?page=${page}&size=10`, {
    //   });
    //   setBoardData(response.data.dtoList);
    //   setTotalPages(Math.ceil(response.data.total / response.data.size));
    // } catch (error) {
    //   console.error("Error fetching board data:", error);
    // }
      });
      const data = response.data;

      console.log("response: ", response.data);
      console.log("data: ", data);
      if (response.status === 200 && Array.isArray(data.dtoList)) {
        setBoardData(data);
        // setTotalPages(Math.ceil(response.data.total / response.data.size));
      } else {
        console.error("Expected an array but got:", data);
      }
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }

    
  };


  // const handlePageChange = (page) => {
  //   console.log("handlePageChange: ", page);
  //   fetchBoardData(page);
  // };



  // useEffect(() => {
  //   axios.get('/board/list')
  //     .then(response => {
  //       const data = response.data.dtoList;
  //       if (Array.isArray(data)) {
  //         setBoardData(data);
  //       } else {
  //         console.error("Expected an array but got:", data);
  //       }
  //     })

  //     .catch(error => {
  //       console.error("There was an error fetching the data!", error);
  //     });
  // }, []);
    
  return (
    <div className="listBackground">
      <div className="board-container">

        <form className="board-form">

        <div className="nav-tabs">
          <button className="active">핫게시판</button>
          <button>영화리뷰</button>
          <button>영화정보</button>
          <button>자유게시판</button>
          {/*// Link to={`/boardread/${item.bno}`} // 밑에 있는 코드 복붙해서 만들었던 거지만, 이렇게 하면 왜 item을 정의할 수 없다는 오류가 발생하는거지?*/}
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
                className='btn'>
                이전
              </NavLink>
            )}
            {pageNumbers.map((pageNumber, index) => (
              <NavLink 
                to={`/board/${pageNumber}`} 
                key={index} 
                className={({ isActive }) => (isActive ? 'btn active' : 'btn')} >
                {pageNumber}
              </NavLink>
            ))}
            {next && (
              <NavLink 
                to={`/board/${end + 1}`}
                className='btn'>
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
