---
layout: post
title: "[디자인패턴] 싱글턴패턴(Singleton Pattern)"
categories: [Design Pattern]
---

불필요한 인스턴스 생성을 방지하는 패턴

## 1. 싱글턴(Singleton) 이란 ?

싱글턴 패턴은 JVM내에서 `오직 한 개의 인스턴스만 생성`하여 재사용을 위해 사용되는 디자인 패턴입니다.

싱글턴 패턴을 사용하는 이유는 다음과 같습니다.

- 하나의 인스턴스를 메모리에 등록해서 여러 스레드가 동시에 해당 인스턴스를 공유하여 사용하게끔 할 수 있으므로, 요청이 많은 곳에서 사용하면 효율을 높일 수 있습니다.
- 고정된 메모리 영역을 사용하도록 단 한 번 new 연산자로 인스턴스를 얻어오기 때문에 메모리의 낭비를 줄입니다. 공통된 객체를 사용해야 하는 코딩에서 매번 객체를 생성하지 않고 같은 객체를 사용하도록 하면 성능 면에서 좋아집니다.
- 전역변수로 선언되고 전역메서드로 호출하므로 다른 클래스에서 사용하기 쉽습니다.

주의해야 할 점은 싱글턴을 만들 때  `동시성(Concurrency)` 문제를 고려해서 싱글턴을 설계해야 합니다.

아래에서 자바의 싱글턴 패턴 구현 방법과, 스프링에서 사용되는 싱글턴 패턴에 대해서 배워보겠습니다.

## 2. 자바의 싱글턴 패턴(Sigleton Pattern in Java)

싱글턴 패턴의 공통적인 특징은 `private constructor` 를 가진다는 것과, `static method` 를 사용한다는 점입니다.

싱글턴 패턴 구현에 사용되는 몇가지 이디엄 방식을 소개하겠습니다.

### 2-1. 고전적인 방식의 Singletone 패턴

```java
public class Singleton { 
    private static Singleton instance; 

    private Singleton() {} 

    public static Singleton getInstance() { 
            if(instance == null) { // 1번 : 쓰레드가 동시 접근시 문제 
                    instance = new Singleton(); // 2번 : 쓰레드가 동시 접근시 인스턴스 여러번 생성
            } 

            return instance; 
    } 
}
```

고전적인 방식은 보기에는 문제가 없지만 멀티 쓰레드 환경에서 문제가 발생합니다.

1번 으로 표시된 if(instance == null)지점이 Thread A까지 진행된 뒤 제어권이 Thread B로 넘어간 경우 Thread B역시 if(instance == null)가 수행되어 2번 이 수행되어 instance = new Singleton() 생성됩니다. 이 때 다시 Thread A로 제어권이 넘어간다면 Thread A에서 다시한번 instance = new Singleton() 가 수행되어 결국 인스턴스는 2개가 생성되는 경우가 발생하게 됩니다.

```java
Tread A : if(instance==null) 수행 결과 true

Tread B : if(instance==null) 수행 결과 true

Tread A : instance = new Singleton() 수행으로 인스턴스1 생성

Tread B : instance = new Singleton() 수행으로 인스턴스2 생성
```

그러므로 Thread-saft하지 않습니다.

### 2-2. Eager Initialization(이른 초기화, Thread-safe)

싱글턴 구현 시 중요한 점이, 멀티 스레딩 환경에서도 동작 가능하게끔 구현해야 한다는 것입니다. 즉, `Thread-safe` 가 보장되어야 합니다.

```java
public class Singleton {
    // Eager Initialization
    private static Singleton uniqueInstance = new Singleton();

    private Singleton() {}

    public static Singleton getInstance() {
      return uniqueInstance; 
    } 
}
```

이른 초기화 방식은, static 키워드의 특징을 이용해서 클래스 로더가 초기화하는 시점에서 `정적 바인딩(static binding)`(컴파일 시점에서 성격이 결정됨)을 통해 해당 인스턴스를 메모리에 등록해서 사용하는 것입니다.

이른 초기화 방식은 클래스 로더에 의해 클래스가 최초로 로딩될 때 객체가 생성되기 때문에 하나의 인스턴스만 생성되는 것을 보장하며, Thread-safe 합니다.

위 패턴은 리소스가 작은 프로그램일 땐 고도화 대상이 아닙니다. 하지만 프로그램의 크기가 커져서 수많은 클래스에서 위와 같은 Signletom Pattern를 사용한다고 하면, 3번째 라인의 `new Singleton();` 으로 인해 클래스가 Load 되는 시점에 인스턴스를 생성시키는 것도 부담스러울 수 있습니다.

