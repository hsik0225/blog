---
layout: post
title: "[JMeter] Non-GUI Commands"
categories: [JMeter]
---

JMeter를 Non-GUI 모드로 실행하는 방법

- `-n`: Non GUI Mode로 JMeter 스크립트를 실행합니다.
- `-t`: 주어진 경로에 존재하는 `.jmx` 파일을 실행합니다.
- `-l`: 실행 결과(`.csv`)를 저장할 경로를 지정합니다.
- `-e`: 테스트가 끝난 후 `.csv` 파일을 HTML 형식으로 변환합니다.
- `-g`: JMeter 스크립트를 실행하지 않고, `csv` 파일로부터 대시보드만을 생성합니다.
-  `-o`: `HTML` 결과를 저장할 경로를 지정합니다.

## Example

```bash
jmeter -n -t Results.jmx \
-l $(date "+%m-%d %H:%M:%S")/result.csv \ 
-e -o $(date "+%m-%d %H:%M:%S")/html
```

```bash
jmeter -g $(ls Reviewer-*.csv) -o html
```

# Reference
- [Learn to generate and analyse HTML intuitive reports in JMeter
](https://haquemousume.medium.com/learn-to-generate-and-analyse-html-intuitive-reports-in-jmeter-574dbe1fca72)
