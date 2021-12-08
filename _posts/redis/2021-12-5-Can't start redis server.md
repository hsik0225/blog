---
layout: post
title: "[Redis] Can't start redis server"
categories: [Redis]
---

`it.ozimov/embedded-redis` 에서 발생하는 예외 해결 방법

### Environment
- Spring Boot 2.6.1
- it.ozimov/embedded-redis 0.7.2
- Jenkins 2.319.1

### 문제 상황
젠킨스 빌드를 실행하면서 내장 레디스를 사용하는 테스트에서 위와 같은 에러가 발생하며 테스트가 빌드가 실패했습니다.

### 원인 분석
코드를 확인해보니 내장 레디스를 사용하는 테스트마다 레디스 서버를 띄우고 있었고, 해당 레디스 서버는 포트를 점유했습니다. 만약 다른 프로세스(내장 레디스 포함)가 사용 중인 포트로 레디스 서버를 생성하려고 하면 `Can't start redis server` 예외가 발생했습니다.

### 해결 방법
- 테스트마다 다른 레디스 서버를 사용할 필요가 없으므로 레디스 서버가 1개만 생성되도록 했습니다.
- 레디스 서버가 사용할 포트를 사용하고 있는 프로세스가 있는지 확인합니다. 만약 없다면 지정한 포트로 레디스 서버를 생성하고, 있다면 사용 가능한 다른 포트를 찾아 지정했습니다.

1. 사용하고 있는 컴퓨터에서 `net-tools` 패키지를 설치합니다.
    ```bash
    # 터미널에서 netstat 입력
    # 다음과 같이 나온다면 설치되어 있는 것
    $ netstat
    Active Internet connections
    Proto Recv-Q Send-Q  Local Address          Foreign Address        (state)
    ...
    
    # 다음과 같이 나온다면 설치되어 있지 않은 것
    $ netstat
    netstat: command not found
    
    # net-tools 패키지 설치
    $ sudo apt-get install -y net-tools
    ```


2. 레디스 서버를 생성하기 전에 `netstat` 명령어로 지정한 포트를 사용하고 있는 프로세스가 있는지 확인합니다.
    ```java
    private boolean isRedisRunning() throws IOException {
      return isRunning(executeGrepProcessCommand(redisPort));
    }
    
    private boolean isRunning(Process process) {
      String line;
      StringBuilder pidInfo = new StringBuilder();
    
      try (BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
    
          while ((line = input.readLine()) != null) {
              pidInfo.append(line);
          }
    
      } catch (Exception e) {
          log.error("EmbeddedRedis 실행 중 에러 발생", e);
      }
          
          // 입력한 명령어에 대한 결과가 존재한다면 포트를 사용중인 것
      return org.springframework.util.StringUtils.hasText(pidInfo.toString());
    }
    
    // 지정한 포트를 사용하고 있는 프로세스가 있는지 확인
    private Process executeGrepProcessCommand(int port) throws IOException {
      String command = String.format("netstat -nat | grep LISTEN|grep %d", port);
      String[] shell = {"/bin/sh", "-c", command};
      return Runtime.getRuntime().exec(shell);
    }
    ```


3. 레디스 서버를 생성합니다.
- 만약 어떤 프로세스도 사용하고 있지 않다면, 지정한 포트로 레디스 서버를 생성합니다.
- 만약 한 프로세스가 사용하고 있다면, 다른 포트로 변경 후 포트 사용 여부를 확인합니다.

    ```java
    public int findAvailablePort() throws IOException {
    
        for (int port = 10000; port <= 65535; port++) {
            Process process = executeGrepProcessCommand(port);
            if (!isRunning(process)) {
                return port;
            }
        }
    
        throw new IllegalArgumentException("Not Found Available port: 10000 ~ 65535");
    }
    ```


<br>
전체 코드로 보면 다음과 같습니다.

```java
@Configuration
public class EmbeddedRedisConfig {

    private static final Logger log = LoggerFactory.getLogger(EmbeddedRedisConfig.class);

    @Value("${spring.redis.port}")
    private int redisPort;

    private static RedisServer redisServer = null;

    @PostConstruct
    public void redisServer() throws IOException {
        if (Objects.isNull(redisServer)) {
            if (isRedisRunning()) {
                redisPort = findAvailablePort();
            }

            log.info("Embedded Redis Using Port : {}", redisPort);
            redisServer = new RedisServer(redisPort);
            redisServer.start();
        }
    }

    @PreDestroy
    public void stopRedis() {
        if (redisServer != null) {
            redisServer.stop();
        }
    }

    /**
     * Embedded Redis가 현재 실행중인지 확인
     */
    private boolean isRedisRunning() throws IOException {
        return isRunning(executeGrepProcessCommand(redisPort));
    }

    /**
     * 현재 PC/서버에서 사용가능한 포트 조회
     */
    public int findAvailablePort() throws IOException {

        for (int port = 10000; port <= 65535; port++) {
            Process process = executeGrepProcessCommand(port);
            if (!isRunning(process)) {
                return port;
            }
        }

        throw new IllegalArgumentException("Not Found Available port: 10000 ~ 65535");
    }

    /**
     * 해당 port를 사용중인 프로세스 확인하는 sh 실행
     */
    private Process executeGrepProcessCommand(int port) throws IOException {
        String command = String.format("netstat -nat | grep LISTEN|grep %d", port);
        String[] shell = {"/bin/sh", "-c", command};
        return Runtime.getRuntime().exec(shell);
    }

    /**
     * 해당 Process가 현재 실행중인지 확인
     */
    private boolean isRunning(Process process) {
        String line;
        StringBuilder pidInfo = new StringBuilder();

        try (BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()))) {

            while ((line = input.readLine()) != null) {
                pidInfo.append(line);
            }

        } catch (Exception e) {
            log.error("EmbeddedRedis 실행 중 에러 발생", e);
        }

        return StringUtils.hasText(pidInfo.toString());
    }
}
```
