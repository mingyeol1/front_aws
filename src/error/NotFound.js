import React from "react";
import "./NotFound.css";
import { Link, useNavigate } from "react-router-dom";

function NotFound(){
    const navigate = useNavigate();



    return(
    <div className="wrap">
       <div>
            <img src="/img/NotFound.png" />
       </div>
       <div className="btn-container">
      <Link to={'/'}><button className="btn">메인페이지로 이동 </button></Link> 
       &nbsp;&nbsp;&nbsp;&nbsp;
       <button className="btn" onClick={() => navigate(-1)}>뒤로가기</button>
       </div>
    </div>
    )
}

export default NotFound