---
layout: post
title: "[IntelliJ] Theme - Monokai Pro 설치"
categories: [IntelliJ]
---


이 글에서는 Monokai Pro Theme과 추천 플러그인들을 설치합니다.


## 1. 플러그인 설치 및 적용

Command + Shift + A 혹은 Shift+Ctrl+A 를 입력하여, Find Action 창을 띄운 후, plugins 를 검색합니다.

<img width="852" alt="1" src="https://user-images.githubusercontent.com/56301069/105492510-62db0680-5cfb-11eb-837f-fd3d62203f43.png">

Marketplace 를 누르고 Monokai 검색 후 `Monokai Pro Theme` 설치합니다.

<img width="1427" alt="2" src="https://user-images.githubusercontent.com/56301069/105492515-65d5f700-5cfb-11eb-8ed3-8f7b05c35c4a.png">

같은 방법으로,

- Atom Material Icons
- Rainbow Brackets

를 검색한 후 설치합니다.

Command + `,` 혹은 Ctrl + Alt + S 를 눌러 설정 창을 엽니다.

Preferences → Appearance & Behavior → Appearance에서 Monokai Pro (Filter Spectrue) 선택합니다.

<img width="994" alt="3" src="https://user-images.githubusercontent.com/56301069/105492523-679fba80-5cfb-11eb-9797-bba223c61010.png">


아래 Apply로 적용 후 OK를 누릅니다.

### Atom Material Icons

Atom Material Icons 을 설치하면 다음 사진과 같이 프로젝트 부분의 아이콘들이 변경됩니다.

적용 전

<img width="277" alt="4" src="https://user-images.githubusercontent.com/56301069/105492526-68385100-5cfb-11eb-97a0-43ec13f86228.png">

적용 후

<img width="300" alt="5" src="https://user-images.githubusercontent.com/56301069/105492527-68385100-5cfb-11eb-87e9-ab396c454ef7.png">

### Rainbow Brackets

Rainbow Brackets 을 설치하면 다음 사진과 같이 괄호의 짝에 색상이 부여됩니다.

적용 전

<img width="456" alt="6" src="https://user-images.githubusercontent.com/56301069/105492528-68d0e780-5cfb-11eb-92f1-5f31bb6febc3.png">

적용 후

<img width="524" alt="7" src="https://user-images.githubusercontent.com/56301069/105492531-68d0e780-5cfb-11eb-8f6b-fbdedd1d6f92.png">

## 2. 추가 사항

### 1. 어노테이션 색상 변경

개인적으로 변경하고 싶은 부분이 있어서 몇 가지 변경합니다.

Monokai는 사진과 같이 어노테이션의 색상이 하늘색으로 되어있습니다. 저는 초록색이 더 익숙하므로 초록색으로 변경하고자 합니다.

<img width="406" alt="8" src="https://user-images.githubusercontent.com/56301069/105492532-69697e00-5cfb-11eb-9e57-666949418901.png">

아까와 같이 설정창을 엽니다.

Editor → Color Scheme → Java 에서 Annotation name을 선택합니다.

Forground의 값을 `5AD4E6`에서 `50FA78`로 변경합니다.

<img width="887" alt="9" src="https://user-images.githubusercontent.com/56301069/105492533-69697e00-5cfb-11eb-9944-b920007d105d.png">

Apply로 적용 후 OK를 눌러줍니다.

다음과 같이 어노테이션 색상이 변경되었습니다.

<img width="426" alt="10" src="https://user-images.githubusercontent.com/56301069/105492534-6a021480-5cfb-11eb-82ca-e350201a4cdc.png">


### 2. Code Editor 배경 색상 변경

Monokai Pro는 사진과 같이 Code Editor 부분과 Project 부분의 색깔이 다릅니다.

<img width="743" alt="11" src="https://user-images.githubusercontent.com/56301069/105492536-6a9aab00-5cfb-11eb-9be5-17d1ac4e22d4.png">

저는 코드 에디터 부분도 프로젝트 부분 색상과 똑같이 하고 싶습니다.

설정(Preferences) → Editor → Color Scheme → General 에서 Text → DefaultText를 선택합니다.

저는 정확한 Project 부분의 색상을 모릅니다. Background의 색상을 가장 비슷하다고 느낀 `191919`로 설정하겠습니다.

<img width="886" alt="12" src="https://user-images.githubusercontent.com/56301069/105492537-6a9aab00-5cfb-11eb-8c04-ee0b748a0e51.png">

Apply를 눌러 적용 후 OK 버튼을 눌러 나와보면 코드 에디터 부분 색상이 변경된 것을 확인할 수 있습니다.

<img width="1792" alt="스크린샷 2021-01-23 오전 3 50 00" src="https://user-images.githubusercontent.com/56301069/105539928-c5062c80-5d38-11eb-88d3-76a373702bdf.png">
