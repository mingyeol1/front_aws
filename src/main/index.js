import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import GlobalStyle from './GlobalStyles';  // GlobalStyle 임포트

ReactDOM.render(
  <>
    <GlobalStyle />  {/* GlobalStyle 적용 */}
    <App />
  </>,
  document.getElementById('root')
);
