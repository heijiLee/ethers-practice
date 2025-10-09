# 🚨 자주 발생하는 에러 및 해결법

ethers.js를 사용하면서 자주 만나는 에러들과 해결 방법입니다.

---

## 1. filter not found + Unexpected server response: 404

### 에러 메시지
```
Error: could not coalesce error
error: { "code": -32000, "message": "filter not found" }
method: 'eth_getFilterChanges'

또는

Error: Unexpected server response: 404
(WebSocket 연결 실패)
```

### 원인
실시간 이벤트 리스닝(`contract.on()`)은 **WebSocket 연결**이 필요한데:
1. **HTTP 연결**(`JsonRpcProvider`)을 사용했거나
2. **잘못된 WebSocket URL** 또는 **유효하지 않은 API Key**를 사용했습니다.

### 문제의 코드
```javascript
// ❌ HTTP Provider로는 실시간 이벤트 모니터링 불가
const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
const contract = new ethers.Contract(address, abi, provider);

contract.on('Transfer', (from, to, amount) => {
  // 에러 발생!
});
```

### 해결 방법

**방법 1: WebSocket Provider 사용 (실시간 모니터링)**
```javascript
// ✅ WebSocket Provider 사용
const wsProvider = new ethers.WebSocketProvider(
  'wss://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY'
);

const contract = new ethers.Contract(address, abi, wsProvider);

contract.on('Transfer', (from, to, amount) => {
  console.log('Transfer:', from, '->', to);
});

// 사용 후 연결 종료 필수!
setTimeout(async () => {
  contract.removeAllListeners('Transfer');
  await wsProvider.destroy();
}, 10000);
```

**방법 2: 과거 이벤트 조회 (HTTP로 가능)**
```javascript
// ✅ HTTP Provider로도 작동
const filter = contract.filters.Transfer();
const events = await contract.queryFilter(filter, fromBlock, toBlock);

events.forEach(event => {
  console.log('Transfer:', event.args.from, '->', event.args.to);
});
```

**방법 3: 폴링(Polling) 방식**
```javascript
// ✅ HTTP Provider로 주기적으로 확인
setInterval(async () => {
  const currentBlock = await provider.getBlockNumber();
  const events = await contract.queryFilter(
    contract.filters.Transfer(),
    currentBlock - 1,
    currentBlock
  );
  
  if (events.length > 0) {
    console.log(`새 Transfer ${events.length}개 발견!`);
  }
}, 5000); // 5초마다 확인
```

---

## 2. replacement fee too low

### 에러 메시지
```
Error: replacement transaction underpriced
Error: replacement fee too low
```

### 원인
같은 **nonce**를 가진 트랜잭션을 여러 번 보내려고 할 때 발생합니다.

### 발생 상황
```javascript
// ❌ 동시에 여러 트랜잭션 전송
sendEthExample();           // nonce 0 사용
transferTokenExample();     // nonce 0 사용 시도 → 에러!
anotherTransaction();       // nonce 0 사용 시도 → 에러!
```

### 해결 방법

**방법 1: 한 번에 하나씩 실행**
```javascript
// ✅ 하나씩 실행
await sendEthExample();
// 위 트랜잭션 완료 후
await transferTokenExample();
```

**방법 2: Nonce 수동 관리**
```javascript
// ✅ 각 트랜잭션에 다른 nonce 설정
let nonce = await wallet.getNonce();

const tx1 = await wallet.sendTransaction({ to, value, nonce: nonce++ });
const tx2 = await wallet.sendTransaction({ to, value, nonce: nonce++ });
const tx3 = await wallet.sendTransaction({ to, value, nonce: nonce++ });
```

**방법 3: 대기 시간 추가**
```javascript
// ✅ 순차 실행 함수
async function runSequentially() {
  await sendEthExample();
  await new Promise(r => setTimeout(r, 3000)); // 3초 대기
  
  await transferTokenExample();
  await new Promise(r => setTimeout(r, 3000));
  
  await anotherTransaction();
}
```

---

## 3. insufficient funds

### 에러 메시지
```
Error: insufficient funds for intrinsic transaction cost
```

### 원인
**가스비를 낼 ETH가 부족**합니다.

### 해결 방법

**1. ETH 잔액 확인**
```javascript
const balance = await provider.getBalance(wallet.address);
console.log('ETH 잔액:', ethers.formatEther(balance));
```

