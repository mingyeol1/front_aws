import React, { useEffect, useState } from 'react';
import './BoardUpdate.css';
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
        <>
            <div className="board-update">
                <form onSubmit={handleSubmit}>
                    <div className="board-update-header">
                        <span className="board-update-category">자유게시판</span>
                        <button className="board-update-delete" onClick={handleDelete}>게시글 삭제</button>
                    </div>
                    <div className="board-update-content">
                        <input name="title" value={dtoList.title} onChange={handleChange} />
                        <textarea name="content" value={dtoList.content} onChange={handleChange}/>
                        <div className="board-update-info">
                            <span className="author">작성자 : {dtoList.writer}</span>
                            <span className="date">작성 : {new Date(dtoList.regDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="board-update-footer">
                        <button className="board-update-complete" type="submit">완료</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default BoardUpdate;