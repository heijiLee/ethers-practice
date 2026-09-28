# 🌐 네트워크 설정 가이드

## 📋 튜토리얼 파일별 네트워크

| 파일 | 네트워크 | 설명 |
|------|---------|------|
| `01-provider.js` | **Ethereum Mainnet** | 읽기만 하므로 안전 (가스비 없음) |
| `02-wallet.js` | **Sepolia Testnet** | 지갑 테스트용 |
| `03-transaction.js` | **Sepolia Testnet** | 트랜잭션 실습용 |
| `04-contract-read.js` | **Sepolia Testnet** | 컨트랙트 읽기 실습 |
| `05-contract-write.js` | **Sepolia Testnet** | 컨트랙트 쓰기 실습 |
| `06-practical-example.js` | **Sepolia Testnet** | 실전 예제 |

---

## 🔗 Sepolia 테스트넷

### 기본 정보
```javascript
{
  name: "Sepolia",
  chainId: 11155111,
  rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
  explorer: "https://sepolia.etherscan.io/",
  currency: {
    name: "Sepolia ETH",
    symbol: "SepoliaETH",
    decimals: 18
  }
}
```

### RPC 엔드포인트

**공개 RPC:**
```
https://ethereum-sepolia-rpc.publicnode.com
https://1rpc.io/sepolia
https://sepolia.gateway.tenderly.co
```

**Infura (추천):**
```
https://sepolia.infura.io/v3/YOUR_API_KEY
```

**Alchemy (추천):**
```
https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
```

### 테스트 ETH 받기 (Faucet)

**공식 Faucet:**
- https://www.alchemy.com/faucets/ethereum-sepolia (가장 추천)
- https://faucet.quicknode.com/ethereum/sepolia
- https://faucets.chain.link/sepolia

**받는 방법:**
1. 위 사이트 중 하나 접속
2. MetaMask 주소 입력
3. "Request" 또는 "Send Me ETH" 클릭
4. 1-2분 후 지갑 확인

**⚠️ 주의:**
- 하루에 받을 수 있는 양이 제한됨
- 여러 Faucet을 사용하면 더 많이 받을 수 있음
- 테스트 ETH는 실제 가치가 없음

---

## 🦊 MetaMask 설정

### Sepolia 네트워크 추가

**자동 추가 (권장):**
1. https://chainlist.org/ 접속
2. "Sepolia" 검색
3. "Add to MetaMask" 클릭

**수동 추가:**
1. MetaMask 열기
2. 네트워크 드롭다운 클릭
3. "네트워크 추가" 클릭
4. 아래 정보 입력:

```
네트워크 이름: Sepolia
RPC URL: https://ethereum-sepolia-rpc.publicnode.com
체인 ID: 11155111
통화 기호: ETH
블록 탐색기 URL: https://sepolia.etherscan.io/
```

5. "저장" 클릭

---

## 📊 Sepolia 테스트 토큰

### 유명한 Sepolia 토큰

**USDC (Circle):**
```
주소: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
Decimals: 6
```

**LINK (Chainlink):**
```
주소: 0x779877A7B0D9E8603169DdbD7836e478b4624789
Decimals: 18
Faucet: https://faucets.chain.link/sepolia
```

**DAI:**
```
주소: 0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6
Decimals: 18
```

**⚠️ 주의:** 
- 이 주소들은 변경될 수 있습니다
- Etherscan에서 "Verified Contracts"로 확인하세요

---

## 🔄 네트워크 전환하기

### 코드에서 네트워크 변경

