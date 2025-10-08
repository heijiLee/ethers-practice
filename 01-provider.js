/**
 * 📖 예제 1: Provider - 블록체인 읽기
 * 
 * Provider는 블록체인과 연결하는 "읽기 전용" 도구입니다.
 * 마치 도서관에서 책을 읽는 것처럼, 정보를 조회만 할 수 있습니다.
 */

const { ethers } = require('ethers');

// ============================================
// 1. Provider 생성하기
// ============================================

/**
 * Provider를 만드는 3가지 방법
 */

// 방법 1: 공개 RPC 사용 (무료, 속도 느릴 수 있음)
const provider1 = new ethers.JsonRpcProvider('https://eth.public-rpc.com');

// 방법 2: Infura 사용 (추천! 무료 tier 있음)
// Infura에서 API Key 받기: https://infura.io/
const INFURA_API_KEY = 'd0839b45069947678365b64ddf9d12cc'; // 실제 키로 교체하세요
const provider2 = new ethers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${INFURA_API_KEY}`
);

// 방법 3: Alchemy 사용 (역시 추천!)
// Alchemy에서 API Key 받기: https://www.alchemy.com/
const ALCHEMY_API_KEY = 'YOUR_ALCHEMY_API_KEY'; // 실제 키로 교체하세요
const provider3 = new ethers.JsonRpcProvider(
  `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
);

// 방법 4: 브라우저의 MetaMask 연결 (브라우저 환경에서만)
// const provider4 = new ethers.BrowserProvider(window.ethereum);

// 이 예제에서는 provider1 사용
const provider = provider2;

// ============================================
// 2. Provider로 할 수 있는 것들
// ============================================

async function providerExamples() {
  console.log('🔗 Provider 예제 시작!\n');

  try {
    // ------------------------------
    // 예제 2-1: 네트워크 정보 확인
    // ------------------------------
    console.log('📡 네트워크 정보:');
    const network = await provider.getNetwork();
    console.log('  - 체인 ID:', network.chainId.toString());
    console.log('  - 네트워크 이름:', network.name);
    console.log('');

    // ------------------------------
    // 예제 2-2: 최신 블록 번호 조회
    // ------------------------------
    console.log('🧱 블록 정보:');
    const blockNumber = await provider.getBlockNumber();
    console.log('  - 현재 블록:', blockNumber);
    console.log('');

    // ------------------------------
    // 예제 2-3: 특정 주소의 ETH 잔액 조회
    // ------------------------------
    console.log('💰 잔액 조회:');
    
    // Vitalik Buterin의 유명한 주소로 테스트
    const vitalikAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
    
    // Wei 단위로 잔액 가져오기 (1 ETH = 10^18 Wei)
    const balanceWei = await provider.getBalance(vitalikAddress);
    
    // ETH 단위로 변환 (사람이 읽기 쉽게)
    const balanceEth = ethers.formatEther(balanceWei);
    
    console.log('  - 주소:', vitalikAddress);
    console.log('  - 잔액 (Wei):', balanceWei.toString());
    console.log('  - 잔액 (ETH):', balanceEth);
    console.log('');

    // ------------------------------
    // 예제 2-4: 특정 블록의 상세 정보 조회
    // ------------------------------
    console.log('🔍 블록 상세 정보:');
    const block = await provider.getBlock(blockNumber);
    console.log('  - 블록 번호:', block.number);
    console.log('  - 타임스탬프:', new Date(block.timestamp * 1000).toLocaleString());
    console.log('  - 트랜잭션 개수:', block.transactions.length);
    console.log('  - 채굴자:', block.miner);
    console.log('');

    // ------------------------------
    // 예제 2-5: 가스 가격 조회 (현재 수수료)
    // ------------------------------
    console.log('⛽ 가스 정보:');
    const feeData = await provider.getFeeData();
    
    // 가스 가격을 Gwei로 변환 (1 Gwei = 10^9 Wei)
    const gasPriceGwei = ethers.formatUnits(feeData.gasPrice, 'gwei');
    
    console.log('  - 현재 가스 가격:', gasPriceGwei, 'Gwei');
    
    // EIP-1559 정보 (이더리움 업그레이드 후)
    if (feeData.maxFeePerGas) {
      console.log('  - Max Fee:', ethers.formatUnits(feeData.maxFeePerGas, 'gwei'), 'Gwei');
      console.log('  - Priority Fee:', ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei'), 'Gwei');
    }
    console.log('');

    // ------------------------------
    // 예제 2-6: 트랜잭션 조회
    // ------------------------------
    console.log('📜 트랜잭션 조회:');
    
    // 유명한 트랜잭션 해시 예제
    const txHash = '0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060';
    
    try {
      const tx = await provider.getTransaction(txHash);
      if (tx) {
        console.log('  - From:', tx.from);
        console.log('  - To:', tx.to);
        console.log('  - Value:', ethers.formatEther(tx.value), 'ETH');
        console.log('  - Block:', tx.blockNumber);
      }
    } catch (error) {
      console.log('  (오래된 트랜잭션이라 조회가 안될 수 있습니다)');
    }
    console.log('');

    // ------------------------------
    // 예제 2-7: ENS 이름 해석 (Ethereum Name Service)
    // ------------------------------
    console.log('🏷️ ENS 이름 해석:');
    
    try {
      // 'vitalik.eth'를 실제 주소로 변환
      const ensAddress = await provider.resolveName('vitalik.eth');
      console.log('  - vitalik.eth의 주소:', ensAddress);
      
      // 반대로 주소를 ENS 이름으로 변환
      const ensName = await provider.lookupAddress(ensAddress);
      console.log('  - 주소의 ENS 이름:', ensName);
    } catch (error) {
      console.log('  (ENS 조회 실패 - RPC 서버가 ENS를 지원하지 않을 수 있습니다)');
    }
    console.log('');

  } catch (error) {
    console.error('❌ 에러 발생:', error.message);
    console.log('\n💡 팁: 공개 RPC는 불안정할 수 있습니다. Infura나 Alchemy API Key를 사용해보세요!');
  }

  console.log('✅ Provider 예제 완료!\n');
  console.log('다음 단계: 02-wallet.js를 실행해보세요.');
}

// ============================================
// 3. 유용한 단위 변환 함수들
// ============================================

function unitConversionExamples() {
  console.log('\n📏 단위 변환 예제:\n');

  // Wei -> ETH
  const weiAmount = '1000000000000000000'; // 1 ETH in Wei
  const ethAmount = ethers.formatEther(weiAmount);
  console.log('Wei to ETH:', weiAmount, 'Wei =', ethAmount, 'ETH');

  // ETH -> Wei
  const ethToWei = ethers.parseEther('1.5');
  console.log('ETH to Wei:', '1.5 ETH =', ethToWei.toString(), 'Wei');

  // Gwei 변환 (가스 가격에 자주 사용)
  const gwei = ethers.formatUnits('50000000000', 'gwei');
  console.log('Wei to Gwei:', '50000000000 Wei =', gwei, 'Gwei');

  const gweiToWei = ethers.parseUnits('50', 'gwei');
  console.log('Gwei to Wei:', '50 Gwei =', gweiToWei.toString(), 'Wei');

  console.log('');
}

// ============================================
// 실행
// ============================================

// 주석을 해제하고 실행해보세요!
providerExamples();
unitConversionExamples();

console.log('💡 사용법:');
console.log('1. 코드를 읽고 주석을 이해하세요');
console.log('2. 맨 아래 주석을 해제하고 실행하세요:');
console.log('   node 01-provider.js');
console.log('3. Infura나 Alchemy API Key를 받아서 교체하면 더 안정적입니다\n');
