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
<br>
<br>

## 파일구조
```
src
 └── main
     └── java
         └── com.project.react_tft
             ├── config                # 프로젝트 설정 관련 클래스
             │   ├── AwsConfig
             │   ├── CustomSecurityConfig
             │   ├── PasswordEncoderConfig
             │   ├── RootConfig
             │   └── SwaggerConfig
             │
             ├── controller             # API
             │   ├── advice
             │   │   └── CustomRestAdvice
             │   ├── BoardController
             │   ├── HomeController
             │   ├── MeetBoardController
             │   ├── MeetBoardImageController
             │   ├── MeetReplyController
             │   ├── MemberController
             │   ├── MovieController
             │   ├── ReplyController
             │   ├── ReviewController
             │   ├── SampleController
             │   └── UnloginController
             │
             ├── domain                 # 엔티티 클래스
             │   ├── BaseEntity
             │   ├── Board
             │   ├── MeetBoard
             │   ├── MeetBoardImage
             │   ├── MeetReply
             │   ├── Member
             │   ├── MemberRole
             │   ├── Movie
             │   ├── Reply
             │   └── Review
             │
             ├── dto                     # DTO (Data Transfer Object)
             │   ├── image
             │   │   ├── ImageFileDTO
             │   │   └── ImageResultDTO
             │   ├── BoardDTO
             │   ├── BoardListReplyCountDTO
             │   ├── MeetBoardDTO
             │   ├── MeetBoardImageDTO
             │   ├── MeetBoardListAllDTO
             │   ├── MeetBoardListReplyCountDTO
             │   ├── MeetReplyDTO
             │   ├── MemberDTO
             │   ├── MemberSecurityDTO
             │   ├── MovieDTO
             │   ├── PageRequestDTO
             │   ├── PageResponseDTO
             │   ├── ReplyDTO
             │   ├── ReviewDTO
             │   ├── ReviewPageRequestDTO
             │   └── ReviewPageResponseDTO
             │
             ├── Repository               # JPA Repository
             │   ├── BoardRepository
             │   ├── MeetBoardRepository
             │   ├── MeetReplyRepository
             │   ├── MemberRepository
             │   ├── MovieRepository
             │   ├── ReplyRepository
             │   └── ReviewRepository
             │
             ├── security                 # 보안 및 인증 관련
             │   ├── filter
             │   │   ├── exception
             │   │   ├── handler
             │   │   │   ├── LoginFilter
             │   │   │   ├── RefreshTokenFilter
             │   │   │   ├── TokenCheckFilter
             │   │   ├── CustomOauth2UserService
             │   │   └── CustomUserDetailsService
             │   ├── handler
             │   │   ├── CustomSocialLoginSuccessHandler
             │
             ├── service                   # serveice
             │   ├── BoardService
             │   ├── BoardServiceImpl
             │   ├── MeetBoardService
             │   ├── MeetBoardServiceImpl
             │   ├── MeetReplyService
             │   ├── MeetReplyServiceImpl
             │   ├── MemberService
             │   ├── MemberServiceImpl
             │   ├── MovieService
             │   ├── MovieServiceImpl
             │   ├── ReplyService
             │   ├── ReplyServiceImpl
             │   ├── ReviewService
             │   └── ReviewServiceImpl
             │
             ├── util                      
             │   └── JWTUtil               # JWT Util
             │
             └── ReactTftApplication       # 메인 애플리케이션 클래스
```

## 조금씩 수정중

<br>
 
### 수정 :  김민결

front : 모임게시판 상세 보기 할 때 닉네임이 아닌 id값 나오던거 수정.

back : 아이디 삭제시 del 값이 true면 더이상 로그인 못하게 막음. 여기서 login service부분 로직이 건너 띄어진다는걸 발견. config 를 수정해서 service 로직을 받아오나 클라이언트에 아무 값을 넣어도 로그인이 되는 상황이 발생 service 에 RuntimeException대신 ResponseStatusException 을 사용해여 401에러를 받을 수 있게하여 정상작동 확인.
        
