---
layout: post
title: "[Spring REST Docs Reference] Spring REST Docs"
categories: [Spring, Spring REST Docs]
---

오역이 있을 수 있습니다. [원문](https://docs.spring.io/spring-restdocs/docs/2.0.5.RELEASE/reference/html5/) 을 꼭 한 번 읽어주시기 바랍니다. 

# 1. Introduction

REST Docs의 목표는 RESTful 서비스를 정확하고 읽기 편하게 문서화 하는 것을 돕는 것이다.

높은 수준의 문서화를 하는 것은 어렵다. 이 작업에 잘 맞는 툴을 사용하는데 있어서 어려움을 편리하게 하는 방법으로 스프링 REST Docs는 `Ascii Doctor` 를 사용한다. 아스키닥터는 평문(Plain Text)을 처리하여 필요에 맞는 스타일과 레이어를 적용한 HTML을 만들어준다. 또한 원한다면, Spring REST Docs를 설정하여 `Markdown` 을 사용할 수 있다.

스프링 REST Docs는 Spring MVC의 Test Framework로 쓰여진 테스트를 통해 만들어진 코드 조각(snippet)들을 사용한다. 이 테스트 기반의 접근법(Test-Driven Approach)은 서비스에 대한 문서화의 정확도를 보장해준다. 스니펫이 올바르지 않다면 결과물 생성에 실패할 것이다.

# 2. Getting Started

## 2-1. Gradle Build Configuration

```java
plugins { 

	// asciidoc 파일을 html 파일로 processing 해주는 플러그인
	id "org.asciidoctor.convert" version "1.5.9.2"
}

dependencies {
	// asciidoctor 설정에 spring-restdocs-asciidoctor 의존성을 추가한다.
	// 이것은 `build/generated-snippets`을 가리키는 
	// `.adoc` 파일들을 사용하기 위한 snippets 속성들을 자동으로 설정할 것이다
	asciidoctor 'org.springframework.restdocs:spring-restdocs-asciidoctor:{project-version}' 

	// spring-restdocs-mockmvc 의존성을 추가한다
	testCompile 'org.springframework.restdocs:spring-restdocs-mockmvc:{project-version}' 
}

// 생성되는 스니펫의 저장 위치를 설정
ext { 
	snippetsDir = file('build/generated-snippets')
}

// 결과물인 스니펫 디렉토리를 추가하는 `test` task를 설정
test { 
	outputs.dir snippetsDir
}

// `asciidoctor` task를 설정
asciidoctor { 

	// 입력 값으로 snippets 디렉토리 설정하기
	inputs.dir snippetsDir  

	// task를 test task에 의존하게 만들어 문서가 생성되기 전에 테스트가 실행된다
	dependsOn test  
}
```

## 2-2. Packaging The Documentation

프로젝트의 jar 파일 안에 생성된 문서를  패키지 하고 싶을 수도 있습니다.  예를 들어, 스프링 부트에 의해 제공되는 **정적인 컨텐츠 제공**이 있습니다. 프로젝트의 빌드를  설정함으로써, 

1. 문서는 jar가 빌드되기 전에 생성됩니다
2. 생성된 문서는 jar 파일 안에 포함됩니다

아래는 Gradle에서의 설정입니다.

```java
bootJar {

	// jar가 빌드 되기 전에 문서가 생성되도록 합니다
	dependsOn asciidoctor 

	// jar의 `static/docs` 디렉토리 안에 생성된 문서를 복사합니다
	from ("${asciidoctor.outputDir}/html5") {  
		into 'static/docs'
	}
}
```

## 2-3. Generating Documentation Snippets

Spring REST Docs는 당신이 문서화하고 있는 서비스에 요청을 보내기 위해 Spring MVC의 [test framework](https://docs.spring.io/spring-framework/docs/5.0.x/spring-framework-reference/testing.html#spring-mvc-test-framework) 를 사용합니다. Spring REST Docs는 요청과 응답 결과 문서 스니펫들을 제공합니다.

### 2-3-1. Setting up Your Tests

테스트를 셋업하는 방법은 사용하고 있는 teste framework에 의존합니다. Spring REST Docs는 JUnit4와 JUnit5를 지원합니다. TestNG같은 다른 framework들도 지원하지만 조금 더 많은 설정이 요구됩니다.

### 2-3-2. Setting up Your JUnit5 Tests

JUnit5를 사용할 때, 문서 스니펫을 생성하기 위한 첫 번째 단계는 `RestDocumentaitionExtension`을 테스트 클래스에 적용하는 것입니다. 다음의 예는 그 방법을 보여주고 있습니다.

```java
@ExtendWith(RestDocumentationExtension.class)
public class JUnit5ExampleTests {
```

일반적인 스프링 어플리케이션을 테스트할 땐 `SpringExtension`도 적용해야 합니다.

```java
@ExtendWith({RestDocumentationExtension.class, SpringExtension.class})
public class JUnit5ExampleTests {
```

`RestDocumentaitionExtension` 은 프로젝트의 빌드 설정을 기반으로 결과 디렉토리가 자동으로 설정됩니다.

만약 JUnit 5.1을 사용하고 있는 중이라면, 테스트 클래스에 필드로 `@RegisterExtension`을 선언하여 기본 설정을 Override할 수 있습니다. `@RegisterExtension` 은 생성할 때 결과 디렉토리를 변수로 받습니다.

```java
public class JUnit5ExampleTests {

	@RegisterExtension
	final RestDocumentationExtension restDocumentation = 
			new RestDocumentationExtension ("custom");

}
```

다음, 당신은 `MockMvc` 를 설정하기 위해 반드시 `@BeforEach` 메소드를 선언해야 합니다. 

```java
private MockMvc mockMvc;

@BeforeEach
public void setUp(WebApplicationContext webApplicationContext,
		RestDocumentationContextProvider restDocumentation) {
	this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
			.apply(documentationConfiguration(restDocumentation)) // 1
			.build();
}
```

1. `MockMvc` 인스턴스는 `MockMvcRestDocumentationConfigurer` 을 사용하여 설정합니다. 정적 메소드인 `MockMvcRestDocumentation#documentationConfiguration()` 를 사용하여 이 클래스의 인스턴스를 얻을 수 있습니다.

**Configurer** 는 민감한 기본 설정들을 적용하고, 설정을 커스터마이징하기 위한 API를 제공합니다.

### 2-3-3. Invoking the RESTful Service

testing framework를 설정하였으므로, 이제 RESTful service를 호출하고, 요청과 응답을 문서화시킬 수 있습니다.

```java
this.mockMvc.perform(get("/").accept(MediaType.APPLICATION_JSON)) // 1
	.andExpect(status().isOk()) // 2
	.andDo(document("index")); // 3
```

1. 서비스의 root(`/`)를 호출하고, 응답은 `application/json` 형식이어야 함을 나타냅니다
2. 서비스가 만들어 내는 원하는 응답을 결정합니다
3. 결과 디렉토리로 설정된 디렉토리 밑에 `index`라는 이름을 가진 디렉토리 안에 스니펫을  작성함으로써 서비스로의 호출을 문서화합니다. 이 스니펫들은 `RestDocumentationResultHandler` 에 의해 작성됩니다. 또, 정적 메소드인 `MockMvcRestDocumentation#document()` 를 사용하여 이 클래스의 인스턴스를 얻을 수 있습니다

기본적으로 6개의 스니펫들이 생성됩니다.

- `<output-directory>/index/curl-request.adoc`
- `<output-directory>/index/http-request.adoc`
- `<output-directory>/index/http-response.adoc`
- `<output-directory>/index/httpie-request.adoc`
- `<output-directory>/index/request-body.adoc`
- `<output-directory>/index/response-body.adoc`

## 2-4. Using the Snippets

생성된 스니펫들을 사용하기 전에 반드시 `.adoc` 소스 파일을 생성해야 합니다. 끝에 `.adoc` suffix(접미사)만 붙는다면 파일 이름을 원하는만큼 길게 명명할 수 있습니다. HTML 결과 파일은 같은 이름을 갖지만 끝에 `.html` suffix를 갖습니다. 소스 파일의 기본 위치와 HTML 결과 파일은 `Maven` 이냐 `Gradle` 이냐에 따라 다릅니다.

**Maven**

- Source files : src/main/asciidoc/*.adoc
- Generated files : target/generated-docs/*.html

**Gradle**

- Source files : src/docs/asciidoc/*.adoc
- Generated files : build/asciidoc/html5/*.html

[include macro](https://asciidoctor.org/docs/asciidoc-syntax-quick-reference/#include-files) 를 사용하여 생성된 스니펫들을 메뉴얼대로 생성한 Asciidoc file 안에 포함시킬 수 있습니다. 스니펫의 결과 디렉토리를 결정하기 위해 build configuration에서 설정한 `spring-restdocs-asccidoctor` 에 의해 자동으로 설정되는`snippets` 속성들을 사용할 수 있습니다.

```
include::{snippets}/index/curl-request.adoc[]
```

# 3. Documenting your API

## 3-1. Hypermedia

Spring REST Docs는 [Hypermedia-based](https://en.wikipedia.org/wiki/HATEOAS) API의 링크들을 문서화를 지원합니다. 

```java
this.mockMvc.perform(get("/").accept(MediaType.APPLICATION_JSON))
	.andExpect(status().isOk())
	.andDo(document("index", links( // 1
			linkWithRel("alpha").description("Link to the alpha resource"), // 2
			linkWithRel("bravo").description("Link to the bravo resource")))); // 3
```

1. 응답 링크들을 설명하는 스니펫을 만들기 위해 Spring REST Docs를 설정합니다. 스태틱 메소드인 `HypermediaDocumentation#links()`를 사용합니다
2. `rel`은 `alpha`인 링크를 예상합니다. 스태틱 메소드인 `HypermediaDocumentation#linkWithRel()` 를 사용합니다
3. `rel`은 `bravo`인 링크를 예상합니다

결과는 리소스의 링크들을 설명하는 테이블을 가지고 있는 `links.adoc` 이라는 이름을 가진 스니펫입니다.

링크들을 문서화할 때, 만약 응답에서 문서화되지 않은 링크가 발견되면 테스트는 실패합니다. 유사하게 만약 응답에 문서화된 링크가 존재하지 않고, 링크가 optional로 마크(설정)되어 있지 않다면, 테스트는 실패합니다. 

만약 링크를 문서화하고 싶지 않다면, 무시(Ignored)로 마크합니다. 이렇게 하면 위에서 설명한 오류를 방지하면서 생성된 스니펫에 표시되지 않습니다.

문서화되지 않은 링크로 인해 테스트 실패가 발생하지 않는 `relaxed mode`에서`HypermediaDocumentation#relaxedLinks()`를 사용하여 문서화할 수 있습니다. 

## 3-1-1. Hypermedia Link Formats

두 링크 포맷들은 기본 값으로 사용됩니다.

- Atom : 링크들은 `links`라는 이름의 배열 안에 있어야 합니다. 응답의 컨텐츠 유형이 `application/json`과 호환 가능할 때 기본적으로 사용됩니다
- HAL : 링크들은 `_links` 라는 이름의 맵 안에 있어야 합니다. 응답의 컨텐츠 유형이 `application/hal+json`과 호환 가능할 때 기본적으로 사용됩니다

Atom 또는 HAL 포맷 링크들을 사용하지만 컨텐츠 유형이 다르다면, 기본적으로 제공되는 `LinkExtractor` 구현체 중 하나를 링크에게 제공합니다.

```java
.andDo(document("index", links(halLinks(), // 1
		linkWithRel("alpha").description("Link to the alpha resource"),
		linkWithRel("bravo").description("Link to the bravo resource"))));
```

링크가 HAL 포맷이라는 것을 나타냅니다. 스태틱 메소드인 `HypermediaDocumentation#halLinks()`를 사용합니다.

만약 API가 Atom이나 HAL이 아닌 다른 포맷이라면, 응답에서 링크를 추출하기 위해 `LinkExtractor` 인터페이스의 구현체를 직접 만들어 응답에서 링크를 추출할 수 있습니다.

## 3-1-2. Ignoring Common Links

HAL을 사용할 때 `self` 및 `curies` 같은 모든 응답에 공통적인 링크를 문서화하는 대신 개요 섹션에 한 번 문서화한 다음 나머지 API 문서에서 무시할 수 있습니다. 이를 위해, 특정 링크를 무시하도록 미리 구성된 스니펫에 링크에 대한 설명을 추가하기 위한 스니펫의 재사용 지원을 기반으로 만들 수 있습니다.

```java
public static LinksSnippet links(LinkDescriptor... descriptors) {
	return HypermediaDocumentation.links(linkWithRel("self").ignored().optional(),
			linkWithRel("curies").ignored()).and(descriptors);
}
```

## 3-2. Request and Response Payloads

**hypermedia-specific** 앞에서 설명한 지원 이외에, 일반적인 요청과 응답 내용 문서 지원도 제공됩니다.

기본적으로, Spring REST Docs는 자동으로 Request와 Response Body에 스니펫을 만듭니다. 이 스니펫들은 각 각 `request-body.adoc` 과 `response-body.adoc`으로 불립니다. 

### 3-2-1. Request and Response Fields

요쳥과 응답 페이로드의 더 상세한 문서를 제공하기 위해 페이로드의 필드 문서화가 제공됩니다.

```json
{
	"contact": {
		"name": "Jane Doe",
		"email": "jane.doe@example.com"
	}
}
```

위의 예시의 필드들을 다음과 같이 문서화할 수 있습니다.

```java
this.mockMvc.perform(get("/user/5").accept(MediaType.APPLICATION_JSON))
		.andExpect(status().isOk())
		.andDo(document("index",
				responseFields( // 1
						fieldWithPath("contact.email")
								.description("The user's email address"), // 2
				fieldWithPath("contact.name").description("The user's name")))); // 3
```

1. 응답 페이로드의 필드를 설명하는 스니펫을 생산하도록 Spring REST Docs를 설정합니다. `requestFields`를 사용하여 요청을 문서화할 수 있습니다. 둘 다 `PayloadDocumentation` 클래스에 있는 정적 메소드입니다
2. `contact.email` 경로를 가진 필드가 필요합니다. 스태틱 메소드인 `PayloadDocumentation#fieldWithPath()` 를 사용합니다
3. `contact.name` 경로를 가진 필드가 필요합니다

결과는 필드를 설명하는 테이블을 가진 스니펫입니다. 요청에서 이 스니펫은 `request-fields.adoc` 의 이름을 갖습니다. 응답에서, `response-fields.adoc` 의 이름을 갖습니다.

필드를 문서화할 때, 만약 문서화되지 않은 필드가 페이로드에 있다면 테스트는 실패합니다. 유사하게 만약 문서화된 필드가 페이로드에 없고 필드가 `optional` 로 마크(설정)되어 있지 않다면 테스트는 실패합니다.

만약 모든 필드의 상세한 문서를 제공하는 것을 원하지 않는다면, 한 페이로드의 전체 서브섹션만 문서화할 수 있습니다.

```java
this.mockMvc.perform(get("/user/5").accept(MediaType.APPLICATION_JSON))
		.andExpect(status().isOk())
		.andDo(document("index",
				responseFields( // 1
						subsectionWithPath("contact")
								.description("The user's contact details")))); //1
```

1. `contact` 경로로 서브 섹션을 문서화합니다. `contact.email` 과 `contact.name` 은 이제 문서화된 것으로 간주합니다. 정적 메소드인  `PayloadDocumentation#subsectionWithPath()` 를 사용합니다.

`subsectionWithPath` 은 한 페이로드의 특정 섹션에 대한 높은 수준의 개요을 제공할 때 유용합니다. 이제 독립적이고 더 상세한 서브 섹션 문서를 작성할 수 있습니다.

`ignored`로 마크(설정)하면 필드나 서브 섹션을 문서화하지 않습니다. 이렇게 하면 앞에서 설명한 오류를 피하면서 생성된 스니펫에 표시되지 않습니다.

문서화되지 않은 필드로 인해 테스트 실패가 발생하지 않는 `relaxed mode`에서 필드를 문서화할 수도 있습니다. 이를 위해 `PayloadDocumentation#relaxedRequestFields(), PayloadDocumentation#relaxedResponseFields()` 를 사용합니다. 이건 페이로드의 한 집합에만 집중하길 원하는 특정 시나리오를 문서화할 때 유용합니다.

Spring REST Docs 기본적으로 문서화하고 있는 페이로드는 JSON일 것이라고 가정합니다.

**JSON Field Types**

필드가 문서화되었을 때, Spring REST Docs는 페이로드를 검사하여 타입을 결정하려고 합니다. 

지원되는 JSON 타입들은 다음과 같습니다.

- array
- boolean
- object
- number
- null
- string
- varies : 이 필드는 다양한 유형의 페이로드에서 여러 번 발생합니다

`FieldDescriptor()` 메소드의 `type(Object)`로 확실하게 타입을 정할 수 있습니다. `Object#toString()` 의 결과는 문서에 사용됩니다. 보통 `JsonFieldType`에 의해 계산된 값들 중 하나가 사용됩니다.

```java
.andDo(document("index",
		responseFields(
				fieldWithPath("contact.email").type(JsonFieldType.STRING) // 1
						.description("The user's email address"))));
```

1. 필드의 타입을 `String` 으로 정합니다

**Reusing Field Descriptors**

스니펫 재사용에 대한 일반적인 지원 외에도 요청 및 응답 스니펫을 통해 **path prefix**로 추가 Descriptor를 구성할 수 있습니다. 이를 통해 요청 또는 응답 페이로드의 반복 부분에서 Descriptor를 한 번만 생성한 다음 재사용할 수 있습니다.

다음은 책을 반환하는 엔드포인트입니다.

```json
{
	"title": "Pride and Prejudice",
	"author": "Jane Austen"
}
```

다음은 책 배열을 반환하는 엔드포인트입니다.

```json
[{
	"title": "Pride and Prejudice",
	"author": "Jane Austen"
},
{
	"title": "To Kill a Mockingbird",
	"author": "Harper Lee"
}]
```

`title` 과 `author` 의 경로는 각 각 `[].title` 과 `[].author` 입니다. 책 한권과 책 배열 사이의 차이점은 오직 필드의 경로가 지금은 접두사로 `[].` 를 가지고 있다는 것 뿐입니다.

다음과 같이 책을 문서화하는 설명자를 만들 수 있습니다.

```java
FieldDescriptor[] book = new FieldDescriptor[] {
		fieldWithPath("title").description("Title of the book"),
		fieldWithPath("author").description("Author of the book") };
```

다음과 같이, 책 한 권을 문서화하기 위해 위의 설명자들을 사용할 수 있습니다.

```java
this.mockMvc.perform(get("/books/1").accept(MediaType.APPLICATION_JSON))
		.andExpect(status().isOk()).andDo(document("book", responseFields(book)));
```

또, 책 배열을 문서화할 수도 있습니다.

```java
this.mockMvc.perform(get("/books").accept(MediaType.APPLICATION_JSON))
		.andExpect(status().isOk())
		.andDo(document("book",
				responseFields(
						fieldWithPath("[]").description("An array of books")) // 1
								.andWithPrefix("[].", book))); // 2
```

1. 배열을 문서화합니다
2. `[].title` 과 `[].author` 를 존재하는 `[].`로 시작하는 접두사를 가진 Descriptor를 사용하여 문서화합니다

### 3-2-2. Documenting a Subsection of a Request or Response Payload

REST Docs는 페이로드가 크거나 구조적으로 복잡할 때, 페이로드의 개인 섹션들을 문서화하는데 도움이 됩니다. REST Docs는 당신이 페이로드의 서브섹션을 추출하고, 그것을 문서화시킴으로써 그것을 가능하게 합니다.

**Documenting a Subsecsion of a Request or Response Body**

다음과 같은 JSON Response Body가 있습니다.

```json
{
	"weather": {
		"wind": {
			"speed": 15.3,
			"direction": 287.0
		},
		"temperature": {
			"high": 21.2,
			"low": 14.8
		}
	}
}
```

다음과 같이 `temperature` 오브젝트를 문서화하는 스니펫을 만들 수 있습니다.

```java
this.mockMvc.perform(get("/locations/1").accept(MediaType.APPLICATION_JSON))
		.andExpect(status().isOk()).andDo(document("location",
				responseBody(beneathPath("weather.temperature")))); // 1
```

1. `PayloadDocumentation` 클래스 안에 있는 정적 메소드 `responseBody()`,  `beneathPath()` 를 사용하여, Response Body의 서브 섹션을 가지고 있는 스니펫을 생산합니다. Request Body에서 스니펫을 생상하기 위해선 `responseBody` 자리에 `requestBody`를 적으면 됩니다

위의 예시의 결과는 다음과 같습니다.

```json
{
	"temperature": {
		"high": 21.2,
		"low": 14.8
	}
}
```

스니펫의 이름을 분명하게 만들기 위해, 서브 섹션에 식별자가 포함되야 합니다. 기본적으로, 이 식별자는 `beneath-${path}`입니다. 예를 들어, 앞의 코드 결과는 `response-body-beneath-weather.temperature.adoc` 의 이름을 갖습니다. 다음과 같이 `withSubsectionId(String)` 메소드를 사용하여 식별자를 커스터마이징 할 수 있습니다.

```java
responseBody(beneathPath("weather.temperature").withSubsectionId("temp"));
```

스니펫 결과의 이름은 `request-body-temp.adoc` 입니다.

**Documenting the Fields of a Subsection of a Request or Response**

Request 또는 Response Body의 서브 섹션을 문서화 할 뿐만 아니라 특정 섹션 안의 필드를 문서화할 수 있습니다. 다음과 같이 `temperature` 오브젝트(`high` and `low`)의 필드를 문서화하는 스니펫을 만들 수 있습니다.

```java
this.mockMvc.perform(get("/locations/1").accept(MediaType.APPLICATION_JSON))
		.andExpect(status().isOk())
		.andDo(document("location",
				responseFields(beneathPath("weather.temperature"), // 1
						fieldWithPath("high").description(
								"The forecast high in degrees celcius"), // 2
				fieldWithPath("low")
						.description("The forecast low in degrees celcius"))));
```

1. `PayloadDocumentation#beneathPath()`를 사용하여 `weather.temperature` 경로 아래에 있는 응답 페이로드의 서브 섹션 안의 필드를 설명하는 스니펫을 생산합니다
2. `high` 와 `low` 필드들을 문서화합니다

결과는 `weather.temperature`의 `high` 와 `low` 필드를 설명하는 테이블을 갖고 있는 스니펫입니다. 스니펫의 이름을 분명하게 하기 위해, 서브 섹션의 식별자를 포함시킬 수 있습니다. 기본적으로, 식별자는 `beneath-${path}`입니다. 예를 들어, 앞의 코드는 `response-fields-beneath-weather.temperature.adoc` 라는 이름의 스니펫을 생성합니다.

## 3-3. Request Parameters

`requestParameters` 를 사용하여 요청 파라미터를 문서화할 수 있습니다. 요청 파라미터를 `GET` 요청의 쿼리 스트링에 포함시킬 수 있습니다.

```java
this.mockMvc.perform(get("/users?page=2&per_page=100")) // 1
	.andExpect(status().isOk())
	.andDo(document("users", requestParameters( // 2
			parameterWithName("page").description("The page to retrieve"), // 3
			parameterWithName("per_page").description("Entries per page") // 4
	)));
```

1. 쿼리 스트링에 두 개의 파라미터 `page` 와 `per_page`가 있는 `GET` 요청을 수행합니다
2. `RequestDocumentation#requestParameters()` 를 사용하여 요청 파라미터를 설명하는 스니펫을 생성하도록 Spring REST Docs를 설정합니다
3. `RequestDocumentation#parameterWithName()`를 사용하여 `page` 매개변수를 문서화합니다
4. `per_page` 파라미터를 문서화합니다

`POST` 요청 본문에 form data로 요청 파라미터를 포함할 수 있습니다.

```java
this.mockMvc.perform(post("/users").param("username", "Tester")) // 1
	.andExpect(status().isCreated())
	.andDo(document("create-user", requestParameters(
			parameterWithName("username").description("The user's username")
	)));
```

1. 한 개의 매개변수 `username`을 가진 `POST` 요청을 수행합니다

모든 결과는 리소스에서 지원하는 매개 변수들을 설명하는 테이블이 포함된 `request-parameters.adoc` 이라는 스니펫입니다.

요청 파라미터들을 문서화할 때, 만약 요청에서 문서화하지 않은 요청 파라미터가  사용된다면 테스트는 실패합니다. 유사하게, 만약 문서화된 요청 파라미터가 요청에 없고, 요청 파라미터가 `optional`로 마크되어 있지 않다면 테스트는 실패합니다.

만약 요청 파라미터를 문서화하고 싶지 않다면, 그 파라미터를 `ignored`로 마크하세요. 이건 위에서 설명한 오류를 피하면서 생성된 스니펫이 보이는 것을 방지합니다.

요청 파라미터를 테스트가 실패하지 않는 문서화하지 않은 파라미터에서 `relaxed mode`로 문서화할 수도 있습니다. 이렇게 하기 위해선, `RequestDocumentation#relaxedRequestParameters()` 를 사용해야 합니다. 이건 오직 요청 파라미터의 한 집합에만 집중하고 싶은 특정 시나리오를 문서화할 때 유용합니다.

## 3-4. Path Parameters

요청의 `path parameter`를 `pathParameters`를 사용하여 문서화할 수 있습니다. 

```java
this.mockMvc.perform(get("/locations/{latitude}/{longitude}", 51.5072, 0.1275)) // 1
	.andExpect(status().isOk())
	.andDo(document("locations", pathParameters( // 2
			parameterWithName("latitude").description("The location's latitude"), // 3
			parameterWithName("longitude").description("The location's longitude") // 4
	)));
```

1. `latitude` 와 `longitude` 파라미터를 가진 `GET` 요청을 수행합니다
2. `RequestDocumentation#pathParameters()`를 사용하여 요청 path parameter를 설명하는 스니펫을 생산하도록 Spring REST Docs를 설정합니다
3. 정적 메소드 `RequestDocumentation#parameterWithName()` 를 사용하여 `latitude` 파라미터를 문서화합니다
4. `longitude` 파라미터를 문서화합니다

결과는 `path-parameters.adoc` 라는 리소스에서 지원하는 요청 파라미터를 설명하는 테이블을 가지고 있는 스니펫입니다. 

MockMvc를 사용하는 경우, 문서에서 요청 파라미터를 사용하려면 `MockMvcRequestBuilders`가 아닌 `RestDocumentationRequestBuilders` 의 메소드를  사용하여 요청을 해야합니다.

경로 파라미터들을 문서화할 때, 만약 요청에서 문서화하지 않은 경로 파라미터가  사용된다면 테스트는 실패합니다. 유사하게, 만약 문서화된 경로 파라미터가 요청에 없고, 경로 파라미터가 `optional`로 마크되어 있지 않다면 테스트는 실패합니다.

경로 파라미터를 테스트가 실패하지 않는 문서화하지 않은 파라미터에서 `relaxed mode`로 문서화할 수도 있습니다. 이렇게 하기 위해선, `RequestDocumentation#relaxedPathParameters()` 를 사용해야 합니다. 이건 오직 경로 파라미터의 한 집합에만 집중하고 싶은 특정 시나리오를 문서화할 때 유용합니다.

만약 경로 파라미터를 문서화하고 싶지 않다면, 그 파라미터를 `ignored`로 마크하세요. 이건 위에서 설명한 오류를 피하면서 생성된 스니펫이 보이는 것을 방지합니다.

## 3-5. Request Parts

multipart  요청의 한 부분을 문서화하기 위해 `requestParts` 를 사용할 수 있습니다.

```java
this.mockMvc.perform(multipart("/upload").file("file", "example".getBytes())) // 1
	.andExpect(status().isOk())
	.andDo(document("upload", requestParts( // 2
			partWithName("file").description("The file to upload")) // 3
));
```

1. `file` 라는 이름의 싱글 파트를 가진 `POST` 요청을 수행합니다
2. 정적 메소드 `RequestDocumentation#requestParts()` 를 사용하여 요청의 파트들을 설명하는 스니펫을 생산하도록 Spring REST Docs를 설정합니다
3. `RequestDocumentation#partWithName()` 를 사용하여 `file` 라는 파트를 문서화합니다

결과는 `request-parts.adoc` 라는 리소스에서 지원하는 요청 파트를 설명하는 테이블을 가지고 있는 스니펫입니다. 

요청 파트를 문서화할 때, 만약 요청에서 문서화하지 않은 파트가 사용된다면 테스트는 실패합니다. 유사하게, 만약 문서화된 파트 요청에 없고, 파트가 `optional`로 마크되어 있지 않다면 테스트는 실패합니다.

요청 파트를 테스트가 실패하지 않는 문서화하지 않은 파라미터에서 `relaxed mode`로 문서화할 수도 있습니다. 이렇게 하기 위해선, `RequestDocumentation#relaxedRequestParts()` 를 사용해야 합니다. 이건 오직 요청 파트의 한 집합에만 집중하고 싶은 특정 시나리오를 문서화할 때 유용합니다.

만약 요청 파트를 문서화하고 싶지 않다면, 그 파트를 `ignored`로 마크하세요. 이건 위에서 설명한 오류를 피하면서 생성된 스니펫이 보이는 것을 방지합니다.

## 3-5. Request Part Payloads

요청 파트의 본문과 필드를 문서화하기 위한 지원을 통해 요청의 페이로드와 거의 동일한 방식으로 요청 파트의 페이로드를 문서화할 수 있습니다.

### 3-5-1. Documenting a Request Part's Body

다음과 같이 요청 파트의 본문을 가지고 있는 스니펫을 생성할 수 있습니다.

```java
MockMultipartFile image = new MockMultipartFile("image", "image.png", "image/png",
		"<<png data>>".getBytes());
MockMultipartFile metadata = new MockMultipartFile("metadata", "",
		"application/json", "{ \"version\": \"1.0\"}".getBytes());

this.mockMvc.perform(fileUpload("/images").file(image).file(metadata)
			.accept(MediaType.APPLICATION_JSON))
	.andExpect(status().isOk())
	.andDo(document("image-upload", requestPartBody("metadata"))); // 1
```

1. 정적 메소드 `PayloadDocumentation#requestPartBody()` 를 사용하여 `metadata` 라는 요청 파트의 본문을 가지고 있는 스니펫을 생산하도록 Spring REST Docs를 설정합니다.

`request-part-${part-name}-body.adoc` 라는 파트의 본문을 담고 있는 스니펫이 생성됩니다. 예를 들어, `metadata` 라는 파트를 문서화하면 `request-part-metadata-body.adoc` 라는 스니펫이 생성됩니다.

## 3-5-2. Documenting a Request Part's Fields

다음과 같이, 요청 및 응답의 필드와 거의 동일한 방식으로 요청 파트의 필드를 문서화할 수 있습니다.

```java
MockMultipartFile image = new MockMultipartFile("image", "image.png", "image/png",
		"<<png data>>".getBytes());
MockMultipartFile metadata = new MockMultipartFile("metadata", "",
		"application/json", "{ \"version\": \"1.0\"}".getBytes());

this.mockMvc.perform(fileUpload("/images").file(image).file(metadata)
			.accept(MediaType.APPLICATION_JSON))
	.andExpect(status().isOk())
	.andDo(document("image-upload", requestPartFields("metadata", // 1
			fieldWithPath("version").description("The version of the image")))); // 2
```

1. 정적 메소드 `PayloadDocumentation#requestPartFields()`를 사용하여 `metadata` 라는 요청 파트의 페이로드에 있는 필드를 설명하는 스니펫을 생산하도록 Spring REST Docs를 설정합니다
2. 정적 메소드 `PayloadDocumentation#fieldWithPath()` 매개변수로 `version` 경로를 가지고 있는 필드가 필요합니다

결과는 파트의 필드를 설명하는 테이블을 포함하고 있는 스니펫입니다. 이 스니펫은  `request-part-${part-name}-fields.adoc` 라는 이름을 갖습니다. 예를 들어, `metadata` 라는 파트를 문서화하면 `request-part-metadata-fields.adoc` 라는 스니펫이 생성됩니다.

필드를 문서화할 때, 문서화하지 않은 필드가 파트의 페이로드에서 발견된다면 테스틑는 실패합니다. 유사하게, 만약 문서화된 필드가 파트의 페이로드에 없고, 필드가 `optional`로 마크되어 있지 않다면 테스트는 실패합니다. 계층 구조(hierarchial structure) 페이로드의 경우, 필드를 문서화하는 것은 모든 하위 항목들도 문서화된 것으로 간주됩니다.

필드를 테스트가 실패하지 않는 문서화하지 않은 파라미터에서 `relaxed mode`로 문서화할 수도 있습니다. 이렇게 하기 위해선, `RequestDocumentation#relaxedRequestPartFields()` 를 사용해야 합니다. 이건 파트의 한 집합에만 집중하고 싶은 특정 시나리오를 문서화할 때 유용합니다.

만약 필드를 문서화하고 싶지 않다면, 그 필드를 `ignored`로 마크하세요. 이건 위에서 설명한 오류를 피하면서 생성된 스니펫이 보이는 것을 방지합니다.

## 3-6. HTTP Headers

다음과 같이, 각 각 `requestHeaders` 와 `responseHeaders` 를 사용하여 요청 및 응답 헤더를 문서화할 수 있습니다.

```java
this.mockMvc
	.perform(get("/people").header("Authorization", "Basic dXNlcjpzZWNyZXQ=")) // 1
	.andExpect(status().isOk())
	.andDo(document("headers",
			requestHeaders( // 2
					headerWithName("Authorization").description(
							"Basic auth credentials")), // 3
			responseHeaders( // 4
					headerWithName("X-RateLimit-Limit").description(
							"The total number of requests permitted per period"),
					headerWithName("X-RateLimit-Remaining").description(
							"Remaining requests permitted in current period"),
					headerWithName("X-RateLimit-Reset").description(
							"Time at which the rate limit period will reset"))));
```

1. basic authentication을 사용하는 `Authorization` 헤더를 가진 `GET` 요청을 수행합니다
2. `HeaderDocumentation#requestHeaders()` 를 사용하여 요청 헤더를 설명하는 스니펫을 생산하도록 Spring REST Docs를 설정합니다
3. 정적 메소드 `HeaderDocumentation#headerWithName()` 를 사용하여 `Authorization` 헤더를 문서화합니다
4. `HeaderDocumentation#responseHeaders()` 를 사용하여 응답 헤더를 설명하는 스니펫을 생산합니다

결과는 `request-headers.adoc` 과 `response-headers.adoc`라는 스니펫이 생성됩니다. 각 각 헤더를 설명하는 테이블을 갖습니다.

HTTP 헤더를 문서화할 때, 문서화된 헤더가 요청 또는 응답에서 발견되지 않는 경우 테스트는 실패합니다.

## 3-6. Reusing Snippets

문서화중인 API에는 여러 리소스에서 공통적인 일부 기능이 있는 것이 일반적입니다. 이러한 리소스를 문서화할 때 반복을 피하기 위해 공통 요소로 구성된 `Snippet` 을 재사용할 수 있습니다.

첫 번째, 다음과 같이 공통 요소를 설명하는 `Snippet`을 생성합니다.

```java
protected final LinksSnippet pagingLinks = links(
		linkWithRel("first").optional().description("The first page of results"),
		linkWithRel("last").optional().description("The last page of results"),
		linkWithRel("next").optional().description("The next page of results"),
		linkWithRel("prev").optional().description("The previous page of results"));
```

둘 째, 스니펫을 사용하고 resource-specific인 further descriptor를 추가합니다.

```java
this.mockMvc.perform(get("/").accept(MediaType.APPLICATION_JSON))
	.andExpect(status().isOk())
	.andDo(document("example", this.pagingLinks.and( // 1
			linkWithRel("alpha").description("Link to the alpha resource"),
			linkWithRel("bravo").description("Link to the bravo resource"))));
```

1. `pagingLinks` 스니펫을 재사용하여 `and` 를 호출하고 문서화중인 리소스에 구체적인 설명 추가합니다

위 예제의 결과는 `first`, `last`, `next`, `previous`, `alpha`, `bravo` 모두가 문서화된 링크들입니다.

## 3-7. Documenting Constraints

Spring REST Docs는 몇 가지 제약 조건을 문서화하는데 도움이 되는 클래스들을 제공합니다. ConstraintDescriptions 의 인스턴스를 사용하면 클래스의 제약 조건의 설명에 접근할 수 있습니다. 

```java
public void example() {
	ConstraintDescriptions userConstraints = 
		new ConstraintDescriptions(UserInput.class); // 1
	List<String> descriptions = userConstraints.descriptionsForProperty("name"); // 2
}

static class UserInput {

	@NotNull
	@Size(min = 1)
	String name;

	@NotNull
	@Size(min = 8)
	String password;

}
```

1. `UserInput` 클래스를 매개변수로 하는 `ConstraintDescriptions` 인스턴스를 생성합니다
2. `name` 속성의 제약 조건의 설명을 얻습니다. 이 리스트는 두 가지 설명을 포함하고 있습니다. `NotNull` 이라는 제약 조건과 `Size` 라는 제약 조건입니다

### 3-7-1. Finding Constraints

기본적으로 제약 조건은 Bean Validation `Validator`를 사용하여 검색합니다. 오직 속성 제약 조건만 지원됩니다. 사용자 지정 `ValidatorConstraintResolver` 인스턴스를 사용하여 `ConstraintDescriptions`를 생성하여 사용되는 `Validator` 를 커스터마이징할 수 있습니다. 제약 조건 해결을 완벽하게 제어하려면 자신만의 `ConstraintResolver`를 구현하십시오.

### 3-7-2. Describing Constraints

Bean Validation 2.0 모든 제약 조건에 대해 기본 설명이 제공됩니다.

- `AssertFalse`
- `AssertTrue`
- `DecimalMax`
- `DecimalMin`
- `Digits`
- `Email`
- `Future`
- `FutureOrPresent`
- `Max`
- `Min`
- `Negative`
- `NegativeOrZero`
- `NotBlank`
- `NotEmpty`
- `NotNull`
- `Null`
- `Past`
- `PastOrPresent`
- `Pattern`
- `Positive`
- `PositiveOrZero`
- `Size`

다음 Hibernate Validator의 제약 조건들의 기본 설명이 제공됩니다.

- `CodePointLength`
- `CreditCardNumber`
- `Currency`
- `EAN`
- `Email`
- `Length`
- `LuhnCheck`
- `Mod10Check`
- `Mod11Check`
- `NotBlank`
- `NotEmpty`
- `Currency`
- `Range`
- `SafeHtml`
- `URL`

`org.springframework.restdocs.constraints.ConstraintDescriptions` 의 base name으로 리소스 번들(resource bundle)을 생성하면 기본 설명을 `override` 하거나 새로운 설명을 제공할 수 있습니다. 

리소스 번들의 각 키(key)는 정규회된 제약 조건의 이름과 `.description` 입니다. 예를 들어, 표준 `@NotNull` 제약조건의 키는 `javax.validation.constraints.NotNull.description` 입니다.

설명에서 제약 조건의 속성을 참조하고 있는 프로퍼티 플레이스홀더(property placeholder)를 사용할 수 있습니다. 예를 들어, `@Min` 제약 조건의 기본 설명인 `Must be least ${value}` 는 제약 조건의 `value` 속성을 가리킵니다.

사용자 지정 ResourceBundleConstraintDescriptionResolver를 사용하여 ConstraintDescriptions를 생성하면 보다 더 큰 제약 조건 설명 해결 제어권을 가질 수 있습니다. 완전한 제어권을 가지고 싶다면 사용자 지정 ConstraintDescriptionResolver 구현체를 사용하여 ConstraintDescriptions를 생성합니다.

### 3-7-3. Using Constraint Descriptions in Generated Snippets

제약 조건에 대한 설명이 있으면 생성된 스니펫에서 원하는 대로 자유롭게 사용할 수 있다. 예를 들어, 필드의 설명의 일부분으로 제약 조건에 대한 설명을 포함할 수 있습니다. 또는, 요청 필드 스니펫에 추가 정보로 제약 조건을  포함할 수 있습니다.

## 3-8. Default Snippets

여러 스니펫들은 요청과 응답을 문서화할 때 자동으로 만들어집니다.

|Snippet|Description|
|--|--|
|curl-request.adoc| 문서화 중인 `MockMvc` 호출에 해당하는 `curl` 커맨드를 포함합니다|
|httpie-request.adoc| 문서화 중인 `MockMvc` 호출에 해당하는 `HTTPie` 커맨드를 포함합니다
|http-request.adoc| 문서화 중인 `MockMvc` 호출에 해당하는 `HTTP Request` 커맨드를 포함합니다|
|http-response.adoc| 리턴된 HTTP Response 를 포함합니다
|request-body.adoc| 보낸 요청의 본문을 포함합니다
|response-body.adoc| 리턴된 리스폰스의 본문을 포함합니다


## 3-9. Using Parameterized Output Directoris

MockMvc를 사용하는 경우, `document`를 사용하여 `output directory` 를 매개변수화할 수 있습니다.

|Parameter|Description|
|--|--|
|{methodName}| 수정되지 않은 테스트 메소드의 이름
|{method-name}| 테스트 메소드의 kebab-case 형식의 이름
|{method_name}| 테스트 메소드의 snake_case 형식의 이름
|{ClassName}| 수정되지 않은 테스트 클래스의 간단한 이름
|{class-name}| 테스트 클래스의 간단한 kebab-case 형식의 이름
|{class_name}| 테스트 클래스의 간단한 snake-case 형식의 이름
|{step}| 현재 테스트에서 서비스에 대한 호출 횟수

예를 들어, `GettingStartedDocumentation` 클래스의 `creatingANote` 라는 테스트 메소드의 `document("{class-name}/{method-name}")` 는 `getting-started-documentation/creating-a-note` 라는 디렉토리에 스니펫을 생성합니다.

매개변수화된 결과 디렉토리는 특히 `@Before` 메소드와 같이 사용될 때 유용합니다. 설정 메소드에서 문서가 한 번 구성되면 모든 테스트에서 재사용하게 해줍니다.

```java
@Before
public void setUp() {
	this.mockMvc = MockMvcBuilders.webAppContextSetup(this.context)
			.apply(documentationConfiguration(this.restDocumentation))
			.alwaysDo(document("{method-name}/{step}/")).build();
}
```

이 설정을 사용하면, 테스트하고 있는 서비스에 대한 모든 호출은 다른 추가 설정 없이 기본 스니펫들을 생산합니다.

## 3-10. Customizing the Output

이 섹션에서는 어떻게 Spring REST Docs의 출력을 커스터마이즈하는지 알아봅니다.

### 3-10-1. Customizing the Generated Snippets

Spring REST Docs는 생성된 스니펫을 만들기 위해 [Mustache](https://mustache.github.io/) 템플릿을 사용합니다. Spring REST Docs가 생성할 수 있는 각각의 스니펫들이 [기본 템플릿](https://github.com/spring-projects/spring-restdocs/tree/v2.0.5.RELEASE/spring-restdocs-core/src/main/resources/org/springframework/restdocs/templates)으로 제공됩니다. 스니펫의 내용을 변경하기 위해선 자체 템플릿을 만들어야 합니다.

템플릿은 `org.springframework.restdocs.templates` 의 서브 패키지 클래스 패스에서 로드됩니다. 서브 패키지의 이름은 사용하는 템플릿 포맷의 ID에 의해 결정됩니다.기본 템플릿 포맷인 Asciidoctor는 `asciidoctor`라는 ID를 가지고 있습니다. 그러므로 스니펫은 `org.springframework.restdocs.templates.asciidoctor` 로 부터 로드됩니다. 각 템플릿은 스니펫이 생성된 이후에 이름이 붙여집니다. 예를 들어, `curl-request.adoc` 스니펫의 템플릿을 오버라이드하려면 `curl-request.snippet` 라는 템플릿을 만듭니다.

### 3-10-2. Including Extra Information

생성된 스니펫에 포함할 추가 정보를 제공하는 방법에는 두 가지가 있습니다.

- 설명자에 `attributes` 메소드를 사용하여 하나 이상의 속성을 추가합니다
- `curlRequest`, `httpRequest`, `httpResponse` 등을 호출할 때 일부 속성을 전달합니다. 이러한 속성들은 스니펫 전체와 연관되어 있습니다

템플릿 렌더링 프로세스 중에 모든 추가 속성을 사용할 수 있습니다. 커스텀 스니펫 템플릿과 결합하면 생성된 스니펫에 추가 정보를 포함할 수 있습니다.

구체적인 예제는 요청 필드를 문서화할 때 제약 조건 컬럼과 타이틀을 추가하는 것입니다.

첫 번째, `constraints` 속성을 문서화하는 각 필드에 제공하고, `title` 속성을 제공하는 것입니다.

```java
.andDo(document("create-user", requestFields(
		attributes(key("title").value("Fields for user creation")), // 1
		fieldWithPath("name").description("The user's name")
				.attributes(key("constraints")
						.value("Must not be null. Must not be empty")), // 2
		fieldWithPath("email").description("The user's email address")
				.attributes(key("constraints")
						.value("Must be a valid email address"))))); // 3
```

1. 요청 필드 스니펫의 `title` 속성을 설정합니다
2. `name` 필드의 `constraints` 속성을 설정합니다
3. `email` 필드의 `constraints` 속성을 설정합니다

두 번째, 생성된 스니펫 테이블에 필드 제약 조건에 대한 정보를 포함하고 제목을 추가하는 `request-fields.snippet` 라는 커스텀 템플릿을 제공하는 것입니다.

```
{% raw %}
.{{title}} // 1
|===
|Path|Type|Description|Constraints // 2

{{#fields}}
|{{path}}
|{{type}}
|{{description}}
|{{constraints}} // 3

{{/fields}}
|===
{% endraw %}
```

1. 테이블에 제목을 추가합니다
2. `Constraints` 라는 새로운 컬럼을 추가합니다
3. 테이블의 각 줄에 설명자의 `constraints` 속성을 포함합니다

# 4. Customizing requests and responses

요청이 전송된 것과 정확히 일치하거나 수신된 것과 정확히 일치하는 응답을 문서화하지 않으려는 상황이 있을 수 있습니다. Spring REST Docs는 문서화 되기 전에 요청 또는 응답을 수정하는데 사용할 수 있는 몇 가지 전처리기(preprocessor)를 제공합니다.

`OperationRequestPreprocessor` 또는 `OperationResponsePreprocessor`의 `document` 호출로 전처리(preprocessing)를 구성합니다. `Preprocessors` 클래스의 정적 메소드 `preprocessRequest` 와 `preprocessResponse` 를 사용하여 인스턴스를 얻을 수 있습니다.

```java
this.mockMvc.perform(get("/")).andExpect(status().isOk())
	.andDo(document("index", preprocessRequest(removeHeaders("Foo")), // 1
			preprocessResponse(prettyPrint()))); // 2
```

1. `Foo` 라는 헤더를 제거하는 요청 전처리기(request preprocessor)를 적용합니다
2. 본문을 정리하여 출력하는 요청 전처리기(request preprocessor)를 적용합니다

`@Before` 메소드에서 RestDocumentationConfigurer API를 사용하여 전처리기를 설정하여 같은 전치리기를 모든 테스트에 적용할 수도 있습니다. 예를 들어, 다음과 같이 모든 요청에서 `Foo` 헤더를 지우고, 모든 응답에 정리된 출력(prertty print)을 얻을 수 있다.

```java
private MockMvc mockMvc;

@Before
public void setup() {
	this.mockMvc = MockMvcBuilders.webAppContextSetup(this.context)
		.apply(documentationConfiguration(this.restDocumentation).operationPreprocessors()
			.withRequestDefaults(removeHeaders("Foo")) // 1
			.withResponseDefaults(prettyPrint())) // 2
		.build();
}
```

1. `Foo` 라는 헤더를 제거하는 요청 전처리기(request preprocessor)를 적용합니다
2. 본문을 정리하여 출력하는 요청 전처리기(request preprocessor)를 적용합니다

그런 다음, 각 테스트에서 해당 테스트에 특정한 설정을 수행할 수 있습니다. 다음은 그 예시입니다.

```java
this.mockMvc.perform(get("/"))
		.andExpect(status().isOk())
		.andDo(document("index",
				links(linkWithRel("self").description("Canonical self link"))
		));
```

위에서 설명한 것들을 포함하고 있는 다양한 내장 (built-in) 전처리기들은 정적 메소드 `Preprocessors`를 통하여 사용할 수 있습니다.

## 4-1. Preprocessors

### 4-1-1. Pretty Printing

`Preprocessors#prettyPrint()` 은 요청 또는 응답의 내용을 읽기 쉽게 형식화(format)합니다.

### 4-1-2. Masking Links

`hyepermedia-based API`를 문서화하고 있다면, 하드 코딩된 URI가 아닌 링크를 사용하여 클라이언트가 API를 탐색하도록  하고 싶을 겁니다. 그를 위한 한 가지 방법은 문서에서 URI 사용을 제한하는 것입니다. `Preprocessors`의  `maskLinks` 는 `...`를 갖는 응답에 있는 모든 링크의 `href`를 교체합니다. 다른 대체품을 지정할 수도 있습니다.

### 4-1-3. Removing Headers

`Preprocessors`의 `removeHeaders` 는 주어진 헤더의 이름과 같은 요청 또는 응답에서 헤더를 제거합니다. `Preprocessors`의 `removeMatchingHeaders`는 이름이 주어진 정규표현식과 일치하는 모든 헤더를 요청 또는 응답에서 제거합니다.

### 4-1-4. Replacing Patterns

`Preprocessors`의 `replacingPattern` 은 요청 또는 응답에서 컨텐츠를 대체하기 위한 범용 매커니즘을 제공합니다. 정규 표현식과 일치하는 모든 것은 교체됩니다.

### 4-1-5. Modifying Request Parameters

`Preprocessors`의 `modifyParameters`를 사용하여 요청 파라미터를 추가, 지정(set), 삭제할 수 있습니다.

### 4-1-6. Modifying URIs

만약 서버에 바운드되지 않은 MockMvc를 사용한다면, 설정을 변경하여 URI를 커스터마이징해야 합니다.

`Preprocessors`의 `modifyUris`를 사용하여 요청 또는 응답의 모든 URI를 수정할 수 있습니다. 

### 4-1-7. Writing Your Own Preprocessor

내장된 전처리기가 요구 사항과 맞는 것이 하나도 없다면, `OperationPreprocessor` 인터페이스를 구현하여 자신만의 전처리기를 작성할 수 있습니다. 그렇게 하면, 자신만의 전처리기를 내장 전처리기와 정확히 동일한 방식으로 사용할 수 있습니다.

요청 또는 응답의 오직 본문만을 수정하고 싶다면, `ContetnModifier` 인터페이스를 구현하고 내장된 `ContentModifyingOperationPreprocessor` 와 함께 사용하세요.

# 5. Configuration

이 섹션에서는 Spring REST Docs를 설정하는 방법을 다룹니다.

## 5-1. Documented URIs

이 섹션에서는 문서화된 URI를 설정하는 방법을 다룹니다.

### 5-1-1. MockMvc URI Customization

MockMvc를 사용하는 경우 Spring REST Docs로 문서화된 URI 기본 설정은 다음과 같습니다.

|Setting|Default|
|--|--|
|Scheme| http
|Host| localhost
|Port| 8080

이 설정은 `MockMvcRestDocumentationConfigurer` 로 적용합니다. `MockMvcRestDocumentationConfigurer` 의 API를 사용하여 하나 이상의 기본 값들을 필요에 맞게 조정할 수 있습니다. 다음은 어떻게 하는 지를 보여주는 예시입니다.

```java
this.mockMvc = MockMvcBuilders.webAppContextSetup(this.context)
		.apply(documentationConfiguration(this.restDocumentation).uris()
				.withScheme("https")
				.withHost("example.com")
				.withPort(443))
		.build();
```

만약 포트가 구성한 스킴(HTTP의 경우 port 80, HTTPS의 경우 port 443)에 대해 기본 값으로 설정되어 있다면, 생성된 스니펫의 모든 URI에서 제외됩니다.

`MockHttpServletRequestBuilder#contextPath()` 를 사용하여 `request's context path`를 설정할 수 있습니다.

## 5-2. Snippet Encoding

기본 스니펫 인코딩은 `UTF-8` 입니다. 기본 스니펫 인코딩을 `RestDocumentationConfigurer` API를 사용하여 변경할 수 있습니다. 예를 들어, 다음 예제는 `ISO-8859-1` 을 사용합니다.

```java
this.mockMvc = MockMvcBuilders.webAppContextSetup(this.context)
		.apply(documentationConfiguration(this.restDocumentation)
				.snippets().withEncoding("ISO-8859-1"))
		.build();
```

Spring REST Docs가 요청 또는 응답의 본문을 `String`으로 변환할 때, `Content-Type` 헤더에 지정된 `charset`은 사용 가능하다면 사용됩니다. 지정된 `charset`이 없는 경우 JVM의 기본 `charset`이 사용됩니다. JVM의 기본 `Charset`을 `file.encoding` 시스템 속성을 사용하여 설정할 수 있습니다.

## 5-3. Snippet Template Foramt

기본 스니펫 템플릿 형식은 `Asciidoctor` 입니다. 마크다운도 즉시 사용 가능합니다(out of the box, 설치 없이 즉시 사용 가능하다). `RestDocumentationConfigurer` API 를 사용하여 기본 형식을 변경할 수 있습니다.

```java
this.mockMvc = MockMvcBuilders.webAppContextSetup(this.context)
		.apply(documentationConfiguration(this.restDocumentation)
				.snippets().withTemplateFormat(TemplateFormats.markdown()))
		.build();
```

## 5-4. Default Snippets

기본으로 6개의 스니펫이 제공됩니다.

- `curl-request`
- `http-request`
- `http-response`
- `httpie-request`
- `request-body`
- `response-body`

설치하는 동안 `RestDocumentationConfigurer` API를 사용하여 기본 스니펫 설정을 변경할 수 있습니다. 다음 예시는 기본으로 `curl-request` 스니펫만을 생산합니다.

```java
this.mockMvc = MockMvcBuilders.webAppContextSetup(this.context)
		.apply(documentationConfiguration(this.restDocumentation).snippets()
				.withDefaults(curlRequest()))
		.build();
```

## 5-5. Default Operation Preprocessors

설치하는 동안 `RestDocumentationConfigurer` API를 사용하여 기본 요청과 응답 전처리기를 설정할 수 있습니다. 다음 예제는 모든 요청에서 `Foo` 헤더를 제거하고,  정리(pretty print)하여 응답합니다.

```java
this.mockMvc = MockMvcBuilders.webAppContextSetup(this.context)
		.apply(documentationConfiguration(this.restDocumentation)
				.operationPreprocessors()
				.withRequestDefaults(removeHeaders("Foo")) // 1
				.withResponseDefaults(prettyPrint())) // 2
		.build();
```

1. `Foo` 라는 헤더를 제거하는 요청 전처리기를 적용합니다
2. 본문을 정리(pretty print)하는 응답 전처리기를 적용합니다

# 6. Working with Asciidoctor

이 섹션에서는 Spring REST Docs와 특히 관련된 아스키닥터 작업의 측면에 대해서 설명합니다.

아스키닥터는 문서 형식입니다. 아스키닥터는 `.adoc` 으로 끝나는 Asciidoc 파일에서 컨텐츠(일반적으로 HTML)을 생상하는 도구입니다.

## 6-1. Resources

- [Syntax quick reference](https://asciidoctor.org/docs/asciidoc-syntax-quick-reference/)
- [User manual](https://asciidoctor.org/docs/user-manual/)

## 6-2. Including Snippets

이 섹션에서는 아스키닥터 스니펫을 포함하는 방법에 대해서 설명합니다.

### 6-2-1. Including Multiple Snippets for an Operation

`operation` 이라는 매크로를 사용하여 특정 작업(operation)에 대해 생성된 여러 스니펫들을 임포트할 수 있습니다. 프로젝트 빌드 설정에 `spring-restdocs-asciidoctor`를 포함하여 사용가능합니다.

매크로 대상은 작업의 이름입니다. 다음 예와 같이 가장 간단한 형식으로 매크롤 사용하여 작업에 대한 모든 스니펫을 포함할 수 있습니다.

```java
operation::index[]
```

`snippets` 속성을 지원하는 작업 매크로를 사용할 수 있습니다. 포함할 스니펫을 선택하는 `snippets` 속성. 속성의 값은 콤마(`,`)로 분리된 리스트입니다. 리스트 안의 각 요소는 포함할 `.adoc` 접미사가 빠진 스니펫 파일의 이름이어야 합니다.  예를 들어 다음 예제에서는 curl, HTTP request, HTTP response 스니펫만이  포함됩니다.

```java
operation::index[snippets='curl-request,http-request,http-response']
```

아래의 예제는 위의 코드와 같은 일을 합니다.

```java
[[example_curl_request]]
== Curl request

include::{snippets}/index/curl-request.adoc[]

[[example_http_request]]
== HTTP request

include::{snippets}/index/http-request.adoc[]

[[example_http_response]]
== HTTP response

include::{snippets}/index/http-response.adoc[]
```

**Section Titles**

`operation` 매크로를 사용하여 포함된 각 스니펫에 대해 타이틀을 가진 섹션이 작성됩니다. 기본 타이틀은 아래의 내장 스니펫들로 제공됩니다.

|Snippet|Title|
|--|--|
|curl-request|Curl Request|
|http-request|HTTP Request|
|http-response|HTTP Response|
|httpie-request|HTTPie Request|
|links|Links|
|request-body|Request Body|
|request-fields|Request Fields|
|response-body|Response Body|
|response-fields|Response Fields|

위의 테이블에 없는 스니펫의 경우 첫 번째 글자를 대문자로 시작하고 `-` 문자를 공백으로 바꾸고 기본 제목을 생성합니다. 예를 들어, `custom-snippet` 라는 스니펫의 제목은 `Custim Snippet` 이 됩니다.

`document` 속성을 사용하여 기본 타이틀을 커스터마이징 할 수 있습니다. 속성의 이름은 `operation-{snippet}-title` 이어야 합니다. 예를 들어, `curl-request` 스니펫의 제목을 `Example request` 가 되게 커스터마이징 하려면 아래의 예제와 같이 합니다.

```java
:operation-curl-request-title: Example request
```

### 6-2-2. Including Individual Snippets

[include macro](https://asciidoctor.org/docs/asciidoc-syntax-quick-reference/#include-files) 는 문서에 개별 스니펫을 포함하기 위해 사용됩니다. `spring-restdocs-asciidoctor` 에 의해 자동으로 설정된 `snippets` 속성을 사용하여 스니펫의 출력 디렉토리를 참조할 수 있습니다.

```java
include::{snippets}/index/curl-request.adoc[]
```

## 6-3. Customizing Tables

대부분의 스니펫에는 기본 설정에 테이블이 포함되어 있습니다. 스니펫이 포함될 때 추가적인 설정을 제공하거나 커스텀 스니펫 템플릿을 사용하여 테이블의 모양을 커스터마이징 할 수 있다. 

### 6-3-1. Formatting Columns

아스키닥터는 [테이블의 컬럼 포맷팅](https://asciidoctor.org/docs/user-manual/#cols-format) 에 대한 풍부한 지원을 가지고 있습니다. 다음 예시처럼 `cols` 속성을 사용하여 테이블의 컬럼 폭을 지정할 수 있습니다.

```java
[cols="1,3"] // 1
include::{snippets}/index/links.adoc[]
```

1. 테이블의 폭은 2개의 컬럼으로 나뉘고, 두 번째 컬럼은 첫 번째보다 3배 넓습니다.

### 6-3-2. Configuring the Title

`.` 접두사를 사용하여 표의 제목을 지정할 수 있습니다.

```java
.Links  // 1
include::{snippets}/index/links.adoc[]
```

1. 표의 제목은 `Links`가 됩니다

### 6-3-3. Avoiding Table Formatting Problems

아스키닥터는 `|` 문자를 사용하여 표의 경계를 정합니다. 만약 셀의 내용 안에 `|` 를 작성하고 싶을 때 문제가 발생합니다. backslash(`\`)를 사용하여 `\|` 와 같이 작성함으로써 문제를 해결할 수 있습니다. 

모든 기본 아스키닥터 스니펫 템플릿은 `tableCellCotent` 라는 `Mustache lamba` 를 사용하여 이스케이프 문자를 수행합니다. 자신만의 커스텀 템플릿을 작성하고 싶다면 `lamba`를 사용하세요. 아래의 예제는 `description` 속성 값을 갖는 셀에서  `|` 문자를 이스케이프 하는 방법을 보여줍니다.

```
{% raw %}
| {{#tableCellContent}}{{description}}{{/tableCellContent}}
{% endraw %}
```

# 7. Working with Markdown

이 섹션에서는 Spring REST Docs와 특히 관련된 마크다운 작업의 측면에 대해서 설명합니다.

## 7-1. Limitations

마크다운은 웹을 위해 글을 쓰는 사람들을 위해 고안되었습니다. 그래서 Asciidoctor 만큼 문서 작성에 적합하지 않습니다. 일반적으로 이런 제한은 마크다운 위에 빌드되는 다른 툴을 사용하여 극복할 수 있습니다.

마크다운은 표(table, 테이블)에 대한 공식적인 지원이 없습니다. Spring REST Docs의 기본 마크다운 스니펫 템플릿은 [마크다운 추가 테이블 형식](https://michelf.ca/projects/php-markdown/extra/#table) 을 사용합니다.

## 7-2. Including Snippets

마크다운은 하나의 마크다운 파일을 다른 파일에 포함하는 기본 제공 지원이 없습니다. 문서에 마크다운의 생성된 스니펫을 포함시키려면 이 기능을 지원하는 추가적인 도구를 사용해야 합니다. 예를 들어 잘 만들어문 문서화 APi인 [Slate](https://github.com/slatedocs/slate) 가 있습니다.
