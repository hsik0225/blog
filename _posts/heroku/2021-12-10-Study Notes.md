---
layout: post
title: "[Heroku] Study Notes"
categories: [Heroku]
---

헤로쿠를 공부한 내용을 정리한 페이지입니다.

# What Is?

헤로쿠는 컨테이너 기반 클라우드 서비스형 플랫폼(PaaS, Platform as a Service)입니다.

개발자는 헤로쿠를 사용하여 앱을 구축, 제공, 모니터링 및 확장할 수 있습니다.

# Why Use?

### A focus on apps

- 헤로쿠는 생성한 앱에 대한 보안과 운영을 모두 담당하므로, 개발자는 서버, 하드웨어 또는 인프라 유지보수에 신경을 쓰지 않고 오로지 어플리케이션 개발에만 집중할 수 있습니다.
- 헤로쿠는 앱 배포(Deploying), 구성(Configuring), 확장(Scaling), 조정(Tuning), 관리(Managing)를 쉽게 구성하여 개발자가 어플리케이션 개발에 집중할 수 있도록 합니다.
- 헤로쿠는 앱을 쉽게 생성하거나 지울 수 있어 확장하기 쉽습니다.
- 한 달에 1000시간이 무료입니다.

## Pricing

### Free

- 한 달 무료 dyno 시간만큼 앱 실행이 무료입니다.
    - 신용 카드로 계정 인증을 하지 않았다면, 무료 dyno 시간은 550시간입니다.
    - 신용 카드로 계정 인증을 했다면, 무료 dyno 시간은 1000시간입니다.
- 무료 앱은 30분 동안 활동이 없으면 자동으로 절전 모드로 전환되어 dyno 시간을 절약할 수 있습니다.
- dyno 시간은 모든 무료 앱에서 공유됩니다.
- 모든 앱에서 커스텀 도메인을 사용할 수 있습니다.
- 계정 인증을 했다면 100개의 무료 앱을 사용할 수 있습니다.
- 앱 당 web dyno 1개, worker dyno 1개, one-off dyno 1개를 가질 수 있습니다.
- dyno의 램은 512MB입니다.

# How To Use?
- [[Heroku] Getting Started](https://hsik0225.github.io/heroku/2021/12/11/Heroku-Getting-Started/)
- [[Heroku] React App 배포](https://hsik0225.github.io/heroku/2021/12/12/React-App-%EB%B0%B0%ED%8F%AC/)
- [[Heroku] Spring Boot Application 배포](https://hsik0225.github.io/heroku/2021/12/13/Spring-Boot-Application-%EB%B0%B0%ED%8F%AC/)
- [[Heroku] MySQL 사용하기](https://hsik0225.github.io/heroku/2021/12/14/MySQL-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0/)
- [[Heroku] Redis 사용하기](https://hsik0225.github.io/heroku/2021/12/15/Redis-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0/)
- [[Heroku] Jenkins 사용하기](https://hsik0225.github.io/heroku/2021/12/16/Jenkins-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0/)
