---
layout: post
title: "[Jenkins] Jenkins와 SonarCloud를 연동하여 PR 데코레이션"
categories: [Jenkins, SonarCloud]
---

Jenkins를 활용하여 SonarQube로 코드 정적 분석한 결과를 PR 코멘트로 확인해봅니다.

> 이 글은 [[SonarCloud] 소나클라우드로 PR에서 코드 분석 결과 확인하기](https://hsik0225.github.io/sonarqube/sonarcloud/tool/2021/11/23/SonarCloud-%EC%86%8C%EB%82%98%ED%81%B4%EB%9D%BC%EC%9A%B0%EB%93%9C/) 글과 이어지므로, 이전 글을 먼저 읽는 것을 추천합니다.

## 1. 소나큐브 설치 및 어플리케이션과 연동

먼저 코드 분석을 해주는 소나큐브를 설치하고, 코드를 분석할 어플리케이션에 소나큐브 의존성을 추가해야 합니다.

소나 큐브 설치 방법 및 어플리케이션과 연동하는 방법은 [[SonarQube] 소나 큐브 설치 및 Jenkins와 연동하기](https://hsik0225.github.io/sonarqube/jenkins/tool/2021/11/22/SonarQube-%EC%86%8C%EB%82%98%ED%81%90%EB%B8%8C/) 글을 참고해주세요.

## 2. 젠킨스에 소나큐브 서버를 설치하여 젠킨스와 소나클라우드를 연동

젠킨스에서 코드 분석 결과를 제출할 소나클라우드 서버를 추가합니다.

1. 소나클라우드에 로그인 한 후 [https://sonarcloud.io/account/security/](https://sonarcloud.io/account/security/) 로 이동한 후, `token`에 이름을 정하고 새로운 토큰을 생성합니다.
2. `Jenkins 관리` > `Manage Credentials`에서 (global)을 클릭합니다.
   ![img](https://user-images.githubusercontent.com/56301069/147365395-98f2cbce-07ce-45f9-b272-fa57a859a562.png)

    1. 왼쪽 메뉴에서 `Add Credentials`를 클릭합니다.
    2. Kind를 Scretet Text로 한 후, 토큰과 다른 곳에서 식별될 ID를 입력합니다.
       ![img_1](https://user-images.githubusercontent.com/56301069/147365351-4c3bb02c-4ce8-488c-85e9-7358a101854a.png)

3. `Jenkins 관리` > `시스템 설정`에서 `SonarQube servers` 섹션을 찾습니다.
    1. `Environmet variables`를 체크합니다.
    2. `Add SonarQube`를 클릭하고, 소나큐브 프로젝트 설정을 사진과 같이 입력합니다.
        - `Name` : SonarCloud
        - `Server URL` : [https://sonarcloud.io](https://sonarcloud.io/)
        - `Server authentication token` : 위에서 생성한 토큰 선택

          ![img_2](https://user-images.githubusercontent.com/56301069/147365353-c0be8cba-fda4-4ea5-b145-a2b9a2300977.png)

## 3. GitHub Webhooks 설정

GitHub에 Push 혹은 PR 요청이 오면 소나큐브가 코드 분석을 실행하도록 `Webhook`을 추가합니다.

1. 정적 코드 분석을 하고자 하는 GitHub 레포지토리로 이동합니다.
2. `Settings` > `Webhooks` > `Add webhook` 을 클릭합니다.
   ![img_3](https://user-images.githubusercontent.com/56301069/147365354-e60ae464-f902-47b7-82a3-337c56043d4f.png)

3. 웹훅을 생성합니다.
    - `PayLoad URL` : http://<Jenkins IP 주소:포트 번호>/multibranch-webhook-trigger/invoke?token=<토큰 이름, 마음가는대로 명명>
    - `Which events would you like to trigger this webhook?`
        - `Let me select individual events.` 클릭
          ![img_4](https://user-images.githubusercontent.com/56301069/147365355-15b89cbe-8186-4e1b-8cfd-17ebad54c200.png)

        - `Pushes`, `Pull requests` 클릭
          ![img_5](https://user-images.githubusercontent.com/56301069/147365356-24ac2c10-476f-4c5d-94af-466da28cd743.png)

    - `Add webhook`  클릭

## 4. GitHub Personal access token 생성

깃허브에 접근할 수 있는 사용자임을 확인시켜주는 `access token`을 생성합니다.

만약 이미 생성한 액세스 토큰이 있다면 해당 토큰을 사용합니다.

1. [https://github.com/settings/tokens](https://github.com/settings/tokens) 로 이동합니다.
2. `Generate new token` 을 클릭합니다.
    1. `Note` : 생성할 토큰의 이름. 다른 토큰과 구분가능한 이름으로 짓습니다.
    2. `Expiration` : 토큰의 유효 기간, 저는 길게 90일로 설정했습니다.
    3. `Select scopes` : `repo`를 선택합니다.
       ![스크린샷 2021-12-25 오전 9 04 33](https://user-images.githubusercontent.com/56301069/147374541-b8697aea-8b97-45c5-985e-928d234682a2.png)

    4. `Generate token` 을 클릭하여 토큰을 생성하고, 생성된 토큰을 저장해둡니다.

## 5. Webhook 플러그인 설치

젠킨스가 깃허브 요청을 받아 스크립트를 실행할 수 있도록 도와주는 `Multibranch Scan Webhook Trigger` 플러그인을 설치합니다.

1. `젠킨스 대시보드` > `Jenkins 관리` > `플러그인 관리` 에 들어갑니다.
2. `Multibranch Scan Webhook Trigger` 를 설치합니다.

## 6. Jenkinsfile 작성

깃허브로부터 웹훅 트리거가 오면 실행할 스크립트인 `Jenkinsfile`을 작성합니다.

프로젝트 내부에 `Jenkinsfile`을 작성합니다.

> Jenkinsfile에 확장자가 붙어 있을 경우 후에 설정할 때 오류가 발생할 수도 있으니 확장자가 없도록 작성해주세요.
>

젠킨스는 깃허브 저장소로부터 클론하여 내부의 Jenkinsfile 을 읽어 실행하기 때문에, Jenkinsfile은  `.git` 디렉토리가 존재하는 루트 디렉토리 내부에 작성해야합니다.

Jenkins Pipeline syntax에 맞춰서 스크립트를 작성합니다.

다음은 스크립트 예시입니다.

```java
pipeline {
    agent any
    stages{
        stage('SCM') {
            steps {
            	git branch: "dev",
                url: "https://github.com/hsik0225/dropthecode.git"
            }
        }

        stage('SonarCloud PR analysis') {
            steps {
                withSonarQubeEnv('SonarCloud') {

                    // backend 디렉토리 내부에 있는 gradlew를 실행합니다.
                    dir('backend') {
                        sh "./gradlew --info sonarqube \
                        	-Dsonar.projectKey=hsik0225_dropthecode \
                        	-Dsonar.organization=seed \
                        	-Dsonar.pullrequest.provider=GitHub \
                        	-Dsonar.pullrequest.github.repository=hsik0225/dropthecoe \
                        	-Dsonar.pullrequest.key=${CHANGE_ID} \
                        	-Dsonar.pullrequest.base=dev \
                        	-Dsonar.pullrequest.branch=${BRANCH_NAME}"
                    }
                }
            }
        }
    }
}
```

- `sonar.projectkey`, `sonar.organization`은 소나클라우드에서 추가한 프로젝트의 Information에 들어가면 볼 수 있습니다.
    1. [https://sonarcloud.io/projects](https://sonarcloud.io/projects) 로 이동합니다.
    2. 추가하고자 하는 저장소를 클릭합니다.
       ![img_7](https://user-images.githubusercontent.com/56301069/147365358-8588fe16-4529-497a-9316-913409df237d.png)

    3. `Information`을 클릭합니다.

       ![img_8](https://user-images.githubusercontent.com/56301069/147365359-44cbfe2a-6db9-4ca2-83aa-e8c36a040f16.png)
    4. 오른쪽 패널에 자신의 `Project Key`와 `Organization Key`가 적혀있습니다.

- `sonar.pullrequest.github.repository`는 어느 저장소에 PR을 작성할 것인지를 지정하는 옵션입니다. `<자신의 깃허브 아이디>`/`<저장소 이름>`의 형식으로 작성합니다.
- `sonar.pullrequest.base`는 PR이 어느 브랜치에 머지될 것인가를 지정하는 옵션입니다. 만약 feature 브랜치가 dev 브랜치에 머지된다면, dev를 적습니다.
- 다른 옵션들은 예시대로 작성합니다.

> Jenkinsfile과 소나큐브 설정(build.grale에서 설정)은 반드시 PR 요청 브랜치 혹은 PR이 머지되는 브랜치에 존재하고 있어야 하며, 존재하는 브랜치를 기준(위 스크립트에서 SCM 스테이지의 브랜치)으로 파이프라인 스크립트를 작성해야 합니다.

## 7. Multibranch Pipeline 생성 및 설정

깃허브 저장소에서 PR 정보를 가져와 스크립트를 실행할 수 있게 해주는 Multibranch Pipeline를 생성합니다.

1. `Mutlbranch Pipeline` 을 생성합니다.
    1. 젠킨스 대시 보드 > 새로운 Item 을 클릭합니다.
        1. 이름 : 젠킨스의 Item들 간 구분가능하도록 이름을 짓습니다.
        2. Multibranch Pipieline 을 클릭하고 OK를 클릭합니다.
2. 생성한 Multibranch Pipeline Item의 설정 페이지로 진입합니다.
    1. 젠킨스 대시보드에서 생성한 Multibranch Pipeline Item을 클릭합니다.
    2. `Configure`를 클릭합니다

       ![img_9](https://user-images.githubusercontent.com/56301069/147365360-8d1ba963-6c2f-46f1-b51e-5338db089914.png)


1. 코드를 분석할 레포지토리를 추가합니다.
    1. `Branch Sources` > `Add source` > `GitHub` 를 클릭합니다.
    2. 깃허브에서 추가하고자 하는 레포지토리의 저장소를 복사합니다.

       ![img_10](https://user-images.githubusercontent.com/56301069/147365361-ee8101c0-14eb-4652-9389-5ffd27a7f5fb.png)

    3. Repository HTTPS URL를 입력합니다.

       복사한 레포지토리 저장소에 깃허브에서 생성한 토큰을 추가하여 작성합니다.

        ```java
        // 형식
        https://<GitHub에서 생성한 Access Token>@github.com/<깃허브 아이디>/<저장소>.git
        
        // 예시
        https://accesstoken@github.com/hsik0225/chess.git 
        ```

       > 젠킨스에서 `Validate` 버튼을 눌렀을 때 ERROR 가 나와도 정상적으로 동작합니다.
       >

       ![img_11](https://user-images.githubusercontent.com/56301069/147365362-bba590f2-f6d9-4316-b726-07abb1b20b90.png)

    4. 위에서 생성한 Jenkinsfile의 경로를 입력합니다. Jenkins 파일 경로는 `.git` 디렉토리가 존재하는 디렉토리를 기준으로 입력합니다.

       만약 Jenkins 파일이 `.git` 디렉토리가 있는 디렉토리의 backend 디렉토리에 있을 경우 backend/Jenkinsfile 을 입력합니다.
        ```java
        $ ls -a
        .git backend
    
        $ ls backend
        Jenkinsfile gradlew src
        ```

    5. `Scan Multibranch Pipeline Triggers`에서 `Scan by webhook`을 체크하고, 토큰 이름을 입력합니다.

       토큰 이름은 깃허브 웹훅에서 설정한 token=`<토큰 이름>` 입니다.

       ![img_13](https://user-images.githubusercontent.com/56301069/147365364-ff1443f5-dd7a-487a-b4a4-f56099406608.png)

       ![img_14](https://user-images.githubusercontent.com/56301069/147365365-66efa35b-2bdd-4844-ba44-e1ed95d4b773.png)


## 8. 젠킨스 빌드 트리거
저장소에서 PR을 요청하면,  다음과 같이 작성한 PR에 대한 젠킨스의 빌드가 실행됩니다.
![img_16](https://user-images.githubusercontent.com/56301069/147365367-e92e254f-3fe3-4332-8f09-aafbc35d2c3d.png)
