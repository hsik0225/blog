---
layout: post
title: "[Linux] 윈도우 10에 VirtualBox로 Ubuntu 20.04 Server 설치하기"
categories: [Linux]
---

컴퓨터에 우분투 서버를 설치합니다.

> 우분투 데스크탑은 윈도우와 같은 GUI 환경이며, 우분투 서버는 CLI 환경입니다.
설치 시 참고해주세요.

# VirtualBox 설치

다음 링크에서 버츄얼 박스를 설치합니다.

> [https://www.virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads)

# Ubuntu 설치

### 1. 우분투 이미지 다운로드

공식 사이트는 해외라서 속도가 느리기 때문에 카카오 미러 서버를 통해 우분투 이미지를 다운받습니다. Ubuntu Server를 설치해야 하므로 Desktop Image가 아닌 `Server Install image`를 다운받아주세요.

> [https://mirror.kakao.com/ubuntu-releases/](https://mirror.kakao.com/ubuntu-releases/)

참고

- LTS(Long Term Support): 장기간 무료로 패치를 지원한다.
- ESM(Extended Security Maitenance): 추가 패치를 위해서는 돈을 지불해야 한다.

### 2. 버츄얼 머신 설정

1. 버츄얼 머신 실행
2. 새로 만들기
3. 가상 머신 만들기
   - 이름은 원하는대로 작성합니다.
   - 종류는 Linux를 선택하고, 다운로드받은 이미지에 해당하는 버전을 선택합니다.

4. 메모리를 할당합니다. 저는 12GB의 메모리가 있으며, 서버를 기동하는 것 외엔 다른 작업을 하지 않기 때문에 4GB 를 할당했습니다. 과도한 메모리를 할당할 경우 설치 도중에 가상머신이 종료될 수 있습니다.
5. 가상 머신에서 사용할 데이터 저장 목적의 하드디스크를 추가합니다. 일반적으로 새로운 가상 하드 디스크를 만들어 사용합니다.

6. 기본적인 하드 디스크 파일 종류인 VDI(VirtualBox Disk Image)를 선택합니다.
7. 컴퓨터의 용량이 많을 경우, 고정 크기로 가상 하드디스크를 만듭니다.
8. 가상 머신이 만들어졌으므로, 설정 탭에서 우분투 이미지를 적용합니다.
9. [저장소] 탭에서 컨트롤러:IDE의 [비어있음]을 클릭하고, 광학 드라이브(D)에서 다운로드한 우분투 ISO 파일을 선택합니다. 다음과 같이 적용된 것을 확인할 수 있습니다.

10. [일반] - [고급]에서 [클립보드 공유]와 [드래그 앤 드롭]을 양방향으로 합니다. 호스트 OS(버츄얼 머신 설치한 컴퓨터)와 게스트(우분투 컴퓨터) OS 사이가 클립보드를 공유하도록 합니다. 즉 윈도우에서 우분투로 혹은 그 반대로 복사가 가능해집니다.

11. [네트워크]탭에 들어가 [어댑터1]이 NAT에 연결되어 있는지 확인합니다.

### 3. 우분투 설정

1. 버츄얼박스에서 시작 버튼을 눌러 우분투를 부팅합니다.

2. 언어를 영어로 설정합니다.

3. 키보드 레이아웃을 설정합니다.

4. 네트워크 설정은 고정 IP와 같은 추가 설정이 필요하지 않다면 [Done] 을 눌러 기본 설정을 사용합니다.
5. 프록시 설정은 기본 설정을 사용합니다.

6. 미러 사이트도 기본으로 설정합니다.

7. 파티션 설정도 기본 값인 전체 디스크 사용으로 설정합니다.

8. 파티션을 포맷합니다.

9. 사용자 계정 및 서버명을 설정합니다.

10. OpenSSH를 설치합니다.

11. 서버용 프로그램은 기본값으로 설정합니다.

12. 설치를 시작합니다.

13. 설치가 완료되면 재부팅합니다.

14. 설정한 계정으로 로그인을 합니다.

# 설치 완료 후 자주 만나는 에러

### **Please remove the installation medium, then press ENTER**

우분투 설치 시 위와 같은 에러가 뜨고 진행이 안되는 경우가 있습니다. 해당 에러의 의미는 아까 버추얼 박스에 삽입한 우분투 iso 이미지 파일을 제거하라는 의미입니다. 그러나 버추얼 박스는 대부분 **자동 이미지 해제**가 되기 때문에 그냥 **Enter**를 누르면 됩니다.

### cc_final_message.py[WARNING]: Used fallback datasource

해당 에러를 무시하고 자신의 id와 password를 입력하면 로그인됩니다.

로그인 한 후

```jsx
sudo apt-get update
sudo apt-get upgrade
```

를 하고 재부팅하면 에러가 다시 발생하지 않습니다.

### apt-get update 시 Temporary failure resolving 'kr.archive.ubuntu.com'

먼저

```jsx
ping 8.8.8.8
```

을 입력해봅니다.

만약 `unreachable`이라는 에러 문구가 나온다면, VirtualBox에서 네트워크 설정을 잘못한 것입니다. 버츄얼박스에서 설치한 우분투를 우클릭하여 삭제 버튼을 눌러 삭제하고, 네트워크 설정을 참고하여 재설치합니다.

# Reference

- [[VirtualBox] Ubuntu 20.04.1 LTS Server 설치](https://ksbgenius.github.io/virtualbox/2020/08/03/ubuntu-20.04.1-lts-server-installation.html)
- [Windows 10 운영체제에 VirtualBox 및 우분투(Ubuntu) 설치하기](https://ndb796.tistory.com/370)
