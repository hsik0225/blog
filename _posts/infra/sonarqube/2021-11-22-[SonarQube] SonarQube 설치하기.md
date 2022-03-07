---
layout: post
title: "[SonarQube] 소나큐브 설치하기"
categories: [SonarQube, Jenkins, Tool]
---

소나큐브는 코드에서 버그, 취약점, 코드 스멜을 감지하는 자동 품질 검사 도구입니다.

# Why Use?

- `코드 품질(Quality code)` : 복잡성, 취약점, 코드 중복 등을 줄여 어플리케이션을 최적화합니다.
- `오류 감지(Detect Errors)` : 의도하지 않은 동작이 사용자에게 영향을 끼치는 버그를 잡아냅니다.
- `기술 향상(Enhance developer skills)` : 코드에 대한 정기적인 피드백은 개발자가 코딩 기술을 향상하는 데 도움이 됩니다.

# Analyzing with SonarQube Scanner for Gradle
![image](https://user-images.githubusercontent.com/56301069/146433952-b688bb4b-1c14-42b6-9e98-99022ecdbb44.png)


소나큐브의 동작 흐름은 다음과 같습니다.

1. 개발자는 개발하고 코드를 DevOps 플랫폼에 보냅니다.
2. CI 도구들은 단위 테스트를 확인, 빌드 및 실행하고, 소나큐브 스캐너는 그 결과를 분석합니다.
3. 스캐너는 소나큐브 서버에 결과를 게시하고, 결과에 대한 피드백을 제공합니다.

1번은 개발자가, 3번은 소나큐브가 알아서 해주므로 저희는 2번을 해야 합니다.

## Environment
- Sonarqube 8.9.4-community
- Jenkins 2.319.1
- Gradle 7.0.2

## 1. 설치
설치는 docker를 통해 진행했습니다.

따로 설치를 원하시는 분은 [소나큐브 다운로드](https://www.sonarqube.org/downloads/?gads_campaign=Asia-SonarQube&gads_ad_group=SonarQube&gads_keyword=sonarqube&gclid=Cj0KCQiA5OuNBhCRARIsACgaiqUgii6OsetGX46aZOdMgbnES01gD5j7JHiZS4q2fb7PtMRSq3c8R44aAuCKEALw_wcB) 에서 파일을 다운받을 수 있습니다.

```bash
sudo docker pull sonarqube:lts-community

sudo docker run -d --restart=always \ 
-e TZ=Asia/Seoul \ 
--name sonarqube -p 9000:9000 \ 
sonarqube:lts-community
```

## 2. 프로젝트 생성

1. http://[설치한 컴퓨터의 IP 주소]:9000 에 접속합니다.
2. 기본 계정(`id`:admin, `password`:admin)으로 접속합니다.
3. 프로젝트를 생성합니다.
   ![image](https://user-images.githubusercontent.com/56301069/146434754-2290b444-ad06-44e7-b90a-5cd9dddcca38.png)

   원하는 토큰 이름을 입력하고 토큰을 생성합니다.
   ![image](https://user-images.githubusercontent.com/56301069/146434482-122c7536-9768-451a-9f78-a13ccf0de34a.png)

   발급된 token을 확인하고 `Continue` 버튼을 누릅니다.
   ![https://user-images.githubusercontent.com/37354145/128582786-ba031852-c158-48c0-a367-3534cafb11d7.png](https://user-images.githubusercontent.com/37354145/128582786-ba031852-c158-48c0-a367-3534cafb11d7.png)


## 3. `build.gradle`에 소나큐브 태스크 설정

`build.gradle`에 플러그인과 `sonarqube` 프로퍼티를 설정합니다.

다음은 주로 사용하는 소나큐브 프로퍼티들입니다.

- Server
    - `sonar.host.url` : 서버 URL, 기본 값은 `http://localhost:9000`

- Authentication
    - `sonar.login` : 소나큐브 서버에서 생성한 토큰 혹은 사용자 이름(username)
    - `sonar.password` : 만약 토큰을 사용한다면 비워둡니다. 그렇지 않고 사용자 로그인을 한다면, 사용자 이름에 대한 비밀번호입니다.

- Project Configuration
    - `sonar.projectKey` : 소나큐브 서버에서 지정한 프로젝트 이름
    - `sonar.sources` : main 소스 파일이 포함된 디렉토리 경로입니다. sonar.sources, sonar.tests 모두 지정하지 않을 경우 프로젝트 기본 디렉토리가 기본 값입니다.
    - `sonar.tests` : test 소스 파일이 포함된 디렉토리 경로입니다. 기본 값은 빈 값입니다.
    - `sonar.sourceEncoding` : UTF-8과 같은 소스 파일의 인코딩입니다. 기본 값은 System encoding에 따릅니다.
    - `sonar.exclusions` : 분석에서 제외할 파일들의 패턴. 예를 들어,  `**/Q*`, `**/dto/**`

- Java Analysis and Bytecode

  하나 이상의 `java` 파일을 가진 프로젝트는 컴파일된 `.class` 파일들이 필요합니다. `.class` 파일들이 제대로 제공되지 않으면 분석에 실패합니다.

    - `sonar.java.binaries` (필수) : 소스 코드의 바이트코드 파일을 가지고 있는 디렉토리의 경로
    - `sonar.java.test.binaries` : 테스트 코드의 바이트코드 파일을 가지고 있는 디렉토리의 경로

- Test coverage analysis parameters
    - `sonar.coverage.jacoco.xmlReportPaths` : JaCoCo XML 커버리지 리포트 경로입니다. 와일드카드를 사용하여 경로를 지정할 수 있습니다.


> 인터넷에서 자주 보이는 `sonar.language` 는 Deprecated된 옵션입니다!
>
>
> [https://community.sonarsource.com/t/why-sonar-language-dont-work/33935](https://community.sonarsource.com/t/why-sonar-language-dont-work/33935)
>

다음은 저희 프로젝트에서 사용하는 소나큐브 설정입니다.

```groovy
plugins {
    // 가장 최신 버전인 3.3 버전으로 지정
    id "org.sonarqube" version "3.3"
}

sonarqube {
    properties {
        property "sonar.projectKey", "<project_key>"

        property "sonar.java.binaries", "${buildDir}/classes"
        property "sonar.sourceEncoding", "UTF-8"
        property "sonar.sources", "src/main/java"
        property "sonar.exclusions", "**/util/**, **/support/**, **/dto/**"

        property "sonar.tests", "src/test/java"
        property "sonar.test.inclusions", "**/*Test.java"
        property "sonar.coverage.jacoco.xmlReportPaths", "${buildDir}/reports/jacoco/test/jacocoTestReport.xml"
    }
}
```

코드 커버리지 측정을 위해 `jacoco` 속성을 추가했습니다.

## 4. CI/CD 도구와 연동하기

지금도 다음과 같이 `sonarqube` 태스크를 실행하면 소나큐브 서버에 분석 결과가 게시됩니다.

```bash
$ ./gradlew sonarqube \
  -Dsonar.projectKey=<project_key> \
  -Dsonar.host.url=<host_url> \
  -Dsonar.login=<token>
```

하지만 로컬에서 코드를 푸시할 때마다 손으로 `sonarqube`를 실행시켜주면 귀찮으며, 까먹고 안하게 될 때도 있으므로 CI/CD 도구에게 그 일을 맡겨봅시다.

다음 링크들에서 CI/CD 도구에 맞는 연동 방법을 확인할 수 있습니다.

- [[Jenkins] Jenkins와 SonarQube 연동하기]()

# Reference

- [https://docs.sonarqube.org/latest/](https://docs.sonarqube.org/latest/)
- [https://www.loginradius.com/blog/async/sonarqube/](https://www.loginradius.com/blog/async/sonarqube/)
- [https://hyeon9mak.github.io/install-sonarqube/](https://hyeon9mak.github.io/install-sonarqube/)
- [https://velog.io/@max9106/정적-분석-with-Jacoco-SonarQube](https://velog.io/@max9106/%EC%A0%95%EC%A0%81-%EB%B6%84%EC%84%9D-with-Jacoco-SonarQube)
