---
layout: post
title: "[우아한 테크코스] 프리코스 2주차"
categories: [Education]

---
해당 글은 우테코 프리코스 2주차를 진행하면서 배운 내용을 정리한 글입니다.

## 1. assertThatThrownBy() vs assertThatCode()

다음과 같이 예외가 발생하지 않을 경우 아무런 예외도 던지지 않는 테스트 코드가 있다.

```java
assertThatThrownBy(() -> validator.validate(carNames)).doesNotThrowAnyException();
```

보기에는 문제가 없고, 컴파일에서도 에러가 발생하지 않는다.

하지만, 테스트 실행 시 다음과 같은 에러가 발생한다.

![error](https://user-images.githubusercontent.com/56301069/101247118-b0ef7700-375a-11eb-8860-defac26346bc.png)


예외가 던져져야 하는데 예외가 던져지지 않아 발생한 에러이다.

하지만, **assertThatThrownBy()** 이 아닌 **assertThatCode()** 를 사용하면 테스트에 성공한다.

```java
assertThatCode(() -> validator.validate(carNames)).doesNotThrowAnyException();
```

**assertThatThrownBy()** 와 **assertThatCode()** 둘 다 예외를 캡쳐한 후 `Throwable` 을 확인하는 메소드이다.

하지만 하나는 테스트 성공, 하나는 테스트를 실패한다. 둘은 어떤 차이가 있는걸까?

### 1-1. assertThatThrownBy()
다음은 **assertThatThrownBy()** 의 javadoc 설명이다.
> if the the provided ThrowableAssert.ThrowingCallable does not raise an exception, an error is immediately thrown, in that case the test description provided with as(String, Object...) is not honored.


제공된 ThrowableAssert.ThrowingCallable이 예외를 발생시키지 않으면 즉시 오류가 발생합니다. 이 경우 as (String, Object ...)와 함께 제공된 테스트 설명이 적용되지 않습니다.

### 1-2. assertThatCode()
다음은 **assertThatCode()** 의 javadoc 설명이다.

> The main difference with assertThatThrownBy(ThrowingCallable) is that this method does not fail if no exception was thrown.

assertThatThrownBy (ThrowingCallable)의 주요 차이점은 **예외가 발생하지 않으면 이 메서드가 실패하지 않는다**는 것이다.

```java
ThrowingCallable boomCode = () -> {
	throw new Exception("boom!");
};

ThrowingCallable doNothing = () -> {};

// assertions succeed
assertThatCode(doNothing).doesNotThrowAnyException();
assertThatCode(boomCode).isInstanceOf(Exception.class)
                       .hasMessageContaining("boom");

// assertion fails
assertThatCode(boomCode).doesNotThrowAnyException();
```

Contrary to assertThatThrownBy(ThrowingCallable) the test description provided with as(String, Object...) is always honored as shown below.

```java
ThrowingCallable doNothing = () -> {};

 // assertion fails and "display me" appears in the assertion error
 assertThatCode(doNothing).as("display me")
                          .isInstanceOf(Exception.class);
```

### 1-3. 결론

정리하면 다음과 같다.

**assertThatThrownBy()**

- 예외가 던져지지 않으면 바로 실패한다
- 예외가 던져지지 않으면 as()의 설명도 에러 메세지에 나타나지 않는다

**assertThatCode()**

- 예외가 던져지지 않아도 실패하지 않는다
- 예외가 던져지지 않아도 as()의 설명이 에러 메세지에 나타난다

어떠한 예외도 던지지 않을 경우 **assertThatCode#doesNotThrow()** 를 사용하자!

## 2. isInstancOf() vs isExactlyInstanceOf()

### 2-1. isInstancOf()

Verifies that the actual value is an instance of the given type.

isInstanceOf 메소드는 상속관계에 있는 클래스를 포함한다.

HashMap은 Map 인터페이스의 구현체이므로 Map 클래스의 인스턴스이다.

```java
// assertions will pass
assertThat("abc").isInstanceOf(String.class);
assertThat(new HashMap<String, Integer>()).isInstanceOf(HashMap.class);
assertThat(new HashMap<String, Integer>()).isInstanceOf(Map.class);

// assertions will fail
assertThat(1).isInstanceOf(String.class);
assertThat(new ArrayList<String>()).isInstanceOf(LinkedList.class);
```

### 2-2. isExactlyInstanceOf()

Verifies that the actual value is exactly an instance of the given type.

isExactlyInstanceOf 메소드는 정확히 그 클래스이어야 한다. 상속관계를 포함하지 않는다.

```java
// assertions will pass
assertThat("abc").isExactlyInstanceOf(String.class);
assertThat(new ArrayList<String>()).isExactlyInstanceOf(ArrayList.class);
assertThat(new HashMap<String, Integer>()).isExactlyInstanceOf(HashMap.class);

// assertions will fail
assertThat(1).isExactlyInstanceOf(String.class);
assertThat(new ArrayList<String>()).isExactlyInstanceOf(List.class);
assertThat(new HashMap<String, Integer>()).isExactlyInstanceOf(Map.class);
```

## 3. 정규표현식을 이용한 유효성 검사의 단점

유효성 검사를 할 때 흔히 정규표현식을 사용한다. 정규표현식을 이용하면 문자열을 반복문을 돌지 않고 한 번에 검사할 수 있어서 짧게 구현할 수 있으며, 그에 따라 가독성도 올라간다는 장점이 있다. 하지만 구현 도중 몇 가지 단점을 알게 되었다.

### 3-1. 단점

- 반복문을 사용하지 않기 때문에 정규표현식과 맞지 않는 부분이 발생해도 어디에서 맞지 않았는지 알 수가 없다. 유효성 검사 실패 시 어느 문자열에서 실패하였는지 알기 어렵다.

- 정규표현식은 변경이 어려워 코드가 유연하지 못하게 된다.

예를 들어 다음과 같은 정규표현식이 있다.

![_2020-12-04__11 35 21](https://user-images.githubusercontent.com/56301069/101247180-45f27000-375b-11eb-8882-f73db63bd477.png)

만약 자동차의 길이 범위를 2에서 6으로 변경한다고 한다면,  1, 5를 하나하나 수정해야 한다.

이것이 싫어서 String.format()을 사용한다면 다음과 같이 더 보기 좋지 않은 코드가 되버린다.

![_2020-12-04__11 51 42](https://user-images.githubusercontent.com/56301069/101247195-5b679a00-375b-11eb-904f-084a89ab6ae9.png)

만약 여기서 위의 코드에서 구분자인 콤마도 상수로 나타낸다고 하면 더 길고, 가독성이 좋지 않은 코드가 될 것이다.

### 3-2. 결론

정규표현식은 다음과 같은 경우에 사용하는 것이 좋다

- 어느 문자열이 틀렸는지는 알지 않아도 될 때
- 변경이 자주 일어나지 않는 패턴일 때(ex. 이메일 주소, 전화번호, ...)

## 4. Map#merge()

다음과 같이 주어진 인자 배열을 반복문을 돌며 Map에 인자가 존재하지 않으면 put() 을 하고, 존재하면 예외를 발생시키는 메소드가 있다.

![스크린샷 2020-12-05 오후 3 59 31](https://user-images.githubusercontent.com/56301069/101247223-91a51980-375b-11eb-9ecf-96e09c64d73c.png)


위 메소드의 반복문은 **키가 밸류와 매핑되어 있지 않으면 키와 밸류를 매핑하고, 매핑되어 있으면 다른 일을 한다** 라는 것을 분리해서 적은 코드라고 생각할 수 있다.

**키가 밸류와 매핑되어 있지 않으면 키와 밸류를 매핑하고, 매핑되어 있으면 다른 일을 한다** 라는 것은 정해진 형식이므로 이미 Map API에 정의되어 있지 않을까? 하는 생각이 들었고, Map API를 살펴보던 도중 **merge()** 메소드를 찾게 되었다.

**merge()** 메소드의 javadoc 설명은 다음과 같다.

> If the specified key is not already associated with a value or is associated with null, associates it with the given non-null value. Otherwise, replaces the associated value with the results of the given remapping function, or removes if the result is null. This method may be of use when combining multiple mapped values for a key. For example, to either create or append a String msg to a value mapping <br><br>map.merge(key, msg, String::concat) <br><br>
If the function returns null the mapping is removed. If the function itself throws an (unchecked) exception, the exception is rethrown, and the current mapping is left unchanged.


키가 밸류와 매핑되지 않았거나 null과 매핑되어있을 경우, 키를 주어진 non-null 밸류와 매핑한다. 그렇지 않으면, 매핑된 밸류를 주어진 **remaaping funtion** 의 결과값으로로 교체한다. 만약 **remaaping funtion** 의 결과값이 null 일 경우 키를 삭제한다. 이 메소드는 키에 대해 여러 매핑된 값을 결합할 때 사용할 수 있다. 예를 들어, `String` 메세지를생성하거나 또는 밸류에 추가(append)하고 싶은 경우 다음과 같이 할 수 있다.

```java
map.merge(key, msg, String::concat)
```

함수가 null을 반환하면 매핑은 제거된다. 함수 스스로 예외가 발생하면, 예외는 다시 발생하고 현재 매핑이 변경되지 않은 상태로 유지된다.

요약하면 다음과 같다.

- key와 매핑이 된 oldValue가 없다면, key와 입력받은 newValue를 매핑시킨다
- key와 매팽이 된 oldValue가 있다면, get(key)하여 얻은  oldValue와 입력받은 newValue를 함수의 인자로 하는 **remapping function** 을 실행시킨다

merge()를 사용하여 처음의 메소드를 리팩토링하여 다음과 같이 수정하였다.

- merge() 전

![스크린샷 2020-12-05 오후 3 59 31](https://user-images.githubusercontent.com/56301069/101247223-91a51980-375b-11eb-9ecf-96e09c64d73c.png)

- merge() 후

![스크린샷 2020-12-05 오후 4 11 38](https://user-images.githubusercontent.com/56301069/101247226-98339100-375b-11eb-83a0-da4e01c2d840.png)
