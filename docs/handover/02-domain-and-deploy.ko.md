# 도메인 연결과 배포는 어떻게 하나요?

지금 사이트는 Vercel이라는 호스팅 서비스에서 `https://olin-bike.vercel.app` 주소로 운영되고 있습니다. 정식 도메인(`olin.bike`)을 연결하는 절차와, 코드를 바꿨을 때 어떻게 실제 사이트에 반영되는지 정리한 문서입니다.

> 용어 한 줄 정리
> - **도메인(domain)**: `olin.bike` 같은 사람이 읽을 수 있는 주소. 도메인 등록 사이트(예: Cloudflare, Namecheap, GoDaddy)에서 매년 갱신료를 내고 소유합니다.
> - **DNS**: 도메인을 실제 서버 IP 주소로 연결해주는 "주소록". 도메인 등록 사이트에서 DNS 레코드를 입력해야 도메인이 우리 사이트를 가리킵니다.
> - **환경변수(env var)**: 코드 바깥에 따로 보관하는 설정 값. 비밀키나 도메인 주소처럼 환경에 따라 달라지는 값을 여기에 둡니다. Vercel 대시보드에서 추가/수정합니다.

---

## 1. 도메인 연결 (단계별)

### Step 1. Vercel 프로젝트에 도메인 추가

1. [Vercel 대시보드](https://vercel.com/dashboard) 로그인 → `olin-bike` 프로젝트 클릭
2. 상단 **Settings** 탭 → 좌측 **Domains** 클릭
3. **Add** 버튼 → `olin.bike` 입력 → Add 클릭
4. 한 번 더 **Add** → `www.olin.bike` 입력 → Add. 이때 `www.olin.bike`는 `olin.bike`로 **리다이렉트(redirect)**되도록 설정하시는 걸 권장드립니다. (브랜드는 짧은 쪽이 깔끔합니다.)

### Step 2. 도메인 등록 사이트에서 DNS 레코드 입력

Vercel 화면에 "이 DNS 레코드를 추가하세요"라는 안내가 표시됩니다. 보통 두 줄입니다.

- `A` 레코드: `olin.bike` → `76.76.21.21`
- `CNAME` 레코드: `www.olin.bike` → `cname.vercel-dns.com`

> 정확한 값은 **반드시 Vercel 화면에 표시된 것을 사용하세요.** 위 숫자는 참고용입니다.

도메인을 구매하신 사이트(Cloudflare/Namecheap/GoDaddy 등)에 로그인해서 DNS 설정 메뉴로 가신 다음, 위 두 레코드를 입력하시면 됩니다.

### Step 3. 5–60분 기다리기

DNS 변경은 인터넷 전체에 퍼지는 데 시간이 걸립니다(이걸 "DNS 전파"라고 부릅니다). 보통 5~60분, 길어야 24시간이면 끝납니다. 전파가 끝나면 Vercel이 **자동으로 HTTPS 인증서**(Let's Encrypt)를 발급해서 `https://olin.bike`로 접속이 됩니다.

전파 상태가 궁금하시면 터미널에서 `dig olin.bike`를 실행하시면 현재 어디로 연결되고 있는지 보입니다.

---

## 2. 도메인 연결 후 챙겨야 할 4가지

도메인 주소가 바뀌었으니, 사이트 곳곳에서 새 주소를 바라보도록 다음 4가지를 갱신해야 합니다.

1. **`NEXT_PUBLIC_SITE_URL` 환경변수 갱신**
   Vercel 대시보드 → Settings → Environment Variables → `NEXT_PUBLIC_SITE_URL`을 `https://olin.bike`로 수정 → 저장 후 재배포. 이 값은 Stripe 결제 후 손님을 우리 사이트로 되돌리는 URL을 만들 때 쓰입니다. 갱신을 빠뜨리면 결제 후 옛날 주소로 가게 됩니다.

2. **Stripe 웹훅 엔드포인트 URL 갱신**
   [Stripe 대시보드](https://dashboard.stripe.com) → Workbench → Webhooks → 기존 destination 편집 → URL을 `https://olin.bike/api/stripe/webhook`으로 변경 → 저장. 그 후 "Send test event" 버튼으로 한 번 테스트하셔서 응답이 200으로 오는지 확인하시는 게 좋습니다.

3. **Adobe Fonts 도메인 화이트리스트 추가**
   브러시 글꼴(Flood Std)은 Adobe Fonts에서 받아옵니다. Adobe Fonts → My Fonts → 해당 키트(`lze3zjz`) → Domains → `olin.bike`, `www.olin.bike` 추가. **이걸 빠뜨리면 헤드라인의 손글씨 느낌이 깨지고 다른 폰트로 대체되어 표시됩니다.**

4. **Instagram bio 링크**
   Instagram 프로필의 링크도 새 도메인으로 바꿔주시면 깔끔합니다.

---

## 3. 코드를 바꾸면 사이트에 어떻게 반영되나요?

```
[로컬에서 코드 수정]  →  [GitHub main 브랜치에 push]  →  [Vercel이 자동 빌드 & 배포]  →  [60–90초 후 라이브]
```

- 사이트 코드는 **GitHub 저장소**에 보관되어 있고, **`main` 브랜치에 새 커밋이 푸시될 때마다 Vercel이 자동으로 새 버전을 배포**합니다.
- 빌드와 배포에 보통 **60~90초** 정도 걸립니다.
- 코드는 안 바꾸고 **환경변수만 수정**하셨다면, Vercel 대시보드에서 해당 환경변수 저장 후 **Deployments → 최근 배포 → "Redeploy"** 버튼을 누르시거나, 터미널에서 `vercel --prod`를 실행하시면 됩니다.

---

## 4. 남은 자리수 카운터 조정 (8 → 7 → 6 …)

손님 한 분이 확정되실 때마다 사이트의 "8 spots remaining" 표시를 줄이고 싶으시면:

1. Vercel 대시보드 → 프로젝트 → **Settings → Environment Variables**
2. `NEXT_PUBLIC_SPOTS_REMAINING` 항목 → **Edit** → 새 숫자(예: `7`) 입력 → Save
3. 자동으로 재배포가 시작됩니다. 약 90초 후 사이트에 반영됩니다.

> 이 값은 **빌드 시점에 한 번 읽히기** 때문에, 환경변수만 바꾸고 재배포를 안 하면 변경되지 않습니다. Vercel이 보통 자동으로 재배포를 트리거하지만, 안 될 때는 Deployments 탭에서 수동 Redeploy를 눌러주세요.

---

## 5. 문제 생기면 어디부터 보나요?

| 증상 | 첫 번째로 볼 곳 |
|---|---|
| 배포가 실패함 (사이트가 안 바뀜) | Vercel → Deployments → 빨간 X 표시된 항목 → **Build Logs** |
| 도메인이 안 풀림 | DNS 전파 시간 (최대 24시간) 대기. `dig olin.bike` 명령어로 현재 가리키는 IP 확인 |
| 결제는 됐는데 확정이 안 들어옴 | Stripe → Workbench → Webhooks → 해당 destination → **Recent attempts** 탭에서 응답 코드 확인. 200이 아니면 우리 서버로 알림이 못 들어온 것입니다 |
| 손글씨 폰트가 안 나옴 | Adobe Fonts 도메인 화이트리스트에 새 도메인 추가됐는지 확인 |

위 항목들로 해결이 안 되시면, 이 문서들을 같이 들고 개발자에게 보여주시면 됩니다. 어떤 환경에서 어떻게 굴러가는지 한 번에 파악할 수 있게 정리되어 있습니다.
