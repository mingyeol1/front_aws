import axios from "axios";
import React, { useEffect, useState } from "react";


function Test(){
    const [hello, setHello] = useState('');

    useEffect(() => {
      axios.get('http://localhost:8090/api/test')
          .then((res) => {
            console.log(res.data);
            setHello(res.data);
          })
    }, []);
    return (
        <div className="App">
          백엔드 데이터 : {hello}
        </div>
    );
}

export default Test;