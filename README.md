
# Ethers.js 초보자 가이드 🚀

## 📚 ethers.js란?
이더리움 블록체인과 소통하기 위한 JavaScript 라이브러리입니다.
웹사이트에서 MetaMask 같은 지갑과 연결하거나, 블록체인 데이터를 읽고 쓸 수 있습니다.

## 🎯 핵심 개념 4가지

### 1️⃣ Provider (제공자)
- **역할**: 블록체인을 "읽는" 도구
- **비유**: 도서관에서 책을 읽는 것
- **할 수 있는 것**: 잔액 조회, 블록 정보 읽기, 트랜잭션 확인
- **할 수 없는 것**: 돈 보내기, 컨트랙트에 쓰기

### 2️⃣ Wallet (지갑)
- **역할**: 계정 관리 및 서명
- **비유**: 신분증 + 도장
- **필요한 이유**: 돈을 보내거나 컨트랙트를 실행하려면 서명이 필요
- **주의**: 개인키는 절대 공유하면 안됩니다!

### 3️⃣ Transaction (트랜잭션)
- **역할**: 블록체인에 데이터 쓰기
- **비유**: 은행 송금
- **특징**: 가스비(수수료)가 필요하고, 되돌릴 수 없습니다

### 4️⃣ Contract (스마트 컨트랙트)
- **역할**: 블록체인 위의 프로그램
- **비유**: 자동판매기 (돈 넣으면 음료수 나옴)
- **필요한 것**: 컨트랙트 주소 + ABI (사용 설명서)

---

## 📖 학습 순서

### 기본 예제 (순서대로 학습)
1. **01-provider.js** - Provider로 블록체인 읽기
2. **02-wallet.js** - Wallet 생성하고 관리하기
3. **03-transaction.js** - 트랜잭션 보내기
4. **04-contract-read.js** - 컨트랙트 읽기
5. **05-contract-write.js** - 컨트랙트에 쓰기

### 실전 & 참고 자료
6. **06-practical-example.js** - 실전 예제 (복사해서 바로 사용 가능)
7. **CHEATSHEET.md** - 빠른 참고용 치트시트
8. **EXERCISES.md** - 연습 문제 (초급 → 고급)
9. **COMMON_ERRORS.md** - 자주 발생하는 에러 해결법 ⭐

---

## 🔧 실행 방법

### 방법 1: 직접 실행
```bash
node 01-provider.js
node 02-wallet.js
node 03-transaction.js
node 04-contract-read.js
node 05-contract-write.js
node 06-practical-example.js
```

### 방법 2: npm scripts (더 편리)
```bash
npm run 01  # Provider 예제
npm run 02  # Wallet 예제
npm run 03  # Transaction 예제
npm run 04  # Contract Read 예제
npm run 05  # Contract Write 예제
npm run 06  # Practical 예제
```

## 🌐 네트워크 정보

**이 튜토리얼의 네트워크 설정:**
- **01-provider.js**: Ethereum Mainnet (읽기만 하므로 안전)
- **02-06 모든 파일**: Sepolia 테스트넷 (실습용)

**Sepolia 테스트넷 정보:**
- RPC URL: `https://ethereum-sepolia-rpc.publicnode.com`
- Chain ID: 11155111
- Explorer: https://sepolia.etherscan.io/
- Faucet: https://www.alchemy.com/faucets/ethereum-sepolia

💡 **자세한 네트워크 설정은 `NETWORK_INFO.md`를 참고하세요!**

## ⚠️ 주의사항

1. **개인키(Private Key)는 절대 공유하지 마세요!**
2. **Sepolia 테스트넷으로 연습하세요** (01-provider.js 제외)
3. 메인넷은 실제 돈이 들어가므로 충분히 연습 후 사용하세요
4. 가스비(수수료)를 항상 확인하세요

## 💡 자주 묻는 질문

**Q: Provider와 Wallet의 차이는?**
A: Provider는 "읽기 전용", Wallet은 "읽기 + 쓰기" 가능합니다.

**Q: ABI가 뭔가요?**
A: 컨트랙트 사용 설명서입니다. 어떤 함수가 있는지 알려줍니다.

**Q: 가스비는 왜 필요한가요?**
A: 블록체인 네트워크를 사용하는 수수료입니다. 채굴자/검증자에게 지급됩니다.

