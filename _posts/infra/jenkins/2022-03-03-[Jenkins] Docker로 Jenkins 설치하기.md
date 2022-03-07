---
layout: post
title: "[Jenkins] Docker로 Jenkins 설치하기"
categories: [Jenkins, Docker]
---

`Docker`로 `Jenkins`를 설치합니다.

## 1. Jenkins 설치하기
도커 허브에 있는 Offical 젠킨스 이미지는 Deprecated되었습니다.

> This image has been deprecated in favor of the jenkins/jenkins image provided and maintained by Jenkins Community as part of project's release process.
>

그러므로 jenkins/jenkins 이미지를 다운받아야 합니다.

```java
docker pull jenkins/jenkins
```

### docker-compose.yml

```java
version: '3.3'

services:
  deploy:
    container_name: jenkins
    image: jenkins/jenkins
    restart: always
    ports:
     - 8080:8080
    volumes:
     - /home/ubuntu/docker/jenkins/home:/var/jenkins_home
```

> 만약 Jenkins의 포트를 8080이 아닌 다른 포트를 쓰고 싶다면 `앞의 포트`를 8080이 아닌 다른 포트로 바꿉니다. 뒤의 포트까지 바꾸면 Jenkins에 접속할 수 없습니다. 왜냐하면 Jenkins 내부에서 포트를 8080과 50000만 열어두었기 때문입니다.
> 
> 즉,  `- 9090:8080`은 접속할 수 있지만, `- 9090:9090`은 접속할 수 없습니다.

위의 docker-compose.yml 파일로 컨테이너를 바로 생성하면, 다음과 같은 에러가 발생합니다.

```java
touch: cannot touch '/var/jenkins_home/copy_reference_file.log': Permission denied
Can not write to /var/jenkins_home/copy_reference_file.log. Wrong volume permissions?
```

그러므로 로컬(docker-compose.yml 파일이 있는 곳)에 `home` 디렉토리를 생성하고, `home` 디렉토리에 권한을 1000으로 설정합니다.

```java
sudo chown 1000 <볼륨으로 사용할 디렉터리>
```

> 자세한 에러 메시지 및 해결은 [링크](https://github.com/jenkinsci/docker/issues/177) 를 참고
>

home 디렉토리에 권한을 준 후, 컨테이너를 생성합니다.

docker-compose.yml 파일이 있는 곳에서 다음 명령어를 실행합니다.

```java
docker-compose up -d
```

## 2. Jenkins 설정하기

젠킨스 컨테이너를 생성한 후, 인스턴스의 public ip:<설정한 포트>로 접속하면 다음과 같은 페이지가 나옵니다.
![image](https://user-images.githubusercontent.com/56301069/145724991-4b2c0e3a-0660-4a75-9be5-7c556a48e7bc.png)

```java
$ curl ifconfig.me
54.180.89.156

인터넷 창에서
54.180.89.156:8080 로 접속
```

젠킨스 컨테이너의 로그를 열면 비밀번호가 들어있습니다.

```java
$ docker ps
CONTAINER ID   IMAGE            ...  NAMES
e2d087010868   jenkins/jenkins  ... jenkins

$ docker logs jenkins(젠킨스 컨테이너 이름)
```

```java
*************************************************************
*************************************************************
*************************************************************

Jenkins initial setup is required. An admin user has been created and a password generated.
Please use the following password to proceed to installation:

<비밀번호>

This may also be found at: /var/jenkins_home/secrets/initialAdminPassword

*************************************************************
*************************************************************
*************************************************************
```

위의 비밀번호를 접속한 인터넷 창의 `Administrator password` 에 입력합니다.

비밀번호를 제대로 입력했다면 다음과 같은 어드민 설정페이지가 나옵니다.

앞으로 사용되는 아이디와 비밀번호이므로 설정하시고 잊지 말아주세요.

![image](https://user-images.githubusercontent.com/56301069/145724996-4b16d5db-018d-4915-825b-5895bb26fc03.png)

`Install suggested plugins` 를 선택합니다.
![image](https://user-images.githubusercontent.com/56301069/145724993-db0191a8-6263-41e8-8058-74d5b8bd8532.png)

## 3. Jenkins 동작 확인

젠킨스를 설치한 Origin(scheme + hostname + port)에 접속했을 때 다음과 같이 로그인 페이지가 나오는 것을 확인할 수 있습니다.
