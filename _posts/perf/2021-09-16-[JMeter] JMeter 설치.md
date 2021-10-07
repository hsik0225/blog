---
layout: post
title: "[JMeter] JMeter 설치 및 사용"
categories: [JMeter]
---

어플리케이션의 성능을 측정하는 `JMeter`를 설치해봅니다.

이 글은 `Mac + Homebrew`를 사용하여 설치를 진행하므로, 이와 다른 운영체제를 사용할 경우 진행하면서 차이점이 있을 수 있습니다.

## JMeter란?
동작을 테스트하고 성능을 측정하도록 설계된 100% 순수 자바 어플리케이션인 오픈 소스 소프트웨어입니다.

다음은 JMeter의 특징입니다.
- 오픈 소스이므로 `무료`입니다.
- 부하테스트를 CLI로 진행할 수 있습니다. 이는 테스트를 여러 번 진행해야 할 때, 스크립트를 작성하여 일일이 실행 버튼을 누르지 않도록 해줍니다.
- HTTP, HTTPS 만이 아닌 다양한 프로토콜을 테스트 할 수 있습니다.
- 시나리오 기반 테스트가 가능합니다.
- 다양한 외부 플러그인을 사용하여 기능 확장이 가능합니다.

## 설치
JMeter는 최소 자바 8 버전 이상이 깔려있어야 합니다.
그러므로 먼저 설치되어 있는 자바 버전을 확인해봅니다.

```bash
$ java -version
java version "1.8.0_301"
Java(TM) SE Runtime Environment (build 1.8.0_301-b09)
Java HotSpot(TM) 64-Bit Server VM (build 25.301-b09, mixed mode)
```

만약 자바가 8 미만으로 설치되어 있다면 자바를 설치합니다.

`mac`유저시라면 `homebrew`로 간단하게 설치할 수 있습니다.

```shell
$ brew update
$ brew tap adoptopenjdk/openjdk
$ brew install --cask adoptopenjdk8
```

자바가 필요 버전이상으로 설치되었다면, `JMeter`를 설치합니다.
마찬가지로 `homebrew`로 간단하게 설치합니다.

```shell
$ brew update
$ brew install jmeter
```

## 실행
설치가 되었으면 터미널에서 `JMeter`를 실행합니다.

<img width="1548" alt="스크린샷 2021-09-16 오전 6 31 31" src="https://user-images.githubusercontent.com/56301069/133512607-89e09648-f391-4900-ba49-013b5a6982a2.png">

다음은 `JMeter` 실행화면입니다.