**Q: 테스트넷 ETH는 어디서 받나요?**
A: Faucet 사이트에서 무료로 받을 수 있습니다.
- Sepolia Faucet (Alchemy): https://www.alchemy.com/faucets/ethereum-sepolia

---

## 📂 파일 구조

```
1014_prac/
├── README.md                  # 시작 가이드 (이 파일)
├── START_HERE.md             # 첫 시작 가이드
├── CHEATSHEET.md             # 빠른 참고용 치트시트
├── EXERCISES.md              # 연습 문제 모음
├── NETWORK_INFO.md           # 네트워크 설정 가이드
├── ENV_SETUP.md              # 환경 변수 설정 가이드
├── COMMON_ERRORS.md          # 에러 해결 가이드 ⭐
├── .env.example              # 환경 변수 예제
├── .gitignore                # Git 무시 파일 (개인키 보호)
├── package.json              # 프로젝트 설정
│
├── 01-provider.js            # Provider 기초 (Mainnet)
├── 02-wallet.js              # Wallet 관리 (Sepolia)
├── 03-transaction.js         # 트랜잭션 전송 (Sepolia)
├── 04-contract-read.js       # 컨트랙트 읽기 (Sepolia)
├── 05-contract-write.js      # 컨트랙트 쓰기 + 토큰 생성 ⭐ (Sepolia)
├── 06-practical-example.js   # 실전 예제 (Sepolia)
└── get-wallet-address.js     # 지갑 주소 계산 유틸
```

---

## 🎯 학습 로드맵

### 1단계: 기초 다지기 (1-2일)
- [ ] README.md 읽기
- [ ] 01-provider.js 학습 및 실행
- [ ] 02-wallet.js 학습 및 실행
- [ ] CHEATSHEET.md 훑어보기

### 2단계: 트랜잭션 (1-2일)
- [ ] 03-transaction.js 학습 및 실행
- [ ] 테스트넷에서 실제 트랜잭션 전송 실습

### 3단계: 스마트 컨트랙트 (2-3일)
- [ ] 04-contract-read.js 학습 및 실행
- [ ] 05-contract-write.js 학습 및 실행
- [ ] 실제 컨트랙트와 상호작용 실습

### 4단계: 실전 (1주일)
- [ ] 06-practical-example.js 학습
- [ ] EXERCISES.md의 초급 문제 풀기
- [ ] EXERCISES.md의 중급 문제 풀기
- [ ] 간단한 프로젝트 만들기

### 5단계: 마스터 (지속적)
- [ ] EXERCISES.md의 고급 문제 풀기
- [ ] 실전 프로젝트 개발
- [ ] 오픈소스 기여

---

## 💻 추천 개발 환경

- **Code Editor**: VS Code
- **Node.js**: v18 이상
- **지갑**: MetaMask (브라우저 확장 프로그램)
- **테스트넷**: Sepolia (가장 안정적)
- **Explorer**: Etherscan (트랜잭션 확인)

---

## 🔗 유용한 링크

### 공식 문서
- [Ethers.js 공식 문서](https://docs.ethers.org/v6/)
- [Ethereum.org](https://ethereum.org/)
- [Solidity 문서](https://docs.soliditylang.org/)

### 개발 도구
- [Remix IDE](https://remix.ethereum.org/) - 브라우저 기반 Solidity IDE
- [Hardhat](https://hardhat.org/) - 이더리움 개발 환경
- [Tenderly](https://tenderly.co/) - 디버깅 도구

### 테스트넷 Faucet
- [Sepolia Faucet (Alchemy)](https://www.alchemy.com/faucets/ethereum-sepolia)
- [Chainlink Faucet](https://faucets.chain.link/)

### API 서비스
- [Infura](https://infura.io/) - RPC 제공
- [Alchemy](https://www.alchemy.com/) - RPC + 추가 기능
- [Etherscan API](https://etherscan.io/apis) - 블록체인 데이터

---

## 🤝 도움이 필요하면

1. **CHEATSHEET.md** - 빠른 코드 참고
2. **각 예제의 주석** - 상세한 설명
3. **Etherscan** - 트랜잭션 확인
4. **Ethers.js 공식 문서** - 깊이 있는 학습

---

행운을 빕니다! 🎉

> "The best way to learn is by doing" - 직접 코드를 작성하고 실험하세요!

