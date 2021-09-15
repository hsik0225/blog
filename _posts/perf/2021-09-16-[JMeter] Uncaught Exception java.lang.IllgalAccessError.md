---
layout: post
title: "[JMeter] Uncaught Exception java.lang.IllegalAccessError"
categories: [JMeter]
---

`JMeter`에서 파일 저장 혹은 열기 버튼 클릭 시 발생하는 예외 해결

만약 JMeter 실행 후 `Open` 혹은 `Save` 아이콘 클릭 시 다음과 같은 예외가 발생한다면,

```text
Uncaught Exception java.lang.IllegalAccessError: 
    class com.github.weisj.darklaf.ui.filechooser.DarkFilePaneUIBridge
    
cannot access class sun.awt.shell.ShellFolder (in module java.desktop) 
```

테마를 Darklaf 가 아닌 다른 것을 사용하시면 됩니다. 저는 사진과 같이 `Nimbus`를 선택했습니다.

<img width="497" alt="스크린샷 2021-09-12 오전 12 02 47" src="https://user-images.githubusercontent.com/56301069/133514207-59035b27-9031-40b7-986b-61cdda1c0ec1.png">

# Reference

- [Why am i not able to click on open icon in Jmeter?](https://stackoverflow.com/questions/67615212/why-am-i-not-able-to-click-on-open-icon-in-jmeter)
- [jMeterで起動はできるが実行ができない場合の対処法](https://ateliee.com/archives/3880)