![스크린샷 2021-09-16 오전 7 11 43](https://user-images.githubusercontent.com/56301069/133516801-1c512929-92c5-43c5-bbbf-936bfd471388.png)

## 테스트 설정
### Test Plan
먼저 `Test Plan` 부터 설정합니다. `Test Plan`에서는 전체 테스트에서 사용 가능한 환경 변수를 설정합니다.

<img width="1054" alt="스크린샷 2021-09-12 오전 12 21 55" src="https://user-images.githubusercontent.com/56301069/133517411-9406b28e-60cd-4209-a935-da544b32fe33.png">

### Thread Group
`Thread Group`은 하나의 시나리오 단위입니다.

다음으로 `Thread Group`을 생성합니다.

<img width="647" alt="스크린샷 2021-09-12 오전 12 22 47" src="https://user-images.githubusercontent.com/56301069/133518426-51ef2c28-033b-4dca-a6ca-0e5295aaf914.png">

`Thread Group`은 다음과 같은 설정을 가지고 있습니다.

- **Number of Threads (users)**: 테스트를 실행할 쓰레드의 수를 정합니다. 테스트 할 웹사이트를 접근할 유저의 수입니다.
- **Ramp-up period (seconds)**: 위에서 설정한 쓰레드의 수에 도달할 때까지 걸리는 시간입니다. 다음은 Ramp-Up Period를 이해하기 쉽도록 작성한 그래프입니다.

![스크린샷 2021-09-16 오전 7 44 11](https://user-images.githubusercontent.com/56301069/133519533-1b68f936-c92f-42aa-9ad1-733fc9cd6fbc.png)

이 그래프는 `10개의 Thread를 50초 동안 차례대로 생성하라`는 의미입니다. 즉, 5초(50초/10개)마다 Thread를 하나씩 생성하는 것과 같은 의미입니다. 동시 접속자 수를 서서히 늘려간다고 생각하면 편합니다.

- **Loop Count**: Thread Group에 등록된 전체 Sampler를 몇 번 반복할지 설정합니다. 만약 Number of Threads가 10이고, Loop Count가 10이면, 열 사람 한명한명이 각각 10번씩 접속한다는 뜻입니다. Loop Count 옆에 있는 Infinite를 체크하면 계속 접속하겠다는 뜻입니다.

JMeter는 탁구를 비유하면 이해하기 쉽습니다.
부하를 일으키는 JMeter와 서버 간의 탁구 경기입니다.

각 용어들을 탁구로 다시 이야기하면, 
- Number of Threads : 탁구 경기를 하는 사람들의 수
- Ramp-up period : 모든 탁구 경기에 참가자들이 입장할 때까지 걸리는 시간
- Loop Count : 랠리 횟수
- Duration : 총 탁구 경기 진행 시간

JMeter는 탁구 랠리와 마찬가지로 응답이 오기 전까지 요청을 보내지 않습니다.
그래서 서버 처리가 오래 걸릴 경우 요청을 보낸 스레드는 다음 요청을 보내지 않아 TPS가 떨어지게 됩니다.

일정 시간동안 VUser(Number of Threads)로 요청했을 때의 TPS 변화를 보고 싶다면, 랠리가 끊기지 않도록 Loop Count를 Infinite로 설정하고 Duration에 시간을 지정합니다.

다음은 VUser를 100으로 1분간 요청을 보내는 예시입니다.

![스크린샷 2021-10-07 오후 7 13 57](https://user-images.githubusercontent.com/56301069/136365345-927f1bb9-8f2a-4ea6-85a1-3ad663390acd.png)

### Sampler
`Sampler`는 하나의 요청 단위입니다. 

다음과 같이 `Sampler`를 생성합니다.

<img width="689" alt="스크린샷 2021-09-12 오전 12 24 47" src="https://user-images.githubusercontent.com/56301069/133524587-4ab09992-6694-48c3-9dd7-1b1d7232c3c6.png">

생성한 `Sampler`를 설정합니다.
`Server Name`과 `Port Number`는 Test Plan에서 설정한 변수를 사용합니다.

<img width="1049" alt="스크린샷 2021-09-12 오전 12 26 47" src="https://user-images.githubusercontent.com/56301069/133524708-d76df969-c91e-4dfe-a732-75905a48f35c.png">

### Listener
지금으로도 테스트는 가능하지만 테스트 결과를 눈으로 확인할 수 없습니다. 테스트 결과를 테이블 혹은 그래프로 보여주는 `Listener`들을 추가합니다.

먼저 `Options`에서 `Plugins Manager`를 클릭합니다.

<img width="287" alt="1" src="https://user-images.githubusercontent.com/56301069/133524836-db1c3e6d-3ab4-481a-8498-3d4fe04a48be.png">

`Plugin Manager`메뉴에서 `Available Plugins`를 클릭한 후 다음의 플러그인들을 설치합니다.

- 3 Basic Graphs
- 5 Additional Graphs
- KPI vs KPI Graphs

그 후 `Test Plan -> Add -> Listener`에서 다음의 `Listener` 들을 추가합니다.

<img width="309" alt="스크린샷 2021-09-16 오전 8 24 34" src="https://user-images.githubusercontent.com/56301069/133525793-4f1f8314-cb27-4db2-8bff-ccd31ec70a5a.png">

### View Results Tree

다음과 같이 왼쪽 패널에서는 테스트 요청이 실패했는지 성공했는지를 나타내고, 오른쪽 패널에서는 요청 및 응답에 대한 정보들을 표시해줍니다.

오른쪽 패널에는 `AccessLog`에 추가적인 정보가 조금 더 들어가 있는 거라고 생각하시면 됩니다.

<img width="1052" alt="4" src="https://user-images.githubusercontent.com/56301069/133526408-50494a85-2b0a-4d36-897f-e7e1a6896fcb.png">

### Summary Report
테스트의 통계를 보여줍니다.

<img width="999" alt="3" src="https://user-images.githubusercontent.com/56301069/133526477-a4f305d7-621b-404d-ac46-c27a74290ad9.png">

- `Samples`: 테스트 서버로 보낸 요청의 수
- `Average`: 평균 응답 시간(ms)
- `Min`: 최소 응답 시간(ms)
- `Max`: 최대 응답 시간(ms)
- `Throughput`: 처리량은 전체 요청 수를 총 시간으로 나눈 값(`처리량 = 전체 요청 수 / 전체 시간`)입니다. 전체 시간은 첫 번째 샘플의 시작부터 마지막 샘플의 끝까지입니다.

## 테스트 실행
먼저 어플리케이션에서 `HOST`와 `PORT`에 맞는 웹 어플리케이션을 실행합니다. 그 후 `JMeter`메뉴바에서 실행 버튼을 눌러 테스트를 실행합니다.

<img width="458" alt="스크린샷 2021-09-16 오전 8 25 26" src="https://user-images.githubusercontent.com/56301069/133525856-c0eb4813-74a0-4cf9-b0ef-45b4b665368d.png">

그 후 추가한 리스너들을 눌러 결과를 확인합니다.

> 터미널에서 커맨드를 통해 실행된 JMeter는 커맨드가 종료되면 설정이 모두 없어집니다. 반드시 저장 버튼을 클릭해서 설정들을 저장해야 합니다.

### 테스트 초기화
이전까지의 테스트 기록들을 초기화하고 새로 테스트 결과를 기록하고 싶다면, 메뉴바에서 `Clean All` 버튼을 클릭합니다.

<img width="755" alt="2" src="https://user-images.githubusercontent.com/56301069/133525670-374a45f5-86c3-479e-be5d-95ac696b30e5.png">

## JMeter 실행 시 발생하는 예외
만약 JMeter 실행 시 예외가 발생한다면, 예외 이름에 해당하는 링크를 참조해주세요.

- [[JMeter] JavaNativeFoundation](https://hsik0225.github.io/jmeter/2021/09/16/JMeter-JavaNativeFoundation/)
- [[JMeter] Uncaught Exception java.lang.IllegalAccessError](https://hsik0225.github.io/jmeter/2021/09/16/JMeter-Uncaught-Exception-java.lang.IllgalAccessError/)

## nGrinder와 JMeter TPS 비교
`nGrinder`에서의 TPS와 `JMeter`에서의 TPS가 같이 나올지 궁금해서 확인해보았습니다.

nGrinder의 설정과 JMeter 설정을 같게 설정하고 테스트 한 결과, JMeter의 TPS가 가끔 떨어지긴 하지만 비슷한 그래프가 나온 것을 확인할 수 있었습니다.

### nGrinder
<img width="1239" alt="스크린샷 2021-10-07 오후 7 26 32" src="https://user-images.githubusercontent.com/56301069/136367378-ccf3bf82-f303-4c22-97e3-b5f691c0981d.png">

### JMeter
![TPS](https://user-images.githubusercontent.com/56301069/136367159-6bc3de52-414f-494f-9880-5b620caf29bf.png)

## Reference
- [맥에서 Brew로 자바 설치하기](https://llighter.github.io/install-java-on-mac/)
- [생활코딩 JMeter 강좌](https://www.youtube.com/watch?v=1AyxqIePusA)
- [테스트 명장, Apache JMeter](https://jybaek.tistory.com/889)
- [[JMeter] Apache JMeter 설치 및 트래픽 부하 테스트](https://hayden-archive.tistory.com/398)
- [[테스트] JMeter와 성능 테스트](https://12bme.tistory.com/272)