**Mainnet으로 변경:**
```javascript
const provider = new ethers.JsonRpcProvider('https://ethereum-rpc.publicnode.com');
// 또는
const provider = new ethers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${API_KEY}`
);
```

**Sepolia로 변경:**
```javascript
const provider = new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
// 또는
const provider = new ethers.JsonRpcProvider(
  `https://sepolia.infura.io/v3/${API_KEY}`
);
```

**다른 테스트넷:**

**Hoodi (검증자/스테이킹 테스트용, Holesky 후속):**
```javascript
const provider = new ethers.JsonRpcProvider('https://ethereum-hoodi-rpc.publicnode.com');
```

**Polygon Amoy (Mumbai 후속):**
```javascript
const provider = new ethers.JsonRpcProvider('https://polygon-amoy-bor-rpc.publicnode.com');
```

---

## 🎯 실전 팁

### 1. API Key 사용 (추천)

무료 공개 RPC는 느리고 불안정할 수 있습니다.

**Infura API Key 받기:**
1. https://infura.io/ 접속
2. 회원가입
3. 새 프로젝트 생성
4. API Key 복사
5. 코드에 적용:

```javascript
const INFURA_API_KEY = 'YOUR_API_KEY';
const provider = new ethers.JsonRpcProvider(
  `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
);
```

**Alchemy API Key 받기:**
1. https://www.alchemy.com/ 접속
2. 회원가입
3. 새 앱 생성 (Sepolia 선택)
4. API Key 복사
5. 코드에 적용

### 2. 환경 변수 사용

**.env 파일 생성:**
```bash
# .env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_API_KEY
PRIVATE_KEY=0x...
```

**코드에서 사용:**
```javascript
require('dotenv').config();

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
```

**⚠️ 중요:** `.env` 파일은 `.gitignore`에 추가하세요!

### 3. 네트워크 확인

```javascript
async function checkNetwork() {
  const network = await provider.getNetwork();
  console.log('Chain ID:', network.chainId.toString());
  console.log('Network Name:', network.name);
  
  // Sepolia인지 확인
  if (network.chainId !== 11155111n) {
    throw new Error('Wrong network! Please switch to Sepolia');
  }
}
```

---

## 🚨 자주 하는 실수

### 1. 잘못된 네트워크
```
❌ Mainnet 주소를 Sepolia에서 사용
✅ 네트워크마다 다른 주소 사용
```

### 2. RPC 속도
```
❌ 공개 RPC 사용 (느림)
✅ Infura/Alchemy API Key 사용
```

### 3. 가스비 부족
```
❌ Faucet에서 ETH를 안받음
✅ 미리 테스트 ETH 받아두기
```

### 4. 잘못된 컨트랙트 주소
```
❌ Mainnet 컨트랙트 주소 사용
✅ Sepolia에 배포된 주소 사용
```

---

## 📚 참고 링크

- [Sepolia 공식 문서](https://sepolia.dev/)
- [Ethereum Testnet 비교](https://ethereum.org/en/developers/docs/networks/)
- [Chainlist (네트워크 목록)](https://chainlist.org/)
- [Sepolia Etherscan](https://sepolia.etherscan.io/)
- [Infura](https://infura.io/)
- [Alchemy](https://www.alchemy.com/)

---

## ❓ FAQ

**Q: Goerli와 Sepolia 중 무엇을 써야 하나요?**
A: Sepolia를 사용하세요. Goerli는 이미 중단되었습니다.

**Q: 테스트 ETH가 부족해요!**
A: 여러 Faucet을 사용하거나, Discord/Twitter에서 요청하세요.

**Q: Mainnet으로 언제 전환하나요?**
A: Sepolia에서 충분히 테스트한 후, 소액으로 먼저 시도하세요.

**Q: API Key는 필수인가요?**
A: 아니지만, 안정성과 속도를 위해 강력히 권장합니다.

**Q: 여러 네트워크를 동시에 사용할 수 있나요?**
A: 네! Provider를 여러 개 만들면 됩니다.

```javascript
const mainnetProvider = new ethers.JsonRpcProvider('https://ethereum-rpc.publicnode.com');
const sepoliaProvider = new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
```

---

이제 Sepolia 테스트넷에서 마음껏 실습하세요! 🚀