**2. 가스비 확인**
```javascript
const gasEstimate = await wallet.estimateGas(tx);
const feeData = await provider.getFeeData();
const gasCost = gasEstimate * feeData.gasPrice;

console.log('필요한 가스비:', ethers.formatEther(gasCost), 'ETH');
```

**3. Faucet에서 ETH 받기**
- Sepolia: https://sepoliafaucet.com/
- Alchemy: https://www.alchemy.com/faucets

---

## 4. execution reverted

### 에러 메시지
```
Error: execution reverted
Error: execution reverted: Insufficient balance
```

### 원인
**스마트 컨트랙트 실행이 실패**했습니다. 여러 원인이 있을 수 있습니다.

### 일반적인 원인들

**1. 토큰 잔액 부족**
```javascript
// ❌ 보내려는 토큰이 없음
const balance = await tokenContract.balanceOf(wallet.address);
console.log('토큰 잔액:', ethers.formatUnits(balance, decimals));
```

**2. Allowance 부족**
```javascript
// ❌ approve 없이 transferFrom 시도
const allowance = await tokenContract.allowance(owner, spender);
console.log('허용 금액:', ethers.formatUnits(allowance, decimals));
```

**3. 잘못된 매개변수**
```javascript
// ❌ 0 주소로 전송 시도
const tx = await contract.transfer('0x0000000000000000000000000000000000000000', amount);
```

### 해결 방법

**사전 확인**
```javascript
// ✅ 전송 전 확인
async function safeTransfer(contract, to, amount) {
  // 1. 주소 검증
  if (!ethers.isAddress(to)) {
    throw new Error('Invalid address');
  }
  
  // 2. 잔액 확인
  const balance = await contract.balanceOf(wallet.address);
  if (balance < amount) {
    throw new Error('Insufficient token balance');
  }
  
  // 3. ETH 확인 (가스비)
  const ethBalance = await provider.getBalance(wallet.address);
  const gasEstimate = await contract.transfer.estimateGas(to, amount);
  const feeData = await provider.getFeeData();
  const gasCost = gasEstimate * feeData.gasPrice;
  
  if (ethBalance < gasCost) {
    throw new Error('Insufficient ETH for gas');
  }
  
  // 4. 전송
  return await contract.transfer(to, amount);
}
```

---

## 5. nonce too low

### 에러 메시지
```
Error: nonce too low
Error: nonce has already been used
```

### 원인
이미 사용한 **nonce**로 다시 트랜잭션을 보내려고 했습니다.

### 해결 방법

**방법 1: Nonce 재설정**
```javascript
const nonce = await wallet.getNonce();
console.log('현재 nonce:', nonce);
```

**방법 2: Pending 트랜잭션 확인**
```
Etherscan에서 pending 트랜잭션 확인
→ 완료될 때까지 대기
```

---

## 6. network error

### 에러 메시지
```
Error: network error
Error: could not detect network
```

### 원인
RPC 노드와의 **연결이 실패**했습니다.

### 해결 방법

**1. RPC URL 확인**
```javascript
// ❌ 잘못된 URL
const provider = new ethers.JsonRpcProvider('https://wrong-url.com');

// ✅ 올바른 URL
const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
```

**2. 다른 RPC 시도**
```javascript
// Sepolia RPC 목록
const rpcs = [
  'https://rpc.sepolia.org',
  'https://rpc2.sepolia.org',
  'https://ethereum-sepolia.publicnode.com',
];

for (const rpc of rpcs) {
  try {
    const provider = new ethers.JsonRpcProvider(rpc);
    await provider.getBlockNumber();
    console.log('✅ 연결 성공:', rpc);
    break;
  } catch {
    console.log('❌ 연결 실패:', rpc);
  }
}
```

**3. API Key 사용 (추천)**
```javascript
// ✅ Infura/Alchemy는 더 안정적
const provider = new ethers.JsonRpcProvider(
  `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
);
```

---

## 7. invalid address

### 에러 메시지
```
Error: invalid address
Error: invalid address (argument="address", value=undefined)
```

### 원인
주소 형식이 잘못되었거나 **undefined**입니다.

### 해결 방법

**주소 검증**
```javascript
// ✅ 주소 사용 전 검증
function validateAddress(address) {
  if (!address) {
    throw new Error('주소가 없습니다');
  }
  
  if (!ethers.isAddress(address)) {
    throw new Error('유효하지 않은 주소 형식');
  }
  
  return ethers.getAddress(address); // 체크섬 주소 반환
}

