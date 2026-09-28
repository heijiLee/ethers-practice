# 🔐 환경 변수 설정 가이드

## 📋 .env 파일이란?

`.env` 파일은 **개인키, API 키 등 민감한 정보를 안전하게 저장**하는 파일입니다.
- 코드에 직접 작성하지 않아도 됩니다
- Git에 올라가지 않습니다 (`.gitignore`에 포함)
- 다른 사람과 코드를 공유해도 안전합니다

---

## 🚀 빠른 시작

### 1단계: .env 파일 생성

터미널에서 실행:
```bash
# .env.example을 복사해서 .env 생성
cp .env.example .env
```

또는 직접 생성:
```bash
# .env 파일 생성
touch .env
```

### 2단계: .env 파일 편집

`.env` 파일을 열고 아래 내용 추가:

```bash
# Ethers.js 튜토리얼 환경 변수
# ⚠️ 이 파일은 절대 Git에 올리지 마세요!

# 개인키 (⚠️ 테스트 지갑만 사용하세요!)
PRIVATE_KEY=0x여기에_본인의_개인키_입력

# 지갑 주소들
WALLET_ADDRESS=0x여기에_지갑_주소_입력
WALLET_ADDRESS_2=0x추가_주소_1 (선택사항)
WALLET_ADDRESS_3=0x추가_주소_2 (선택사항)

# 토큰/ETH를 받을 주소
SUBMIT_ADDRESS=0x토큰을_받을_주소 (선택사항)

# RPC URLs
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
MAINNET_RPC_URL=https://ethereum-rpc.publicnode.com

# API Keys (선택사항)
INFURA_API_KEY=
ALCHEMY_API_KEY=
```

### 3단계: 개인키와 주소 가져오기

**A. MetaMask에서 개인키 내보내기:**
1. MetaMask 열기
2. 계정 메뉴 클릭 (오른쪽 상단)
3. "계정 세부정보" 클릭
4. "개인 키 내보내기" 클릭
5. 비밀번호 입력
6. 개인키 복사
7. `.env` 파일의 `PRIVATE_KEY=` 뒤에 붙여넣기

**B. MetaMask에서 지갑 주소 복사:**
1. MetaMask 열기
2. 계정 이름 클릭 (주소가 표시됨)
3. 주소 클릭하여 복사 (예: `0x1234...abcd`)
4. `.env` 파일의 `WALLET_ADDRESS=` 뒤에 붙여넣기

**C. 추가 주소 (선택사항):**
- 여러 지갑을 사용한다면:
  - `WALLET_ADDRESS_2`: 두 번째 지갑 주소
  - `WALLET_ADDRESS_3`: 세 번째 지갑 주소
  - `SUBMIT_ADDRESS`: 토큰/ETH를 받을 주소 (05-contract-write.js에서 사용)

**⚠️ 주의사항:**
- 반드시 **테스트 지갑**만 사용하세요!
- 메인 지갑의 개인키는 절대 사용하지 마세요!
- 새 지갑을 만들어서 테스트용으로 사용하는 것을 권장합니다
- **개인키와 주소가 일치하는지 확인하세요!**

### 4단계: 완료!

이제 코드에서 자동으로 `.env` 파일의 값을 불러옵니다:

```javascript
// 코드에서 자동으로 불러옴
const PRIVATE_KEY = process.env.PRIVATE_KEY;
```

---

## 📝 .env 파일 상세 설명

### 필수 환경 변수

```bash
# 개인키 (필수)
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# 지갑 주소 (필수 - 04-contract-read.js 등에서 사용)
WALLET_ADDRESS=0x1234567890123456789012345678901234567890
```

### 선택 환경 변수

```bash
# 추가 지갑 주소들 (여러 주소 조회시 사용)
WALLET_ADDRESS_2=0xabcdef1234567890abcdef1234567890abcdef12
WALLET_ADDRESS_3=0x567890abcdef1234567890abcdef1234567890ab

# 토큰/ETH를 받을 주소 (05-contract-write.js에서 사용)
SUBMIT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678

# Sepolia RPC URL (기본값 있음)
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com

# Mainnet RPC URL (기본값 있음)
MAINNET_RPC_URL=https://ethereum-rpc.publicnode.com

# Infura API Key (속도 향상)
INFURA_API_KEY=your_infura_api_key

# Alchemy API Key (속도 향상)
ALCHEMY_API_KEY=your_alchemy_api_key
```

---

## 🔍 코드에서 사용 방법

### 기본 사용법

```javascript
// .env 파일 불러오기
require('dotenv').config();

// 환경 변수 사용
const privateKey = process.env.PRIVATE_KEY;
const walletAddress = process.env.WALLET_ADDRESS;
const rpcUrl = process.env.SEPOLIA_RPC_URL;

// 기본값 설정 (환경 변수가 없을 때)
const privateKey = process.env.PRIVATE_KEY || 'YOUR_DEFAULT_KEY';
const walletAddress = process.env.WALLET_ADDRESS || '0x0000000000000000000000000000000000000000';
```

