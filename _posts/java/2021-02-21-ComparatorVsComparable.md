---
layout: post
title: "[JAVA] Comparator와 Comparable"
categories: [Java]
---

객체들의 비교를 위한 인터페이스, `Comparator`와 `Comparable`

## Comparator와 Comparable

Comparator와 Comparable은 모두 인터페이스로 컬렉션을 정렬하는데 필요한 메서드를 정의하고 있다.

### Comparable

Comparable을 구현하고 있는 클래스들은 같은 타입의 인스턴스끼리 서로 비교할 수 있는 클래스들, 주로 `Integer`와 같은 wrapper클래스와 String, Data, File과 같은 것들이며 기본적으로 오름차순, 즉, 작은 값에서부터 큰 값의 순으로 정렬되도록 구현되어 있다. 그래서 Comparable을 구현한 클래스는 정렬이 가능하다는 것을 의미한다.

List와 Arrays는 Comparable을 구현하고 있다. 그러므로 Collections.sort()와 Arrays.sort()로 정렬할 수 있다.  만약, List의 원소가 Comparable을 구현하고 있지 않을 경우 ClassCastException을 던진다.

### compare(o1, o2), compareTo(o)

return 값이 1이면 뒤로, -1이면 앞으로 라고 생각할 수 있다. 이는 Comparator#compare(), Comparable#compareTo() 둘 다 똑같다.

```java
@Override
public int compare(Integer o1, Integer o2) {

    // o1이 o2보다 크다면 뒤로 보낸다. 즉, 오름차순이다.
    if (o1 > o2) {
        return 1;
    }

    return -1;
}

// 결과 [1, 3, 5, 7, 9]
```

```java
@Override
public int compare(Integer o1, Integer o2) {

		// o1이 o2보다 작다면 뒤로 보낸다. 즉, 내림차순이다
    if (o1 < o2) {
        return 1;
    }

    return -1;
}

// 결과 [9, 7, 5, 3, 1]
```

## Comparator와 Comparable 사용 시기

Comparable을 구현한 클래스들이 기본적으로 오름차순으로 정렬되어 있지만, 내림차순으로 정렬한다던가 아니면 다른 기준에 의해서 정렬되도록 하고 싶을 때 Comparator를 구현해서 정렬 기준을 제공할 수 있다.

- **Comparable** : 기본 정렬 기준을 구현하는데 사용한다. 새로운 클래스를 정의하고, 그 클래스에 맞는 정렬 기준을 새우려면 Comparable을 사용한다.

- **Comparator** : 기본 정렬 기준 외에 다른 기준으로 정렬하고자 할 때 혹은 Comparable을 구현하지 않은 객체를 정렬하고자 할 때 사용한다.

### Comparable의 사용 시기

Comparable을 다른 정렬 기준으로 구현하기 위해선 compareTo() 메소드를 오버라이드 해야 한다. 내가 정의한 클래스의 정렬 기준을 바꾸는 것은 괜찮다. 그냥 해당 클래스를 상속하는 새로운 클래스를 생성해서 정의하면 되기 때문이다.

다음은 예시 코드이다. 코드가 조금 길다. Ascending와 Descending의 리스트를 생성하고 정렬한다음 결과를 출력해본다. Ascending에선 오름차순으로 정렬하고 있으며, Descending에선 내림차순으로 정렬하고 있다.

```java
public class Main {
    public static void main(String[] args) {
        List<Ascending> ascendings = Arrays.asList(
                new Ascending(1),
                new Ascending(5),
                new Ascending(3),
                new Ascending(9),
                new Ascending(7)
        );

        // Ascendings#compareTo()를 기준으로 정렬하므로 오름차순
        Collections.sort(ascendings);

        System.out.println(ascendings);

        List<Descending> descendings = Arrays.asList(
                new Descending(1),
                new Descending(5),
                new Descending(3),
                new Descending(9),
                new Descending(7)
        );

        // Descending#compareTo()를 기준으로 정렬하므로 내림차순
        Collections.sort(descendings);

        System.out.println(descendings);
    }

    static class Ascending implements Comparable<Ascending> {

        public final int value;

        public Ascending(int value) {
            this.value = value;
        }

        // 오름차순
        @Override
        public int compareTo(Ascending o) {
            if (value > o.value) {
                return 1;
            }

            return -1;
        }

        @Override
        public String toString() {
            return Integer.toString(value);
        }
    }

    static class Descending extends Ascending {

        public Descending(int a) {
            super(a);
        }

        // 내림차순
        @Override
        public int compareTo(Ascending o) {
            if (value < o.value) {
                return 1;
            }

            return -1;
        }
    }
}
```

실행 결과 각각 오름차순 내림차순으로 정렬되어 출력된다.

```java
[1, 3, 5, 7, 9]
[9, 7, 5, 3, 1]
```

Comparable로 기존 정렬 기준과 다른 정렬 기준을 정의하는데는 다음과 같은 문제점을 갖는다.

- Comparable을 상속하는 클래스가 `final` 일 경우 상속받아 재정의할 수 없어 다른 정렬 기준을 만들지 못한다. 예를 들어, Integer 클래스는 `final`로 선언되어 있다. 그러므로 오름차순으로만 정렬 가능하다.

- compareTo() 메소드가 `final` 로 선언되어 있을 경우 재정의 할 수 없어 다른 정렬 기준을 만들지 못한다. 예를 들어, Enum#compareTo()가 있다.

그러므로 기존 정렬 기준과 다른 정렬 기준이 필요할 떄는 Comparator를 사용하는 것이 좋다. 

### 참고 문서

- 자바의 정석 - Comparator와 Comparable
- [https://docs.oracle.com/javase/tutorial/collections/interfaces/order.htm](https://docs.oracle.com/javase/tutorial/collections/interfaces/order.html)
