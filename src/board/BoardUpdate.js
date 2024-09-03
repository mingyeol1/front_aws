import React, { useEffect, useState } from 'react';
import './BoardRead.css';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../Member/api';

function BoardUpdate() {
    const [dtoList, setDtoList] = useState({
        title: '',
        content: ''
    });
    const { paramBno } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBoardData = async (bno) => {
            try {
                const response = await api.get(`/board/read/${bno}`);
                const data = response.data;

                console.log("data: ", data);
                if (response.status === 200) {
                    setDtoList(data);
                } else {
                    console.error("Unexpected data format:", data);
                }
            } catch (error) {
                console.error("Error fetching the data!", error);
            }
        };
        fetchBoardData(paramBno);
    }, [paramBno]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDtoList(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/board/${paramBno}`, dtoList);
            navigate(`/boardread/${paramBno}`);
        } catch (error) {
            console.error("Error updating board data:", error.response || error);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/board/${paramBno}`);
            navigate(`/board`);
        } catch (error) {
            console.error("Error deleting board data:", error.response || error);
        }
    };

    return dtoList && (
        <div className="board-read">
            <div className="board-content">
                <div className="board-header">
                    <span className="board-category">자유게시판</span>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>제목</label>
                            <input type="text" name="title" value={dtoList.title} onChange={handleChange} />
                        </div>
                        <div className="board-info">
                            <span className="author">작성자 : {dtoList.writer}</span>
                            <span className="date">작성 : {new Date(dtoList.regDate).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <label>내용</label>
                            <textarea cols={30} rows={10} name="content" value={dtoList.content} onChange={handleChange}></textarea>
                        </div>
                        <button type="submit">수정 완료</button>
                    </form>
                    <button onClick={handleDelete}>삭제</button>
                </div>
            </div>
        </div>
    );
}

export default BoardUpdate;



// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import api from '../Member/api';

// function BoardUpdate() {
//     const [boardData, setBoardData] = useState({ title: '', content: '', writer: '' });
//     const { bno } = useParams();
//     const navigate = useNavigate();
//     const location = useLocation();

//     useEffect(() => {
//         if (location.state && location.state.boardData) {
//             setBoardData(location.state.boardData);
//         } else {
//             const fetchBoardData = async () => {
//                 try {
//                     const response = await api.get(`/board/read/${bno}`);
//                     setBoardData(response.data);
//                 } catch (error) {
//                     console.error("Error fetching board data:", error.response || error);
//                 }
//             };
//             fetchBoardData();
//         }
//     }, [bno, location.state]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setBoardData(prevState => ({
//             ...prevState,
//             [name]: value
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await api.put(`/board/${bno}`, boardData);
//             navigate(`/board/read/${bno}`);
//         } catch (error) {
//             console.error("Error updating board data:", error.response || error);
//         }
//     };

//     return (
//         <div>
//             <h2>게시글 수정</h2>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>제목</label>
//                     <input type="text" name="title" value={boardData.title} onChange={handleChange} />
//                 </div>
//                 <div>
//                     <label>내용</label>
//                     <textarea name="content" value={boardData.content} onChange={handleChange}></textarea>
//                 </div>
//                 <div>
//                     <label>작성자</label>
//                     <input type="text" name="writer" value={boardData.writer} onChange={handleChange} />
//                 </div>
//                 <button type="submit">수정 완료</button>
//             </form>
//         </div>
//     );
// }

// export default BoardUpdate;