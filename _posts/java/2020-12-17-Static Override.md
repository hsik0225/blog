---
layout: post
title: "[JAVA] 정적 메소드를 오버라이드 하지 못하는 이유"
categories: [Java]
---

`static`으로 선언한 메소드를 오버라이딩하지 못하는 이유는 무엇일까?

## 정적 메소드를 오버라이드 하지 못하는 이유

static이라는 것은 정적이라는 것이다. 변경될 수 없다는 것이다. 오버라이딩은 변하게 하는 것이다. 문법적인 오류가 발생하는 것은 당연하다.

정적 메소드와 인스턴스 메소드(non-static method)가 메모리에 올라가는 시점이 다르다.

정적 메소드는 컴파일 시점에 올라가며, 인스턴스 메소드는 런타임 시점에 올라간다.

![Untitled](https://user-images.githubusercontent.com/56301069/102368813-9d67ca00-3ffe-11eb-8d3d-5d06a79d134c.png)

static binding

- 컴파일 타임에 올라간다. 따라서 compiler가 어떤 메소드를 실행할지 컴파일 타임에 결정한다.

dynamic binding

- 런타임 시점에 올라간다. 따라서 override 인스턴스 메소드는 runtime에 어떤 메소드가 실행될지 결정한다.

JVM 이 메서드를 호출할 때, instance method 의 경우 런타임 시 해당 메서드를 구현하고 있는 실제 객체를 찾아 호출한다. (다형성) 하지만 컴파일러와 JVM 모두 static 메서드에 대해서는 실제 객체를 찾는 작업을 시행하지 않기 때문에 class method(static method)의 경우, 컴파일 시점에 선언된 타입의 메서드를 호출한다. 그래서 static 메소드에서는 다형성이 적용되지 않습니다.

다음 예시를 살펴보자.

```java
class SuperClass {
	public static void staticMethod() {
		System.out.println("SuperClass: inside staticMethod");
	}

	public void instance() {
		System.out.println("SuperClass: inside instanceMethod");
	}
}

public class SubClass extends SuperClass {
    //overriding the static method
    public static void staticMethod() {
        System.out.println("SubClass: inside staticMethod");
    }
    
    public void instance() {
        System.out.println("SubClass: inside instanceMethod");
    }
}

public class TestClass {
    public static void main(String[] args) {
        SuperClass superClass = new SubClass();
        SubClass subClass = new SubClass();

        superClass.staticMethod();
        subClass.staticMethod();

        superClass.instance();
        subClass.instance();
    }
}

// 출력 결과
SuperClass: inside staticMethod
SubClass: inside staticMethod

SubClass: inside instanceMethod
SubClass: inside instanceMethod
```

static 메소드는 컴파일 시점에 선언된 타입의 메소드를 호출한다. 그러므로 superClass와 subClass 모두 자신들의 staic 메소드를 호출한 것을 볼 수 있다.

인스턴스 메소드는 런타임 시점에 해당 메소드를 보유하고 있는 실제 객체를 찾아 호출한다. 그러므로 superClass와 subClass 모두 자신을 호출한 객체인 SubClass를 찾아가 SubClass의 메소드를 호출한 것을 볼 수 있다.

### Reference

- [Can we Overload or Override static methods in java ?](https://www.geeksforgeeks.org/can-we-overload-or-override-static-methods-in-java/](https://www.geeksforgeeks.org/can-we-overload-or-override-static-methods-in-java/))
- [Overriding Vs Hiding - Override Static Method]([https://ohgyun.com/242](https://ohgyun.com/242))
- [[Static 메소드와 Override hiding에 대한 정리](https://wedul.site/457)](https://www.geeksforgeeks.org/can-we-overload-or-override-static-methods-in-java/)
- [자바 오버라이딩(Overriding)에 제대로 이해하기 - 고급편 (static, hiding 기법 )]([https://blog.naver.com/gngh0101/221206214829](https://blog.naver.com/gngh0101/221206214829))
- [스태틱 메소드 상속]([https://velog.io/@cchloe2311/Java-static-method-상속](https://velog.io/@cchloe2311/Java-static-method-%EC%83%81%EC%86%8D))
