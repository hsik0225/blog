---
layout: post
title: "[SonarCloud] 소나클라우드로 PR에서 코드 분석 결과 확인하기"
categories: [SonarQube, SonarCloud, Tool]
---

소나클라우드는 클라우드 기반 코드 분석 서비스입니다.

깃허브에 PR을 보내면 해당 코드를 소나큐브로 정적 분석을 한 뒤 PR에 해당 결과를 표시합니다.
![image](https://user-images.githubusercontent.com/56301069/146436801-94d40ea2-f2e4-42ba-8c65-20fd72fa4c5f.png)

소나클라우드의 PR 분석은 새로 작성된 코드만 분석을 진행합니다.
그래서 새로 추가된 코드가 커버리지와 같은 지정한 조건을 잘 만족했는지를 쉽게 파악할 수 있습니다.


다음과 같이 Quality Gate를 만들어서 지정한 조건을 만족시키지 않으면 `Failed`라고 표시하며, 조건을 만족할 때까지 머지가 안되도록 할 수도 있습니다.
![image](https://user-images.githubusercontent.com/56301069/146436856-bc10fba1-300c-4ba1-80d6-b06a000f1f89.png)

> [SonarQube에서 제공하는 Github 연동 서비스](https://www.sonarqube.org/github-integration/?gads_campaign=Asia-SonarQube&gads_ad_gr%5B) 는 유료이지만,
SonarCloud는 GitHub Public Repository에 한해서 무료로 이용할 수 있습니다!!

# SonarCloud 설정 방법
## 1. 소나 클라우드에 프로젝트 추가

1. [https://sonarcloud.io/](https://sonarcloud.io/) 에서 `GitHub` 로그인을 합니다.
2. [https://sonarcloud.io/projects](https://sonarcloud.io/projects) 에서 `Favorite project from your ogrs`를 클릭하고 소나클라우드를 적용하고 싶은 레포지토리의 organization을 클릭합니다.
   ![image](https://user-images.githubusercontent.com/56301069/146437034-e68b2c25-6f03-4742-a564-0beea2fee3d2.png)
3. `Create new project` > `Analyze projects`에서 `GitHub app configuration` 을 클릭합니다.
   ![image](https://user-images.githubusercontent.com/56301069/146437066-5cabffaa-ae63-4f28-8fad-199d2935c1d5.png)
4. SonarCloud의 `Configure`를 클릭합니다.
   ![image](https://user-images.githubusercontent.com/56301069/146437107-eac96d79-d8a0-46cd-92ed-fb5ca1c8848e.png)
5. `Repository access`에서 추가하고자 하는 레포지토리를 선택하고 `Save`를  눌러 저장합니다.
   ![image](https://user-images.githubusercontent.com/56301069/146437172-e5d2060c-bb45-46c4-b58a-b90b18864059.png)
6. 다시 `Analyze projects` 로 돌아와서 자신이 추가한 레포지토리를 클릭하고 `Set Up` 버튼을 누릅니다.
   ![image](https://user-images.githubusercontent.com/56301069/146437203-b02105ad-cb4b-413d-847f-f4ee36829a0a.png)


## 2. 자동 분석 활성화

다음 사진과 같이 `sonarcloud`가 PR에 자동으로 코드 분석 결과를 알려주려면 자동 분석을 활성화해야 합니다.
![image](https://user-images.githubusercontent.com/56301069/146437232-0139e5d5-ff8d-41e5-9519-6185d51c3363.png)


생성한 프로젝트에서 `Administration` > `Analysis Method`에 들어갑니다.
![image](https://user-images.githubusercontent.com/56301069/146437259-1d7f6c68-a6f6-42d9-be5f-f0509f2387c2.png)


`SonarCloud Automatic Analysis`를 활성화합니다.
![image](https://user-images.githubusercontent.com/56301069/146437295-a4ee0cf7-c1e0-49ec-b816-a6cded86a4e6.png)

> 깃허브에 코드를 푸시 혹은 PR 요청을 보내면, 젠킨스에서 소나큐브를 실행하고, 그 결과를 PR 코멘트에 작성하는 줄 알알았습니다. 
> 
> 그래서 젠킨스 설정을 건드리면서 몇 시간동안 삽질했네요.. 😥
> 
> 여러분들은 삽질하지 않기를 바랍니다.
>

프로젝트의 레포지토리에서 PR을 요청하면 이렇게 코멘트가 달리는 것을 확인할 수 있습니다.
![image](https://user-images.githubusercontent.com/56301069/146437722-6ff376b5-d1c7-477a-a64f-69a3fe77a0af.png)

추가로 `Administration` > `General Settings` > `Analysis Scope`에서 어떤 파일을 분석할 것인지, 어떤 파일을 커버리지 측정안할 것인지 등 자동 분석에 대한 추가 설정을 할 수 있습니다.
![image](https://user-images.githubusercontent.com/56301069/146437767-06500e7f-2248-48df-bc1b-6647261a60c5.png)

[https://sonarcloud.io/documentation/advanced-setup/automatic-analysis/](https://sonarcloud.io/documentation/advanced-setup/automatic-analysis/) 에서 `Analysis Scope`에 대한 자세한 설명을 확인할 수 있으니 참고바랍니다!


# Reference

- [https://sonarcloud.io/documentation/](https://sonarcloud.io/documentation/)
- [https://hyeon9mak.github.io/sonarcloud-trouble-shooting/](https://hyeon9mak.github.io/sonarcloud-trouble-shooting/)
- [https://stackoverflow.com/questions/54591822/how-to-integrate-sonarcloud-with-github-and-jenkins](https://stackoverflow.com/questions/54591822/how-to-integrate-sonarcloud-with-github-and-jenkins)
- [https://blog.jdriven.com/2019/08/sonarcloud-github-pull-request-analysis-from-jenkins/](https://blog.jdriven.com/2019/08/sonarcloud-github-pull-request-analysis-from-jenkins/)
- [https://docs.sonarqube.org/latest/analysis/pull-request/](https://docs.sonarqube.org/latest/analysis/pull-request/)
