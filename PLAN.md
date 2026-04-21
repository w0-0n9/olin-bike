# Olin Cycling Experiences — 웹사이트 구축 계획안

> French Alps · Tour de France 2026 · July 21–26
> Founding member experience for 10 cyclists
> Source: `TourDeFrance_Olin_Invitation.pdf`, `TourDeFrancia_Olin_Invitacion.pdf`

---

## 1. 프로젝트 개요

PDF 초대장에 담긴 Olin의 브랜드와 컨텐츠를 웹사이트로 옮기되, 단순 소개 페이지를 넘어 **Airbnb 스타일의 숙소 예약·결제 시스템**을 갖춘 풀스택 서비스로 구축한다.

### 1.1 핵심 가치
- **Exclusivity**: "word of mouth, not advertised" — 초대 기반 컨셉 유지
- **Cinematic invitation**: 다크 네이비 + 노란 브러시 핸드라이팅의 프리미엄 톤
- **Functional booking**: 실제 예약/결제까지 매끄럽게 이어지는 사용자 경험
- **Global access**: 영어/스페인어/프랑스어 3개 언어 + 데스크탑/모바일 완벽 대응

### 1.2 타깃 사용자
- 사이클링을 사랑하는 글로벌 라이더 (프랑스, 이탈리아, 스페인, UK, US, 싱가포르, 일본, 라틴아메리카)
- Tour de France를 화면이 아닌 현장에서 경험하고 싶은 사람
- 큐레이티드 프리미엄 여행을 선호하는 사용자

---

## 2. 기술 스택

| 영역 | 선택 | 이유 |
|---|---|---|
| 프레임워크 | **Next.js 14 (App Router)** | SSR/SEO, i18n 라우팅, 이미지 최적화, Server Components |
| 언어 | **TypeScript** | 타입 안정성, 결제·예약 도메인의 안전성 |
| 국제화 | **next-intl** | EN/ES/FR 라우트 기반(`/en`, `/es`, `/fr`), 서버 컴포넌트 호환 |
| 스타일 | **Tailwind CSS** | 빠른 반응형 개발 |
| UI 컴포넌트 | **shadcn/ui + Radix** | 접근성 보장, 커스터마이즈 용이 |
| 폰트 | **Playfair Display** (serif) + **Permanent Marker / 핸드라이팅** + **Inter** | PDF 톤 매칭 |
| 결제 | **Stripe Checkout + Payment Intents** | 다통화, 보증금/잔금 분할, SCA, 환불 |
| DB | **Supabase (Postgres)** | DB + 인증 + Storage(숙소 사진) 통합 |
| 인증 | **Supabase Auth** (Magic link + Google) | 비밀번호 없는 UX |
| 메일 | **Resend + React Email** | 다국어 트랜잭셔널 메일 (확정/리마인더/잔금) |
| 지도 | **Mapbox GL JS** | 샬레 위치, Alpe d'Huez 코스 시각화 |
| 분석 | **Vercel Analytics + PostHog** | 익명 트래킹, 퍼널 분석 |
| 호스팅 | **Vercel** | 글로벌 엣지 CDN, 이미지 최적화 |
| PWA | **next-pwa** | 모바일 홈화면 설치, 오프라인 itinerary |

---

## 3. 모바일 전략 — PWA 채택

- **결정**: 네이티브(React Native) 대신 **PWA(Progressive Web App)** 로 진행
- **이유**:
  - 사용자 규모(연 10–30명)에 네이티브 앱은 과잉 투자
  - PWA로 홈화면 설치 / 오프라인 itinerary / 푸시 알림(예약 리마인더) 모두 충분
  - 단일 코드베이스 유지 비용 절감
- **구현**: 모바일 우선 반응형 → PWA 매니페스트 + 서비스 워커 추가

---

## 4. 사이트 구조 (Information Architecture)

