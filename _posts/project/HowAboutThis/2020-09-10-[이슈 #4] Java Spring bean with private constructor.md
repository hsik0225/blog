---
layout: post
title: "[이슈 #4] Java Spring bean with private constructor" 
categories: [HAT]
---

`private` 생성자인 클래스도 빈 등록이 가능하다.

예를 들어, 다음과 같은 기본 생성자를 가진 빈이 있습니다. 

```java
@Getter
@Component
class Policy {  
 
    private final tring term = "test";

    private Policy() {}
}
```
그리고 위의 클래스를 호출하는 다른 컨트롤러가 있습니다.
```java
@RestController
public class SignUp {
    
    @Autowired
    private Policy policy;
    
    @GetMapping("/")
    public String test() {
        return policy.getTerm();
    }   
}
```
저는 컨테이너가 처음에 `Policy policy = new Policy()`와 같이 인스턴스를 먼저 생성한 후, 
`setter`나 `constructor`로 알맞게 의존성을 주입한 후, 그 인스턴스를 컨테이너가 보관한다고 생각하고 있었습니다.

위의 `Policy` 클래스는 생성자가 private인데다가 다른 생성자도 없습니다. 
@Autowired를 하여 `Policy`의 의존성을 주입하려고 하면, 기본 생성자도 생성할 수 없으며, 
 다른 생성자도 존재하지 않으니 컴파일에러가 나거나 null이 들어올 것이라고 예상했습니다. 
 
 ![test](https://user-images.githubusercontent.com/56301069/92620226-6007e800-f2fd-11ea-8d47-8c963cd66bcc.png)
 
 하지만 결과는 정상적으로 출력되었습니다.

기존의 저의 생각과 정면으로 부딪히는 결과여서 조금 충격이었습니다. 그래서 `stackoverflow`를 
찾아보았습니다.

`stackoverflow`에는 다음과 같이 적혀있었습니다.
```markdown
Is possible in Spring that class for bean doesn't have public constructor but only private ?

Yes, Spring can invoke private constructors. If it finds a constructor with the right arguments, regardless of visibility, it will use reflection to set its constructor to be accessible.

 the Spring BeanUtils class uses a class called ReflectionUtils to make the constructor accessible.
```

스프링의 BeanUtils 클래스는 reflect 패키지의 Constructor<T> 클래스를 사용하여 
생성자에 접근할 수 있다고 합니다.

 reflect의 예시는 다음과 같습니다.
 ```java
import java.lang.reflect.Constructor;

public class Example {
    public static void main(final String[] args) throws Exception {
        Constructor<Foo> constructor = Foo.class.getDeclaredConstructor();
        constructor.setAccessible(true);
        Foo foo = constructor.newInstance();
        System.out.println(foo);
    }
}

class Foo {
    private Foo() {
        // private!
    }

    @Override
    public String toString() {
        return "I'm a Foo and I'm alright!";
    }
}
```

`reflect`는 접근제한자가 private인데도 접근할 수 있다니.. 저의 기존 
사고를 깨버리는 충격적인 일이었습니다. 

java를 더 공부해야겠습니다.

### 참고
- [How can I access a private constructor of a class?](https://stackoverflow.com/questions/2599440/how-can-i-access-a-private-constructor-of-a-class)
- [Java Spring bean with private constructor](https://stackoverflow.com/questions/7254496/java-spring-bean-with-private-constructor)