또한 위 패턴은 `Singleton` 클래스가 인스턴스화 되는 시점에 어떠한 에러 처리도 할 수 없습니다.

### 2-3. Static Block Eager Initialization

```java
public class StaticBlockInitalization {

	private static StaticBlockInitalization instance;

	private StaticBlockInitalization () {}
	
	static {
		try {
			System.out.println("instance create..");
			instance = new StaticBlockInitalization();
		} catch (Exception e) {
			throw new RuntimeException("Exception creating StaticBlockInitalization instance.");
		}
	}
	
	public static StaticBlockInitalization getInstance () {
		return instance;
	}
}
```

`static` 초기화블럭을 이용하면 클래스가 로딩 될 때 최초 한번 실행하게 된다. 특히나 초기화블럭을 이용하면 logic을 담을 수 있기 때문에 복잡한 초기변수 셋팅이나 위와 같이 에러처리를 위한 구문을 담을 수 있다. 첫 번째 패턴보다 좋아보이지만 인스턴스가 사용되는 시점에 생성되는 것은 아니다.

### 2-4. **Lazy Initialization with synchronized (동기화 블럭, Thread-safe)**

두 번째 방식은, `synchronized` 키워드를 이용한 게으른 초기화 방식인데, 메서드에 동기화 블럭을 지정해서 Thread-safe 를 보장합니다.

게으른 초기화 방식이란 ? 컴파일 시점에 인스턴스를 생성하는 것이아니라, 인스턴스가 필요한 시점에 요청 하여 `동적 바인딩(dynamic binding)`(런타임시에 성격이 결정됨)을 통해 인스턴스를 생성하는 방식을 말합니다.

```java
public class Singleton {
    private static Singleton uniqueInstance;

    private Singleton() {}

    // Lazy Initailization
    public static synchronzied Singleton getInstance() {
      if(uniqueInstance == null) {
         uniqueInstance = new Singleton();
      }
      return uniqueInstance;
    }
}
```

`synchronized` 는 단일 쓰레드가 대상 메소드를 호출시작~종료까지 다른 쓰레드가 접근하지 못하도록 lock 을 하기 때문에 위와 같이 getInstance()메소드를 synchronized로 처리하면 멀티 쓰레드에서 동시 접근으로 인한 인스턴스 중복생성 문제는 해결되게 됩니다.

동기화 블럭을 지정한 게으른 초기화 방식은 스레드 세이프하지만, 단점이 있습니다. 인스턴스가 생성되었든, 안되었든 무조건 동기화 블록을 거치게 되어있다는 것입니다. 최초 instance초기화 문제 때문에 synchronized를 추가하였는데, 초기화가 완료된 시점 이후라면 synchronized는 불필요하게 lock을 잡을 뿐 별다른 역할을 하지 못합니다.

synchronized 키워드를 사용하면 성능이 약 100배 가량 떨어집니다. 만약, getInstance 메서드의 속도가 중요하지 않은 경우라면 그냥 둬도 상관은 없습니다. 하지만 아래에서 나오는 방식들을 배우고 나서는 위 방식을 사용하면 안됩니다.

### 2-5. **Lazy Initialization. Double Checking Locking(DCL, Thread-safe)**

위 동기화 블럭 방식을 개선한 방식이 `DCL(Double Checking Locking)` 방식 입니다. 이 방식은, 인스턴스가 생성되지 않은 경우에만 동기화 블럭이 실행되게끔 구현하는 방식입니다.

```java
public class Singleton {
    private volatile static Singleton uniqueInstance;

    private Sigleton() {}

    // Lazy Initialization. DCL
    public Singleton getInstance() {
      if(uniqueInstance == null) {
         synchronized(Singleton.class) {
            if(uniqueInstance == null) {
               uniqueInstance = new Singleton(); 
            }
         }
      }
      return uniqueInstance;
    }
}
```

위 코드에서 `volatile` 키워드가 등장하는데, `volatile` 키워드를 사용하면 멀티스레딩을 쓰더라도 uniqueInstance 변수가 Sigleton 인스턴스로 초기화 되는 과정이 올바르게 진행되도록 할 수 있습니다.

**volatile 키워드가 필요한 이유 ?**

