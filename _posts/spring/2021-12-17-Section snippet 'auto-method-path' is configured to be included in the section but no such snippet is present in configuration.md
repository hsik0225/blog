---
layout: post
title : "[Spring Auto REST Docs] Section snippet 'auto-method-path' is configured to be included in the section but no such snippet is present in configuration"
categories : [Spring, Spring REST Docs]
---

Spring Auto REST Docs를 사용하면서 만난 WARN 로그가 무엇인지 이해하고, 제거합니다.



### 문제
Spring Auto REST Docs를 사용하다가 다음과 같은 WARN 문구를 만났습니다.

> [WARN]: Section snippet 'auto-description' is configured to be included in the section but no such snippet is present in configuration

이 문구가 테스트 코드에서 계속 보이는 것이 신경쓰였기 때문에 이 WARN을 해결할 방법을 찾아보았습니다.

### 해결 방법

Spring Auto Rest Docs의 Section에 `auto-method-path`와 `auto-description`가 있으면 나타나는 문구입니다. SectionBuilder에서 두 개의 스니펫을 제거하세요.

```groovy
AutoDocumentation.sectionBuilder()
                 .snippetNames(
                  //  AUTO_METHOD_PATH, < remove this
                  //  AUTO_DESCRIPTION, < remove this
                    AUTO_AUTHORIZATION)
                 .build();
```

### WARN 로그가 찍히는 이유
> [WARN]: Section snippet 'auto-description' is configured to be included in the section but no such snippet is present in configuration


위 문구는 섹션 스니펫이 `auto-method-path`, `auto-description`를 사용하도록 설정했지만 그런 설정을 가진 스니펫이 없다는 것인데요.

저의 섹션 빌더는 다음과 같았습니다.

```java
AutoDocumentation.sectionBuilder()
                 .snippetNames(
                    AUTO_METHOD_PATH,
                    AUTO_AUTHORIZATION,
                    AUTO_PATH_PARAMETERS,
                    AUTO_MODELATTRIBUTE,
                    AUTO_REQUEST_PARAMETERS,
                    AUTO_REQUEST_FIELDS,
                    AUTO_RESPONSE_FIELDS,
                    HTTP_REQUEST,
                    HTTP_RESPONSE)
                 .skipEmpty(true)
                 .build();
```

해당 문구를 출력하는 메서드를 찾아가보았습니다.

```java
// SectionSnippet#createSection()
SectionSupport section = getSectionSnippet(operation, sectionName);
if (section != null) {
    ...
} else {
    log.warn("Section snippet '" + sectionName + "' is configured to be " +
        "included in the section but no such snippet is present in configuration");
}
```

해당 메서드의 getSectionSnippet(...)에서 어떠한 섹션도 찾을 수 없어서 워닝 문구가 나타났습니다.

`getSectionSnippet`메서드 안에서는 snippetName(위 SectionBuilder에서 설정한 스니펫 이름들. ex) AUTO_METHOD_PATH)을 가진 Snippet 클래스가 `SectionSupport`를 상속받는지를 확인합니다.

```java
private SectionSupport getSectionSnippet(Operation operation, String snippetName) {
        return getDefaultSnippets(operation).stream()
                .filter(snippet -> snippet instanceof SectionSupport)
            ...
}
```

다른 Snippet 클래스들은 모두 SectionSupport를 상속받지만, auto-method-path를 갖는 `MethodAndPathSnippet` 과 auto-description을 갖는 `DescriptionSnippet`은 SectionSupport를 상속받지 않습니다.

그래서 `MethodAndPathSnippet`, `DescriptionSnippet` 은 필터링에 걸리게 되고 결국 `null`을 리턴하여 WARN 문구를 로깅합니다.
