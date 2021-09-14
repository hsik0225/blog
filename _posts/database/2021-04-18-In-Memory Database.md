---
layout: post
title: "[Database] In-Memory Database"
categories: [Database]
---

In-Memory DB란 무엇일까?

# IMDB
IMDB는 디스크 또는 SSD에 데이터를 저장하는 데이터베이스와 달리, 메모리에 데이터를 저장하는 데이터베이스입니다.
프로세스가 시작될 때 생성되고, 프로세스가 완료되면 파괴됩니다(Destroyed).
IMDB는 디스크에 액세스하지 않음으로써, 응답 시간을 최소화화도록 설계되었습니다.

## IMDB의 특징 
### 속도가 빠르다
외부 저장 장치에 있는 데이터를 읽고자 할 경우, 해당 데이터를 곧바로 사용할 수 없습니다.
디스크에 있는 데이터를 읽어서 메모리에 올려야, 데이터를 읽어서 사용할 수 있습니다.

**메모리 계층 구조**
![https://blog.kakaocdn.net/dn/u2IvO/btqDHsFJ2pu/COQt1jj3gTi3ghnF6eDrFK/img.png](https://blog.kakaocdn.net/dn/u2IvO/btqDHsFJ2pu/COQt1jj3gTi3ghnF6eDrFK/img.png)

disk-based DB는 데이터를 페이지(블록)단위로 읽어옵니다.
내가 원하는 데이터가 지금 메모리에 있는 페이지(블록)에 없다면?
그러면 또 디스크에서 다른 페이지(블록)을 읽어야 합니다. 이 과정에서 지연이 발생합니다.

하지만, IMDB는 애초에 메모리에 모든 데이터가 있기 때문에 지연이 적어, 데이터를 읽는 속도가 빠릅니다.

### IMDB는 영속성(persistence)을 보장하지 않습니다
IMDB는 IMDB를 사용하는 프로세스가 꺼지면, IMDB의 내용도 모두 사라지는 휘발성 데이터베이스입니다. 
모든 데이터는 메인 메모리에서만 저장 및 관리되기 때문에, 프로세스 또는 서버 오류로 인해 데이터가 손실될 위험이 있습니다.

### 메모리에 데이터를 저장하기 때문에 저장 공간이 한정되어있습니다
- 메모리의 용량이 한계에 도달하면, 기존 데이터를 지우거나, 새로운 데이터를 입력하지 못합니다.

## 테스트에서의 IMDB
테스트에서는 데이터를 저장할 필요가 없으며, 저장 공간이 많이 필요하지 않으므로, IMDB는 테스트에서 매우 유용합니다.

테스트에서 IMDB를 사용하면 다음과 같은 장점이 있습니다.

### 테스트 속도가 빠르다
테스트 속도가 느리다면 테스트를 실행하는데 부담이 생길 수 있습니다. 이는 테스트를 자주 실행하지 않는 원인이 될 수 있습니다.
그러므로, 테스트 속도가 빠른 것은 중요합니다.

IMDB는 Disk Database보다 데이터를 저장하고, 가져오는 속도가 빠릅니다.
그러므로, 테스트 속도도 Disk Database 를 사용하는 것보다 빠릅니다.

### 실제 서비스의 DB를 잘못 수정하는 일을 방지한다
DB의 테이블을 삭제하거나, 테이블을 잘못 업데이트 하더라도 메모리에만 저장될 뿐 디스크에 반영하지 않기 때문에, 
실제 서비스의 DB를 잘못 수정하는 일을 방지할 수 있습니다.

### IMDB를 사용한 테스트의 문제점
서버에서 사용하는 Disk Database와 동일한 `dialect를` 지원하지 않거나, 대상 데이터베이스의 모든 기능을 가지고 있지 않을 수 있다는 것입니다.
테스트가 실패한다면 다행이지만, 실제로는 오류이지만 테스트가 실패하지 않을 수도 있습니다.

## Reference
- [WIKI - 인메모리 데이터베이스](https://ko.wikipedia.org/wiki/%EC%9D%B8%EB%A9%94%EB%AA%A8%EB%A6%AC_%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4)
- [Spring Database-H2](https://better-dev.netlify.app/java/2019/03/25/spring_18/)
- [In-Memory DB는 왜 더 빠를까?](https://2kindsofcs.tistory.com/40)
- [Amazon - In-Memory](https://aws.amazon.com/ko/nosql/in-memory/)
- [Difference Between In-Memory Databases And Disk-Memory Database](https://stackoverflow.com/questions/25802521/difference-between-in-memory-databases-and-disk-memory-database)
- [Don't use In-Memory Databases (H2, Fongo) for Tests](https://phauer.com/2017/dont-use-in-memory-databases-tests-h2/)

틀린 내용이 있다면 지적 부탁드립니다!
