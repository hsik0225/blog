---
layout: post
title: "[JMeter] PerfMon"
categories: [JMeter]
---

부하 테스트를 하는 서버의 상태를 모니터링하는 `JMeter Plugin`

부하 테스트 중인 어플리케이션의 CPU, Memory 사용량 등을 확인할 수 있도록 도와주는 플러그인입니다.

JMeter는 기본적으로 Tomcat이 아니면 서버의 메트릭을 검색하지 못합니다. 이런 한계를 극복하기 위해 서버 에이전트를 개발했습니다. 메트릭을 수집하고 TCP 또는 UDP 프로토콜을 통해 JMeter로 보냅니다. 그 후 Metrics Collector Listener 를 통해 해당 메트릭을 볼 수 있습니다.

위의 동작들이 잘 수행되기 위해서는 다음 것들을 체크해야 합니다.

1. 서버 에이전트는 원격 서버에서 동작하고 있어야 합니다.
2. JMeter 호스트와 원격 서버 간의 TCP 또는 UDP 연결은 기본적으로 `4444` 입니다.
3. `Metrics Collector Listener`가 Test Plan에 추가되어 있는지 확인합니다.

## 설치
아래의 링크에서 `agent`를 다운받습니다.
> [https://github.com/undera/perfmon-agent/blob/master/README.md](https://github.com/undera/perfmon-agent/blob/master/README.md)

## 서버 에이전트 실행
압축을 열면 다음의 파일들이 있습니다.

![5](https://user-images.githubusercontent.com/56301069/134107842-575fef09-bdc6-4738-b9c0-8374fb9b3706.png)

자신의 os에 맞는 스크립트로 파일을 실행합니다.

스크립트를 실행하면 다음과 같이 TCP와  UDP 연결을 `4444`번 으로 리스닝하고 있다는 것을 확인할 수 있습니다.

```bash
❯ sh ServerAgent-2.2.3/startAgent.sh
INFO    2021-09-16 02:40:10.607 [kg.apc.p] (): Binding UDP to 4444
INFO    2021-09-16 02:40:10.681 [kg.apc.p] (): Binding TCP to 4444
INFO    2021-09-16 02:40:10.689 [kg.apc.p] (): JP@GC Agent v2.2.3 started
```

JMeter가 서버 에이전트에 연결할 수 없는 경우 Result Collector에 메트릭이 표시되지 않으므로 부하 테스트를 실행하기 전에 JMeter 호스트에서 연결을 확인하는 것이 좋습니다. curl로 연결을 확인합니다.

```bash
# 서버 에이전트
❯ sh ServerAgent-2.2.3/startAgent.sh
INFO    2021-09-16 02:44:18.939 [kg.apc.p] (): Binding UDP to 4444
INFO    2021-09-16 02:44:18.984 [kg.apc.p] (): Binding TCP to 4444
INFO    2021-09-16 02:44:18.989 [kg.apc.p] (): JP@GC Agent v2.2.3 started

# JMeter 호스트
❯ curl 127.0.0.1:4444

# 서버 에이전트 - JMeter 호스트에서 요청이 들어옴
INFO    2021-09-16 02:45:16.023 [kg.apc.p] (): Accepting new TCP connection
ERROR   2021-09-16 02:45:16.028 [kg.apc.p] (): Error executing command
  
java.lang.UnsupportedOperationException: Unknown command [14]: 
  'GET / HTTP/1.1'
  	at kg.apc.perfmon.PerfMonMetricGetter.processCommand)
...
```

만약 `AWS EC2`의 보안 그룹 등으로 인해 기본 포트 `4444`가 아닌 다른 포트를 사용하고 경우, 뒤에 옵션을 추가합니다.

```bash
sh startAgent.sh --tcp-port 9000
```

## PerfMon Metrics Collector 설정
JMeter에서 `PerfMon Metrics Collector` Listener 를 추가합니다.

- `Servers to Monitor`에서 서버 에이전트의 `Host`및 `Port`와 함께 자신이 필요한 수집하고 싶은 설정들을 추가합니다.
- `Filename`에 파일을 저장할 위치와 이름을 지정합니다.

![6](https://user-images.githubusercontent.com/56301069/134108147-96ea8655-8e0c-49ef-be26-7aac890f2443.png)

## `csv` 파일을 `png` 파일로 변환
지금 상태로도 테스트는 정상 동작하지만 어플리케이션 모니터링 결과가 `perfmon.csv`과 같이 `csv`파일이기 때문에 결과를 한 눈에 이해하기 어렵습니다. `csv`파일을 그래프로 시각화해주는 플러그인을 사용하여, 더 쉽게 이해할 수 있도록 해봅시다.

`JMeterPluginsCMD.bat` 파일을 찾아서 심볼릭 링크를 연결해줍니다.

mac에서 `homebrew`로 설치하지 않았을 경우 `JMeterPluginsCMD.bat`는 다른 디렉토리에 있을 겁니다.

```bash
ln -s /usr/local/Cellar/jmeter/5.4.1/libexec/bin/JMeterPluginsCMD.sh plugin.sh
```

지금 `JMeterPluginCMD.sh`는 경로가 상대 경로로 되어 있기 때문에, 실행 시 오류가 발생합니다. plugin.sh를 열어서 경로를 수정해줍니다.

```bash
#!/bin/sh

java -Djava.awt.headless=true -jar /usr/local/Cellar/jmeter/5.4.1/libexec/lib/cmdrunner-2.2.jar --tool Reporter "$@"
```

JMeter를 이용한 부하 테스트 실행 및 모니터링 결과를 `png` 파일로 변환하는 쉘 스크립트를 작성합니다.

```bash
#!/bin/bash

JMETER_PATH=/Users/kimhyeonsik/Desktop/programming/jmeter
jmeter -n -t $JMETER_PATH/"$(ls -A1 | grep *.jmx)"

sudo sh plugin.sh --generate-png perfmon.png --input-jtl $JMETER_PATH/result/perfmon.csv --plugin-type PerfMon --width 1024 --height 768
```

그 후 쉘 스크립트를 실행하면 `perfmon.png` 파일이 생성됩니다.

![perfmon](https://user-images.githubusercontent.com/56301069/134108808-81aae3ed-f725-4d59-b14f-b3c4a8bb5cf8.png)

# Reference

- [JMeter PerfMon Wiki](https://jmeter-plugins.org/wiki/PerfMon/)
- [How to Monitor Your Server Health & Performance During a JMeter Load Test](https://www.blazemeter.com/blog/how-monitor-your-server-health-performance-during-jmeter-load-test)
- [Getting the graph of the CPU and Memory usage of a server during a JMeter load test in Jenkins](https://stackoverflow.com/questions/59732485/getting-the-graph-of-the-cpu-and-memory-usage-of-a-server-during-a-jmeter-load-t)
- [How to Use the JMeterPluginsCMD Command Line
  ](https://www.blazemeter.com/blog/how-use-jmeterpluginscmd-command-line)
