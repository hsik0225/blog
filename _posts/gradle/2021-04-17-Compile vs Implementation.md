---
layout: post
title: "[Gradle] compile vs implementation"
categories: [Gradle]
---

자주 사용하는 `compile`과 `implementation`이란 무엇이고, 이 둘의 차이점은 무엇일까?

# Configuration
compile과 implementation은 모듈에 다른 모듈(의존성)을 추가하여 런타임과 컴파일 시간에 사용한다는 것을 Gradle에 알려주는 것입니다.

### compile
Deprecated 되었습니다.
> The`compile`and`runtime`configurations have been removed with Gradle 7.0.
> 
`compile` 은 `implementation` 혹은 `api`로 변환해야 합니다.

### api
`api`는`compile`처럼 작동하지만, 주의해서 소비자에게 이전해야 하는 종속 항목과만 사용해야 합니다. 
그 이유는**`api`**종속 항목이 외부 API를 변경하면 Gradle이 컴파일 시 종속 항목에 액세스 권한이 있는 모든 모듈을 다시 컴파일하기 때문입니다.
따라서**`api`**종속 항목 수가 많으면 빌드 시간이 크게 증가할 수 있습니다.

다음과 같은 의존성 트리가 있습니다.

![image](https://user-images.githubusercontent.com/56301069/115052960-863bd900-9f19-11eb-9415-5de5364cbfa0.png)

`api`를 이용하여 의존성을 추가했습니다.

```gradle
// LibraryB에서 LibraryD 의존성 추가
dependencies {
	. . . .
	api project(path: ':librayB')
}

// ModuleX에서 LibraryB 의존성 추가
dependencies {
	. . . .
	api project(path: ':librayB')
}
```

만약 LibraryD가 변경된다면, Gradle은 LibraryD, LibraryD, Library B를 Import하는 다른 모든 모듈(ModuleX)를 Recompile해야 합니다. 

`api` 키워드는 의존성에 추가하는 모듈이 의존하고 있는 다른 모듈까지 접근할 수 있습니다. 예를 들어, ModuleX에서는 지금 LibraryB와 LibraryD 모두에 접근할 수 있습니다.

### implementation

모듈에서 `implementation` 종속 항목을 구성하면 모듈이 컴파일 시간에 종속 항목을 다른 모듈에 누출하기를 바라지 않는다는 것을 Gradle에 알려주는 것입니다. 즉 종속 항목은 런타임에만 다른 모듈에서 이용할 수 있습니다.

**`api`**또는**`compile`** 대신 이 종속 항목 구성을 사용하면 빌드 시스템에서 다시 컴파일해야 하는 모듈 수가 줄어들기 때문에 **빌드 시간이 크게 개선**될 수 있습니다.

예를 들어**`implementation`**종속 항목이 API를 변경하면 Gradle은 이 종속 항목과 이에 직접적으로 종속된 모듈만 다시 컴파일합니다. 대부분의 앱과 테스트 모듈은 이 구성을 사용해야 합니다.

![image](https://user-images.githubusercontent.com/56301069/115055171-19760e00-9f1c-11eb-9e77-3d807aafad37.png)

LibraryC를 수정하면, Gradle은 A와 C만 Recompile 합니다.

`implementation` 는 의존성에 추가하는 모듈이 의존하는 다른 모듈에는 접근이 불가능 합니다. 
 
```
implementation project(path: ':LibraryA')
```

로 의존성을 추가하면 ModuleX에서 LibraryC 클래스에는 접근할 수 없습니다.

### TIP
모든 compile을 implementation으로 바꾸고 프로젝트를 빌드해보세요.
만일 여러분이 성공적으로 잘 된다면 훌륭한 프로젝트 입니다.
그렇지 않으면 종속성이 있는지 찾아보고 `api` 키워드를 사용하여 해당 라이브러리를 사용합시다.
### **참고 링크**

**1. Gradle 공식 문서**

[https://docs.gradle.org/current/userguide/dependency_management_for_java_projects.html#sec:configurations_java_tutorial](https://docs.gradle.org/current/userguide/dependency_management_for_java_projects.html#sec:configurations_java_tutorial)

**2. StackOverFlow**

[https://stackoverflow.com/questions/44493378/whats-the-difference-between-implementation-and-compile-in-gradle](https://stackoverflow.com/questions/44493378/whats-the-difference-between-implementation-and-compile-in-gradle)

### 3. Devloper android

[https://developer.android.com/studio/build/dependencies?hl=ko](https://developer.android.com/studio/build/dependencies?hl=ko)

### 4. 블로그
- [https://hack-jam.tistory.com/13](https://hack-jam.tistory.com/13)
- [Implementation VS Api in Android Gradle Plugin - 번역](https://sikeeoh.github.io/2017/08/28/implementation-vs-api-android-gradle-plugin-3/)
