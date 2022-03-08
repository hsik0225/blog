---
layout: post
title: "[Jenkins] Jenkins와 SonarQube 연동하기"
categories: [Jenkins, SonarQube]
---

SonarQube와 Jenkins로 코드를 자동으로 정적 분석하여 코드의 품질을 확인합니다.

> 이 글은 [[SonarQube] SonarQube 설치하기](https://hsik0225.github.io/sonarqube/jenkins/tool/2021/11/22/SonarQube-SonarQube-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0/) 글과 이어지므로, 이전 글을 먼저 읽는 것을 추천합니다.

## 1. Jenkins 설치
Jenkins를 설치하지 않았다면, 다음 [[Jenkins] Docker로 Jenkins 설치하기](https://hsik0225.github.io/jenkins/docker/2022/03/03/Jenkins-Docker%EB%A1%9C-Jenkins-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0/) 글을 참고하여 Jenkins를 설치해주세요. 

## 2. Jenkins에서 소나큐브 플러그인 설치 및 설정
1. `Jenkins 관리` > `플러그인 관리`에서 `SonarQube Scanner for Jenkins`를 찾아 설치합니다. 이 플러그인을 사용하면 소나 큐브 서버 연결 구성을 젠킨스 글로벌 설정에 모아서 관리할 수 있습니다.

2. `Jenkins 관리` > `Manage Credentials`에서 (global)을 클릭합니다.
   ![image](https://user-images.githubusercontent.com/56301069/146435548-c96ca2e3-c26a-41db-9718-b5b66ff0fe6f.png)

3. 왼쪽 메뉴에서 `Add Credentials`를 클릭합니다.
4. Kind를 Scretet Text로 한 후, 토큰과 다른 곳에서 식별될 ID를 입력합니다.
   ![image](https://user-images.githubusercontent.com/56301069/146435561-6423bbbc-428e-48b6-8386-5d87fcdfcdb0.png)
5. `Jenkins 관리` > `시스템 설정`에서 `SonarQube servers` 섹션을 찾습니다.
    1. `Environmet variables`를 체크합니다.
    2.  `Add SonarQube`를 클릭하고, 소나큐브 프로젝트 설정을 입력합니다.
        ![image](https://user-images.githubusercontent.com/56301069/146435690-d10b0228-9ac6-47b4-9e2b-ee5b49f972b1.png)

6. 젠킨스에서 소나큐브를 적용하고자 하는 Item의 `구성` 페이지로 이동합니다.
   - Item이 파이프라인일 경우 다음과 같이 스크립트를 작성할 수 있습니다.

        ```
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

## 3. 정상 동작 확인
소나큐브 서버로 가서 정상적으로 코드가 분석되었는지 확인합니다.
   ![image](https://user-images.githubusercontent.com/56301069/146435998-738ed68f-947a-4a12-a706-c039c44004f1.png)
