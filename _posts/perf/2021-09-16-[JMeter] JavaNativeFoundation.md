---
layout: post
title: "[JMeter] JavaNativeFoundation"
categories: [JMeter]
---

JMeter 실행 시 출력되는 JavaNativeFoundation 메시지를 안보이게 해봅시다.

만약 JMeter 실행시 다음과 같이 `JavaNativeFoundation` 에러가 발생한다면,

```text
JavaNativeFoundation: GetGlobalVM: 
    Failed to locate @rpath/libjvm.dylib for JNI_GetCreatedJavaVMs(). 
        A JVM must be loaded before calling this function.
```

`libjvm.dylib` 를 찾지 못해서 발생하는 에러입니다.

자신의 자바에 맞는 `libjvm.dylib`를 찾습니다.

만약 openjdk11을 설치하신 분은 각 경로에 `libjvm.dylib`이 존재할 것입니다.

```shell
/usr/local/opt/openjdk/libexec/openjdk.jdk/Contents/Home/lib/server/libjvm.dylib

/usr/local/opt/openjdk/libexec/openjdk.jdk/Contents/Home/lib/libjvm.dylib
```

이 둘을 심볼릭 링크로 연결합니다.

```shell
sudo ln -s /usr/local/opt/openjdk/libexec/openjdk.jdk/Contents/Home/lib/server/libjvm.dylib /usr/local/opt/openjdk/libexec/openjdk.jdk/Contents/Home/lib/libjvm.dylib
```

그러면 더 이상 `JavaNativeFoundation` 예외가 발생하지 않습니다.

# Reference
- [(solved) JavaNativeFoundation: GetGlobalVM: Failed to locate @rpath/libjvm.dylib for JNI_GetCreatedJavaVMs(). A JVM must be loaded before calling this function.](https://github.com/hardwarelayer/tientn-jboard-game/issues/3)
