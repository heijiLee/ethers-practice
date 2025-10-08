# 연습 문제 💪

이론을 배웠으니 이제 직접 코드를 작성해보세요!
각 문제는 난이도별로 구성되어 있습니다.

---

## 🟢 초급 문제

### 문제 1: 여러 주소의 ETH 잔액 조회하기

다음 주소들의 ETH 잔액을 조회하고 출력하세요:
- `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045` (Vitalik)
- `0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B` (Vitalik 2)
- `0x00000000219ab540356cBB839Cbe05303d7705Fa` (ETH 2.0 Deposit)

<details>
<summary>💡 힌트</summary>

```javascript
const provider = new ethers.JsonRpcProvider('https://eth.public-rpc.com');
const balance = await provider.getBalance(address);
const balanceEth = ethers.formatEther(balance);
```
</details>

---

### 문제 2: 현재 가스 가격 모니터링

5초마다 현재 가스 가격을 조회하고, Gwei 단위로 출력하세요.
10번 조회 후 종료하세요.

<details>
<summary>💡 힌트</summary>

```javascript
setInterval(async () => {
  const feeData = await provider.getFeeData();
  const gasPriceGwei = ethers.formatUnits(feeData.gasPrice, 'gwei');
  console.log(`Current Gas: ${gasPriceGwei} Gwei`);
}, 5000);
```
</details>

---

### 문제 3: 랜덤 지갑 3개 생성하기

랜덤 지갑 3개를 생성하고, 각각의 주소와 개인키를 출력하세요.
(⚠️ 실제로는 개인키를 출력하면 안됩니다!)

<details>
<summary>💡 힌트</summary>

```javascript
const wallet = ethers.Wallet.createRandom();
console.log('Address:', wallet.address);
console.log('Private Key:', wallet.privateKey);
```
</details>

---

## 🟡 중급 문제

### 문제 4: 특정 블록의 모든 트랜잭션 조회

최신 블록의 모든 트랜잭션을 조회하고, 다음 정보를 출력하세요:
- 총 트랜잭션 개수
- 각 트랜잭션의 from, to, value

<details>
<summary>💡 힌트</summary>

```javascript
const blockNumber = await provider.getBlockNumber();
const block = await provider.getBlock(blockNumber, true); // true = 트랜잭션 포함
console.log('Total TXs:', block.transactions.length);

for (const tx of block.transactions) {
  console.log(`${tx.from} -> ${tx.to}: ${ethers.formatEther(tx.value)} ETH`);
}
```
</details>

---

### 문제 5: USDC 토큰의 상위 3개 홀더 잔액 조회

다음 USDC 상위 홀더들의 잔액을 조회하세요:
- `0x0A59649758aa4d66E25f08Dd01271e891fe52199` (Maker)
- `0x5754284f345afc66a98fbB0a0Afe71e0F007B949` (Compound)
- `0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503` (Binance)

USDC 주소: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`

<details>
<summary>💡 힌트</summary>

```javascript
const USDC_ABI = ['function balanceOf(address) view returns (uint256)'];
const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider);

const balance = await usdcContract.balanceOf(holderAddress);
const balanceFormatted = ethers.formatUnits(balance, 6); // USDC는 6 decimals
```
</details>

---

### 문제 6: 메시지 서명 및 검증 시스템

사용자가 입력한 메시지를 서명하고, 서명을 검증하는 함수를 작성하세요.

요구사항:
- `signMessage(message, privateKey)` 함수
- `verifySignature(message, signature)` 함수
- 검증 결과를 boolean으로 반환

<details>
<summary>💡 힌트</summary>

```javascript
async function signMessage(message, privateKey) {
  const wallet = new ethers.Wallet(privateKey);
  return await wallet.signMessage(message);
}

