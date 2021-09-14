---
layout: post
title: "[IntelliJ] Grep Console - 로그를 보기 쉽게"
categories: [IntelliJ]
---

로그에 색상을 부여해서 로그를 더 쉽게 찾아보자!

# Grep Console

다음 사진처럼 로그가 많을 경우, 내가 원하는 로그만을 찾기 어렵다.
![스크린샷 2021-04-12 오후 2 19 01(2)](https://user-images.githubusercontent.com/56301069/114344060-1be20c00-9b9a-11eb-912b-f4f378601b9a.png)


`Grep Console`은 로그에 색상을 부여하여 원하는 로그를 발견하기 쉽게 해주는 플러그인이다.
다음은 Greo Console을 이용하여 색상을 부여한 로그이다.

![스크린샷 2021-04-12 오후 2 22 11](https://user-images.githubusercontent.com/56301069/114344278-7da27600-9b9a-11eb-88a8-00235a8172ab.png)

로그 레벨별로 색상을 다르게 하여 내가 원하는 로그를 더 빠르게 찾을 수 있다.

## 설치
`Shift 2번` 혹은 `Command + Shift + A`(Mac 기준) 을 누른 후 `plugins` 를 검색한다.

Marketplace를 선택한 후, `grep console`을 검색한 후 설치한다.

![스크린샷 2021-04-12 오후 2 24 49](https://user-images.githubusercontent.com/56301069/114344491-e5f15780-9b9a-11eb-8160-4169bb77638f.png)

## 설정
### Highlighting
Grep Console 설정에서 로그 색상을 변경할 수 있다.

1. `Command + ,` 혹은 메뉴바에서 `InteeliJ IDEA -> Preferences` 를 들어간다.
2. 왼쪽 메뉴에서 `Other Setting -> Grep Console` 를 들어간다.
3. 사진과 같이 `Highlighting`을 체크한다. 

![스크린샷 2021-04-12 오후 2 27 57(2)](https://user-images.githubusercontent.com/56301069/114344811-7760c980-9b9b-11eb-9e30-c676ce629976.png)


나는 Monokai Pro의 색상이 마음에 들어, 해당 테마 색상을 이용하여 로그 색상을 변경했다.

```
error FF6188 빨강색
warning FFD866 노란색
info 78DCE8 하늘색
debug A9DC76 녹색
```

![스크린샷 2021-04-12 오후 2 35 16](https://user-images.githubusercontent.com/56301069/114345284-65cbf180-9b9c-11eb-9a6d-4e47245bfef4.png)

`Background`를 체크 박스를 체크 해제하고, `Foreground`의 색상을 클릭하여 원하는 색상으로 변경한다.

**적용**
![스크린샷 2021-04-12 오후 2 37 47](https://user-images.githubusercontent.com/56301069/114345453-b6434f00-9b9c-11eb-96c3-66c824610014.png)

### Filter
원하는 레벨만 모아서 출력할 수 있다.
원하는 레벨을 드래그하고 우클릭 누른 후, `Grep` 클릭.

![스크린샷 2021-04-12 오후 2 39 38](https://user-images.githubusercontent.com/56301069/114345607-002c3500-9b9d-11eb-9c7d-2c2523df6422.png)

DEBUG 레벨의 로그만 모아서 볼 수 있다.
![스크린샷 2021-04-12 오후 2 41 47](https://user-images.githubusercontent.com/56301069/114345745-3bc6ff00-9b9d-11eb-9fc4-8667cfa67059.png)
