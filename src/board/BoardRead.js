import React, { useEffect, useState } from 'react';
import './BoardRead.css';
import { Link, useParams } from 'react-router-dom';
import api from '../Member/api';

// function api(data){
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     const raw = JSON.stringify({
//     "title": data.title,
//     "content": data.content,
//     "writer": data.writer
//     });

//     const requestOptions = {
//     method: "GET",
//     headers: myHeaders,
//     body: raw,
//     redirect: "follow"
//     };

//     fetch("http://localhost:8090/board/register", requestOptions)
//     .then((response) => response.text())
//     .then((result) => console.log(result))
//     .catch((error) => console.error(error));
// }


function BoardRead() {

    const [dtoList, setDtoList] = useState();
    const {paramBno} = useParams();

    // if(paramBno){
    //     console.log("if paramBno: ", paramBno);
    //     setBno(paramBno);
    // }
    
    // console.log("bno: ", bno);
    // console.log("paramBno: ", paramBno);

    // const dtoList  = item;
    // console.log();

    useEffect( () => {
        const fetchBoardData = async (bno) => {
            try {
              const response = await api.get(`/board/read/${bno}`, {
              });
              const data = response.data;
        
              console.log("data: ", data);
              if (response.status === 200) {
                setDtoList(data);
                // setTotalPages(Math.ceil(response.data.total / response.data.size));
              } else {
                console.error("Expected an array but got:", data);
              }
            } catch (error) {
              console.error("There was an error fetching the data!", error);

            }
        };
        fetchBoardData(paramBno);
        
        // console.log("HarryPotter")
        // console.log("dtoList: ", dtoList);  //dtoList 불러오기 위해서 지연
    }, [paramBno]);


    return dtoList && (
        <>
            <div className="board-read">
                <div className="board-content">
                    <div className="board-header">
                        <span className="board-category">자유게시판</span>
                        <button 
                            style={{position: "absolute", right: "0", marginRight: "10px"}}><Link to={`/boardupdate/${dtoList.bno}`}>게시글 수정</Link></button>
                        <h1 className="board-title">{dtoList.title}</h1>


                        <div className="board-info">
                            <span className="author">작성자 : {dtoList.writer}</span>
                            <span className="date">작성 : {new Date(dtoList.regDate).toLocaleDateString()}</span>

                        </div>
                    </div>
                    <div className="board-body">
                        <p>{dtoList.content}</p>
                    
                    </div>
                </div>



                <div className="comments-section">
                    <div className="comment-count">댓글 수 : 3</div>
                        <div className="comment">
                            <span className="comment-author">myname</span>
                            <p className="comment-text">추천도 미쳐</p>

                        </div>
                    <div className="comment">
                        <span className="comment-author">babo</span>
                        <p className="comment-text">굿</p>

                    </div>
                    <div className="comment">
                        <span className="comment-author">babo2</span>
                        <p className="comment-text">김채리 이동욱 허전낙 짱!</p>

                    </div>
                </div>
            </div>
        </>
    );
}

export default BoardRead;