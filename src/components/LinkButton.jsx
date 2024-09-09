import style from "../styles/LinkComponents.module.css";
import { Link, NavLink, useParams } from "react-router-dom";

const LinkButton = ({ className, color = "primary", size = "md", onClick, children }) => {
    return (
        <button  
            onClick={onClick} 
            className={`${className} ${style[color]} ${style[size]} ${style.btn}`}
        >
            <Link to={`/boardcreate`}>
            {children}
            </Link>
        </button>
    );
};

export default LinkButton;