// 사용
const validAddress = validateAddress(process.env.SUBMIT_ADDRESS);
```

---

## 8. missing revert data

### 에러 메시지
```
Error: missing revert data
```

### 원인
컨트랙트가 실패했지만 **상세한 에러 메시지가 없습니다**.

### 해결 방법

**1. 가스 한도 증가**
```javascript
// 가스가 부족해서 실패할 수 있음
const tx = await contract.transfer(to, amount, {
  gasLimit: gasEstimate * 120n / 100n // 20% 여유
});
```

**2. Tenderly로 시뮬레이션**
- https://dashboard.tenderly.co/
- 트랜잭션 시뮬레이션으로 실패 원인 확인

---

## 9. cannot estimate gas

### 에러 메시지
```
Error: cannot estimate gas
Error: execution reverted (estimating gas failed)
```

### 원인
트랜잭션이 **실패할 것으로 예상**되어 가스 예측이 불가능합니다.

### 해결 방법

**실패 원인 찾기**
```javascript
try {
  const gas = await contract.transfer.estimateGas(to, amount);
} catch (error) {
  console.log('가스 예측 실패 원인:');
  
  // 잔액 확인
  const balance = await contract.balanceOf(wallet.address);
  console.log('토큰 잔액:', ethers.formatUnits(balance, decimals));
  
  // 주소 확인
  console.log('받는 주소:', to);
  console.log('유효한가?', ethers.isAddress(to));
  
  // 컨트랙트 확인
  const code = await provider.getCode(contract.target);
  console.log('컨트랙트 존재?', code !== '0x');
}
```

---

## 10. MODULE_NOT_FOUND

### 에러 메시지
```
Error: Cannot find module 'dotenv'
Error: Cannot find module 'ethers'
```

### 원인
패키지가 **설치되지 않았습니다**.

### 해결 방법

```bash
# dotenv 설치
npm install dotenv

# ethers 설치
npm install ethers

# 또는 모든 의존성 설치
npm install
```

---

## 11. process.env.XXX is undefined

### 에러 메시지
```
TypeError: Cannot read property of undefined
process.env.PRIVATE_KEY is undefined
```

### 원인
`.env` 파일이 **없거나** 형식이 **잘못되었습니다**.

### 해결 방법

**1. .env 파일 존재 확인**
```bash
ls -la .env
```

**2. .env 파일 형식 확인**
```bash
# ✅ 올바른 형식
PRIVATE_KEY=0x123...
WALLET_ADDRESS=0xabc...

# ❌ 잘못된 형식
PRIVATE_KEY="0x123..."  # 따옴표 불필요
PRIVATE_KEY = 0x123...  # 공백 불필요
```

**3. require('dotenv').config() 확인**
```javascript
// 파일 맨 위에 있어야 함
require('dotenv').config();

// 확인
console.log('PRIVATE_KEY 존재?', !!process.env.PRIVATE_KEY);
```

---

## 12. 트랜잭션이 pending 상태로 멈춤

### 증상
트랜잭션을 보냈는데 계속 pending 상태입니다.

### 원인

**1. 가스 가격이 너무 낮음**
- 채굴자가 처리하지 않음

**2. 네트워크 혼잡**
- 블록이 가득 참

**3. Nonce 순서 문제**
- 이전 트랜잭션이 pending

### 해결 방법

**방법 1: Speed Up (MetaMask)**
```
MetaMask에서 "Speed Up" 클릭
→ 가스비를 올려서 재전송
```

**방법 2: Cancel (MetaMask)**
```
MetaMask에서 "Cancel" 클릭
→ 같은 nonce로 0 ETH 전송 (취소)
```

**방법 3: 코드로 교체**
```javascript
// 더 높은 가스비로 같은 nonce 재전송
const nonce = await wallet.getNonce('pending');
const feeData = await provider.getFeeData();

