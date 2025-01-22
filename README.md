# TFT 영화 사이트

<br>
<br>
<br>

## 프로젝트 소개

### TFT 영화 사이트는 사용자들이 다양한 영화를 검색하고, 상세 정보를 확인하며, 다른 사용자들과 모임을 조직하여 함께 영화를 관람할 수 있는 플랫폼입니다.

<br>
<br>
<br>


## 개발인원 4명
### 팀장 김민결
#### 회원 기능(회원 가입, 로그인, 마이페이지, 소셜로그인) / AWS 엘라스틱 빈스톡을 통한 배포 , CICD파이프 라인을 통한 자동배포 / 모임 게시판 CRUD 및 S3에 이미지 저장 / 회원기능 FRONT / 팀원 보조를 맡음
<br>

### 팀원 이영근
#### TMDB API연동 /  메인 영화 페이지 및 댓글기능 / 메인페이지 FRONT를 맡음
<br>

### 팀원 이현관
#### YOU TUBE API 연동(영화의 트레일러보기) / 메인 영화 페이지 FRONT / 모임 게시판 FRONT를 맡음
<br>

### 팀원 박성균
#### 통합 게시판 CRUD / 통합게시판 FRONT를 맡음

<br>
<br>

### 개발기간 2024 - 08 - 14 ~ 2024 - 09 -09
<hr>

## 기술 스택

- **프론트엔드**: React.js , React.cookie , React.Router
- **백엔드**: Spring Boot, Spring Data JPA
- **데이터베이스**: MySQL
- **배포**: AWS Elastic Beanstalk, CI/CD 파이프라인
- **인증 및 보안**: Spring Security, 카카오 OAuth




<br>

## 메인페이지 

![메인](https://github.com/mingyeol1/front_aws/blob/main/Mainpage.png)
사용자가 사이트 방문시 가장 먼저 보게되는 화면입니다.


## 영화 카테고리
![카테고리](https://github.com/mingyeol1/front_aws/blob/main/category.png)

좌측 상단에 토글버튼을 누르면 카테고리 창이 나옵니다.


## 영화 상세페이지
![상세페이지](https://github.com/mingyeol1/front_aws/blob/main/MovieModal.png)

원하는 영화 클릭시 상세 모달이 나오며 

감독, 평점, 배우, 러닝타임, 영화의 카테고리를 볼 수 있으며 유튜브API를 연동해서 영화의 예고편도 볼 수 있습니다.



## 로그인 페이지
![로그인 페이지](https://github.com/mingyeol1/front_aws/blob/main/Login.png)

사용자가 로그인 할 수 있는 로그인 화면입니다..

카카오auth를 해서  카카오 로그인으로 가입이 가능합니다.



## 회원가입페이지
![회원가입 페이지](https://github.com/mingyeol1/front_aws/blob/main/SignUp%20(2).png)

사용자가 회원가입을 할 수 있는 화면입니다.


## 모임게시판
![모임게시판](https://github.com/mingyeol1/front_aws/blob/main/Meet.png)


사용자끼리 모임을 하여 영화를 같이 볼 수 있는 게시판입니다.



## 모임게시글 보기
![모임게시글보기](https://github.com/mingyeol1/front_aws/blob/main/Meet2.png)



## 모임게시판 상세보기
![모임게시글상세보기](https://github.com/mingyeol1/front_aws/blob/main/MeetDetail.png)



## 마이페이지
![마이페이지1](https://github.com/mingyeol1/front_aws/blob/main/Mypage.png)


사용자정보를 수정할 수 있는 페이지입니다. 탈퇴 및 정보변경을 할 수 있습니다.



## 회원정보수정1
![마이페이지2](https://github.com/mingyeol1/front_aws/blob/main/MyDetail.png)


## 회정정보수정2
![마이페이지3](https://github.com/mingyeol1/front_aws/blob/main/MyDetail2.png)



