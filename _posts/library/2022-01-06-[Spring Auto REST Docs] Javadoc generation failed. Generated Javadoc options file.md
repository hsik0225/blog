---
layout: post
title : "[Spring Auto REST Docs] Javadoc generation failed. Generated Javadoc options file"
categories : [Spring, Spring REST Docs]
---

JDK가 아닌 JRE를 설치하여 발생한 문제입니다.

## 문제 상황
서버에서 간단하게 jar파일을 배포하려고 `./gradlew build` 를 실행했는데 다음과 같은 에러를 만났습니다.

```java
> Task :jsonDoclet FAILED
Watching 87 directories to track changes
Caching disabled for task ':jsonDoclet' because:
  Build cache is disabled
Task ':jsonDoclet' is not up-to-date because:
  Task has failed previously.
Watching 86 directories to track changes
Starting process 'command '/usr/lib/jvm/java-11-openjdk-amd64/bin/javadoc''. Working directory: /home/seed/dropthecode/backend Command: /usr/lib/jvm/java-11-openjdk-amd64/bin/javadoc @/home/seed/dropthecode/backend/build/tmp/jsonDoclet/javadoc.options
Problems generating Javadoc.
  Command line issued: [/usr/lib/jvm/java-11-openjdk-amd64/bin/javadoc, @/home/seed/dropthecode/backend/build/tmp/jsonDoclet/javadoc.options]
  Generated Javadoc options file has following contents:
```

`test` 태스크를 제외하고 빌드를 실행하면 jar 파일이 생성되긴 하지만 나중에도 발생할 수 있는 이슈라고 생각하여 해결하고 넘어가기로 결정했습니다.

## 원인 분석
구글 검색해도 정확히 어떤 것이 원인인지 잘 나오지 않았습니다.

혹시 몰라 Local에서 같은 `build.gradle` 코드로 빌드를 실행해보았고, 결과는 성공이었습니다.

로컬과 원격 서버에서 `./gradlew build --info` 를 실행하여 둘의 차이점을 확인해보았습니다.

그 결과 로컬에서는 `javadoc` 파일이 존재하지만, 서버에는 존재하지 않는 것을 확인할 수 있었습니다.

```bash
$ cd /

$ find . -name "javadoc"
# `javadoc`이 발견되지 않음
```

구글에서 javadoc에 대해서 검색을 하자 스택오버플로우에서 관련 글을 찾을 수 있었습니다.

[https://stackoverflow.com/questions/59419562/javadoc-executable-not-found-with-maven-if-even-java-home-seems-correctly-set](https://stackoverflow.com/questions/59419562/javadoc-executable-not-found-with-maven-if-even-java-home-seems-correctly-set)

> I think the problem is that you have a Java 11 JRE package installed rather than a JDK.
>

위 답변을 보고 JDK가 아닌 JRE를 설치한 것이 문제일 수도 있겠다고 생각했습니다.

이전에 자바를 설치할 때 사용했던 스크립트를 보자 JRE를 설치했었습니다.

## 해결 방법

먼저 JRE를 설치했으니 JDK를 설치하기 위해 기존 JRE를 제거했습니다.

Java를 지우는 과정은 다음과 같습니다.

> [https://askubuntu.com/questions/84483/how-to-completely-uninstall-java](https://askubuntu.com/questions/84483/how-to-completely-uninstall-java)
>

```bash
# 1. Remove all the Java related packages (Sun, Oracle, OpenJDK, IcedTea plugins, GIJ):
dpkg-query -W -f='${binary:Package}\n' | grep -E -e '^(ia32-)?(sun|oracle)-java' -e '^openjdk-' -e '^icedtea' -e '^(default|gcj)-j(re|dk)' -e '^gcj-(.*)-j(re|dk)' -e '^java-common' | xargs sudo apt-get -y remove

sudo apt-get -y autoremove

# 2. Purge config files (careful. This command removed libsgutils2-2 and virtualbox config files too):
dpkg -l | grep ^rc | awk '{print($2)}' | xargs sudo apt-get -y purge

# 3. Remove Java config and cache directory
sudo bash -c 'ls -d /home/*/.java' | xargs sudo rm -rf

# 4. Remove manually installed JVMs
sudo rm -rf /usr/lib/jvm/*

# 5. Remove Java entries, if there is still any, from the alternatives:
for g in ControlPanel java java_vm javaws jcontrol jexec keytool mozilla-javaplugin.so orbd pack200 policytool rmid rmiregistry servertool tnameserv unpack200 appletviewer apt extcheck HtmlConverter idlj jar jarsigner javac javadoc javah javap jconsole jdb jhat jinfo jmap jps jrunscript jsadebugd jstack jstat jstatd native2ascii rmic schemagen serialver wsgen wsimport xjc xulrunner-1.9-javaplugin.so; do sudo update-alternatives --remove-all $g; done

# 6. Search for possible remaining Java directories:
sudo updatedb
sudo locate -b '\pack200'

# If the command above produces any output like /path/to/jre1.6.0_34/bin/pack200 remove the directory that is parent of bin, like this: sudo rm -rf /path/to/jre1.6.0_34.
```

그 후 JDK를 다시 설치했습니다.

```bash
sudo apt install -y openjdk-11-jdk
```

`which` 명령어로 javadoc이 제대로 설치되어 있는 것을 확인할 수 있습니다.

```bash
$ which javadoc
/usr/bin/javadoc
```

그 후 BUILD를 다시 실행하면 성공적으로 jar 파일이 생성됩니다!

```bash
> Task :jsonDoclet
...
:jsonDoclet (Thread[Execution worker for ':',5,main]) completed. Took 5.147 secs.
BUILD SUCCESSFUL in 18s
4 actionable tasks: 4 executed
```

> JsonDoclet 의존성 문제라고 의심해서 죄송합니다 😂
> 앞으로도 믿고 사용하겠습니다!