소스코드 논리적으로는 문제가 없지만 컴파일러에 따라서 재배치(reordering)문제를 야기한다.  위에 소스가 컴파일 되는 경우 인스턴스 생성은 아래와 같은 과정을 거치게 됩니다.

```java
public class Singleton {
    public static Singleton getInstance() {
        if(instance == null) { // Thread B 수행
            synchronized (Singleton.class) {
                if(instance == null) {
    
                    // instance = new Singleton(); 아래와 같이 변환 됨
                    some_space = allocate space for Singleton object;
                    instance = some_space; // Thread A가 수행
                    create a real object in some_space; // 실제 오브젝트 할당
    
                }
            }
        }
    
        return instance;
    }
}
```

volatile 변수를 사용하고 있지 않는 멀티 스레드 어플리케이션에서는 작업(Task)을 수행하는 동안 성능 향상을 위해 Main Memory 에서 읽은 변수 값을 CPU Cache 에 저장하게 됩니다. 이런 경우 각 스레드마다 동일한 변수의 값을 다르게 기억할 수 있습니다. 만약 멀티 스레드 환경에서 스레드가 변수 값을 읽어올 때, 각각의 CPU Cache에 저장된 값이 다르다면 변수 값 불일치가 발생하게 됩니다.

만약 Thread A가 인스턴스 생성을 위해서 instance = some_space;를 수행하는 순간 Thread B가 Singleton.getInstance()를 호출하게 되면 아직 실제로 인스턴스가 생성되지 않았지만, Thread B는 instance == null 의 결과가 false로 리턴되는 문제를 야기하게 됩니다.

즉, volatile 키워드를 이용하는 경우 instance는 CPU Cache에 값을 저장하지 않고, Main Memory에 값을 저장하고 읽어오기 때문에(read and write) 변수 값 불일치 문제가 생기지 않습니다.

- 멀티 스레드 환경에서 하나의 스레드는 read and write 하며, 나머지 스레드는 read 만 하는 경우 변수의 최신 값을 보장
- 멀티 스레드 환경에서 여러개의 스레드가 write 하는 상황이라면 동기화 블럭(synchronized) 을 지정해서 원자성(atomic) 을 보장해야 한다.

### 2-6. **Lazy Initailization. Enum(열거 상수 클래스, Thread-safe)**

Enum 인스턴스의 생성은 기본적으로 Thread-safe 합니다. 따라서 스레드 관련된 코드가 없어져서 코드가 간단해집니다. 하지만 Enum 내의 다른 메서드가 있는 경우에 해당 메서드가 Thread-safe 한지는 개발자가 책임져야합니다.

```java
enum Singleton {
    SINGLETON;

    public void print() {
        System.out.println("싱글톤 생성");
    }
}

class SingletonTest {
    public static void main(String[] args) {
        Singleton.SINGLETON.print();
    }
}

// 출력 결과
싱글톤 생성
```

Enum 방식을 사용한 장점은 아주 복잡한 직렬화 상황이나, 리플렉션 공격에도 제 2의 인스턴스가 생성되는 것을 막아줍니다. 단, 만들려는 싱글턴이 Enum 외의 클래스를 상속해야 하는 경우에는 사용할 수 없습니다. 또한, Android 같이 Context 의존성이 있는 환경일 경우, 싱글턴의 초기화 과정에 Context 라는 의존성이 끼어들 가능성이 있습니다.

### 2-7. **Lazy Initialization. LazyHolder(게으른 홀더, Thread-safe)**

LazyHolder 방식은 가장 많이 사용되는 싱글턴 구현 방식입니다.

volatile 이나 synchronized 키워드 없이도 동시성 문제를 해결하기 때문에 성능이 뛰어납니다.

```java
public class Singleton {

    private Singleton() {}

    /**
     * static member class
     * 내부클래스에서 static변수를 선언해야하는 경우 static 내부 클래스를 선언해야만 한다.
     * static 멤버, 특히 static 메서드에서 사용될 목적으로 선언
     */
    private static class InnerInstanceClazz() {
        // 클래스 로딩 시점에서 생성
        private static final Singleton uniqueInstance = new Singleton();
    }

    public static Singleton getInstance() {
        return InnerInstanceClazz.instance;
    }
    
}
```

InnerInstanceClazz 내부 인스턴스는 static 이기 때문에 클래스 로딩 시점에 한번만 호출된다는 점을 이용한것이며, final을 써서 다시 값이 할당되지 않도록 합니다.

## 3. Inner Class 초기화 시점

