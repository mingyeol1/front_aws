import React, { useEffect, useState } from 'react';

import './BoardRead.css';
import api from '../Member/api';
import { Link, useParams } from 'react-router-dom';
import { useCookies } from "react-cookie";      // 3-1. 로그인한 유저의 ID를 가져오기 위해 필요한 import 추가
import { setAuthToken } from "../Member/api";   // 3-1. 로그인한 유저의 ID를 가져오기 위해 필요한 import 추가

function BoardRead() {
    const [dtoList, setDtoList] = useState();
    const [comments, setComments] = useState([]);
    const [commentInfo, setCommentInfo] = useState({});//commentInfo 상태를 추가하여 페이지네이션 정보를 저장합니다.
    const [currentPage, setCurrentPage] = useState(1);//currentPage 상태를 추가하여 현재 페이지 번호를 관리합니다.
    const { paramBno } = useParams();
    const [newComment, setNewComment] = useState({ replyText: '', replyer: '' });//1-1. 댓글 작성 기능을 추가하기 위해 새로운 상태를 추가
    const [cookies] = useCookies(['accessToken']);      // 3-2. 로그인한 유저의 ID를 가져오기 위해 컴포넌트 내부에 다음 상태와 쿠키 사용 추가
    const [memberData, setMemberData] = useState('');   // 3-2. 로그인한 유저의 ID를 가져오기 위해 컴포넌트 내부에 다음 상태와 쿠키 사용 추가

    useEffect(() => {   //useEffect 훅에 currentPage를 의존성 배열에 추가하여 페이지 변경 시 댓글을 다시 불러옵니다.
        setAuthToken(cookies.accessToken);      // 3-3. 로그인한 유저의 ID를 가져오기 위해 useEffect 훅 수정, 의존성 배열에 추가
    
        const fetchMemberData = async () => {   // 3-3. 로그인한 유저의 ID를 가져오기 위해 useEffect 훅 수정, 의존성 배열에 추가
            try {
                const response = await api.get("/api/auth/modify");
                const { mnick } = response.data;
                setMemberData(mnick);
                setNewComment(prev => ({ ...prev, replyer: mnick }));
            } catch (error) {
                console.error("Error fetching member data:", error);
            }
        };
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

        fetchMemberData();      // 3-3. 로그인한 유저의 ID를 가져오기 위해 useEffect 훅 수정, 의존성 배열에 추가
        fetchBoardData(paramBno);
        fetchComments(paramBno, currentPage);//fetchComments 함수를 수정하여 페이지 번호를 파라미터로 받아 해당 페이지의 댓글을 가져옵니다.
    }, [paramBno, currentPage, cookies.accessToken]);

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

    const handlePageChange = (newPage) => {     //handlePageChange 함수를 추가하여 페이지 변경 시 currentPage를 업데이트합니다.
        setCurrentPage(newPage);
    };  // 2-1 'fetchComments' is not defined 에러 해결을 위해 fetchComments 함수를 컴포넌트 레벨로 옮겨 useEffect와 handleCommentSubmit 양쪽에서 모두 사용
    
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

    const handleCommentChange = (e) => {    //1-2. 댓글 작성 기능을 추가하기 위해 댓글 입력 처리 함수를 추가
        setNewComment({ ...newComment, [e.target.name]: e.target.value });
    };

    const handleCommentSubmit = async (e) => {      //1-3. 댓글 작성 기능을 추가하기 위해 댓글 제출 함수를 추가
        e.preventDefault();
        if (!newComment.replyText) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }
        try {
            const response = await api.post('/replies/', {
                bno: paramBno,
                replyText: newComment.replyText,
                replyer: memberData          // 3-4. 로그인한 유저의 ID를 가져오기 위해 handleCommentSubmit 함수 수정
            });
            if (response.status === 200) {
                // 댓글 작성 성공 후 댓글 목록 새로고침
                fetchComments(paramBno, currentPage);
                // 입력 필드 초기화
                setNewComment(prev => ({ ...prev, replyText: '' }));    // 3-4. 로그인한 유저의 ID를 가져오기 위해 handleCommentSubmit 함수 수정
            }
        } catch (error) {
            console.error("There was an error posting the comment:", error);
        }
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
                    {/* 댓글 작성 1-4. JSX에 댓글 작성 폼을 추가 3-5. 로그인한 유저의 ID를 가져옴 4-1. 네이버 댓글입력 UI 모방 */}
                    <div className="comment-form">
                        <form onSubmit={handleCommentSubmit}>
                            <div className="comment-input-area">
                                <textarea
                                    name="replyText"
                                    value={newComment.replyText}
                                    onChange={handleCommentChange}
                                    placeholder="댓글을 남겨보세요"
                                    required
                                ></textarea>
                            </div>
                            <div className="comment-footer">
                                <span className="comment-author">작성자: {memberData}</span>
                                <button type="submit" className="comment-submit-btn">등록</button>
                            </div>
                        </form>
                    </div>
                </div>
                {renderPagination()}
            </div>
        </>
    );
}

export default BoardRead;