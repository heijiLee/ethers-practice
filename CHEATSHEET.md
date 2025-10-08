# Ethers.js 치트시트 📝

빠른 참고를 위한 핵심 코드 모음입니다.

## 📦 설치

```bash
npm install ethers
```

```javascript
const { ethers } = require('ethers');
```

---

## 🔌 Provider (블록체인 연결)

### Provider 생성

```javascript
// 공개 RPC
const provider = new ethers.JsonRpcProvider('https://eth.public-rpc.com');

// Infura
const provider = new ethers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${API_KEY}`
);

// Alchemy
const provider = new ethers.JsonRpcProvider(
  `https://eth-mainnet.g.alchemy.com/v2/${API_KEY}`
);

// 브라우저 (MetaMask)
const provider = new ethers.BrowserProvider(window.ethereum);
```

### 기본 조회

```javascript
// 네트워크 정보
const network = await provider.getNetwork();

// 최신 블록 번호
const blockNumber = await provider.getBlockNumber();

// ETH 잔액
const balance = await provider.getBalance(address);
const balanceEth = ethers.formatEther(balance);

// 블록 정보
const block = await provider.getBlock(blockNumber);

// 가스 가격
const feeData = await provider.getFeeData();
const gasPriceGwei = ethers.formatUnits(feeData.gasPrice, 'gwei');

// 트랜잭션 조회
const tx = await provider.getTransaction(txHash);

// ENS 해석
const address = await provider.resolveName('vitalik.eth');
const name = await provider.lookupAddress(address);
```

---

## 👛 Wallet (지갑)

### 지갑 생성

```javascript
// 새 지갑 생성
const wallet = ethers.Wallet.createRandom();

// 개인키로 복원
const wallet = new ethers.Wallet(privateKey);

// 니모닉으로 복원
const wallet = ethers.Wallet.fromPhrase(mnemonic);

// Provider 연결
const connectedWallet = wallet.connect(provider);
```

### 지갑 정보

```javascript
// 주소
const address = wallet.address;

// 개인키
const privateKey = wallet.privateKey;

// 니모닉
const mnemonic = wallet.mnemonic.phrase;

// 잔액
const balance = await wallet.provider.getBalance(wallet.address);
```

### 서명

```javascript
// 메시지 서명
const signature = await wallet.signMessage('Hello');

// 서명 검증
const recoveredAddress = ethers.verifyMessage('Hello', signature);

// 트랜잭션 서명
const signedTx = await wallet.signTransaction(tx);
```

---

## 💸 Transaction (트랜잭션)

### ETH 전송

```javascript
// 간단한 전송
const tx = await wallet.sendTransaction({
  to: recipientAddress,
  value: ethers.parseEther('1.0')
});

// 확인 대기
const receipt = await tx.wait();

// 상세 설정
const tx = await wallet.sendTransaction({
  to: recipientAddress,
  value: ethers.parseEther('1.0'),
  gasLimit: 21000,
  gasPrice: ethers.parseUnits('50', 'gwei'),
  nonce: await wallet.getNonce(),
});
```

### EIP-1559 (추천)

```javascript
const feeData = await provider.getFeeData();

const tx = await wallet.sendTransaction({
  to: recipientAddress,
  value: ethers.parseEther('1.0'),
  maxFeePerGas: feeData.maxFeePerGas,
  maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
});
```

### 가스 예측

```javascript
const gasEstimate = await wallet.estimateGas({
  to: recipientAddress,
  value: ethers.parseEther('1.0')
});
```

---

## 📜 Contract (스마트 컨트랙트)

### 컨트랙트 생성

```javascript
// Human-Readable ABI
const abi = [
  'function name() view returns (string)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)'
];

// 읽기 전용
const contract = new ethers.Contract(contractAddress, abi, provider);

// 읽기 + 쓰기
const contract = new ethers.Contract(contractAddress, abi, wallet);
```

### 컨트랙트 읽기 (무료)

```javascript
// 함수 호출
const name = await contract.name();
const balance = await contract.balanceOf(userAddress);

// 여러 호출 동시에
const [name, symbol, decimals] = await Promise.all([
  contract.name(),
  contract.symbol(),
  contract.decimals()
]);
```

### 컨트랙트 쓰기 (가스비 필요)

```javascript
// 함수 호출
const tx = await contract.transfer(recipientAddress, amount);
const receipt = await tx.wait();

// 가스 예측
const gasEstimate = await contract.transfer.estimateGas(recipientAddress, amount);

// 커스텀 가스 설정
const tx = await contract.transfer(recipientAddress, amount, {
  gasLimit: 100000,
  maxFeePerGas: ethers.parseUnits('50', 'gwei')
});
```

### 이벤트

```javascript
// 과거 이벤트 조회
const filter = contract.filters.Transfer();
const events = await contract.queryFilter(filter, fromBlock, toBlock);

// 특정 주소 필터
const filter = contract.filters.Transfer(fromAddress, toAddress);

