---
layout: post
title: "[JMeter] Graphs Generator Listener"
categories: [JMeter]
---

부하 테스트 결과들을 한 번에 추가해주는 `JMeter Plugin`

일일이 추가하기 귀찮은 Graphs Listener 들을 한 번에 추가해주는 플러그인입니다.

## 설치
JMeter를 실행하고 Options - Plugin Manager에서 추가하고 싶은 리스너들을 지원하는 플러그인들을 설치합니다.

지원하는 리스너들과 해당 리스너들이 포함되어 있는 플러그인은 다음과 같습니다.
- Active Threads Over Time(3 Basic Graphs)
- Response Times Over Time(3 Basic Graphs)
- Transactions per Second(3 Basic Graphs)

- Server Hits per Seconds(5 Additional Graphs)
- Response Codes per Second(5 Additional Graphs)
- Response Latencies Over Time(5 Additional Graphs)
- Bytes Throughput Over Time(5 Additional Graphs)

- Response Times vs Threads(KPI vs KPI Graphs)
- Transaction Throughput vs Threads(KPI vs KPI Graphs)

- Response Times Distribution(Distribution/Percentile Graphs)
- Response Times Percentiles(Distribution/Percentile Graphs)

## 설정
### user.properties
`homebrew`로 설치했을 경우 `user.properties`는 다음 경로에 있습니다.

```
/usr/local/Cellar/jmeter/{jmeter 설치 버전}/libexec/bin
```

user.properties 제일 아래에 다음과 옵션을 추가합니다.

```
jmeter.save.saveservice.autoflush=true
```

### Graphs Generator
1. 적용하고 싶은 `Test Plan`에 다음 2가지 리스너를 추가합니다.
- View Results Tree
- Graphs Generator Listener

> 다음과 같이 반드시 View Results Tree가 Graphs Generator Listener보다 위에 있어야 합니다.

<img width="242" alt="스크린샷 2021-09-21 오후 12 25 32" src="https://user-images.githubusercontent.com/56301069/134106969-7e2eb3e9-db20-4d51-a20b-9c86d4aa98a3.png">

2. `View Results Tree`에서 `Filename`에 View Results Tree가 결과 파일을 출력할 위치를 설정합니다.
![1](https://user-images.githubusercontent.com/56301069/134107136-c4bbfa03-e795-4150-a5e0-1dc6baf0079e.png)

3. Graphs Generator에서 옵션을 설정합니다.
다음은 제가 자주 사용하는 옵션들입니다.
![2](https://user-images.githubusercontent.com/56301069/134107141-3226fd48-d071-4675-a4b0-95f1797c6a7a.png)

- `Output Folder` : 생성될 CSV 혹은 PNG 파일이 저장될 위치
- `JMeter Results file` : 위에서 `View Results Tree`에서 지정한 파일 이름
- `User relative X axis time`: 실제 시간을 쓸 것인지 상대 시간을 쓸 것인지 정합니다.
    - True로 설정했을 때. 시간이 0 부터 시작해서 요청 처리가 끝날 때까지입니다.

      ![3](https://user-images.githubusercontent.com/56301069/134107311-217c113b-a289-41e5-a910-12bd187d1b39.png)

    - False로 설정했을 때. 실제 요청 시각을 기록합니다.

      ![4](https://user-images.githubusercontent.com/56301069/134107313-0672f4c0-fd3a-4ad7-a427-d798d86f5999.png)

- `Granulation time for samples`: 위 사진의 그래프에서 보이는 점들을 몇 초마다 찍을지 정합니다. 단위는 `ms`

테스트를 실행해보면 `csv` 파일 또는 `png` 파일이 생성된 것을 확인할 수 있습니다.

> 테스트로 생성된 csv 파일에서 `Throughput`의 단위는 `second`입니다.

# Reference
- [Graphs Generator Listener Plugin Docs](https://jmeter-plugins.org/wiki/GraphsGeneratorListener/)