```
/
├── [locale]/                          # /en /es /fr
│   ├── (marketing)/
│   │   ├── page.tsx                   # 1. Landing — invitation hero
│   │   ├── experience/                # 2. The Experience (itinerary)
│   │   ├── included/                  # 3. What's Included
│   │   ├── about/                     # 4. About (Augusto & Rodrigo)
│   │   └── philosophy/                # 5. Olin philosophy (Nahuatl 어원)
│   │
│   ├── stays/
│   │   ├── page.tsx                   # 6. Stays — Airbnb-style 그리드
│   │   └── [slug]/                    # 7. 샬레 상세 (사진, 침실, 가격)
│   │
│   ├── book/
│   │   ├── [stayId]/
│   │   │   ├── dates/                 # 8a. 날짜 + 인원
│   │   │   ├── options/               # 8b. 자전거 렌탈 + private room
│   │   │   ├── review/                # 8c. 가격 확인
│   │   │   └── checkout/              # 8d. Stripe 결제
│   │   └── confirmation/[id]/         # 8e. 예약 확정
│   │
│   ├── account/
│   │   ├── bookings/                  # 9a. 내 예약
│   │   ├── balance/                   # 9b. 잔금 결제
│   │   └── profile/                   # 9c. 프로필
│   │
│   └── invite/[code]/                 # 10. 초대 코드 진입
│
├── admin/                             # 호스트 (Augusto & Rodrigo) 전용
│   ├── stays/                         # 숙소 CRUD
│   ├── bookings/                      # 예약 관리
│   ├── guests/                        # 게스트 명부
│   └── content/                       # 다국어 콘텐츠 편집
│
└── api/
    ├── stripe/webhook/
    ├── bookings/
    └── invites/
```

---

## 4.1 참고 레퍼런스 — DuVine Alps Challenge

