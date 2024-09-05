import React, { useEffect, useState } from 'react';

import './BoardRead.css';
import api from '../Member/api';
import { Link, useParams } from 'react-router-dom';

function BoardRead() {
    const [dtoList, setDtoList] = useState();
    const [comments, setComments] = useState([]);
    const [commentInfo, setCommentInfo] = useState({});//commentInfo 상태를 추가하여 페이지네이션 정보를 저장합니다.
    const [currentPage, setCurrentPage] = useState(1);//currentPage 상태를 추가하여 현재 페이지 번호를 관리합니다.
    const { paramBno } = useParams();

    useEffect(() => {   //useEffect 훅에 currentPage를 의존성 배열에 추가하여 페이지 변경 시 댓글을 다시 불러옵니다.
        const fetchBoardData = async (bno) => {
            try {
                const response = await api.get(`/board/read/${bno}`);
                const data = response.data;
                if (response.status === 200) {
                    setDtoList(data);
                } else {
                    console.error("Expected an array but got:", data);
                }
            } catch (error) {
                console.error("There was an error fetching the data!", error);
            }
        };

        const fetchComments = async (bno, page) => {
            try {
                const response = await api.get(`/replies/list/${bno}?page=${page}&size=10`);
                const data = response.data;     console.log("Comments data Harry: ", data);
                if (response.status === 200 && data.dtoList) {
                    setComments(data.dtoList);
                    setCommentInfo({
                        page: data.page,
                        size: data.size,
                        total: data.total,
                        start: data.start,
                        end: data.end,
                        prev: data.prev,
                        next: data.next
                    });
                } else {
                    console.error("Expected an array but got:", data);
                }
            } catch (error) {
                setComments([]);
                setCommentInfo({});
                console.error("There was an error fetching the comments data!", error);
            }
        };

        fetchBoardData(paramBno);
        fetchComments(paramBno, currentPage);//fetchComments 함수를 수정하여 페이지 번호를 파라미터로 받아 해당 페이지의 댓글을 가져옵니다.
    }, [paramBno, currentPage]);

    const handlePageChange = (newPage) => {     //handlePageChange 함수를 추가하여 페이지 변경 시 currentPage를 업데이트합니다.
        setCurrentPage(newPage);
    };
    
    const renderPagination = () => {        //renderPagination 함수를 추가하여 페이지네이션 UI를 렌더링합니다
        const pageNumbers = [];
        for (let i = commentInfo.start; i <= commentInfo.end; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={currentPage === i ? 'active' : ''}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="pagination">
                {commentInfo.prev && (
                    <button onClick={() => handlePageChange(commentInfo.start - 1)}>
                        이전
                    </button>
                )}
                {pageNumbers}
                {commentInfo.next && (
                    <button onClick={() => handlePageChange(commentInfo.end + 1)}>
                        다음
                    </button>
                )}
            </div>
        );
    };

    return dtoList && (
        <>
            <div className="board-read">
                <div className="board-content">
                    <div className="board-header">
                        <span className="board-category">자유게시판</span>
                        <button 
                            style={{position: "absolute", right: "0", marginRight: "10px"}}>
                            <Link to={`/boardupdate/${dtoList.bno}`}>게시글 수정</Link>
                        </button>
                        <h1 className="board-title">{dtoList.title}</h1>
                        <div className="board-info">
                            <span className="author">작성자 : {dtoList.writer}</span>
                            <span className="date">작성날짜 : {new Date(dtoList.regDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="board-body">
                        <p>{dtoList.content}</p>
                    </div>
                </div>

                <div className="comments-section">
                    <div className="comment-count">댓글 수 : {commentInfo.total}</div>
                    {comments.map((comment) => (
                        <div className="comment" key={comment.rno}>
                            <span className="comment-author">{comment.replyer}</span>
                            <p className="comment-text">{comment.replyText}</p>
                            <span className="comment-date">{new Date(comment.regDate).toLocaleString()}</span>
                        </div>
                    ))}
                    {/* {renderPagination()} */}
                </div>
                {renderPagination()}
            </div>
        </>
    );
}

export default BoardRead;