---
layout: post
title: "[이슈 #2] 어째서 @RequestBody 어노테이션을 붙여야만 객체와 RequestBody가 매핑이 될까?" 
categories: [HAT]
---

컨트롤러의 파라미터에 `@RequestBody` 어노테이션을 붙이지 않으면 객체를 읽어오지 못하는 이유에 대해서 알아보자.


프로젝트를 진행하던 도중 커맨드 객체의 프로퍼티에 값이 입력되지 않아 자꾸 `null`로 
나오는 이슈가 있었습니다. 왜 그런가 하고 보니 인수에 `@RequestBody`를 입력하지 않았기 
때문이었습니다. 여기서 의문이 생겼습니다. 왜 @RequestBody 어노테이션을 붙여야만 객체와 RequestBody가 매핑이 될까?

공식 문서에서는 `@RequestBody`를 다음과 같이 얘기하고 있습니다.
```markdown
`@RequestBody`

`@RequestBody`어노테이션을 사용하여 리퀘스트 전체를 읽어들여 `HttpMessageConverter`를 
통하여 `Object`로 Deserialize할 수 있습니다.

`@RequestBody`를 `javax.validation.Valid` 또는 Spring의 `@Valid` 어노테이션과 
조합하여 사용할 수 있습니다. 어노테이션 둘 다 표준 Bean Validation에 적용됩니다.  
```
즉, Serialize된 객체를 다시 Deserialize하기 위하여 `@RequestBody` 어노테이션을 
사용해야한다는 것을 알 수 있었습니다.
