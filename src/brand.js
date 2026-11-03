const milestones=[
 ['2026','강한소상공인 최우수상 수상','중소벤처기업부 강한소상공인(혁신 소상공인) 최우수상'],
 ['2025','매출 30억 원 달성','더 많은 식탁으로 전해진 정선의 정성'],
 ['2022','매출 14억 1,429만 원','꾸준히 이어온 좋은 먹거리의 성장'],
 ['2021','온라인·오프라인 판매 확대','오픈마켓과 식당·체인점 등으로 판매 채널 확대'],
 ['2016–2017','유통 채널 확장','2016년 홈플러스 입점 · 2017년 공영홈쇼핑 방송 매출 5천만 원'],
 ['2013–2014','나물 가공과 간편식 개발','2013년 정선 사북 식품 제조공장 인수 및 산채류 제조·가공 시작 · 2014년 산채류 3종 비비는 이야기 시리즈 개발·판매'],
 ['2004–2009','생산·유통 기반 구축','2004년 ISO 9001 인증 획득 · 2007년 구리농수산물시장 중매권 취득 및 지사 개설 · 2009년 남양주 화도읍 지사 신축 이전'],
 ['2000–2003','고원농산의 새로운 출발','2000년 고원농산영농조합법인으로 재구성 · 2003년 강원랜드 및 국민연금관리공단 리조트 식자재 공급'],
 ['1996','고랭지에서 시작된 첫걸음','청농회 영농조합법인으로 고랭지 채소 수집·생산 사업 시작']
];
export function historySummary(){return '<div class="history-summary"><div><small>2022 매출</small><b>14억 1,429만 원</b></div><div><small>2025 매출</small><b>30억 원 달성</b></div><div><small>2026 강한소상공인</small><b>최우수상 수상</b></div></div>';}
export function renderBrandStory(){return `
<section class="brand-intro section"><a class="brand-back" href="/">← 홈으로</a><div class="eyebrow">윤영근의 착한 나물 · 브랜드 스토리</div><h1>건강을 생각하고,<br><em>간편함을 만듭니다.</em></h1><p>잘 먹고 싶은 마음은 누구나 같으니까.<br>정선의 좋은 나물을, 바쁜 일상에서도 쉽고 맛있게.</p><a class="button" href="#brand-history">우리가 걸어온 길 <span>↓</span></a><span class="brand-flower" aria-hidden="true">✳</span></section>
<section class="section brand-origin"><div class="landscape"><span class="landscape-alt" aria-hidden="true">800<span>m</span></span><img src="/images/mountains.svg" alt="정선 고랭지 산지를 표현한 일러스트"><div class="landscape-label">청정 정선, 해발 800m<br><b>좋은 땅에서 시작한 정성.</b></div><small class="illustration-note">산지 풍경 일러스트</small></div><div class="story-copy"><div class="eyebrow">01 — 건강을 생각합니다</div><h2>내 가족이 먹는다는<br>마음으로.</h2><p>맑은 공기와 깨끗한 자연이 머무는 강원도 정선. 해발 800m 고랭지에서 직접 기르고 엄선한 나물로, 매일의 한 끼를 준비합니다.</p><p>화학첨가물을 더하지 않고 깨끗하고 철저한 생산라인에서 만듭니다. 짜지 않고 감칠맛 나는 나물 본연의 맛을 온 가족이 함께 즐길 수 있도록.</p></div></section>
<section class="brand-easy"><div class="section"><div class="eyebrow">02 — 간편함을 만듭니다</div><h2>좋은 한 끼가,<br>어려울 필요는 없으니까.</h2><p>손질하고 씻고 삶는 정성은 우리가 담았습니다.<br>당신은 따끈한 밥 한 공기만 준비해 주세요.</p><div class="brand-steps"><article><b>01</b><h3>쓱 뜯고.</h3><p>먹고 싶은 나물 한 팩을 고르고</p></article><article><b>02</b><h3>툭 붓고.</h3><p>따끈한 밥 위에 그대로 올리고</p></article><article><b>03</b><h3>슥 비비고.</h3><p>맛있게 한 입, 간단하게 한 끼</p></article></div><strong class="brand-five">5초 나물, 윤영근의 착한 나물.</strong></div></section>
<section class="section brand-history" id="brand-history"><div class="section-heading"><div><div class="eyebrow">03 — 회사 연혁</div><h2>정직하게 쌓아온 시간,<br>함께 자라는 내일.</h2></div><p>고원농산영농조합법인의 주요 발자취</p></div>${historySummary()}<ol class="history-timeline">${milestones.map(([year,title,description])=>`<li><time>${year}</time><div><h3>${title}</h3><p>${description}</p></div></li>`).join('')}</ol></section>
<section class="section buy"><div class="eyebrow">정선의 정성을 당신의 식탁으로</div><h2>건강한 마음을 담아,<br>간단하게 먹어봐요.</h2><p>쓱 뜯고, 툭 붓고, 슥 비비면 끝!</p><a class="button brand-shop" href="https://naver.me/FpPBRQ6z" target="_blank" rel="noopener noreferrer">착한 나물 구매하러 가기 <span>↗</span></a><a class="brand-home" href="/#products">제품 라인업 살펴보기 →</a></section>`;}
