# 윤영근의 착한나물

고원농산영농조합법인의 한국어 반응형 브랜드 홈페이지. Vite + vanilla JavaScript로 구현했으며 Firebase Storage 사진 교체를 지원합니다.

## 실행

Node.js 22.12 이상 권장.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

## 운영 정보 설정

`src/config.js`에서 `shopUrl`, `smartstoreUrl`, `phone`, `bulkEmail`, `address`를 실제 운영 정보로 변경합니다. 구매 주소는 HTTPS URL을 사용하세요. 주소가 비어 있으면 준비 중 안내창이 표시됩니다. 인스타그램은 요청받은 `@good_namul`로 연결되어 있습니다.

제품 이름·참고 가격·설명은 `src/main.js`의 `products` 배열에서 관리합니다. 상품 상세 구매 연결은 현재 구매처 선택 섹션으로 이동합니다. 실제 제품별 URL이 있다면 개별 링크로 확장할 수 있습니다.

## Firebase 사진 연결

사진 원본 파일은 **Firebase Storage**에 저장합니다. 별도의 Firestore 데이터베이스는 현재 필요하지 않습니다. 관리자 웹 업로드 UI는 포함하지 않았으며 Firebase Console에서 업로드합니다.

1. Firebase 프로젝트에서 웹 앱을 등록하고 Storage를 활성화합니다.
2. `.env.example`을 `.env.local`로 복사하고 Firebase 웹 앱 설정을 입력합니다. 서비스 계정 private key 등 서버 비밀키를 `VITE_` 변수에 넣지 마세요.
3. Storage 규칙은 `storage.rules`를 검토해 적용합니다. `public/` 파일만 공개 읽기를 허용하며, 브라우저 쓰기는 차단합니다. Firebase Console의 권한 있는 관리자가 업로드합니다.
4. 아래 파일명으로 WebP 사진을 업로드합니다.

|Storage 경로|사용 위치|
|---|---|
|public/hero.webp|메인 나물밥|
|public/story.webp|실제 농장·산지|
|public/recipe.webp|조리 예시|
|public/gondre.webp|곤드레|
|public/siraegi.webp|시래기|
|public/chwi.webp|취나물|
|public/yuchae.webp|유채나물|
|public/bundle.webp|묶음 세트|
|public/gift.webp|선물세트|

환경 변수가 없거나 사진을 읽지 못하면 기본 SVG/패키지 일러스트가 표시됩니다. 이미지를 성공적으로 가져오면 해당 일러스트 표기가 사라집니다. 사진과 일러스트는 구별되어 있으며 초기 패키지는 실제 포장 디자인이 아닙니다.

## Vercel 및 도메인 (추후 배포)

1. Vercel에서 이 GitHub 저장소를 Import합니다.
2. Framework Preset: Vite, Build Command: `npm run build`, Output: `dist` (vercel.json 포함).
3. Firebase를 사용하는 경우 Vercel Environment Variables에 `.env.example`의 항목을 입력한 뒤 배포합니다.
4. 프로젝트 Settings → Domains에서 도메인을 추가하고 Vercel이 안내하는 DNS 레코드를 도메인 관리 서비스에 적용합니다.
5. 실제 구매 URL, 고객센터, 상세 주소, 사업자 표시 정보, 제품 사진, 판매가격을 확정하고 수상·선정 문구의 공식 증빙을 확인한 뒤 공개 운영합니다.

현재 수상·선정 이력 및 브랜드 설명은 사용자가 제공한 내용을 반영했습니다. 공식 인증 로고, 인증서, 식품 관련 추가 인증은 임의로 만들지 않았습니다.

## 포함 기능

- 모바일 메뉴, 본문 바로가기, 키보드 포커스, 모션 감소 설정 대응
- 제품 카테고리 필터와 제품 상세 모달(Escape 닫기 지원)
- 구매 링크 미설정 안내 및 인스타그램 연결
- 원격 사진 오류 시 기본 이미지 유지
- 반응형 페이지 및 기본 검색 메타데이터

Sites 제작 가이드를 참고했으나 현재 실행 환경에는 Sites source/publish helper가 없어서 Sites 호스팅은 수행하지 않았습니다. Graphify는 연결 워크스페이스 접근 오류로 코드 인덱스를 사용하지 못했습니다. Vercel은 사용자의 추후 배포 계획에 맞춰 설정 파일만 준비했습니다.
