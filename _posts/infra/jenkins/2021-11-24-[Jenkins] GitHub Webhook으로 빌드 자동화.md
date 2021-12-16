---
layout: post
title: "[Jenkins] GitHub Webhooks로 빌드 자동화"
categories: [Jenkins, Tool]
---

GitHub Webhooks를 이용하여 젠킨스의 Job을 자동으로 실행합니다.

# Environment
- Jenkins 2.303.3

# 1. GitHub Webhooks

### Webhook이란?

Webhooks란, 리포지토리에 변경 사항이 있을 때마다 지정한 URL로 신호를 보내는 것입니다. 웹훅을 이용하면 리포지토리의 변경을 자동으로 빌드 서버에게 알려주기 때문에, CI&CD를 자동화할 수 있습니다.

1. GitHub에 로그인 한 후 Webhook을 설정할 저장소를 들어갑니다.
2. 웹훅 설정 페이지로 이동합니다.  **`Settings` > `Webhooks`  > `Add webhook` 에 들어갑니다.**
   ![image](https://user-images.githubusercontent.com/56301069/146336267-0adc1e5d-047f-43e9-91c2-2e8f634fd0f6.png)
  ![image](https://user-images.githubusercontent.com/56301069/146336274-4570425c-5eb2-49ce-b2c6-c2608872085f.png)

3. Webhooks을 설정합니다.
- Payload URL: http://<Jenkins서버 IP>:<port>/github-webhook/
  - Payload 입력 시 `github-webhook/` 와 같이 끝에 `/` 를 꼭 붙여야 합니다!
- `Which events would you like to trigger this webhook?`에서 `Just the push event` 선택합니다.
  ![image](https://user-images.githubusercontent.com/56301069/146336288-9e11341d-7d32-4035-992a-fbd70b073596.png)

<br>

  웹훅을 만들고 나면 다음과 같이 설정한 Payload URL 옆에 녹색으로 체크 표시가 되어 있어야 합니다.
![image](https://user-images.githubusercontent.com/56301069/146336294-c097cbcd-1e37-4bf9-9abb-955732ea08e8.png)

다음과 같이 `빨강색 삼각형`으로 표시될 경우 payload가 URL에 전달되지 않았다는 것을 의미합니다.
  ![image](https://user-images.githubusercontent.com/56301069/146336298-92a37fe5-2a46-41f6-9c08-fd3498d685c7.png)

Webhook에서 Payload URL을 수정한 후에 `Recent Deliveries` - `Redeliver`를 클릭하여 다시 테스트를 해봅니다.
![image](https://user-images.githubusercontent.com/56301069/146336306-72ff1bce-3790-4358-a7e7-61f56b03f374.png)

# 2. GitHub Access Token
1. [https://github.com/settings/profile](https://github.com/settings/profile)에 접속 후, 왼쪽 메뉴에서 `Developer settings`를 클릭합니다.
2. 왼쪽 메뉴에서 `Personal access tokens` 를 클릭하고, `Generate new token`를 클릭하여 토큰을 생성합니다.
   ![image](https://user-images.githubusercontent.com/56301069/146336326-c7831109-ff4b-422c-b255-d0612dcd856c.png)


3. `New personal access token` 에서 토큰 설정을 합니다.

- `Note`: <원하는 access token 이름>
- Select scopes
  - `repo` 체크
  - `admin:repo_hook` 체크
    ![image](https://user-images.githubusercontent.com/56301069/146336334-e59ad28b-deab-4153-82b4-90bc750a3ce2.png)

4. `Generate toek`을 클릭하여 토큰을 생성합니다.
5. 생성된 token 값을 다른 곳에 적어둡니다.

# 3. Jenkins Trigger

### 1. GitHub 플러그인 설치

github webhook 연동을 위해 `Github Integeration Plugin`이 필요합니다.

1. Jenkins에 로그인하여 왼쪽의 `Jenkins 관리` > `플러그인 관리` > `설치 가능` 탭을 선택합니다.
2. `Github Integeration Plugin`을 체크하고, 아래의 ‘지금 다운로드하고 재시작 후 설치하기’를 선택합니다.

   > 처음 젠킨스를 부팅하고 재시작하는 것이라면 젠킨스가 다시 실행되는데 오랜 시간이 걸립니다.
   빠르게 진행하고 싶으시다면 재시작 하지말고 넘어가는 것을 추천드립니다!!

3. `플러그인 설치/업그레이드 중` 페이지에서 설치 진행을 확인합니다.
4. Jenkins가 재시작됩니다.
   ![image](https://user-images.githubusercontent.com/56301069/146336348-b60695f4-44b2-4b96-8e76-1b35d731cd01.png)

### 2. Jenkins credential 설정
1. `Jenkins 관리` - `Manage Credentials` - `Stoers scoped to Jenkins`의 Jenkins를 클릭합니다.
   ![image](https://user-images.githubusercontent.com/56301069/146336358-bfe35361-1abe-4bf0-ad4d-8ffc921c817d.png)

2. `Global credentials (unrestricted)`를 선택하고 왼쪽의 `Add Credentials` 버튼을 선택합니다.
3. credential 생성 페이지에서 아래와 같이 설정하고, 아래의 ‘OK’ 버튼을 선택하여 저장합니다.
   ![image](https://user-images.githubusercontent.com/56301069/146336368-e2c8c4bd-a144-4bf7-b61e-783728a69aeb.png)
  - `Kind` : Secret text
  - `Scope` : Global (Jenkins, nodes, items, all child items, etc)
  - `Secret` : {GITHUB PERSONAL ACCESS TOKEN}
  - `ID` : github-access-token
  - `Description` : github-access-token
 
> {GITHUB PERSONAL ACCESS TOKEN} 값은 깃허브에서 생성한 github-access-token 값입니다.
> 
> ID와 Description은 임의로 입력합니다.

4. 생성한 jenkins credential을 확인합니다.
   ![image](https://user-images.githubusercontent.com/56301069/146336373-0cec19de-b746-42ae-a219-cc8194ecec48.png)


### 3. github account를 위한 jenkins credential 생성

1. 위에서 access token을 등록한 것과 동일하게
   `Jenkins 관리` > `Manage credentials` > `Jenkins` > `Global credentials (unrestricted)` > `Add Credentials`  로 들어가서 credential을 하나 더 생성합니다.
2. 아래와 같이 설정하고, 아래의 ‘OK’ 버튼을 선택하여 저장합니다.

   ![image](https://user-images.githubusercontent.com/56301069/146336406-058a5953-06e3-4b90-adb8-aa7f19fbd6a0.png)
  - `Kind` : Username with password
  - `Scope` : Global (Jenkins, nodes, items, all child items, etc)
  - `Username` : {GITHUB ACCOUNT NAME}
  - `Password` : {GITHUB ACCOUNT PASSWORD}
  - `ID`:: github-account
  - `Description` : github account


> ID와 Description은 임의로 입력합니다.
>
> `Username`은 github 로그인 시 입력하는 이메일 주소가 아닙니다.
> 
> 깃허브에 로그인 한 후 [https://github.com/settings/profile](https://github.com/settings/profile) 에 들어갔을 때, Profile의 보이는 Name입니다.
![image](https://user-images.githubusercontent.com/56301069/146336390-c08d13fd-d82b-424f-8379-beb4252b3d59.png)
>

### 4. Github server 설정

1. Jenkins 메인 페이지에서 `Jenkins 관리` > `시스템 설정` > GitHub 영역을 찾습니다.
2. GitHub 설정 영역에서 `Add GitHub Server`를 선택합니다.
![https://lindarex.github.io/assets/images/2020-04-23-jenkins-github-webhook-setting/lindarex-jenkins-github-webhook-setting-031.png](https://lindarex.github.io/assets/images/2020-04-23-jenkins-github-webhook-setting/lindarex-jenkins-github-webhook-setting-031.png)

1. 아래와 같이 설정하고, 아래의 ‘저장’ 버튼을 선택하여 저장합니다.
  - `Name` : <깃헙 서버 이름>
  - `API URL` : https://api.github.com
  - `Credentials` : github-access-token
  - `Manage hooks` : 체크

> `Name`은 임의로 입력합니다.
> 
> `Credentials`는 github personal access token을 위해 생성한 jenkins credential 값입니다.
>

### 5. Jenkins 파이프라인 생성

1. jenkins 첫 페이지에서 왼쪽의 `새로운 Item` 메뉴를 선택합니다.
2. 아래와 같이 설정하고, 아래의 ‘OK’ 버튼을 선택하여 새로운 item(job)을 생성합니다.
  - Item name : <job 이름>
  - `Pipeline` 선택
3. Build Triggers에서 **`GitHub hook trigger for GITScm polling` 체크**
4. 파이프라인 스크립트 입력
  - SCM 스테이지에서 받은 마지막 브랜치가 설정되고, 이 브랜치에 변경이 없으면 빌드가 실행되지 않습니다.

   다음은 저희 프로젝트에서 사용하는 파이프라인 스크립트입니다.

   자신의 요구 사항에 맞춰 스크립트를 작성합니다.

      ```groovy
      pipeline {
          agent any
          stages{
              stage('SCM') {
                  steps {
                      git branch: "dev",
                      url: "https://github.com/foo/bar.git"
                  }
              }
      
                      stage('Test') {
                  steps {
                      dir('backend') {
                          sh './gradlew test'
                      }
                  }
              }
              
              stage('SonarQube analysis') {
                  steps {
                      withSonarQubeEnv('<위에서 지정한 소나큐브 서버 이름>') { 
                          dir('backend') {
                              sh './gradlew sonarqube'
                          }
                      }
                  }
              }
          }
      }
    ```

5. Item에서 **`Build Now`** 버튼을 통해 한번 실행하여 webhook을 받습니다. 끝!!

# Reference
- [Setup Github Webhook for Jenkins on Amazon Linux (AWS)](https://bhargavamin.com/how-to-do/setup-github-webhook-jenkins-amazon-linux-aws/)
- [https://wickso.me/jenkins/continuous-integration/](https://wickso.me/jenkins/continuous-integration/)
- [https://lindarex.github.io/jenkins/jenkins-github-webhook-setting/](https://lindarex.github.io/jenkins/jenkins-github-webhook-setting/)