// 실시간 리스닝
contract.on('Transfer', (from, to, amount, event) => {
  console.log(`Transfer: ${from} -> ${to}: ${amount}`);
});

// 리스너 제거
contract.removeAllListeners('Transfer');
```

---

## 🔄 단위 변환

```javascript
// Wei -> ETH
const eth = ethers.formatEther('1000000000000000000'); // '1.0'

// ETH -> Wei
const wei = ethers.parseEther('1.0'); // 1000000000000000000n

// Wei -> Gwei
const gwei = ethers.formatUnits('50000000000', 'gwei'); // '50.0'

// Gwei -> Wei
const wei = ethers.parseUnits('50', 'gwei'); // 50000000000n

// 커스텀 decimals
const formatted = ethers.formatUnits('1000000', 6); // '1.0' (USDC)
const parsed = ethers.parseUnits('1.0', 6); // 1000000n
```

---

## 🛠️ 유틸리티

```javascript
// 주소 검증
const isValid = ethers.isAddress(address);

// 체크섬 주소
const checksummed = ethers.getAddress(address);

// 주소 비교
const isSame = address1.toLowerCase() === address2.toLowerCase();

// ENS 해시
const node = ethers.namehash('vitalik.eth');

// 메시지 해시
const hash = ethers.hashMessage('Hello');

// Keccak256 해시
const hash = ethers.keccak256(ethers.toUtf8Bytes('Hello'));

// 랜덤 바이트
const randomBytes = ethers.randomBytes(32);

// 16진수 변환
const hex = ethers.hexlify([1, 2, 3]); // '0x010203'
const bytes = ethers.getBytes('0x010203'); // Uint8Array

// BigInt 연산
const a = 100n;
const b = 50n;
const sum = a + b; // 150n
const product = a * b; // 5000n
```

---

## 📦 ERC-20 표준 ABI

```javascript
const ERC20_ABI = [
  // 읽기
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  
  // 쓰기
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  
  // 이벤트
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)'
];
```

---

## 🎯 자주 사용하는 패턴

### 토큰 정보 한번에 가져오기

```javascript
const [name, symbol, decimals, balance] = await Promise.all([
  contract.name(),
  contract.symbol(),
  contract.decimals(),
  contract.balanceOf(userAddress)
]);
```

### 안전한 토큰 전송

```javascript
// 1. 잔액 확인
const balance = await contract.balanceOf(wallet.address);
if (balance < amount) throw new Error('Insufficient balance');

// 2. 가스 예측
const gasEstimate = await contract.transfer.estimateGas(to, amount);

// 3. ETH 잔액 확인
const ethBalance = await provider.getBalance(wallet.address);
const gasCost = gasEstimate * (await provider.getFeeData()).gasPrice;
if (ethBalance < gasCost) throw new Error('Insufficient ETH for gas');

// 4. 전송
const tx = await contract.transfer(to, amount);
const receipt = await tx.wait();
```

### Approve + TransferFrom

```javascript
// 1. Approve
const approveTx = await tokenContract.approve(spenderAddress, amount);
await approveTx.wait();

// 2. Check Allowance
const allowance = await tokenContract.allowance(ownerAddress, spenderAddress);

// 3. TransferFrom (spender가 실행)
const transferTx = await tokenContract.transferFrom(ownerAddress, recipientAddress, amount);
await transferTx.wait();

// 4. Revoke (선택)
const revokeTx = await tokenContract.approve(spenderAddress, 0);
await revokeTx.wait();
```

---

## ⚠️ 일반적인 에러

```javascript
// insufficient funds - ETH 잔액 부족 (가스비)
// execution reverted - 컨트랙트 실행 실패
// nonce too low - 이미 사용된 nonce
// replacement fee too low - 트랜잭션 교체 실패
// network error - RPC 연결 실패
```

---

## 🌐 네트워크 설정

```javascript
// Mainnet
chainId: 1
rpc: https://eth.public-rpc.com

// Sepolia (테스트넷)
chainId: 11155111
rpc: https://rpc.sepolia.org

// Polygon
chainId: 137
rpc: https://polygon-rpc.com

// Arbitrum
chainId: 42161
rpc: https://arb1.arbitrum.io/rpc

// Optimism
chainId: 10
rpc: https://mainnet.optimism.io
```

---

## 💡 모범 사례

1. **항상 try-catch 사용**
2. **테스트넷에서 먼저 테스트**
3. **개인키는 환경 변수로 관리**
4. **가스 예측 후 여유있게 설정 (1.2배)**
5. **트랜잭션 전 잔액 확인**
6. **Approve는 필요한 만큼만**
7. **사용 후 Allowance 취소**
8. **이벤트로 상태 확인**
9. **에러 처리 철저히**
10. **사용자에게 진행상황 표시**

---

이 치트시트를 저장해두고 필요할 때마다 참고하세요! 🚀
