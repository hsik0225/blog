---
layout: post
title: "[Proceed #3] ConstraintDescription"
categories: [Katalk]
---

`Spring REST Docs`의 `Constraint` 메시지에 영어와 한글을 모두 출력

Spring REST Docs에 Constraint를 추가하는 작업 도중 constraint의 메세지가 제대로 입력되지 않고 있습니다.

```java
@Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])[a-zA-Z0-9]*$")
String password
```

다음의 제약 조건을 Spring REST Docs로 ConstraintDescription을 달아보면 다음과 같이 출력됩니다.

![요청 1](https://user-images.githubusercontent.com/56301069/97087760-619c2e00-1667-11eb-9bd7-df075faff1d9.png)


하지만 이것은 API 문서를 보는 입장에서 어떻게 입력해야 하는지 잘 모릅니다. 그래서 출력 메세지에 

**소문자 영어, 숫자가 1번씩 포함되어야 하며 비밀번호는 대/소문자, 숫자만이 가능합니다**

를 추가하여 API를 보는 사람이 쉽게 알 수 있도록 변경하고 싶었습니다.

## 해결 과정

@Pattern에 다음과 같이 기본 메세지를 수정할 수 있는 옵션이 있습니다.

```java
@Pattern(message = "소문자 영어, 숫자가 1번씩 포함되어야 하며 비밀번호는 대/소문자, 숫자만이 가능합니다")
```

`message` 옵션을 주게 되면 validation이 실패했을 때 해당 문구로 바꾸어 출력합니디. 이 message의 기본 값은`{javax.validation.constraints.Pattern.message}` 에 설정되어 있는 값 입니다.

이 `message` 옵션은 위의 기본 값 대신 새로운 메세지 값을 설정해주는 것입니다.

위의 코드처럼 메세지 옵션에 값을 넣어주었지만 결과는 그대로 

**Must match the regular expression `^(?=.*[0-9])(?=.*[a-z])[a-zA-Z0-9]*$`.**

가 출력되었습니다.

혹시 `message` 의 값이 변경되지 않은 것인지 확인해보기 위하여 `@Pattern` 의 `message` 값을 불러오는 코드를 구현해 보았습니다. <br>
다음은 그 예시입니다.

```java
ValidatorConstraintResolver constraintResolver 
	= new ValidatorConstraintResolver();

List<Constraint> constraints 
	= constraintResolver.resolveForProperty(property, clazz); // 1

Map<String, Object> configuration = constraints.get(0).getConfiguration(); // 2

System.out.println(configuration);

// 결과
configuration = {... message=소문자 영어, 숫자가 1번씩 포함되어야 하며 비밀번호는 대/소문자, 숫자만이 가능합니다}
```

1. `ValidatorConstraintResolver` 클래스를 사용하여 해당 클래스가 가지고 있는 속성의 Constraint를 가지고 옵니다. 여기서 속성은 위의 코드의 속성인 `password` 입니다. `clazz` 는 `password` 속성을 가지고 있는 클래스입니다. `Class<T>` 의 타입입니다.
2. List<Constraint> 의 첫 번째 인덱스를 가져오고, `Constraint`의 속성인 `Configuration` 을 가져옵니다. `Configuration`은 `Map<String, Object>` 의 타입으로 키 값으로 옵션의 이름(ex.`message`) 을 가지고 있고, 밸류로 해당 옵션이 가지고 있는 값을 가지고 있습니다.

출력 결과 `message` 는 제대로 변경되었다는 것을 알 수 있습니다.

그렇다면 문제는 그 다음인 주어진 constraint를 통하여 description을 만들 때 발생한다는 것을 알 수 있습니다.

디버그를 하나하나 찍으며 들어가보자 문제는 `PropertyResourceBundle` 클래스에서 HashMap을 이용하여 Key인 `javax.validation.constraints.Pattern.description` 와 맞는 Value 값인 기본 메세지를 찾기 때문이라는 것을 알 수 있었습니다

만약 키인 `javax.validation.constraints.Pattern.description`의 밸류 값을 변경하면 다른 곳에서 `@Pattern` 을 사용할 때 변경한 메세지가 출력되는 일이 발생할 것입니다. 

저는 그런 상황을 원치 않으므로 위의 예제에서 `configuration` 으로 가져온 메세지를 그대로 snippet에 추가하겠습니다.

다음은 커스텀메세지를 추가하는 코드입니다.

한글만이 아닌 영어도 같이 출력하게 만들었습니다. <br>
라이브러리의 내부 코드를 조금 수정하였습니다.
```java

private static final ValidatorConstraintResolver constraintResolver
            = new ValidatorConstraintResolver();

private static final ConstraintDescriptionResolver descriptionResolver =
            new ResourceBundleConstraintDescriptionResolver();

private static final List<String> descriptions = new ArrayList<>();

public static String message(String property, Class<T> clazz) {
    
    String constraintMessages = "";

    List<Constraint> constraints
            = constraintResolver.resolveForProperty(property, clazz);
    
    // 제약 조건을 가지고 있지 않을 수 있으므로 if 문으로 한 번 체크합니다
    if (!constraints.isEmpty()) {

        for (Constraint constraint : constraints) {
            String message = constraint.getConfiguration().get("message") + " ";

            // 한글이 한 글자도 포함되어 있지 않으면 기본 메세지로 간주하고 추가하지 않습니다
            if (!message.matches("^.*[가-힣]+.*$")) {
                message = "";
            }

            descriptions.add(message + descriptionResolver.resolveDescription(constraint));
        }

        // collectionToDelimitedString : 컬렉션을 delimiter 로 연결합니다
        constraintMessages = collectionToDelimitedString(descriptions, ". ");

       // 저장한 값 삭제
        descriptions.clear();
    }

    return constraintMessages;
}
```

원하는대로 잘 출력이 되는 것을 확인할 수 있습니다. 
![요청 2](https://user-images.githubusercontent.com/56301069/97087498-a1621600-1665-11eb-8c4d-4972291fa701.png)

사용된 모든 코드는 [깃허브](https://github.com/hsik0225/Katalk) 에 있습니다.