function verifySignature(message, signature, expectedAddress) {
  const recoveredAddress = ethers.verifyMessage(message, signature);
  return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
}
```
</details>

---

## 🔴 고급 문제

### 문제 7: 토큰 전송 비용 계산기

사용자가 ERC-20 토큰을 전송할 때 필요한 총 비용(가스비)을 계산하는 함수를 작성하세요.

입력:
- 토큰 컨트랙트 주소
- 받는 주소
- 전송할 토큰 양

출력:
- 예상 가스 양
- 가스비 (ETH)
- 가스비 (USD, 1 ETH = $3000 가정)

<details>
<summary>💡 힌트</summary>

```javascript
async function calculateTransferCost(tokenAddress, to, amount, wallet) {
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
  
  const gasEstimate = await contract.transfer.estimateGas(to, amount);
  const feeData = await provider.getFeeData();
  const gasCost = gasEstimate * feeData.gasPrice;
  const gasCostEth = ethers.formatEther(gasCost);
  const gasCostUsd = parseFloat(gasCostEth) * 3000;
  
  return { gasEstimate, gasCostEth, gasCostUsd };
}
```
</details>

---

### 문제 8: 이벤트 히스토리 분석기

특정 토큰의 Transfer 이벤트를 분석하는 함수를 작성하세요.

입력:
- 토큰 주소
- 시작 블록
- 끝 블록

출력:
- 총 전송 횟수
- 전송된 총 금액
- 가장 많이 전송한 주소 (Top 3)

<details>
<summary>💡 힌트</summary>

```javascript
async function analyzeTransferEvents(tokenAddress, fromBlock, toBlock) {
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const filter = contract.filters.Transfer();
  const events = await contract.queryFilter(filter, fromBlock, toBlock);
  
  let totalAmount = 0n;
  const senderCounts = {};
  
  for (const event of events) {
    totalAmount += event.args.value;
    
    const sender = event.args.from;
    senderCounts[sender] = (senderCounts[sender] || 0) + 1;
  }
  
  // 상위 3명 찾기
  const topSenders = Object.entries(senderCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  return {
    totalTransfers: events.length,
    totalAmount: ethers.formatUnits(totalAmount, decimals),
    topSenders
  };
}
```
</details>

---

### 문제 9: Multi-Token 포트폴리오 트래커

여러 지갑의 여러 토큰 잔액을 추적하는 시스템을 만드세요.

요구사항:
- 여러 지갑 주소 지원
- 여러 토큰 지원
- 각 지갑의 총 가치 계산 (USD)
- 결과를 JSON으로 저장

토큰 가격 (가정):
- ETH: $3000
- USDC: $1
- DAI: $1

<details>
<summary>💡 힌트</summary>

```javascript
const portfolios = [];

for (const wallet of wallets) {
  const portfolio = { address: wallet, tokens: [] };
  
  // ETH
  const ethBalance = await provider.getBalance(wallet);
  const ethValue = parseFloat(ethers.formatEther(ethBalance)) * 3000;
  portfolio.tokens.push({ symbol: 'ETH', balance: ethers.formatEther(ethBalance), value: ethValue });
  
  // 각 토큰
  for (const token of tokens) {
    const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
    const balance = await contract.balanceOf(wallet);
    const balanceFormatted = ethers.formatUnits(balance, token.decimals);
    const value = parseFloat(balanceFormatted) * token.price;
    
    portfolio.tokens.push({
      symbol: token.symbol,
      balance: balanceFormatted,
      value
    });
  }
  
  portfolio.totalValue = portfolio.tokens.reduce((sum, t) => sum + t.value, 0);
  portfolios.push(portfolio);
}

// JSON 저장
const fs = require('fs');
fs.writeFileSync('portfolios.json', JSON.stringify(portfolios, null, 2));
```
</details>

---

### 문제 10: 실시간 DEX 가격 모니터 (최고난이도)

Uniswap V2의 ETH-USDC 페어를 모니터링하고 가격 변동을 추적하세요.

요구사항:
- Sync 이벤트 리스닝
- 실시간 가격 계산
- 5% 이상 가격 변동시 알림
- 가격 히스토리 저장

<details>
<summary>💡 힌트</summary>

```javascript
const PAIR_ADDRESS = '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc'; // ETH-USDC
const PAIR_ABI = [
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'event Sync(uint112 reserve0, uint112 reserve1)'
];

const pairContract = new ethers.Contract(PAIR_ADDRESS, PAIR_ABI, provider);

let lastPrice = null;
const priceHistory = [];

// 초기 가격
const reserves = await pairContract.getReserves();
const price = calculatePrice(reserves.reserve0, reserves.reserve1);
lastPrice = price;

// 이벤트 리스닝
pairContract.on('Sync', (reserve0, reserve1) => {
  const newPrice = calculatePrice(reserve0, reserve1);
  const priceChange = ((newPrice - lastPrice) / lastPrice) * 100;
  
  console.log(`Price: $${newPrice.toFixed(2)} (${priceChange > 0 ? '+' : ''}${priceChange.toFixed(2)}%)`);
  
  if (Math.abs(priceChange) >= 5) {
    console.log('🚨 ALERT: Price moved more than 5%!');
  }
  
  priceHistory.push({ timestamp: Date.now(), price: newPrice });
  lastPrice = newPrice;
});

function calculatePrice(reserve0, reserve1) {
  // ETH (18 decimals) / USDC (6 decimals)
  const ethReserve = parseFloat(ethers.formatEther(reserve0));
  const usdcReserve = parseFloat(ethers.formatUnits(reserve1, 6));
  return usdcReserve / ethReserve;
}
```
</details>

---

## 🎯 프로젝트 아이디어

연습 문제를 다 풀었다면, 다음 프로젝트를 만들어보세요:

### 1. 지갑 대시보드
- 여러 지갑의 잔액 표시
- 토큰 리스트
- 트랜잭션 히스토리
- 가격 차트

### 2. 토큰 스캐너
- 새로운 토큰 자동 감지
- 유동성 분석
- 홀더 분석
- 리스크 점수

### 3. 가스 가격 알림 봇
- 가스 가격 실시간 모니터링
- 특정 가격 이하일 때 알림
- 역사적 가격 분석
- 최적 전송 시간 추천

### 4. NFT 트래커
- NFT 컬렉션 모니터링
- 거래 이벤트 추적
- 바닥 가격 알림
- 레어도 분석

### 5. DeFi 수익률 계산기
- 다양한 프로토콜 APY 비교
- 수수료 계산
- 임파먼트 로스 시뮬레이션
- 최적 전략 추천

---

## 💡 학습 팁

1. **직접 타이핑**: 복사-붙여넣기 대신 직접 타이핑하세요
2. **에러 분석**: 에러가 나면 왜 그런지 이해하세요
3. **코드 변경**: 예제 코드를 변경해서 실험하세요
4. **문서 읽기**: ethers.js 공식 문서도 읽어보세요
5. **실전 적용**: 작은 프로젝트부터 시작하세요

---

## 📚 추가 학습 자료

- [Ethers.js 공식 문서](https://docs.ethers.org/)
- [Ethereum.org 개발자 가이드](https://ethereum.org/developers)
- [OpenZeppelin 컨트랙트](https://docs.openzeppelin.com/)
- [Solidity 문서](https://docs.soliditylang.org/)

---

문제를 풀면서 막히면 `CHEATSHEET.md`를 참고하세요!
화이팅! 🚀
