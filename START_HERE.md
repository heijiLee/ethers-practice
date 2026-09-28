# 🚀 여기서 시작하세요!

안녕하세요! Ethers.js를 처음 배우시는군요. 환영합니다! 👋

이 가이드는 여러분을 **완전 초보에서 실전 개발자**로 만들어드립니다.

---

## ✅ 시작 전 체크리스트

### 1. Node.js 설치 확인
```bash
node --version  # v18 이상이어야 합니다
```

설치 안되어 있다면: https://nodejs.org/

### 2. 패키지 설치 확인
```bash
npm install
```

### 3. 테스트 실행
```bash
npm run 01
```

주석을 해제하면 예제가 실행됩니다!

---

## 📚 학습 순서 (중요!)

### 📖 Step 1: 개념 이해 (30분)
먼저 `README.md`를 읽고 핵심 개념 4가지를 이해하세요:
- Provider (블록체인 읽기)
- Wallet (지갑 관리)
- Transaction (트랜잭션 전송)
- Contract (스마트 컨트랙트)

### 🔬 Step 2: Provider 배우기 (1시간)
```bash
npm run 01
```

`01-provider.js` 파일을 열고:
1. 모든 주석을 꼼꼼히 읽기
2. 코드 이해하기
3. 맨 아래 주석 해제하고 실행하기
4. 코드를 수정해서 실험하기

**목표**: 블록체인에서 데이터를 읽을 수 있다

### 👛 Step 3: Wallet 배우기 (1시간)
```bash
npm run 02
```

`02-wallet.js` 파일로 동일하게 학습

**목표**: 지갑을 생성하고 관리할 수 있다

### 💸 Step 4: Transaction 배우기 (2시간)
```bash
npm run 03
```

`03-transaction.js` 파일 학습

**⚠️ 중요**: 이제부터 실제 테스트넷이 필요합니다!

**테스트넷 준비하기:**
1. MetaMask 설치: https://metamask.io/
2. Sepolia 네트워크 추가
3. Faucet에서 테스트 ETH 받기: https://www.alchemy.com/faucets/ethereum-sepolia
4. 코드에 개인키 입력 (⚠️ 테스트 지갑만!)

**목표**: 테스트넷에서 트랜잭션을 보낼 수 있다

### 📜 Step 5: Contract Read 배우기 (2시간)
```bash
npm run 04
```

`04-contract-read.js` 파일 학습

**목표**: 스마트 컨트랙트에서 데이터를 읽을 수 있다

### ✍️ Step 6: Contract Write 배우기 (2시간)
```bash
npm run 05
```

`05-contract-write.js` 파일 학습

**목표**: 스마트 컨트랙트에 데이터를 쓸 수 있다

---

## 🎯 이제 실전입니다!

### Step 7: 실전 예제 (1시간)
```bash
npm run 06
```

`06-practical-example.js`에는 실제로 사용 가능한 코드가 있습니다.
복사해서 프로젝트에 바로 사용하세요!

### Step 8: 치트시트 숙지 (30분)
`CHEATSHEET.md`를 읽고 북마크하세요.
개발할 때 빠르게 참고할 수 있습니다.

### Step 9: 연습 문제 (1주일)
`EXERCISES.md`의 문제를 풀어보세요:
- 🟢 초급: 3문제
- 🟡 중급: 3문제
- 🔴 고급: 4문제

### Step 10: 프로젝트 만들기 (지속적)
`EXERCISES.md` 하단의 프로젝트 아이디어 중 하나를 골라서
실제로 만들어보세요!

---

## 💡 학습 팁

### ✅ DO
- ✅ 코드를 직접 타이핑하세요
- ✅ 주석을 꼼꼼히 읽으세요
- ✅ 코드를 수정해서 실험하세요
- ✅ 에러를 두려워하지 마세요
- ✅ 테스트넷에서 충분히 연습하세요

### ❌ DON'T
- ❌ 복사-붙여넣기만 하지 마세요
- ❌ 주석을 건너뛰지 마세요
- ❌ 에러를 무시하지 마세요
- ❌ 개인키를 공유하지 마세요
- ❌ 메인넷에서 바로 시작하지 마세요

---

## 🆘 문제가 생기면

### 1. 에러가 났어요!
→ 에러 메시지를 읽어보세요. 대부분 무엇이 문제인지 알려줍니다.

### 2. 코드가 이해가 안돼요!
→ `CHEATSHEET.md`를 참고하거나, 해당 파일의 주석을 다시 읽어보세요.

### 3. 트랜잭션이 실패해요!
→ Etherscan에서 트랜잭션을 확인하세요. 실패 원인이 나옵니다.

### 4. 가스비가 없어요!
→ Faucet에서 테스트 ETH를 받으세요: https://www.alchemy.com/faucets/ethereum-sepolia

### 5. 그래도 모르겠어요!
→ [Ethers.js 공식 문서](https://docs.ethers.org/)를 참고하세요.

---

## 📅 학습 계획 예시

### 주중 (평일 2시간씩)
- **Day 1**: README + Provider (01)
- **Day 2**: Wallet (02)
- **Day 3**: Transaction (03) + 테스트넷 준비
- **Day 4**: Contract Read (04)
- **Day 5**: Contract Write (05)

### 주말 (각 4시간씩)
- **토요일**: Practical Example (06) + CHEATSHEET
- **일요일**: 연습 문제 풀기

### 다음 주
- 프로젝트 만들기!

---

## 🎉 준비되셨나요?

자, 이제 시작해볼까요!

```bash
# 첫 번째 예제 실행
npm run 01
```

그리고 `01-provider.js` 파일을 열어보세요!

---

**화이팅! 여러분은 할 수 있습니다! 🚀**

> 질문이 있으면 각 파일의 주석을 다시 읽어보세요.
> 답은 항상 코드 안에 있습니다!
