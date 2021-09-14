---
layout: post
title: "[Spring] Spring Dependency Management"
categories: [Spring]
---

스프링 부트는 의존성들을 어떻게 관리할까?

### Spring Dependency Management
말 그대로 의존성을 관리하는 것. 어떤 의존성을 가져올지, 해당 의존성의 어느 버전을 사용할지 등을 설정한다.

## 1. Getting Started

build.gradle에 다음과 같이 플러그인을 작성한다.

```sql
plugins {
    id 'io.spring.dependency-management' version '1.0.9.RELEASE'
}
```

이 플러그인을 선언함으로써 의존성을 관리할 수 있게 된다.
## 2. Managing Dependencies

`io.spring.dependency-management`  플러그인을 적용하면, SpringBoot의 플러그인은 자동으로, 사용하고 있는 Spring Boot의 버전에서 `spring-boot-dependencies` bom 을 가져옵니다.

bom에서 관리되는 dependency를 선언할 때,  `version number`를 생략할 수 있습니다.

```sql
dependencies {
    implementation('org.springframework.boot:spring-boot-starter-web')
    implementation('org.springframework.boot:spring-boot-starter-data-jpa')
}
```


## 3. Dependency Sets
`dependency set` 을 사용하면, 같은 그룹과 버전을 가진 여러 모듈에 대한 Dependency Management를 제공할 수 있다. `dependency set` 은 같은 그룹과 버전을 여러 번 지정하는 것을 없애준다.

```sql
dependencyManagement {
    dependencies {
        dependencySet(group:'org.slf4j', version: '1.7.7') {
            entry 'slf4j-api'
            entry 'slf4j-simple'
        }
    }
}
```

## 4. 버전을 명시하지 않아도 라이브러리의 버전이 관리되도록 한 이유

각 Spring Boot 릴리스는 특정 타사(Third-Party) 종속성 세트(Set)에 대해 설계되고 테스트됩니다.
버전을 재정의하면 호환성 문제가 발생할 수 있으므로, 주의해서 수행해야합니다.

자동적으로 추가된 버전은 Spring을 리딩하는 개발자들이 철저한 테스트를 통해서 적용시킨 버전이기 때문에 왠만한 경우, 문제가 발생하지 않는다. 그렇기 때문에 Dependency Management를 사용하면 라이브러리 끼리의 버전이 충돌날 가능성이 줄어든다.

### Reference

- [https://docs.spring.io/dependency-management-plugin/docs/current/reference/html/](https://docs.spring.io/dependency-management-plugin/docs/current/reference/html/)
- [https://docs.spring.io/spring-boot/docs/2.4.4/gradle-plugin/reference/htmlsingle/](https://docs.spring.io/spring-boot/docs/2.4.4/gradle-plugin/reference/htmlsingle/)
- [https://dingue.tistory.com/17](https://dingue.tistory.com/17)
