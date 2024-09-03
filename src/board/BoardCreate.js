import { useHistory, useNavigate } from "react-router-dom"; 
import api, { setAuthToken } from "../Member/api";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

function BoardCreate() {
  const [cookies] = useCookies(['accessToken']);
  const [memberData, setMemberData] = useState();
  const [createBoard, setCreateBoard] = useState({
    title: "",
    content: "",
    writer: ""
  });
   const navigate = useNavigate(); 

  const handleCreateBoardChange = (e) => {
    setCreateBoard({ ...createBoard, [e.target.name]: e.target.value });
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!createBoard.title || !createBoard.content || !createBoard.writer) {
      alert("제목, 내용, 작성자를 입력해주세요.");
      return;
    }
    try {
      const response = await api.post('/board/register', createBoard);
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
        const { mnick } = response.data;
        setMemberData(mnick);
        setCreateBoard({ ...createBoard, writer: mnick });
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="board-read">
      <div className="board-content">
        <div className="board-header">
          <span className="board-category">자유게시판</span>
          <form className="board-header" onSubmit={handleCreateBoard}>
            <div>
              <span className="author" name='writer'
                style={{ position: "absolute", right: "0", marginRight: "100px" }}>작성자 : {memberData}</span>
            </div>
            <input className="board-title" name='title' value={createBoard.title} onChange={handleCreateBoardChange} placeholder="제목" />
            <div className="board-body">
              <textarea className="author" name="content" value={createBoard.content} onChange={handleCreateBoardChange} placeholder="내용" />
            </div>
            <button type="submit">완료</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BoardCreate;
