import { useHistory, useNavigate } from "react-router-dom"; 
import api, { setAuthToken } from "../Member/api";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import "./BoardCreate.css";

function BoardCreate() {
  const [cookies] = useCookies(['accessToken']);
  const [memberData, setMemberData] = useState();
  const [createBoard, setCreateBoard] = useState({
    title: "",
    content: "",
    mid: ""
  });
   const navigate = useNavigate(); 

  const handleCreateBoardChange = (e) => {
    setCreateBoard({ ...createBoard, [e.target.name]: e.target.value });
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!createBoard.title || !createBoard.content || !createBoard.mid) {
      alert("제목, 내용, 작성자를 입력해주세요.");
      return;
    }
    try {
      const response = await api.post('/api/board/register', createBoard);
      console.log("게시글 작성 성공:", response);

      // 게시판 페이지로 리다이렉트하고 페이지 새로고침
        navigate(`/board/1`); // v6 용
    } catch (error) {
      console.error("게시글 작성 실패:", error);
    }
  };

  useEffect(() => {
    setAuthToken(cookies.accessToken);
    api.get("/api/auth/modify")
      .then(response => {
        const { mid } = response.data;
        setMemberData(mid);
        setCreateBoard({ ...createBoard, mid: mid });
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <>
      <div className="board-create">
        <form onSubmit={handleCreateBoard}>
          <div className="board-create-header">
            <span className="board-create-category">자유게시판</span>
          </div>
          <div className="board-create-content">  
              <input name='title' value={createBoard.title} onChange={handleCreateBoardChange} placeholder="제목" />
              <textarea name="content" value={createBoard.content} onChange={handleCreateBoardChange} placeholder="내용" />
              <div className="board-create-info">
                <span className="author">작성자 : {memberData}</span>
              </div>
          </div>
          <div className="board-create-footer">
            <button className="board-create-complete" type="submit">완료</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default BoardCreate;
