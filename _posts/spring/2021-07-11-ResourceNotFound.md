---
layout: post
title: "[Spring] 스프링 Resource Not Found 문제"
categories: [Spring, Spring REST Docs]
---

정적 파일이 존재하지 않거나, 경로가 틀려 발생하는 오류입니다.

# 1. 결론
jar 파일을 백그라운드로 실행시키고, 정적 파일에 접근했을 시 `NOT FOUND` 를 마주친다면, 
1. 접근하려는 경로에 정적 파일이 있는지 확인해보세요.
2. 만약 정적 파일이 존재한다면, jar 파일을 생성하기 전에도 해당 정적 파일이 정말 존재하는 건지 확인해보세요.
3. 2번도 확인했다면, jar 파일 생성 시 Gradle이 `processResources`를 실행하는지 확인하세요. 

# 2. 해결 과정
AWS EC2 인스턴스로 `Spring Auto REST Docs`를 적용한 Spring Application을 실행 시킨 후, 브라우저에서 정적 파일 리소스로 접근하니 `404 NOT FOUND`를 만났습니다.

저의 build task는 크게 다음 순서로 진행되었습니다. gradle 로그는 `./gradlew build --info` 와 같이 뒤에 로깅 레벨을 붙여줌으로써, 더 자세하게 확인할 수 있습니다.

1. compileJava
2. processResources
3. bootJar
4. jar(jar 파일 생성)
5. copyDocument(정적 파일 생성)
6. build

정적 파일이 생성되기 전에 jar 파일이 생성되었으므로, jar 파일에는 정적 파일이 없는 상태입니다. 이 jar 파일을 이용하여 서버를 실행시켰으므로, 정적 파일에 접근하려고 하면 `NOT FOUND` 가 발생했습니다.

jar 파일을 압축해제 하여 실제로 정적 파일이 있는지 확인해보았지만, 원하는 정적 파일이 존재하지 않았습니다. jar 파일은 다음 명령어로 압축 해제할 수 있습니다.

```bash
$ jar xvf *.jar
```


그래서 `jar` task가 `copyDocument` 보다 늦게 실행되도록, `jar`가 `copyDocument`를 의존하도록 설정하여 해결했습니다.

```groovy
assemble {
    dependsOn copyDocument
}
```

하지만 그렇게 해도 `NOT FOUND` 가 발생했으며, 이전의 정적 파일에는 접근할 수 있었습니다.
예를 들어, 기존 정적 파일의 경로가 `/docs/asciidoc/api.html`이고, 새로 build하여 생성한 정적 파일의 경로가 `/docs/new.html`이라면, `/docs/asciidoc/api.html`에는 접근할 수 있었지만, `/docs/new.html`에 접근하려고 하면 `NOT FOUND` 를 마주쳤습니다.

왜 그런지 Gradle의 build task들을 뜯어보던 참에, `processResources` 라는 task를 발견했습니다.

어떤 작업을 하는지 몰라 구글에서 찾아봤습니다.

> Copies resources from their source to their target directory, potentially processing them. Makes sure no stale resources remain in the target directory.
> 
> 소스 코드로부터 Resource 파일들을 타겟 디렉토리로 복사합니다. 대상 디렉토리에 오래된 리소스가 남아 있지 않은지 확인합니다.

저의 생각으로는 Gradle은 처음 실행할 때, 모든 정적 파일을 작업하기 위한 공간에 담아놓습니다. 그 역할을 하는 것이 `processResources`입니다. `build`를 실행하면 그림과 같이 처음 한 번만 `processResources`를 실행합니다.

![무제 2](https://user-images.githubusercontent.com/56301069/125197438-9bb26c00-e298-11eb-844b-7c7969b4acb8.jpg)

정적 파일들을 변경(copyDocument)하였으므로, 정적 파일들을 다시 로딩(processResources) 해주어야 하는데, 이 작업을 실행하지 않았으므로 기존 파일들(`/docs/asciidoc/api.html`)로 jar 파일을 생성한 것입니다.

copyDocument에서 processResources를 실행하고, jar에서도 processResources를 실행하도록, 다음과 같이 나누어서 실행시켜보았더니 잘 동작했습니다.

```
./gradlew copyDocument
./gradlew jar
```
