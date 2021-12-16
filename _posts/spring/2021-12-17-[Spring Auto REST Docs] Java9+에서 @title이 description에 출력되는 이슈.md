---
layout: post
title : "[Spring Auto REST Docs] Java9+에서 @title이 description에 출력되는 이슈"
categories : [Spring, Spring REST Docs]
---

Java9 이상에서 Spring Auto REST Docs v2.0.11를 사용하면 섹션 스니펫의 `description`에 `@title` 이 붙어서 출력되는 문제가 있습니다.

Spring Auto REST Docs로 생성한 API 문서를 확인해보면 다음과 같이 `@title`이 붙은 문구가 출력되는 것을 확인할 수 있습니다.

![image](https://user-images.githubusercontent.com/56301069/146318543-d398424d-6ed5-4521-9771-817fd86446a9.png)

Auto REST Docs 깃허브 이슈에 이미 관련 이슈가 등록되어 있으며, 이는 최신 버전인 `2.0.11` 이후에 해결되었습니다.

> 이슈 링크
> 
> [https://github.com/ScaCap/spring-auto-restdocs/issues/452#ref-pullrequest-1022691312](https://github.com/ScaCap/spring-auto-restdocs/issues/452#ref-pullrequest-1022691312)

그러므로 @title이 출력되지 않도록 하기 위해서는 아직 릴리즈 되지 않은 `2.0.12-SNAPSHOT` 버전을 사용해야 합니다.

사용 방법은 `build.gradle`을 다음과 같이 수정하면 됩니다.

```groovy
...

repositories {
    // maven url 추가
    maven { url "https://oss.sonatype.org/content/repositories/snapshots" }
    mavenCentral()
}

// Spring Auto REST Docs 2.0.12-SNAPSHOT 버전 사용
dependencies {
    testImplementation 'capital.scalable:spring-auto-restdocs-core:2.0.12-SNAPSHOT'
    jsondoclet 'capital.scalable:spring-auto-restdocs-json-doclet-jdk9:2.0.12-SNAPSHOT'
}
```

문서를 다시 생성하면 다음과 같이  `@title 웹 소켓 연결용 토큰 발급.` 이 사라진 것을 확인할 수 있습니다.

![image](https://user-images.githubusercontent.com/56301069/146318551-2d6db0f1-27a9-48bf-b3a8-8e4dcfa4d54f.png)
