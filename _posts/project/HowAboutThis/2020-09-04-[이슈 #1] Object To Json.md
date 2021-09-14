---
layout: post
title: "[이슈 #1] 객체를 JSON으로 응답할 때"
categories: [HAT]
---


객체의 인스턴스를 `@RestController`를 사용하여 반환할 때, 객체의 속성이
1. `public` 이면 getter 메소드가 필요없다
2. `private`, `publci static`,`private static` 이면 getter 메소드가 필요하다

여기서 getter는 정적 메소드이면 안됩니다. 아마도 인스턴스의 속성들을 getter로 뽑아내야 하는데 
메소드가 static이면, 인스턴스 메소드인 뽑아내는 메소드가 getter를 호출할 수 없어서 그런 것 같습니다.

공식문서에서 보면 `@ResponseBody`의 응답은 HttpMessageConverter를 구현한 클래스가 
응답 형태에 맞게 변환한다고 써있는데, 어디서 getter를 호출하는지 모르겠네요. 조금 더 공부해봐야겠습니다.
