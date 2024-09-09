import style from "../styles/LinkComponents.module.css";
import { Link, NavLink, useParams } from "react-router-dom";

const LinkButton = ({ className, color = "primary", size = "md", onClick, children }) => {
    console.log(onClick);
    console.log('LinkButton');
    return (
        <Link onClick={onClick} to={`/boardcreate`}>
            <button
                className={`${className} ${style[color]} ${style[size]} ${style.btn}`}
            >
                {children}
            </button>
        </Link>
    );
};

export default LinkButton;