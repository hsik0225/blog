---
layout: post
title: "[Git] Squash And Merge 커밋, Rebase Conflict 이유"
categories: [Git]
---

스쿼시 머지한 커밋을 다른 커밋에 리베이스 할 경우 발생하는 이슈

### 문제 발생

사진과 같이 기존 기능을 작성하고 있던 브랜치(`hsik0225`)와 PR로 Merge(Squash & Merge)된 Upstream의 커밋이 있습니다.

![무제](https://user-images.githubusercontent.com/56301069/107480515-0bc0a700-6bc0-11eb-8dba-d4476590f601.jpg)

사진에서의 `upstream` 브랜치의 머지 커밋을 기존 기능 브랜치(`hsik0225`)에 리베이스를 하려고 하면 충돌이 발생합니다.

<img width="753" alt="2" src="https://user-images.githubusercontent.com/56301069/107473227-aff02100-6bb3-11eb-8e92-1be4763aa0fe.png">

어째서 충돌이 일어나는걸까요?

그 이유는 Squash & Merge  된 커밋은 기능 브랜치의 커밋들을 모두 반영한 커밋이기 때문입니다. 참고로 PR을 머지하는 방법은 사진과 같이 3가지가 있습니다.

<img width="1072" alt="3" src="https://user-images.githubusercontent.com/56301069/107473230-b088b780-6bb3-11eb-813f-03f184714f1d.png">

Squash는 커밋들을 하나로 합쳐주는 기능입니다. Squash & Merge를 하게 되면, PR 보낼 때의 최종 결과물들만이 커밋 내용에 남는다고 생각하시면 편합니다. 지금 제 사진에서는 `hsik0225` 브랜치의 제일 위 커밋, < chore:클래스들을 패키지에 맞게 이동 > 때의 파일들이 커밋에 반영이 됩니다.

머지된 커밋이 어떻게 반영되었는지를 다음과 같이 확인할 수 있습니다.

1. 업스트림 저장소로 갑니다.
2. 본인 브랜치를 선택합니다.
3. 마지막 머지된 커밋을 클릭합니다.

<img width="1250" alt="4" src="https://user-images.githubusercontent.com/56301069/107473235-b1b9e480-6bb3-11eb-996c-d452851c11d9.png">

스크롤을 아래로 내리면 다음과 같이 자신이 작성한 `모든` 파일들이 하나의 커밋으로 작성되었다는 것을 볼 수 있습니다.

<img width="676" alt="5" src="https://user-images.githubusercontent.com/56301069/107473237-b2eb1180-6bb3-11eb-91e4-630840056f3a.png">

이 PR을 보낼 때의 마지막 최종 파일들이 기존 브랜치의 커밋들과 충돌이 일어나는 것인데요.

업스트림의 머지된 커밋을

```java
git rebase upstream
```

로 리베이스하면, 공통 조상 커밋 이후부터 충돌이 일어나는지, 안나는지 확인을 합니다.

<img width="891" alt="6" src="https://user-images.githubusercontent.com/56301069/107473240-b2eb1180-6bb3-11eb-8488-a2375bf92ef8.png">

위 사진에서, PR 보낸 최종 결과 파일들이 `study junit`부터 충돌을 검사하는 것입니다. 처음 작성했을 때 파일을 계속 기능 구현하며 수정하였으니, 마지막 최종 결과 파일과 제일 처음 작성한 파일은 같지 않겠죠?

사진에서 보이는 `study junit`을 커밋한 후, 그 후 한 번이라도 `study junit` 에서 커밋한 파일들을 수정했다면 최종 결과물과 `study junit` 의 파일이 달라 충돌이 발생하게 됩니다.
