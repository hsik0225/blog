---
layout: post
title: "[Spark] Spark Logging Level 변경"
categories: [Spark]
---

`Spark`에서 로깅 레벨을 변경하는 방법

```
> Task :WebUIChessApplication.main()
17:24 DEBUG spark.route.Routes - Adds route: get, /, spark.RouteImpl$1@3498ed
17:24 DEBUG org.eclipse.jetty.util.log - Logging to Logger[org.eclipse.jetty.util.log] via org.eclipse.jetty.util.log.Slf4jLog
...
```

로그가 너무 많이 출력되서 내가 보고 싶은 로그를 확인하기 어렵다.
기본 로그 레벨이 DEBUG로 되어있기 때문에, DEBUG 로그들을 모두 출력한다.

이럴 때 로그 레벨을 설정해주면 로그의 양이 줄어 내가 원하는 로그를 찾기 쉽다.

로그를 처음부터 살펴보면 어떤 로거에 의해 로그가 출력되는지 알 수 있다. 나의 Spark 로그는 Slf4j를 이용하여 출력된다.

```
17:24 DEBUG org.eclipse.jetty.util.log - Logging to Logger[org.eclipse.jetty.util.log] via org.eclipse.jetty.util.log.Slf4jLog
```

## Slf4j 로그 설정

Sl4fj는 로그를 남기기 위한 공통 인터페이스이다.

Sl4fj로 logback 라이브러리를 이용하여 로그를 남기는 것이므로, 실제 로그를 남기는 것은 logback 라이브러리다. 그래서 logback 설정을 해줘야 한다.

Resources 폴더 최상단에 logback.xml 파일을 다음과 같이 생성한다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="true" scanPeriod="30 seconds">
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <Pattern>%d{HH:mm} %-5level %logger{36} - %msg%n</Pattern>
        </encoder>
    </appender>

    <root level="debug">
        <appender-ref ref="CONSOLE"/>
    </root>
</configuration>
```

이 설정 파일의 루트 요소는 `configuration` 이며, 해당 루트 요소 안에는 `appender`, `logger`, `,root` 등이다.

### `<appender>`
`<appender>`는 어디에 어떤 포맷으로 로그를 남길 것인지 정할 수 있는 방법을 제공한다. 여기서는 ConsoleAppender를 사용한다. ConsoleAppender는 콘솔에 로그를 어떤 포맷으로 출력할지 설정할 때 사용한다.

`<enccoder>`안의 Pattern에는 로그를 출력할 형태의 포맷을 지정한다.

- `%d{HH:mm}` : 로그가 출력되는 시간이 출력된다. 중괄호`{ }` 안은 이 시간의 포맷이다.
- `%-5level` :  로그 레벨을 5의 고정폭 값으로 출력하라는 것을 의미한다.
- `%logger` : logger의 이름을 축약해서 출력한다. 중괄호 `{ }` 안에는 length이다. 최대 자릿수를 의미한다.
- `%msg` : 사용자가 출력한 메세지가 출력된다.
- `%n` : 줄바꿈

### Log Level

아래로 갈수록 심각한 오류이다.

1. trace
2. debug
3. info
4. warn
5. error

### <logger>

logback 설정에서 logger라는 엘리먼트는 어떤 패키지 이하의 클래스에서 어떤 레벨 이상의 로그를 출력할지 결정할 때 사용한다.

```xml
<logger name="org.springframework" level="info"/>
<logger name="src.main.java.chess.view" level="debug" additivity="false">
    <appender-ref ref="CONSOLE"/>
</logger>
```

위 예시는

- `org.springframwork` 로 시작하는 패키지에 속한 클래스에서 출력하는 로그는 `info` 이상의 레벨에 해당하는 것으로 출력하라는 의미이다. 즉, info, warn, error 가 출력될 것이다.
- `src.main.java.chess.view`로 시작하는 패키지의 클래스에서는 debug 이상의 레벨에 해당하는 로그를 출력하라는 의미이다. 즉, debug, info, warn, error가 출력될 것이다

### <root>

모든 대상에 적용된다.

```jsx
<root level="debug">
    <appender-ref ref="CONSOLE"/>
</root>
```

- `level` : 로깅 레벨
- `<appender-ref>` :   어디에 출력할지 정한다. CONSOLE 이므로 콘솔에 출력

### Reference
- [SLF4J 이용하여 로그 남기는 방법 (with Logback)](https://enai.tistory.com/36)