const tx = await wallet.sendTransaction({
  to: recipient,
  value: amount,
  nonce: nonce - 1, // 기존 트랜잭션의 nonce
  maxFeePerGas: feeData.maxFeePerGas * 120n / 100n, // 20% 증가
  maxPriorityFeePerGas: feeData.maxPriorityFeePerGas * 120n / 100n,
});
```

---

## 13. wrong network

### 에러 메시지
```
Error: wrong network
Error: network does not match signer
```

### 원인
지갑과 Provider의 **네트워크가 다릅니다**.

### 해결 방법

**네트워크 확인**
```javascript
const network = await provider.getNetwork();
console.log('Chain ID:', network.chainId);
console.log('네트워크:', network.name);

// Sepolia인지 확인
if (network.chainId !== 11155111n) {
  throw new Error('Sepolia 네트워크가 아닙니다!');
}
```

---

## 🛠️ 디버깅 팁

### 1. 에러 로그 상세히 보기

```javascript
try {
  await contract.transfer(to, amount);
} catch (error) {
  console.error('에러 타입:', error.code);
  console.error('에러 메시지:', error.message);
  console.error('전체 에러:', error);
  
  // 트랜잭션 데이터 확인
  if (error.transaction) {
    console.log('실패한 트랜잭션:', error.transaction);
  }
}
```

### 2. 트랜잭션 시뮬레이션

```javascript
// 실제 전송 전에 estimateGas로 테스트
try {
  const gas = await contract.transfer.estimateGas(to, amount);
  console.log('✅ 트랜잭션 성공할 것으로 예상');
  console.log('예상 가스:', gas.toString());
} catch (error) {
  console.log('❌ 트랜잭션 실패 예상');
  console.log('원인:', error.message);
}
```

### 3. Step-by-step 확인

```javascript
console.log('1. Provider 연결:', !!provider);
console.log('2. Wallet 생성:', !!wallet);
console.log('3. 지갑 주소:', wallet.address);
console.log('4. ETH 잔액:', ethers.formatEther(await provider.getBalance(wallet.address)));
console.log('5. 토큰 잔액:', ethers.formatUnits(await contract.balanceOf(wallet.address), decimals));
console.log('6. 네트워크:', (await provider.getNetwork()).name);
```

---

## 📚 에러별 빠른 참고

| 에러 | 원인 | 해결 |
|------|------|------|
| `filter not found` | HTTP Provider로 실시간 이벤트 | WebSocket 사용 또는 queryFilter |
| `replacement fee too low` | 같은 nonce 재사용 | 순차 실행 또는 nonce 관리 |
| `insufficient funds` | ETH 부족 | Faucet에서 받기 |
| `execution reverted` | 컨트랙트 실행 실패 | 잔액/allowance 확인 |
| `nonce too low` | 이미 사용한 nonce | getNonce()로 재확인 |
| `network error` | RPC 연결 실패 | 다른 RPC 시도 |
| `invalid address` | 잘못된 주소 | isAddress()로 검증 |
| `missing revert data` | 가스 부족 | gasLimit 증가 |
| `MODULE_NOT_FOUND` | 패키지 미설치 | npm install |
| `undefined` | .env 로드 실패 | dotenv.config() 확인 |

---

## 💡 예방 팁

### 1. 항상 try-catch 사용
```javascript
try {
  const tx = await contract.transfer(to, amount);
  await tx.wait();
} catch (error) {
  console.error('에러:', error.message);
  // 에러 처리
}
```

### 2. 사전 검증
```javascript
// 트랜잭션 전 모든 것 확인
async function preCheck() {
  const balance = await provider.getBalance(wallet.address);
  const tokenBalance = await contract.balanceOf(wallet.address);
  const network = await provider.getNetwork();
  
  console.log('✅ 사전 검증 통과');
}
```

### 3. 테스트넷 사용
```javascript
// 메인넷 전에 반드시 테스트넷에서 테스트
if (network.chainId === 1n) {
  console.warn('⚠️ 메인넷입니다! 신중하게!');
  // 추가 확인 로직
}
```

---

## 🆘 그래도 해결 안되면?

1. **Etherscan 확인**
   - 트랜잭션 해시로 검색
   - 실패 원인이 표시됨

2. **전체 에러 로그 확인**
   ```javascript
   console.log(JSON.stringify(error, null, 2));
   ```

3. **공식 문서 참고**
   - https://docs.ethers.org/

4. **커뮤니티 질문**
   - Discord, Stack Overflow, GitHub Issues

---

이 문서를 북마크하고 에러가 발생하면 참고하세요! 🚀
