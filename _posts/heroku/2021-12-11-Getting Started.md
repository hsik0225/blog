---
layout: post
title: "[Heroku] Getting Started"
categories: [Heroku]
---

Mac에서 헤로쿠를 설치하고 로그인합니다.

# Install

```bash
brew tap heroku/brew && brew install heroku
```

# Login

헤로쿠에 로그인을 합니다.

`-i` 옵션을 이용하여 브라우저로 이동하지 않고, CLI에서 로그인을 할 수 있습니다.

`-i` 을 지정하지 않는다면, 브라우저 창으로 이동합니다.

```bash
$ heroku login -i
heroku login -i
heroku: Enter your login credentials
Email: me@example.com
Password: ***************
Two-factor code: ********
Logged in as me@heroku.com
```

CLI는 나중에 재사용하기 위해 이메일 주소와 API 토큰을 `~/.netrc`에 저장합니다.