### 실제 예제

```javascript
require('dotenv').config();
const { ethers } = require('ethers');

// .env에서 값 가져오기
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const RPC_URL = process.env.SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com';

// 사용
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

console.log('지갑 주소:', wallet.address);
console.log('.env의 주소:', WALLET_ADDRESS);
console.log('일치 여부:', wallet.address === WALLET_ADDRESS);
```

---

## ✅ 올바른 .env 파일 예제

```bash
# 좋은 예 ✅
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
INFURA_API_KEY=abc123def456
```

```bash
# 나쁜 예 ❌
PRIVATE_KEY="0x123..."  # 따옴표 필요 없음
SEPOLIA_RPC_URL = https://...  # = 양쪽 공백 없음
# PRIVATE_KEY=0x123...  # 주석 처리하면 안됨
```

---

## 🛡️ 보안 체크리스트

- [ ] `.env` 파일이 `.gitignore`에 포함되어 있나요?
- [ ] 테스트 지갑의 개인키만 사용하고 있나요?
- [ ] `.env` 파일을 Git에 커밋하지 않았나요?
- [ ] `.env.example`에는 실제 값이 없나요?
- [ ] 공개 저장소에 올릴 때 `.env`가 빠졌나요?

---

## 🚨 문제 해결

### 문제 1: "process.env.PRIVATE_KEY is undefined"

**원인:** `.env` 파일이 없거나 형식이 잘못됨

**해결:**
```bash
# .env 파일이 있는지 확인
ls -la .env

# .env 파일 형식 확인
cat .env

# 올바른 형식으로 작성
PRIVATE_KEY=0x123...
```

### 문제 2: "Cannot find module 'dotenv'"

**원인:** dotenv 패키지가 설치되지 않음

**해결:**
```bash
npm install dotenv
```

### 문제 3: ".env 파일을 만들었는데 작동 안함"

**원인:** 파일 위치가 잘못됨

**해결:**
- `.env` 파일은 `package.json`과 같은 폴더에 있어야 합니다
- 경로 확인: `/Users/heiji/Develop/ETC/1014_prac/.env`

### 문제 4: "개인키 형식이 잘못됨"

**원인:** 개인키 형식 오류

**해결:**
- 개인키는 `0x`로 시작해야 합니다
- 64자(16진수)여야 합니다
- 예: `0x1234567890abcdef...` (총 66자)

---

## 📚 추가 환경 변수 설정

### Infura API Key 추가

```bash
# 1. https://infura.io/ 에서 회원가입
# 2. 새 프로젝트 생성
# 3. API Key 복사
# 4. .env에 추가

INFURA_API_KEY=abc123def456ghi789
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/${INFURA_API_KEY}
```

### Alchemy API Key 추가

```bash
# 1. https://www.alchemy.com/ 에서 회원가입
# 2. 새 앱 생성 (Sepolia 선택)
# 3. API Key 복사
# 4. .env에 추가

ALCHEMY_API_KEY=xyz789abc456def123
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}
```

---

## 💡 팁과 모범 사례

### 1. 여러 지갑 사용

```bash
# .env
PRIVATE_KEY_MAIN=0x...
PRIVATE_KEY_TEST=0x...
PRIVATE_KEY_DEV=0x...
```

```javascript
// 코드에서
const mainWallet = new ethers.Wallet(process.env.PRIVATE_KEY_MAIN);
const testWallet = new ethers.Wallet(process.env.PRIVATE_KEY_TEST);
```

### 2. 환경별 설정

```bash
# .env.development (개발)
PRIVATE_KEY=0xtest...
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com

# .env.production (배포)
PRIVATE_KEY=0xprod...
MAINNET_RPC_URL=https://mainnet.infura.io/v3/...
```

### 3. 필수 환경 변수 체크

```javascript
require('dotenv').config();

// 필수 환경 변수 체크
if (!process.env.PRIVATE_KEY) {
  console.error('❌ PRIVATE_KEY가 .env 파일에 없습니다!');
  process.exit(1);
}

console.log('✅ 환경 변수 로드 성공');
```

---

## 🎯 완료 확인

다음 명령어로 테스트하세요:

```bash
node 02-wallet.js
```

정상적으로 실행되면 성공입니다! 🎉

---

## ❓ FAQ

**Q: .env 파일을 Git에 올려도 되나요?**
A: 절대 안됩니다! `.gitignore`에 포함되어 있는지 꼭 확인하세요.

**Q: .env.example은 뭔가요?**
A: 실제 값 없이 형식만 보여주는 예제 파일입니다. Git에 올려도 안전합니다.

**Q: 팀원과 .env를 공유하려면?**
A: 직접 공유하지 말고, 안전한 방법(1Password, 직접 전달 등)을 사용하세요.

**Q: 개인키가 노출됐어요!**
A: 즉시 해당 지갑의 자산을 다른 지갑으로 옮기고, 새 지갑을 만드세요.

---

이제 안전하게 개인키를 관리할 수 있습니다! 🔐
