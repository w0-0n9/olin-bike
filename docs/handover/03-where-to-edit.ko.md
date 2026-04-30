# 어디를 고쳐야 하나요? — 코드 위치 가이드

"이걸 바꾸고 싶은데 어느 파일을 열어야 하지?"에 대한 빠른 안내서입니다. 1부는 항목별 파일 매핑 표, 2부는 실제로 수정해서 사이트에 반영하는 한 사이클 절차입니다.

> 용어 한 줄 정리
> - **레포(repo)**: 코드 저장소. 우리 사이트의 모든 코드가 GitHub 레포 한 곳에 들어 있습니다.
> - **클론(clone)**: GitHub에 있는 코드를 본인 컴퓨터로 복사해 오는 것.
> - **커밋(commit) / 푸시(push)**: 변경사항을 코드 이력에 기록하는 것 / 그 기록을 GitHub로 업로드하는 것.
> - **로컬(local)**: 본인 컴퓨터.
> - **프로덕션(production)**: 손님들이 실제로 보는 라이브 사이트.

---

## 1부. "이걸 바꾸고 싶어요" → 파일 매핑

| 바꾸고 싶은 것 | 파일 / 위치 |
|---|---|
| 4개 언어 문구 (영어/스페인어/프랑스어/한국어) | `messages/{en,es,fr,ko}.json` — **4개 파일 모두 같은 키를 동기화**해야 합니다 |
| 가격 (총액, 보증금, 자전거 렌탈비, 1인실 추가비) | `src/lib/stripe.ts`의 `PRICING` 상수 |
| 남은 자리 숫자 (8 → 7 → 6 …) | Vercel 환경변수 `NEXT_PUBLIC_SPOTS_REMAINING` (코드 수정 X) |
| 인스타그램 핸들 | Vercel 환경변수 `NEXT_PUBLIC_INSTAGRAM_HANDLE` |
| 사이트 메타 (브라우저 탭 타이틀, 검색결과 설명) | `messages/*.json`의 `meta.title`, `meta.description` |
| Hero / About / Chalet 등 섹션 레이아웃 | `src/components/{Hero,About,ChaletGallery,Itinerary,...}.tsx` |
| 파트너 로고 추가/교체 | 이미지: `public/images/partners/`, 배열: `src/components/InGoodCompany.tsx` |
| 객실(샬레) 사진 추가/교체 | 이미지: `public/images/chalet/`, 배열: `src/components/ChaletGallery.tsx` |
| 푸터 (저작권 문구, 인스타 링크) | `src/components/Footer.tsx` + `messages/*.json`의 `footer.*` |
| Stripe 결제 흐름 | `src/app/api/stripe/checkout/route.ts` (세션 생성), `src/app/api/stripe/webhook/route.ts` (확정 처리) |
| 새 언어 추가 (예: 일본어 `ja`) | ① `src/i18n/routing.ts`에 `'ja'` 추가 ② `src/components/LanguageSwitcher.tsx`에 추가 ③ `messages/ja.json` 생성 |
| 도메인 / 배포 / 비밀키 | Vercel 대시보드 (Settings → Environment Variables, Domains) — 코드 수정 X |
| 글꼴 (브러시 / 본문) | `src/app/layout.tsx`의 next/font 설정. Adobe Fonts 키트 ID는 환경변수 `NEXT_PUBLIC_ADOBE_FONTS_KIT_ID` |

---

## 2부. "수정 → 배포" 한 사이클 절차

처음 한 번만 본인 컴퓨터에 코드를 받아두시면, 이후로는 같은 절차의 반복입니다.

### Step 1. 로컬에 코드 받기 (최초 1회)

GitHub 레포 페이지에서 "Code" 버튼을 눌러 URL을 복사한 뒤, 터미널에서:

```bash
git clone <레포 URL>
cd TourDeFrance
npm install
```

이미 한 번 받아두셨다면 다음번부터는 최신 코드를 당겨오기만 하시면 됩니다:

```bash
git pull origin main
```

### Step 2. 로컬에서 사이트 띄워보기

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 본인 컴퓨터에서 사이트가 돌아갑니다. 코드를 저장할 때마다 자동으로 새로고침됩니다.

### Step 3. 파일 수정 + 브라우저에서 확인

위 1부 표를 보고 해당 파일을 열어 수정하시면 됩니다. 저장하면 바로 브라우저에 반영되니 눈으로 확인하시면서 진행하세요.

### Step 4. 변경사항 기록하고 GitHub로 올리기

```bash
git add <수정한 파일들>
git commit -m "변경 내용을 한 줄로 설명"
git push origin main
```

### Step 5. Vercel이 자동 배포 → 프로덕션 확인

- `main`에 푸시되는 순간 Vercel이 자동으로 빌드를 시작합니다.
- 약 60~90초 후 프로덕션 URL(`https://olin.bike` 또는 `https://olin-bike.vercel.app`)에 반영됩니다.
- 진행 상황은 Vercel 대시보드의 Deployments 탭에서 실시간으로 보실 수 있습니다.

---

## 알려진 한계

- **한국어 페이지의 손글씨 헤드라인**: 영어용 브러시 글꼴(Flood Std)에는 한글이 포함되어 있지 않아서, `/ko` 페이지의 굵은 손글씨 제목들은 OS 기본 한글 글꼴(Mac에서는 Apple SD Gothic Neo)로 자동 대체되어 보입니다. 향후 한글 손글씨 글꼴(예: 산돌 영필체, KCC한빛체 등)을 별도로 추가하시면 영어 페이지와 동일한 손글씨 분위기를 살릴 수 있습니다.

---

## 마지막 한 마디

수정 작업이 익숙하지 않으시거나 부담스러우시면, 이 세 문서(`01-data-flow.ko.md`, `02-domain-and-deploy.ko.md`, `03-where-to-edit.ko.md`)를 다른 개발자에게 그대로 보여주시면 됩니다. 사이트가 어떻게 구성되어 있고 어디를 만져야 하는지 빠르게 파악할 수 있도록 정리되어 있습니다.

문구 수정, 사진 교체, 가격 조정 같은 가벼운 작업은 직접 해보셔도 무리가 없지만, **결제 흐름 변경, 새 기능 추가, DB 연동** 같은 작업은 개발자에게 의뢰하시는 걸 권장드립니다.