싱글턴 클래스에는 InnerInstanceClazz 클래스의 변수가 없기 때문에, static 멤버 클래스더라도, 클래스 로더가 초기화 과정을 진행할때 InnerInstanceClazz 메서드를 초기화 하지 않고, getInstance() 메서드를 호출할때 초기화 됩니다.

jvm 의 클래스 초기화 과정에서 보장되는 원자적 특성(시리얼하게 동작)을 이용합니다. 즉 동기화 문제를 jvm이 처리 하도록 하였기에, `동적바인딩(Dynamic Binding)` (런타임시에 성격이 결정) 의 특징을 이용하여 Thread-safe 하면서 성능이 뛰어납니다.

다음은 외부 클래스가 static 이너 클래스의 변수를 가지고 있지 않을 떄의 예시입니다.

```java
class Test {
    
    static  {
        System.out.println("외부 클래스 생성");
    }
    
    private static class InnerTest {
        static {
            System.out.println("내부 클래스 생성");
        }
    }
}

class Print {
	public static void main(String[] args) {
        Test test = new Test();
    }
}

// 실행 결과
외부 클래스 생성
```

내부 클래스가 static으로 선언되어 있음에도, 내부 클래스는 클래스 로더에 의해 아직 로딩되지 않았음을 알 수 있습니다.

다음은 외부 클래스가 static 이너 클래스의 변수를 가지고 있을 때의 예시입니다.

```java
class Test {
    
    static  {
        System.out.println("외부 클래스 생성");
        System.out.println("InnerTest.a = " + InnerTest.a);
    }

    private static class InnerTest {
        
        static {
            System.out.println("내부 클래스 생성");
        }
        
        private static final int a =1;
    }
}

class Print {
	public static void main(String[] args) {
        Test test = new Test();
    }
}

// 실행 결과
외부 클래스 생성
InnerTest.a = 1
```

외부 클래스에서 내부 클래스의 값을 참조하려고 하자 내부 클래스의 로딩이 이루어지는 것을 볼 수 있습니다.

## 4. 싱글턴 사용시 주의사항

클래스 로더를 2개 이상 사용하는 경우, 인스턴스가 2개 이상 생성될 수 있습니다. 이런 경우에는 클래스 로더를 지정해야 합니다.

자바와 스프링의 싱글톤 차이점은, 싱글톤 객체의 생명주기가 다릅니다. 또한 자바에서 범위는 클래스 로더가 기준이지만, 스프링 에서는 어플리케이션 컨텍스트(ApplicationContext) 가 기준이 됩니다.

클래스 로더 기준이라는 것은 톰캣이 WAR 파일을 만들게 되면, WAR 파일 하나 당 클래스 로더 하나 1:1 식으로 배치가 되기 때문에 다른 WAR 파일은 참조가 불가능합니다.

반면, ApplicationContext 기준이라는 것은 web.xml 에서 root context 하나와 servlet cotnext 여러개를 등록할 수 있는데, 이 각각의 context 들이 싱글턴 범위가 됩니다.

## 5. 스프링의 싱글턴 패턴(Singleton Pattern in Spring)

스프링은 빈을 등록할 때 범위(scope)를 지정할 수 있는데 디폴트가 싱글턴(Singleton) 입니다. 그 외에도 prototype, request, session 이 있습니다.

- prototype : 컨테이너에 빈을 요청할 때마다 매번 새로운 객체를 만든다.
- request : HTTP 요청 하나당 하나의 객체를 만든다.

스프링에서 싱글턴을 저장하고 관리해주는 녀석이 `applicationContext` 입니다. 이 녀석의 명칭은 Singleton Registry, IOC 컨테이너, 스프링 컨테이너, 빈 팩토리 등으로 불립니다.

스프링의 핵심 컨테이너의 빈 관리를 담당하는 BeanFactory 의 핵심 구현 클래스는 `DefaultListableBeanFactory`입니다. 대부분의 애플리케이션 컨텍스트는 바로 이 클래스를 BeanFactory 로 사용하는데, 핵심 구현 클래스인`DefaultListableBeanFactory` 가 구현하고 있는 인터페이스의 한가지가 바로 SingletonRegistry 입니다.

### 5-1. 스프링은 왜 Bean 을 Singleton 으로 생성할까?

스프링에서 하나의 요청을 처리하기 위해서는 Presentation Layer, Business Layer, Data Access Layer 등 다양한 기능을 담당하는 객체들이 계층형을 이루고 있는데, 클라이언트 요청 마다 각 로직을 담당하는 객체를 만들어 사용한다면, GC 가 있더라도 메모리 부하가 올 수 있습니다.

