import React, { useState, useEffect } from 'react';
import api from '../../Member/api';
import { FaTimes } from 'react-icons/fa';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1003;
`;

const ModalContent = styled.div`
  position: relative;
  width: 70%;
  max-width: 500px;
  background-color: #141414;
  border-radius: 20px;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

const AuthorInfo = styled.p`
  font-size: 14px;
  color: #999;
  margin-bottom: 15px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;

  label {
    margin-bottom: 5px;
  }

  input, textarea {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #333;
    background-color: #222;
    color: white;
  }

  textarea {
    min-height: 150px;
  }
`;

const MeetingTimeGroup = styled(InputGroup)`
  flex-direction: row;
  align-items: center;

  label {
    margin-right: 10px;
    margin-bottom: 0;
  }

  input {
    flex-grow: 1;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 100px;
  margin: 0 auto;
  display: block;
`;

const ImagePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
  }
`;

const TextArea = styled.textarea`
  min-height: 150px;
  resize: none;
`;

const MeetCreate = ({ show, onClose, editMode = false, meetNum, authToken, userData }) => {
  const [formData, setFormData] = useState({
    meetTitle: '',
    meetWriter: userData ? userData.mnick : '',
    meetContent: '',
    personnel: '',
    meetTime: '',
    fileNames: [] // 서버에 업로드된 이미지 파일명을 저장
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (authToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    }

    if (editMode && meetNum) {
      api.get(`/api/meet/read/${meetNum}`)
        .then(response => {
          const data = response.data;
          setFormData({
            meetTitle: data.meetTitle,
            meetWriter: data.meetWriter,
            meetContent: data.meetContent,
            personnel: data.personnel,
            meetTime: data.meetTime,
            fileNames: data.fileNames || []
          });

          if (data.fileNames) {
            const previews = data.fileNames.map(fileName => `/view/${fileName}`);
            setImagePreviews(previews);
          }
        })
        .catch(error => console.error("게시글 데이터를 가져오는데 실패했습니다.", error));
    }
  }, [editMode, meetNum, authToken, userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const formObj = new FormData();

    files.forEach(file => {
      formObj.append("files", file);
    });

    try {
      const result = await uploadToServer(formObj, authToken);
      const newFileNames = result.map(item => item.uuid + "_" + item.fileName);

      setFormData(prev => ({
        ...prev,
        fileNames: [...prev.fileNames, ...newFileNames]
      }));

      const newPreviews = newFileNames.map(fileName => `/view/${fileName}`);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    } catch (error) {
      console.error("File upload failed", error);
    }
  };

  const handleRemoveImage = async (index) => {
    const fileNameToRemove = formData.fileNames[index];
    try {
      await removeFileToServer(fileNameToRemove, authToken);
      const newFileNames = [...formData.fileNames];
      const newImagePreviews = [...imagePreviews];
      newFileNames.splice(index, 1);
      newImagePreviews.splice(index, 1);

      setFormData(prev => ({
        ...prev,
        fileNames: newFileNames,
      }));
      setImagePreviews(newImagePreviews);
    } catch (error) {
      console.error("File removal failed", error);
    }
  };

  const handleSubmit = async () => {
    const data = {
      ...formData,
    };

    const url = editMode ? `/api/meet/modify/${meetNum}` : '/api/meet/register';
    const method = editMode ? 'put' : 'post';

    try {
      const response = await api({
        method: method,
        url: url,
        data: data,
      });
      console.log("Form submission successful", response.data);
      onClose(true);
    } catch (error) {
      console.error("Form submission failed", error);
    }
  };

  const uploadToServer = async (formObj, token) => {
    const response = await api.post('/upload', formObj, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  };

  const removeFileToServer = async (fileName, token) => {
    const response = await api.delete(`/remove/${fileName}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  };

  if (!show) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        <ModalTitle>{editMode ? "모임 수정" : "모임 등록"}</ModalTitle>
        <AuthorInfo>작성자: {formData.meetWriter}</AuthorInfo>
        <InputGroup>
          <label htmlFor="meetTitle">제목</label>
          <input 
            id="meetTitle"
            type="text" 
            name="meetTitle" 
            value={formData.meetTitle} 
            onChange={handleInputChange} 
          />
        </InputGroup>
        <MeetingTimeGroup>
          <label htmlFor="meetTime">모집 시간</label>
          <input 
            id="meetTime"
            type="datetime-local" 
            name="meetTime" 
            value={formData.meetTime} 
            onChange={handleInputChange} 
          />
        </MeetingTimeGroup>
        <InputGroup>
          <label htmlFor="personnel">모집 인원</label>
          <input 
            id="personnel"
            type="number" 
            name="personnel" 
            value={formData.personnel} 
            onChange={handleInputChange} 
          />
        </InputGroup>
        <InputGroup>
          <label htmlFor="meetContent">모임 내용</label>
          <TextArea 
            id="meetContent"
            name="meetContent" 
            value={formData.meetContent} 
            onChange={handleInputChange} 
          />
        </InputGroup>
        <InputGroup>
          <label htmlFor="images">이미지 업로드</label>
          <input 
            id="images"
            type="file" 
            multiple 
            onChange={handleFileChange} 
          />
        </InputGroup>
        <ImagePreview>
          {imagePreviews.map((src, index) => (
            <div key={index}>
              <img src={src} alt="미리보기" />
              <button onClick={() => handleRemoveImage(index)}>삭제</button>
            </div>
          ))}
        </ImagePreview>
        <Button onClick={handleSubmit}>
          {editMode ? "수정" : "등록"}
        </Button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default MeetCreate;
