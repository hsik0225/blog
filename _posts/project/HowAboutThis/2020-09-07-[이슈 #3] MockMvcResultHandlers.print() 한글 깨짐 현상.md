---
layout: post
title: "[이슈 #3] MockMvcResultHandlers.print() 한글 깨짐 현상" 
categories: [HAT]
---



![사진](https://user-images.githubusercontent.com/56301069/92398415-7a0dc300-f163-11ea-9479-a4e77a8b80f8.png)

코딩 중 위의 사진과 같이 MockHttpServletResponse.Body 의 한글이 깨지는 
현상이 발생했다.

해결 방법은 `@Controller` 클래스의 `@RequestMapping`에 produces를 `application/json; charset=UTF-8`로 설정해주면 된다.
```java
@RequestMapping(value = "/api/users" , produces = {"application/json; charset=UTF-8"})
@RestController
public class SignUpController {
    ...
}
```
## 해결 과정
오류가 난 코드는 다음과 같았다.
```java
void 이용약관_목록_테스트() throws Exception {

    // given
    Policy expectedPolicy = PolicySingleton.getInstance();

    // when
    MockHttpServletRequestBuilder requestBuilder = get("/api/users/policy");

    MockHttpServletResponse response = mockMvc.perform(requestBuilder)
            .andDo(print())
            .andReturn()
            .getResponse();

    // then
    assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
    assertThat(response.getContentAsString()).isEqualTo(ObjectToJsonConverter.ObjectToJson(expectedPolicy));
}
```

`MockMvcResultHandlers#print()`에서 글을 인코딩하고 출력할 때, 정해져 있는 인코딩 값이 
한글을 지원하지 않아 깨지는 것이라고 생각했다.

그래서 정해져있는 인코딩 값을 바꿀 방법을 생각해보았다.
### 1. print 메소드의 매개변수로 인코딩 값을 설정
`MockMvcResultHandlers#print()`는 매개변수로 `OutputStream`과 `Writer`를 받을 수 있다. 
Writer의 자손인 OutputStreamWriter는 생성자로 인코딩 값을 받아 지정된 
인코딩을 사용하는 OutputStreamWriter를 생성할 수 있다. 

이 OutputStreamWriter를 매개변수로 print 메소드를 실행하면 
print()하는 메소드는 OutputStreamWriter의 인코딩 값을 이용하여 
인코딩을 한 후 출력을 할 것이라 생각했다.
```java
MockHttpServletResponse response = mockMvc.perform(requestBuilder)
        .andDo(print(new OutputStreamWriter(System.out, StandardCharsets.UTF_8)))
        .andReturn()
        .getResponse();
```

```markdown
// 출력 결과
org.opentest4j.AssertionFailedError: 
Expecting:
 <"{"length":20,"terms":[{"title":"ì  1 ì¡°","contents":["ì£¼ìíì¬ ëë£¨ê° ì ê³µíë ìë¹
```

하지만 여전히 글자가 깨져서 나타났다. 왜 그런지 내부 코드를 조금 더 살펴보았다.
`MockMvcResultHandlers#print()`는 `MockMvc#andDo()`메소드에서 호출된다.
`MockMvc#andDo()` 메소드는 다음과 같이 구현되어 있다.
```java
@Override
public ResultActions andDo(ResultHandler handler) throws Exception {
    handler.handle(mvcResult);
    return this;
}
```

`MockMvcResultHandlers#print()`는 `MvcResult`를 호출하며 `MockMvcResultHandlers#print()` 내부에선 
`MvcResult`를 상속받는 `PrintingResultHandler` 클래스를 반환하도록 되어있다.

즉 위의 andDo 메소드는 `PrintingResultHandler#handle()`를 호출한다는 것을 알 수 있다.
`PrintingResultHandler#handle()`는 다음과 같다.
```java
@Override
public final void handle(MvcResult result) throws Exception {
    this.printer.printHeading("MockHttpServletRequest");
    printRequest(result.getRequest());

    ...

    this.printer.printHeading("MockHttpServletResponse");
    printResponse(result.getResponse());
}
```

`printResponse()`가 `MockHttpServletResponse`를 호출하고, 여기서 
한글이 깨진다는 것을 알 수 있다.

`printResponse()` 메소드는 다음과 같다.
```java
public class MockHttpServletResponse implements HttpServletResponse {

    // WebUtils.DEFAULT_CHARACTER_ENCODING == "ISO-8859-1" 
    @Nullable
    private String characterEncoding = WebUtils.DEFAULT_CHARACTER_ENCODING;

    protected void printResponse(MockHttpServletResponse response) throws Exception {
        String body = (response.getCharacterEncoding() != null ?
            response.getContentAsString() : MISSING_CHARACTER_ENCODING);
    
        this.printer.printValue("Status", response.getStatus());
        this.printer.printValue("Error message", response.getErrorMessage());
    }
    
    public String getContentAsString() throws UnsupportedEncodingException {
        return (this.characterEncoding != null ?
                this.content.toString(this.characterEncoding) : this.content.toString());
    }
}
    
```
ResponseBody를 출력할 때는 `MockMvcResultHandlers#print()`의 매개변수에 지정된 인코딩 값이 아니라 
MockHttpServletResponse클래스의 characterEncoding 속성 값에 의해 인코딩된다는 것을 알 수 있다.

MockHttpServletResponse클래스의 characterEncoding 속성은 기본값을 가지고 있어서 그 기본값에 의해 
인코딩된 후 출력된다.

그러면 `MockHttpServletResponse`의 characterEncoding값만 변경하면 한글이 깨지지 않을 것이다.
### 2. MockHttpServletResponse의 characterEncoding 값 변경
`MockHttpServletResponse#setCharacterEncoding("UTF-8")`를 해주면 인코딩 값을 `UTF-8`로 변경할 수 있다.

```java
MockHttpServletResponse response = mockMvc.perform(requestBuilder)
            .andDo(print(new OutputStreamWriter(System.out, StandardCharsets.UTF_8)))
            .andReturn()
            .getResponse();
        
response.setCharacterEncoding("UTF-8");
``` 

하지만 위와 같이 코딩을 하면 2가지 문제점이 있다.
1. `MockMvcResultHandlers#print()`를 하면 한글은 여전히 깨진다. `MockHttpServletResponse#setCharacterEncoding("UTF-8")`를 하기 전에
`MockMvcResultHandlers#print()`를 실행하여 아직 인코딩 되기 전에 출력을 진행하기 때문이다
2. 한글을 응답하는 모든 메소드에 `MockHttpServletResponse#setCharacterEncoding("UTF-8")`를 넣어주어야 한다. 이것은 
반환된 값과 기대값을 비교할 때 사용한다.
### 3. @RequestMapping produces 설정
`@RequestMapping` 의 `produces`를 사용하여 Request 요청에 따른 Response의 Headers와 Content-Type을 변경할 수 있다.
```java
@RequestMapping(value = "/api/users", produces = {"application/json; charset=UTF-8"})
```

```markdown
-- 기존
MockHttpServletResponse:
           Status = 200
    Error message = null
          Headers = [Content-Type:"application/json"]
     Content type = application/json

-- 변경
MockHttpServletResponse:
           Status = 200
    Error message = null
          Headers = [Content-Type:"application/json;charset=UTF-8"]
     Content type = application/json;charset=UTF-8
```
### 개선점
한글을 응답하는 모든 컨트롤러 RequestMapping에 produces 설정을 해줘야 한다.
빈을 등록해서 `MockHttpServletResponse`의 기본값을 `UTF-8`로 변경한다 등등 빈을 
이용하여 코드 중복을 없앨 수 있는 방법은 없을까?
