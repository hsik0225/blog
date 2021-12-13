---
layout: post
title: "[Linux] ssh password 입력 없이 접속"
categories: [Linux]
---

비밀키/공개키를 사용하여 비밀번호를 입력하지 않고 바로 서버에 접속하도록 합니다.

클라이언트 A와 서버 B(username: seed, ip addr: 192.168.1.68)가 있습니다. 
클라이언트 A에서 비밀번호 없이 서버 B로 접근하고 싶다면, 클라이언트 터미널에서 다음 명령어를 입력합니다.

```bash
$ cd ~/.ssh

# 클라이언트의 비밀키/공개키 생성
$ ssh-keygen
Enter file in which to save the key (/home/jsmith/.ssh/id_rsa): [Enter key]
Enter passphrase (empty for no passphrase): [Press enter key]
Enter same passphrase again: [Pess enter key]

# 클라이언트에서 생성한 공개키를 서버에 등록
$ ssh-copy-id -i ~/.ssh/id_rsa.pub seed@192.168.1.68

# -C: 통신 내용을 압축. 응답 속도가 빨라진다.
# 이제 다시 ssh 접속을 하면 비밀번호 없이 접속된다.
ssh -C seed@192.168.1.68
```

# Reference
- [http://oniondev.egloos.com/10022984](http://oniondev.egloos.com/10022984)