경쟁·벤치마크 사이트로 [DuVine Alps Challenge](https://www.duvine.com/tour/alps-challenge/)의 UX 패턴을 분석하여 아래 요소를 차용한다.

### 차용할 패턴
| DuVine 패턴 | Olin 적용 방식 |
|---|---|
| **내러티브 데이 타이틀** ("Go for the Galibier", "The Alpe d'Huez") | PDF의 "Tuesday July 22 — The big ride" 대신 감정을 담은 타이틀로 재작성. 예: "Into the Oisans", "The 21 Hairpins" |
| **확장형 데이 섹션** (Expand/Collapse + "Expand All Days") | Itinerary 페이지를 아코디언 구조로. 기본은 요약, 클릭 시 상세(거리·고도·식사·숙소·코칭 포인트) |
| **일별 메트릭** (distance km/mi, elevation gain, meals covered) | 각 라이딩 데이에 🚴 거리 · ⛰️ 누적고도 · 🍽️ 식사 · 🛌 숙소 아이콘 카드 |
| **라이딩 레벨 옵션** (Longer / Shorter Option) | PDF의 "guides adapt routes"를 구체화 — 각 데이마다 **A 코스(full) / B 코스(shorter)** 제시 |
| **사전 피트니스 체크인** (booking 후 form 발송) | 예약 확정 후 온보딩 설문: FTP, 주간 훈련량, 최근 그란폰도 경험, 식이/의료 |
| **"Not Included" 섹션 명시** | "항공권, Lyon 점심, 레이스 관람일 현장 간식" 등 투명 공개 |
| **Press / "As featured in"** | Rapha, Airbnb, Wolf Tooth 등 PDF 파트너 로고 + 향후 언론 노출 시 업데이트 |
| **가이드 전문성 배지** | Augusto(TdF·Vuelta·Giro 가이드), Rodrigo(Airbnb Superhost + BIEA 인증 미캐닉) 상세 카드 |
| **기후·날씨 테이블** | 7월 French Alps 평균 기온/강수/고도별 체감 — 짐 꾸리기 섹션에 삽입 |
| **Print / Download Itinerary PDF** | 다국어 PDF 자동 생성 (React-PDF) — 예약자 전용 다운로드 |
| **Multiple CTA 배치** | Hero / Itinerary 하단 / Pricing / Floating bottom bar(모바일) |
| **솔로 트래블러 표기** | "Private bedroom 추가요금 안내" 명확화 |
| **Related / Cross-sell** | 2027년 시즌 확장 시 Vuelta/Giro 패키지 연결 |

### Olin이 **안 할 것** (DuVine과 차별화)
- ❌ 여러 투어 카탈로그 — 올린은 "하나의 큐레이티드 위크"에 집중
- ❌ 공개 가격표와 Book Now 스팸 — invitation 중심의 조용한 톤 유지
- ❌ 과도한 편의 강조 — DuVine이 "럭셔리 투어"라면 Olin은 "친구 10명의 의례(ritual)"

---

## 5. 핵심 기능

### 5.1 다국어 (i18n)
- **지원 언어**: English / Español / Français
- **라우팅**: `/en/...`, `/es/...`, `/fr/...`
- **로케일 자동 감지**: `Accept-Language` 헤더 → 사용자가 수동 변경 가능 (쿠키 저장)
- **콘텐츠 소스**:
  - EN, ES: PDF 원본 사용
  - FR: 신규 번역 필요 (전문 번역 권장 — 브랜드 톤 유지)
- **확장 항목**:
  - 통화 표기 (USD 기본 + EUR 보조)
  - 날짜 포맷 (`July 21` / `21 de julio` / `21 juillet`)
  - 결제 영수증 / 메일 / 푸시 알림 모두 로케일별

### 5.2 예약 + 결제 (Airbnb 스타일)

#### 플로우
1. 숙소 카드 클릭 → 상세 페이지
2. 날짜·인원·옵션 선택 → 실시간 가격 계산
3. 로그인 (이메일 매직링크 또는 Google)
4. **Stripe Checkout: 보증금 USD $1,300 결제**
5. 다국어 확정 메일 + `.ics` 캘린더 첨부
6. 출발 60일 전까지 자동 환불 가능
7. 잔금은 출발 30일 전 자동 청구 또는 수동 결제 링크

#### 가격 모델
```
Founding member fee     $2,990   (필수)
+ Carbon bike rental    $  500   (옵션)
+ Private bedroom       $  XXX   (옵션, 호스트 정의)
────────────────────────────────
Total                   $3,490+
Deposit (today)         $1,300
Balance (30일 전)       $2,190
```

#### 환불 정책 자동화
- 출발 60일 전: 보증금 100% 환불
- 60일 이내: 보증금 비환불 (PDF 정책 기반)
- Stripe Refund API 연동

### 5.3 추가 옵션 (Add-ons)

부킹 단계의 옵션 선택 UI:

```
🚴 Bike option
  ○ I'll bring my own bike          +$0
  ● Carbon bike rental              +$500
     └─ Size: [48 / 50 / 52 / 54 / 56 / 58 cm]
     └─ Pedal type: [SPD-SL / SPD / Look Keo / Flat]

🛏️ Room option
  ● Shared bedroom (2–3 people)     +$0   (기본)
  ○ Private bedroom                  +$XXX (가용 시)

🧘 Recovery (선택)
  ☐ Daily massage package           +$XXX
```

#### DB 필드 추가
- `bookings.bike_rental: boolean`
- `bookings.bike_size: enum`
- `bookings.pedal_type: enum`
- `bookings.room_type: enum('shared', 'private')`
- `bookings.add_ons: jsonb` — 향후 확장용

### 5.4 Invitation 게이팅
- 초대 코드 기반 진입 (`/invite/[code]`)
- 코드 입력 시 쿠키에 저장 → 예약 페이지 접근 허용
- 공개 마케팅 페이지(랜딩, 철학, About)는 누구나 열람 가능
- 예약/체크아웃은 코드 보유자만

### 5.5 Itinerary 상세 페이지 (DuVine 패턴 적용)
- **아코디언 데이 카드** — 기본 접힌 상태, 클릭 시 전개
- **메트릭 바**: 🚴 거리(km/mi 토글) · ⛰️ 고도 · ⏱️ 예상 라이딩 시간 · 🍽️ 식사 포함 · 🛌 숙소
- **A/B 라우트**: 각 데이 full/shorter 옵션 GPX 다운로드 링크
- **코스 지도 임베드**: Mapbox로 GPX 렌더링 + 하이라이트 포인트 핀
- **"Expand All Days" 토글**: 전체 펼치기/접기
- **인쇄 가능 PDF** 자동 생성 (다국어)

### 5.6 사전 피트니스 온보딩
예약 확정 직후 다국어 설문:
- 주간 라이딩 거리 / 최장 1일 라이딩
- 산악 라이딩 경험 (최근 3년)
- FTP 또는 파워 데이터 (선택)
- 자전거 사이즈 + 페달 타입 (렌탈 선택 시 필수)
- 식이 제한 / 알러지 / 의료 사항
- 비상 연락처
- Lyon 도착 항공편 정보

→ Admin 대시보드 "게스트 명부"에 집계, 가이드가 그룹 페이싱 설계에 사용

### 5.7 Trust & Transparency 섹션
- **Not Included** 명시 박스 (항공권, Lyon 점심, 팁, 여행자 보험)
- **날씨 & 패킹 가이드** — 7월 Alps 기후 테이블 + 추천 킷 리스트
- **가이드 프로필** 상세 카드 (Augusto/Rodrigo 경력 + 투어 실적)
- **파트너 배지** (Rapha, Airbnb Superhost, Wolf Tooth, Park Tool, BIEA)
- **FAQ** (훈련 수준 / 환불 / 비자 / 자전거 항공 운송)

### 5.8 PWA 기능
- 홈화면 설치 (manifest.json)
- 오프라인에서도 itinerary 열람 (서비스 워커 캐시)
- 푸시 알림:
  - 예약 확정
  - 잔금 결제 D-7 / D-1
  - 출발 D-7 (체크리스트)
  - 출발 당일 (Lyon 픽업 정보)

### 5.9 Admin Dashboard
- 숙소 등록/수정 (사진, 침실, 가격, 가용 기간)
- 예약 목록 (상태별 필터: 보증금완료/잔금대기/완납)
- 게스트 정보 (자전거 사이즈, 페달 타입, 식이 알러지)
- 다국어 콘텐츠 편집 (CMS 대안: Sanity 또는 Payload 검토)
- 매출 대시보드

---

## 6. 데이터 모델 (Postgres)

```sql
users (
  id, email, name, locale, phone,
  bike_size, pedal_type, dietary_notes,
  created_at
)

invitations (
  code, invited_by, used_by, expires_at,
  created_at
)

stays (
  id, slug, name, location, description_i18n,
  bedrooms, max_guests, base_price_usd,
  private_room_fee_usd, photos[], coordinates,
  amenities[], available_from, available_to
)

bookings (
  id, user_id, stay_id,
  start_date, end_date, guests,
  bike_rental, bike_size, pedal_type,
  room_type, add_ons jsonb,
  total_usd, deposit_usd, balance_usd,
  status enum('pending','deposit_paid','fully_paid','cancelled','refunded'),
  stripe_session_id, stripe_payment_intent_id,
  created_at
)

payments (
  id, booking_id, amount_usd, type enum('deposit','balance','refund'),
  stripe_charge_id, status, created_at
)

content_blocks (
  key, locale, content,           # CMS 대체 — 마케팅 카피 다국어 관리
  updated_at
)
```

---

## 7. 디자인 시스템

### 7.1 컬러
- **Primary BG**: `#0F1226` (deep navy from PDF)
- **Accent**: `#F0E65A` (electric yellow brush)
- **Text**: `#F5F2EA` (warm white)
- **Muted**: `#8B8FA8`
- **Surface**: `#1A1E3A`

### 7.2 타이포그래피
- **Display (hero)**: Playfair Display — "You are exclusively invited"
- **Hand-brush (accent)**: Permanent Marker / 커스텀 SVG — "OLIN", "8 SPOTS REMAINING"
- **Body**: Inter — 본문, UI

### 7.3 모션
- 페이지 진입 시 fade + slight up (Framer Motion)
- 이미지 패럴랙스 (산악 사진, 펠로톤)
- 노란 브러시 스트로크는 SVG 경로 애니메이션

---

## 8. 단계별 로드맵

### Phase 1 — Marketing Foundation (2–3주)
- [ ] 디자인 시스템 셋업 (컬러, 타이포, 컴포넌트)
- [ ] Next.js + next-intl 프로젝트 초기화
- [ ] Landing 페이지 (invitation hero)
- [ ] The Experience (itinerary — 아코디언 + 메트릭 바 + A/B 라우트 + Mapbox)
- [ ] What's Included **+ Not Included** 섹션
- [ ] 날씨 & 패킹 가이드 테이블
- [ ] 가이드 프로필 상세 카드 + 파트너 배지
- [ ] FAQ 섹션
- [ ] About (Augusto & Rodrigo + 파트너 로고)
- [ ] Olin philosophy 페이지
- [ ] EN/ES 콘텐츠 적용 + FR 번역
- [ ] 컨택 폼 (이메일 캡처 → Resend)
- [ ] Vercel 배포 + 도메인 연결 (`olin.bike`)

**Deliverable**: 누구에게나 보여줄 수 있는 브랜드 사이트

### Phase 2 — Booking System (2–3주)
- [ ] Supabase 셋업 (DB + Auth)
- [ ] 데이터 모델 마이그레이션
- [ ] Stays 리스팅 + 상세 페이지
- [ ] 사진 갤러리 (Next/Image + Supabase Storage)
- [ ] Mapbox 위치 표시
- [ ] 예약 플로우 4단계 (dates → options → review → checkout)
- [ ] 자전거 렌탈 / private room 옵션 UI + 가격 계산
- [ ] Stripe Checkout 통합 (보증금 $1,300)
- [ ] Stripe Webhook → 예약 상태 업데이트
- [ ] 다국어 확정 메일 (React Email)
- [ ] `.ics` 캘린더 첨부
- [ ] **사전 피트니스 온보딩 설문** (예약 확정 직후 발송)
- [ ] 다국어 Itinerary PDF 자동 생성 (React-PDF)

**Deliverable**: 실제 결제 가능한 예약 시스템

### Phase 3 — Account & Admin (1–2주)
- [ ] 사용자 계정 (예약 조회, 프로필)
- [ ] 잔금 결제 페이지
- [ ] 환불 자동화 (60일 정책)
- [ ] Admin 대시보드
  - 숙소 CRUD
  - 예약 관리
  - 게스트 명부 (자전거 사이즈 등)
- [ ] 다국어 콘텐츠 편집 UI
- [ ] 잔금 D-30 자동 청구 (Cron)

**Deliverable**: 운영 가능한 풀스택 시스템

### Phase 4 — PWA & Polish (3–5일)
- [ ] PWA 매니페스트 + 아이콘
- [ ] 서비스 워커 (오프라인 itinerary)
- [ ] 푸시 알림 (Web Push API)
- [ ] Lighthouse 최적화 (성능/접근성 95+)
- [ ] OG 이미지 다국어 생성
- [ ] Sitemap + robots.txt
- [ ] 분석 도구 연결

**Deliverable**: 모바일 앱 수준의 웹 경험

---

## 9. 보안 & 컴플라이언스

- **결제**: Stripe (PCI-DSS 위임), 카드정보 자체 저장 X
- **인증**: Supabase Auth (passwordless), Row-Level Security
- **개인정보**: GDPR 준수 (EU 사용자), 쿠키 동의 배너
- **환경 변수**: Vercel Encrypted, `.env.local` git 제외
- **Webhook 검증**: Stripe signature 검증 필수
- **Rate limiting**: 예약/로그인 엔드포인트 (Upstash Redis)

---

## 10. 결정 필요 사항

다음 4가지가 정해지면 Phase 1 즉시 착수 가능:

1. **숙소 범위**
   - [ ] 현재 Oz 샬레 1곳만 등록 (방 단위 예약)
   - [ ] 향후 여러 숙소 확장 (multi-listing 모델)

2. **Invitation 게이팅 강도**
   - [ ] 마케팅 페이지 공개 + 예약만 코드 필요
   - [ ] 전체 사이트 코드 입력 후 진입

3. **결제 정책**
   - [ ] PDF 그대로 ($1,300 보증금 + 잔금)
   - [ ] 풀결제 옵션 추가 (즉시 $2,990)

4. **CMS 도입 여부**
   - [ ] DB content_blocks 테이블로 자체 관리
   - [ ] Sanity / Payload CMS 도입 (호스트가 직접 편집)

---

## 11. 향후 확장 (2027 정식 런칭 대비)

- 추가 패키지: La Vuelta a España, Giro d'Italia
- 동반자(non-rider) 패키지
- 사진 패키지 (전문 포토그래퍼)
- 추가 코칭 데이
- 멤버십 (founding members 30% off TDF 2027)
- 갤러리 / 후기 / 영상 콘텐츠 섹션
- 추천 인바이트 시스템 (referral tracking)