<br>

게시글 및 모임게시글에 댓글이 있을 때 삭제가 안되는 상황 수정 OneToMany추가 후 orphanRemoval = true 부분 넣어줘서 해결했음.

<br>

board 엔티티를 member엔티티와 ManyToOne으로 연관관계를 정의 했음.





<br>

## 메인페이지 

![메인](https://github.com/mingyeol1/front_aws/blob/main/Mainpage.png)
![메인2](https://github.com/mingyeol1/front_aws/blob/main/mp/main.gif)
<br>
사용자가 사이트 방문시 가장 먼저 보게되는 화면입니다.

<br>
<br>
<br>
<br>
<br>
<br>



## 영화 카테고리
![카테고리](https://github.com/mingyeol1/front_aws/blob/main/category.png)
![카테고리2](https://github.com/mingyeol1/front_aws/blob/main/mp/category.gif)
<br>
좌측 상단에 토글버튼을 누르면 카테고리 창이 나옵니다.


<br>
<br>
<br>
<br>
<br>
<br>


## 영화 상세페이지
![상세페이지](https://github.com/mingyeol1/front_aws/blob/main/MovieModal.png)
![상세페이지2](https://github.com/mingyeol1/front_aws/blob/main/mp/youtu.gif)
<br>
원하는 영화 클릭시 상세 모달이 나오며 

감독, 평점, 배우, 러닝타임, 영화의 카테고리를 볼 수 있으며 유튜브API를 연동해서 영화의 예고편도 볼 수 있습니다.




<br>
<br>
<br>
<br>
<br>
<br>


## 댓글 작성
![댓글1](https://github.com/mingyeol1/front_aws/blob/main/mp/review.gif)
<br>
영화에 대해 댓글을 작성할 수 있으며 로그인 한 사용자에 대해서만 이용이 가능합니다.

<br>
<br>


![댓글1](https://github.com/mingyeol1/front_aws/blob/main/mp/review2.gif)


<br>
<br>
<br>
<br>
<br>
<br>


## 로그인 페이지
![로그인 페이지](https://github.com/mingyeol1/front_aws/blob/main/Login.png)
![로그인 페이지2](https://github.com/mingyeol1/front_aws/blob/main/mp/login.gif)
<br>
사용자가 로그인 할 수 있는 로그인 화면입니다.

카카오auth를 해서  카카오 로그인으로 가입이 가능합니다.




<br>
<br>
<br>
<br>
<br>
<br>


## 회원가입페이지
![회원가입 페이지](https://github.com/mingyeol1/front_aws/blob/main/SignUp%20(2).png)
![회원가입 페이지2](https://github.com/mingyeol1/front_aws/blob/main/mp/signup.gif)
<br>
사용자가 회원가입을 할 수 있는 화면입니다.


<br>
<br>
<br>
<br>
<br>
<br>


## 모임게시판
![모임게시판](https://github.com/mingyeol1/front_aws/blob/main/Meet.png)


<br>
사용자끼리 모임을 하여 영화를 같이 볼 수 있는 게시판입니다.

<br>
<br>
<br>
<br>
<br>
<br>

## 모임게시글 보기
![모임게시글보기](https://github.com/mingyeol1/front_aws/blob/main/Meet2.png)

<br>


## 모임게시판 상세보기
![모임게시글상세보기](https://github.com/mingyeol1/front_aws/blob/main/MeetDetail.png)
<br>
![모임게이시판](https://github.com/mingyeol1/front_aws/blob/main/mp/meet.gif)

<br>
<br>
<br>
<br>
<br>
<br>

## 마이페이지
![마이페이지1](https://github.com/mingyeol1/front_aws/blob/main/Mypage.png)

<br>
<br>

![마이페이지4](https://github.com/mingyeol1/front_aws/blob/main/mp/modify.gif)
<br>
사용자정보를 수정할 수 있는 페이지입니다. 탈퇴 및 정보변경을 할 수 있습니다.

<br>
<br>
<br>



