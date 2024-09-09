import styled, { css, keyframes } from "styled-components";

export const scrollbarStyle = css`
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const StyledReviewSection = styled.div`
  margin-bottom: 10px;
  margin-top: 20px; 
  height: 40%; // 고정 높이 설정
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
`;

export const MovieReview = styled.h3`
  font-size: 22px;
  color: white;
  margin: 0;
`;

export const MovieReviewCount = styled.div`
  font-size: 16px;
  color: white;
`;

export const StarRating = styled.span`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

export const ReviewInputContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 10px;
`;

export const ReviewInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  margin-right: 10px;
  border-radius: 5px;
`;

export const SubmitReview = styled.button`
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  white-space: nowrap;
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
  padding: 5px;
  &:hover {
    color: #e50914;
  }
`;

export const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: ${rotate} 1s linear infinite;
  margin: 10px auto;
`;

export const EmptyReviewMessage = styled.div`
text-align: center;
padding: 70px;
color: #888;
font-style: italic;
`;

export const ReviewList = styled.ul`
  margin-top: 20px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.1); 
  border-radius: 5px;
  max-height: calc(100% - 100px);
  overflow-y: auto;
  ${scrollbarStyle}
  list-style-type: none;
  width: 100%; // 변경된 부분
  box-sizing: border-box; // 추가된 부분
`;

export const ReviewItem = styled.li`
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

export const ReviewAuthor = styled.span`
  font-weight: bold;
  width: 120px;
  margin-right: 20px;
`;

export const ReviewContent = styled.span`
  flex: 1;
  margin-right: 20px;
`;

export const ReviewRating = styled.span`
  display: flex;
  align-items: center;
  margin-right: 20px;
  min-width: 80px;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;