이 때문에 엔터프라이즈 분야에서는 `서비스 오브젝트(Service Object)` 라는 개념을 사용해 왔는데 서블릿은 Java 엔터프라이즈 기술의 가장 기본이 되는 서비스 오브젝트라고 할수 있습니다.

서블릿은 대부분의 멀티 스레딩 환경에서 싱글턴을 동작하며, 서블릿 클래스 하나당 하나의 객체를 생성하여, 클라이언트 요청 처리를 담당하는 스레드 들이 해당 객체를 공유해서 사용합니다.

### 5-2. 스프링은 어떻게 빈을 싱글턴으로 생성할까?

방법은 간단합니다. 우리가 Bean 을 어떻게 만드는지 생각하시면 됩니다.

스프링은 어노테이션 설정만으로 IoC 컨테이너(applicationContext) 에 제어권을 넘겨줌으로써 손쉽게 빈(Bean) 을 싱글턴으로 생성하여 사용할 수 있습니다.

Component-scan 대상이 되는 어노테이션들 `@Repository, @Service, @Controller, @Component` 등 을 사용하면됩니다.

### 5-3. private 생성자를 가진 클래스도 빈으로 등록이 가능할까?

private 생성자를 가진 클래스도 스프링의 빈으로 등록해서 사용이 가능합니다. 스프링은 리플렉션을 통해서 인스턴스를 만들고, 리플렉션을 통해서라면 private 생성자를 호출해서 인스턴스를 만드는 것이 가능합니다.

하지만 추천하는 방법은 아니며, 가능하면 클래스 설계자의 의도를 존중하고, 접근방법을 지키도록 하는 것이 바람직합니다.

### 5-4.싱글턴 설계시 주의사항

싱글턴의 중요한 특징 중 하나가 멀티 스레딩 환경에서도 동작 가능하게 구현해야 한다고 했습니다. 즉, Thread-safe 를 보장해야 한다고 했습니다.

따라서 Thread-safe 를 보장하려면, `무상태성(stateless)` 을 지켜야 합니다. 즉, 상태 정보를 클래스 내부에 가지고 있으면 안됩니다.

```java
@RequiredArgsConstructor
public class EventService {
  private final ApplyRepository; // (1)
  private List<Stirng> applicants; // (2)
  private ApplyVo apply; // (2)

  public void createEvent() {
    // 생략
  } 
}
```

무상태성을 지키기 위해서는 클래스 내부에 상태 정보를 가지고 있으면 안된다고 했는데, 예외가 있습니다.

(1) 번 같은 경우는 자신의 클래스 내부에서 다른 싱글턴 빈(Singleton Bean) 을 저장하려는 용도이면 사용 가능합니다.

(2) 번과 같은 전역 변수는 메모리의 메서드 영역(Static Area) 에 저장됩니다. 메서드 영역은 스레드가 공유 가능한 영역 이므로, 여러개의 스레드가 접근하는 경우 값이 변경될 위험이 있기 때문에 Thread-safe 하지 않습니다.

따라서 (2) 번같은 경우는 지역변수나, 메서드의 매개변수로 이용하여 스레드가 공유 불가능한 스택 영역(Stack Area) 에 저장되도록하여 Thread-safe 를 보장하게끔 만들어 줘야 합니다.

즉, 싱글턴이라해도 메서드 파라미터나, 메서드 안에서 생성되는 로컬변수는 메서드가 호출될 때마다 매번 새로 할당되므로, 여러 스레드가 변수의 값을 덮어쓸 일은 없습니다.

### Reference
- [싱글턴 패턴](h[ttps://medium.com/webeveloper/싱글턴-패턴-singleton-pattern-db75ed29c36](https://medium.com/webeveloper/%EC%8B%B1%EA%B8%80%ED%84%B4-%ED%8C%A8%ED%84%B4-singleton-pattern-db75ed29c36))
- [자바 싱글톤 패턴]([https://commin.tistory.com/121](https://commin.tistory.com/121))
- [싱글톤 패턴의 모든 것]([https://javaplant.tistory.com/21](https://javaplant.tistory.com/21))
- [싱글톤 패턴]([https://blog.seotory.com/post/2016/03/java-singleton-pattern](https://blog.seotory.com/post/2016/03/java-singleton-pattern))
