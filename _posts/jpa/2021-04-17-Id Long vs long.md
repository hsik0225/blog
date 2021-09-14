---
layout: post
title: "[JPA] Id Long vs long"
categories : [JPA, Spring]
---

엔티티의 Id는 Wrapper? Primitive?

### Id의 타입,  Long vs long
MySQL에서는 ID가 0이 될 수 있다. 음수도 가능하다.

```sql
CREATE TABLE sample
(
    sample_id BIGINT, PRIMARY KEY (sample_id)
);

INSERT INTO sample(sample_id) VALUE (0);
INSERT INTO sample(sample_id) VALUE (-100);
```

<img width="213" alt="스크린샷 2021-04-16 오후 12 00 24" src="https://user-images.githubusercontent.com/56301069/115059093-06b20800-9f21-11eb-95a5-8fd7a942cb92.png">


프리미티브 타입인 `long` 은 기본적으로 0으로 초기화된다. 만약 id가 없을 경우, 이  id가 없어서 0인 것인지, 0으로 초기화되어서 0인 것인지 알 수가 없다.

하지만 `Long` 타입은 id가 없을 경우 `null` 이 되고, 그 자체로 id가 없다는 것을 보장할 수 있다.

### Reference
- [https://www.inflearn.com/questions/35759](https://www.inflearn.com/questions/35759)
- [https://stackoverflow.com/questions/20421735/jpa-entity-id-long-or-long](https://stackoverflow.com/questions/20421735/jpa-entity-id-long-or-long)
