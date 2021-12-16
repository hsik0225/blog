---
layout: post
title: "[Heroku] Spring Boot Application 배포"
categories: [Heroku]
---

Heroku에서 Spring Boot Application을 빌드하고, 배포합니다.

# Environment
- heroku/7.59.2
- darwin-x64
- node-v12.21.0

# Create new app

1. [https://dashboard.heroku.com/apps](https://dashboard.heroku.com/apps) 에 접속한 후 `Create new app` 을 클릭하여 앱을 생성합니다.
![image](https://user-images.githubusercontent.com/56301069/145709864-72bd66cc-6633-4b4d-a674-2db7e63ede43.png)

2. 앱의 이름을 설정하고 앱을 생성합니다.
![image](https://user-images.githubusercontent.com/56301069/145709859-07ddc1bf-4b9d-4a09-9596-3e6a1f0e0a73.png)

3. `Settings` 탭에서 `Add buildpack` 버튼을 클릭합니다.
   ![image](https://user-images.githubusercontent.com/56301069/145709874-2fe8d6b4-c85b-44ec-a746-12f19bfa253c.png)

4. `gradle`을 클릭하고 저장합니다.
   ![image](https://user-images.githubusercontent.com/56301069/145709877-6ec8d261-70d0-4e7c-84d5-0f8c57e32278.png)

## Add-ons

- 프로젝트에서 MySQL을 사용한다면 [Heroku에서 MySQL 사용하기](https://hsik0225.github.io/heroku/2021/12/14/Heroku%EC%97%90%EC%84%9C-MySQL-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0/) 를 참고해주세요.
- 프로젝트에서 Redis을 사용한다면 [Heroku에서 Redis 사용하기](https://hsik0225.github.io/heroku/2021/12/15/Heroku%EC%97%90%EC%84%9C-Redis-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0/) 를 참고해주세요.

# Application 설정
## Config Vars

`application.properties`의 DATABASE_URL, PASSWORD와 같이 외부에서 지정해주는 옵션들을 설정합니다.

예를 들어 applicaiton.properties가 다음과 같이 되어 있을 경우,

```bash
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=${DATASOURCE_URL}
spring.datasource.username=${DATASOURCE_USERNAME}
spring.datasource.password=${DATASOURCE_PASSWORD}
```

`Settings` - `Config Vars`에서는 다음과 같이 설정합니다.
![image](https://user-images.githubusercontent.com/56301069/145709907-f9ce877f-f91e-4e6b-98d9-6c86193f49dc.png)


> Tip 💡 !!
> 
>`Settings` - `Config Vars`를 수정하면 자동으로 헤로쿠에 배포한 스프링 어플리케이션이 재실행됩니다.
> 
> `Config Vars`만을 수정했다면 코드를 수정하고 다시 Push하지 않아도 됩니다.
>
> 다이노 매니저는 다음 상황에서 어플리케이션을 재실행합니다.
> - 새로운 커밋을 헤로쿠 저장소에 푸시했을 때
> - `config vars`를 수정했을 때
> - `add-ons`를 추가하거나 삭제했을 때
> - `heroku restart`를 실행했을 때
>

### Build task

Gradle buildpack은 기본적으로 `./gradlew build -x test` 를 실행합니다.

만약 `./gradlew clean build`로 빌드 태스크를 변경하고 싶다면, 다음의 방법들로 heroku에서 설정을 변경합니다.

- Config Vars에서 GRADLE_TASK="clean build"를 추가합니다.
- 터미널에서 `heroku config:set GRADLE_TASK="clean build"`를 실행합니다.

## Procfile

루트 디렉토리로 이동합니다.

루트 디렉토리는 배포하고자 하는 폴더의 최상위 폴더입니다.

예를 들어 다음과 같은 프로젝트 구조에서 백엔드의 루트 디렉토리는 `backend/`입니다.

```bash
❯ ls
README.md backend/ frontend/
```

루트 디렉토리에서 `Procfile`을 생성합니다.

그 후 안에 `java -jar` 명령어를 작성합니다.

```bash
# 루트 디렉토리에서 java -jar 명령어와 함께 필요한 옵션들을 작성합니다.
❯ echo "web: java -Dlog4j2.formatMsgNoLookups=true -Dserver.port=\$PORT -Dspring.profiles.active=heroku -Duser.timezone=Asia/Seoul \$JAVA_OPTS -jar build/libs/*.jar" >> Procfile
```

## Heroku java version

`heroku/gradle`은 기본적으로 Java8 버전으로 빌드를 실행합니다.

다른 버전으로 변경하고 싶은 경우 루트 디렉토리에서 `system.properties`를 추가하고 안에 `java.runtime.version=${version}`을 작성합니다.

예를 들어 Java11을 사용하고 싶을 경우

```bash
# 루트 디렉토리에서
$ echo "java.runtime.version=11" >> system.properties
```

# Deploy

## Heroku Git Repository  추가

`Settings` 탭에서 App Information을 보시면 `Heroku git URL`이 적혀 있습니다.
![image](https://user-images.githubusercontent.com/56301069/145709916-7cd248d5-63a8-4ff0-af1b-ed750026e621.png)


해당 저장소를 프로젝트에 추가합니다. 프로젝트에서

```bash
$ git remote add <원격 저장소 이름> <Heroku git URL>
```

를 입력합니다.

### Backend 폴더와 Frontend 폴더 각각을 저장소에 추가

저희 프로젝트는 다음과 같이 backend 폴더와 frontend 폴더가 하나의 저장소에 들어있습니다.

```bash
❯ ls
README.md backend/ frontend/
```

backend에서는 `java jar`로, front는 `npm`으로 배포를 진행합니다. backend와 frontend에서 실행해야 할 스크립트가 다르기 때문에, 둘을 같은 헤로쿠 저장소에 추가하면 안됩니다.

그러므로 `front`와 `backend`는 다음과 같이 다른 원격 저장소 이름으로 각각 저장소를 추가합니다.

```bash
$ git remote add heroku-front <Heroku front git URL>
$ git remote add heroku-back <Heroku backend git URL>
```

## 헤로쿠에 Push

백엔드의 변경 사항을 커밋합니다.

```bash
❯ git add .
❯ git commit -m '백엔드 헤로쿠 배포 설정 추가'
```

### 프로젝트 저장소에 프론트와 백엔드 폴더가 같이 있을 경우

다음과 같이 프로젝트 저장소에 프론트와 백엔드 폴더가 같이 있다면,

```bash
❯ ls
README.md backend/ frontend/
```

`git subtree split`을 이용하여 백엔드 폴더만을 따로 분리하고 헤로쿠 저장소에 푸시해야 합니다.

```bash
# git push -f <원격 저장소 이름> `git subtree split --prefix <배포할 폴더 이름>`:master
# -f: 강제 푸시. 로컬의 커밋 이력을 강제로 원격에 저장

# git subtree split --prefix <배포할 폴더 이름>: <배포할 폴더 이름>만을 가진 새로운 커밋 생성

# git push -f <원격 저장소 이름> <커밋>:<브랜치>
# <원격 저장소>에 있는 <브랜치>에 <커밋>을 추가

❯ git push -f heroku-back `git subtree split --prefix backend`:master
```

### 프로젝트에 프론트 폴더만 있을 경우

다음과 같이 프로젝트 저장소에 `.git` 폴더와 프론트파일이 같이 있다면,

```bash
❯ ls -a
.git .gitignore gradle/ build.gradle src/
```

헤로쿠 설정을 추가한 커밋을 바로 헤로쿠 저장소에 푸시합니다.

```bash
❯ git push heroku-back master
```

# Check

배포가 끝나고 나면 다음과 같이 배포된 웹 사이트의 주소가 나옵니다.

해당 링크를 클릭하여 성공적으로 배포가 되었는지 확인해봅니다.

```bash
remote: -----> Compressing...
remote:        Done: 112.4M
remote: -----> Launching...
remote:        Released v65
remote:        https://dropthecode-server.herokuapp.com/ deployed to Heroku
remote: 
remote: Verifying deploy... done.
To https://git.heroku.com/dropthecode-server.git
   72ba5a9..1b0cb62  1b0cb6259421ec2d7a6f71b2f4903c2af2516109 -> master
```

<br>

웹 페이지가 정상적으로 출력되었습니다 👍

![image](https://user-images.githubusercontent.com/56301069/145709932-1499837f-2f5a-4285-9867-1a525d667cfa.png)


# Issue

```bash
Warning - The same version of this code has already been built: 
  72ba5a9c1260a45fbf5c828ef2e9077daa64a8dc
```

위 메시지는 헤로쿠 저장소에 있는 가장 최근 커밋과 푸시한 커밋이 같기 때문에 다시 배포해도 같은 결과가 나온다는 것을 의미합니다.

먼저 코드를 수정했는지를 확인합니다.

- 만약 코드를 수정했다면, 그 수정한 파일이 커밋이 되었는지 확인하세요.
- 만약 코드를 수정하지 않았다면, 푸시를 안하셔도 됩니다.
