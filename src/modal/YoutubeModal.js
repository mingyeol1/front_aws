import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const YoutubeModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const YoutubeContainer = styled.div`
  position: relative;
  width: 75%;
  height: 80%;
  max-width: none;
`;

const CloseYoutubeButton = styled.button`
  position: absolute;
  top: -20px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
`;

const YoutubeIframe = ({ videoId, onClose }) => {
  const iframeRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (iframeRef.current) {
        setDimensions({
          width: iframeRef.current.offsetWidth,
          height: iframeRef.current.offsetHeight,
        });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <YoutubeModal onClick={onClose}>
      <YoutubeContainer ref={iframeRef} onClick={(e) => e.stopPropagation()}>
        <CloseYoutubeButton onClick={onClose}>✖</CloseYoutubeButton>
        <iframe 
          width={dimensions.width} 
          height={dimensions.height}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </YoutubeContainer>
    </YoutubeModal>
  );
};

export default YoutubeIframe;