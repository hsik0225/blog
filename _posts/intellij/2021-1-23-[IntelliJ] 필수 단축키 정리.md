---
layout: post
title: "[IntelliJ] 필수 단축키 정리(Mac, Windows)"
categories: [IntelliJ]
---

인텔리제이를 사용하면 꼭 알아야 하는 단축키 모음

이 글에서 캐럿은 문자 커서를 의미합니다.

문자 커서 참조

- [https://ko.wikipedia.org/wiki/커서_(사용자_인터페이스)](https://ko.wikipedia.org/wiki/%EC%BB%A4%EC%84%9C_(%EC%82%AC%EC%9A%A9%EC%9E%90_%EC%9D%B8%ED%84%B0%ED%8E%98%EC%9D%B4%EC%8A%A4))

## 1. Editor Actions
- Delete Line : 캐럿이 위치한 줄 제거
  - Mac [`Command + Backspace`]
  - Windows [`Ctrl + Y`] 
    

- Duplicate Line or Selection : 캐럿이 위치한 줄 혹은 블럭을 한 줄 아래에 복제
  - Mac [`Command + D`]
  - Windows [`Ctrl + D`]

<img width="495" alt="1" src="https://user-images.githubusercontent.com/56301069/105535044-b5cfb080-5d31-11eb-8f84-963cb13464c1.png">

위 사진과 같이 복제하고 싶은 라인에 캐럿을 위치한 후 `Command + D` 를 입력하면 다음 사진과 같이 라인이 복제됩니다.

<img width="490" alt="2" src="https://user-images.githubusercontent.com/56301069/105534931-8d47b680-5d31-11eb-9507-0a442cf7c386.png">

- Move Caret to Line End : 캐럿을 줄의  끝으로 이동
  - Mac [`Command + ⭢`]
  - Windows [`End`]


- Move Caret to Line End with Selection : 캐럿부터 줄의 끝까지 블록
  - Mac [`Shift + Command + ⭢`]
  - Windows [`Shift + End`]
    

- Move Caret to Line Start : 캐럿을 줄의 시작 지점으로 이동
  - Mac [`Command + ⭠`] 
  - Windows [`Home`]
    

- Move Caret to Line Start with Selection : 줄의 시작부터 캐럿까지 블록
  - Mac [`Shift + Command + ⭠`] 
  - Windows [`Shift + Home`]
    

- Move Caret to Next Word : 다음 단어로 캐럿을 이동
  - Mac [`Option + ⭢`] 
  - Windows [`Ctrl + ⭢`]
    

- Move Caret to Next Word with Selection : 캐럿부터 다음 단어까지 블록
  - Mac [`Shfit + Option + ⭢`] 
  - Windows [`Shfit + Ctrl + ⭢`]
    

- Move Caret to Previous Word : 이전 단어로 캐럿을 이동
  - Mac [`Option + ⭠`]
  - Windows [`Ctrl + ⭠`]
    

- Move Caret to Previous Word with Selection : 이전 단어부터 캐럿까지 블록
  - Mac [`Shfit + Option + ⭠`]
  - Windows [`Shift + Ctrl + ⭠`]


- Extend Selection : 선택 확장
  - Mac [`Option + ⭡`]
  - Windows [`Ctrl + W`]


- Shrink Selection : 선택 축소
  - Mac [`Option + ⭣`]
  - Windows [`Shift + Ctrl + W`]

## 2. Main Menu

### 2-1. File

- Preferences : 설정
    - Mac [`Command + ,`]
    - Windows [`Ctrl + Alt + S`]


### 2-2. Edit

- Cut : 잘라내기
    - Mac [`Command + X`]
    - Windows [`Ctrl + X`]


- Copy : 복사
    - Mac [`Commad + C`]
    - Windows [`Ctrl + C`]


- Paste : 붙여넣기
    - Mac [`Command + V`]
    - Windows [`Ctrl + V`]


- Paste as Plaint Text : 일반 텍스트로 붙여넣기
    - Mac [`Shift + Option + Command + V`]
    - Windows [`Shfit + Ctrl + Alt + V`]


- Find : 찾기
    - Mac [`Command + F`]
    - Windows [`Ctrl + F`]


- Replace : 바꿔쓰기
    - Mac [`Command + R`]
    - Windows [`Ctrl + R`]


- Find Usages : 사용되는 곳 찾기
    - Mac [`Option + F7`]
    - Windows [`Alt + F7`]


- Indent Selection : 들여쓰기
    - Mac [`Tab`]
    - Windows [`Tab`]


- Unindent Line or Selection : 들여쓰기 제거
    - Mac [`Shift + Tab`]
    - Windows [`Shift + Tab`]



### 2-3. View

- Quick Definition : 클래스 구성을 빠르게 확인
    - Mac [`Command + Y`]
    - Windows [`Shift + Ctrl + I`]


- Parameter Info : 메소드의 파라미터 정보를 보여줌
    - Mac [`Command + P`]
    - Windows [`Ctrl + P`]



다음 사진과 같이 파라미터를 입력하는 곳에 캐럿을 두고 `Command + P` 를 입력하면 어떤 파라미터가 와야하는지 보여줍니다.

<img width="466" alt="스크린샷 2021-01-23 오전 2 33 10" src="https://user-images.githubusercontent.com/56301069/105535066-bb2cfb00-5d31-11eb-8d41-5bb79d5e69cb.png">


- Recent Files : 최근 사용한 파일 목록
    - Mac [`Command + E`]
    - Windows [`Ctrl + E`]


### 2-4. Navigate

- Next Highlighted Error : 경고 위치로 이동
    - Mac [`F2`]
    - Windows [`F2`]


- Next Method : 다음 메소드로 이동
    - Mac [`Ctrl + ⭣`]
    - Windows [`Alt + ⭣`]


- Previous Method : 이전 메소드로 이동
    - Mac [`Ctrl + ⭡`]
    - Windows [`Alt + ⭡`]


- Go to Test : 관련 테스트 코드로 이동
    - Mac [`Shift + Command + T`]
    - Windows [`Shift + Ctrl + T`]


- File Structure : 해당 파일 구조를 보여줌
    - Mac [`Command + F12`]
    - Windows [`Ctrl + F12`]


### 2-5. Code

- Generate : 생성자, Getter/Setter 등 여러 가지 생성 가능
    - Mac [`Command + N`]
    - Windows [`Alt + Insert`]


- Code Completion - SmartType : 자동 완성
    - Mac [`Shift + Control + Space`]
    - Windows [`단축키 지정 필요`]


- Surround With.. : 해당 라인을 감쌀 수 있는 여러 목록을 보여줌
    - Mac [`Option + Command + T`]
    - Windows [`Ctrl + Alt + T`]


원하는 라인에 캐럿을 둔 후 `Option + Command + T` 를 입력하면 사진과 같이 여러 목록들이 출력됩니다. 사진에선 mainController에 캐럿을 두었습니다.

<img width="519" alt="스크린샷 2021-01-23 오전 3 00 48" src="https://user-images.githubusercontent.com/56301069/105535067-bb2cfb00-5d31-11eb-8e95-66ff17389f89.png">

6번 try/catch를 선택하면 다음과 같이 해당 라인이 try/catch 문으로 감싸집니다.

<img width="501" alt="스크린샷 2021-01-23 오전 3 02 58" src="https://user-images.githubusercontent.com/56301069/105535071-bbc59180-5d31-11eb-9cae-425d184737ab.png">

- Comment with Line Comment : 한 줄 주석
    - Mac [`Command + /`]
    - Windows [`Ctrl + /`]

- Comment with Block Comment : 블록한 라인 전체 주석
    - Mac [`Option + Command + /` 혹은 `Shift + Command + /`]
    - Windows [`Shift + Ctrl + /`]


- Reformat File : 코드를 정리
    - Mac [`Shift + Option + Command + L`]
    - Windows [`Shift + Ctrl + Alt + L`]


- Move Statement Down : 해당 줄과 아랫줄을 교체
    - Mac [`Shift + Command + ⭣`]
    - Windows [`Shfit +Ctrl + ⭣`]


위의 사진에서 mainController.run() 에 캐럿을 둔 후 `Shift + Command + ⭣` 를 입력하면 다음 사진과 같이 됩니다.

<img width="504" alt="스크린샷 2021-01-23 오전 3 10 29" src="https://user-images.githubusercontent.com/56301069/105535075-bc5e2800-5d31-11eb-9e47-a480870c56a2.png">

- Move Statement Up : 해당 줄과 윗줄을 교체
    - Mac [`Shift + Command + ⭡`]
    - Windows [`Shfit +Ctrl + ⭡`]


### 2-6. Refactor

- Refactor This.. : 리팩토링 기능 목록
    - Mac [`Contrl + T`]
    - Windows [`Shift + Ctrl + Alt + T`]
    

- Rename... : 이름 변경, 해당 파일에서만이 아니라 사용하는 모든 곳에서 이름이 변경됩니다
    - Mac [`Shift + F6`]
    - Windows [`Shift+ F6`]
    


- Introduce Variable... : 해당 변수를 지역 변수로 변경
    - Mac [`Option + Command + V`]
    - Windows [`Ctrl + Alt + V`]


- Introduce Constant... : 해당 변수를 상수로 변경
    - Mac [`Option + Command + C`]
    - Windows [`Ctrl + Alt + C`]


- Introduce Field... : 해당 변수를 필드로 변경
    - Mac [`Option + Command + F`]
    - Windows [`Ctrl + Alt + F`]


- Introduce Parameter... : 해당 변수를 파라미터로 변경
    - Mac [`Option + Command + P`]
    - Windows [`Ctrl + Alt + P`]


다음과 같이 1을 출력하는 프로그램이 있습니다.

<img width="396" alt="스크린샷 2021-01-23 오전 3 30 21" src="https://user-images.githubusercontent.com/56301069/105535077-bcf6be80-5d31-11eb-92ee-01d928fc9a87.png">

- Introduce Variable 을 하면 1을 지역 변수로 변경합니다.

<img width="395" alt="스크린샷 2021-01-23 오전 3 32 04" src="https://user-images.githubusercontent.com/56301069/105535078-bcf6be80-5d31-11eb-932a-49da61bcd514.png">


- Introduce Constant 을 하면 1을 상수로 변경합니다.

<img width="383" alt="스크린샷 2021-01-23 오전 3 32 59" src="https://user-images.githubusercontent.com/56301069/105535081-bd8f5500-5d31-11eb-8ffd-1f71bd754210.png">


- Introduce Parameter 을 하면 1을 파라미터로 변경합니다.

<img width="446" alt="스크린샷 2021-01-23 오전 3 33 56" src="https://user-images.githubusercontent.com/56301069/105535083-be27eb80-5d31-11eb-9872-5957231e6439.png">


### 2-7. Run

- Run : 실행
    - Mac [`Control + R`]
    - Windows [`Shift + F10`]


- Run context configuration : 현재 파일의 main 메소드 실행
    - Mac [`Shift + Control + R`]
    - Windows [`Shift + Ctrl + F10`]


- Stop : 중지
    - Mac [`Command + F2`]
    - Windows [`Ctrl + F2`]


### 2-8. Git

- Commit : 커밋
    - Mac [`Command + K`]
    - Windows [`Ctrl + K`]


- Push : 푸시
    - Mac [`Shift + Command + K`]
    - Windows [`Shift + Ctrl + K`]


### 2-9. Window

- Hide All Tool Windows : 모든 도구 숨김
    - Mac [`Shift + Command + F12`]
    - Windows [`Shift + Ctrl + F12`]


- Split Right : 세로로 창 분할
    - Mac [`단축키 지정 필요`]
    - Windows [`단축키 지정 필요`]


- Unsplit All : 모든 창 통합
    - Mac [`단축키 지정 필요`]
    - Windows [`단축키 지정 필요`]



### 2-10. Help

- Find Action... : 도구 모음
    - Mac [`Shift + Command + A`]
    - Windows [`Shift + Ctrl + A`]


## 3. Others

- Show Context Actions : 에러를 해결할 수 있게 도와줌
    - Mac [`Option + Enter`]
    - Windows [`Alt + Enter`]


다음은 흔히 일어나는 클래스가 import 되지 않은 상황입니다.

<img width="384" alt="스크린샷 2021-01-23 오전 4 04 24" src="https://user-images.githubusercontent.com/56301069/105535092-bec08200-5d31-11eb-9115-976d84d69520.png">


여기서 List에 캐럿을 두고 `Option + Enter` 를 누르면 해당 에러를 해결할 수 있는 방법들의 목록이 출력됩니다.

<img width="400" alt="스크린샷 2021-01-23 오전 4 05 07" src="https://user-images.githubusercontent.com/56301069/105535095-bf591880-5d31-11eb-82b7-6f21f42a8dce.png">


import class 를 누르면 자동으로 필요한 클래스가 import 됩니다.

<img width="388" alt="스크린샷 2021-01-23 오전 4 06 51" src="https://user-images.githubusercontent.com/56301069/105535096-bff1af00-5d31-11eb-8a13-bfae6f7f9c2e.png">



추후 좋은 단축키를 찾으면 추가하겠습니다.
