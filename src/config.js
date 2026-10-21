// 실제 운영 정보로 교체하세요. 빈 구매 주소는 안내창을 표시합니다.
export const siteConfig = {
  shopUrl: '', smartstoreUrl: '', instagramUrl: 'https://www.instagram.com/good_namul/',
  phone: '', bulkEmail: '', address: '강원특별자치도 정선군',
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  },
};
