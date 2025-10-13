/**
 * 예제 3: Transaction - 트랜잭션 보내기
 * 
 * 트랜잭션은 블록체인에 데이터를 "쓰는" 작업입니다.
 * ETH 전송, 컨트랙트 실행 등이 모두 트랜잭션입니다.
 * 
 * 주의: 
 * - 트랜잭션은 가스비(수수료)가 필요합니다
 * - 한번 보내면 되돌릴 수 없습니다
 * - 처음엔 반드시 테스트넷을 사용하세요!
 */

// .env 파일에서 환경 변수 불러오기
require('dotenv').config();


const { ethers } = require('ethers');



// ============================================
// 1. 기본 설정
// ============================================

// 테스트넷 Provider (Sepolia)
// Sepolia는 이더리움 테스트 네트워크입니다 (가짜 돈 사용)
const SEPOLIA_RPC = process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org';
const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);

// .env 파일에서 개인키 가져오기
// ⚠️ Sepolia 테스트 ETH는 faucet에서 무료로 받을 수 있습니다
// https://sepoliafaucet.com/
const PRIVATE_KEY = process.env.PRIVATE_KEY || 'YOUR_PRIVATE_KEY_HERE';

// ============================================
// 2. 트랜잭션의 구조
// ============================================

console.log('트랜잭션의 구조\n');
// https://github.com/ethereum/go-ethereum/blob/master/internal/ethapi/transaction_args.go#L42

const transactionStructure = {
  to: '0x...',           // 받는 사람 주소 (필수)
  value: '0',            // 보낼 ETH 양 (Wei 단위)
  data: '0x',            // 추가 데이터 (컨트랙트 호출시 사용)
  gasLimit: 21000,       // 최대 가스 한도
  gasPrice: '20000000000', // 가스 가격 (Wei 단위)
  nonce: 0,              // 트랜잭션 순서 번호
  chainId: 1,            // 네트워크 ID (1 = 메인넷)
};

console.log('트랜잭션 구조:', transactionStructure);
console.log('');
console.log('주요 필드 설명:');
console.log('- to: 받는 사람 주소');
console.log('- value: 보낼 ETH 양 (wei 단위, 1 ETH = 10^18 wei)');
console.log('- data: 컨트랙트 함수 호출 데이터');
console.log('- gasLimit: 이 트랜잭션이 사용할 최대 가스');
console.log('- gasPrice: 가스 1개당 지불할 가격');
console.log('- nonce: 보내는 사람이 보낸 트랜잭션 개수 (중복 방지용)');
console.log('');

// ============================================
// 3. 간단한 ETH 전송
// ============================================

async function sendEthExample() {
  console.log('ETH 전송 예제\n');

  // 개인키가 설정되지 않았는지 확인
  if (PRIVATE_KEY === 'YOUR_PRIVATE_KEY_HERE') {
    console.log('개인키가 설정되지 않았습니다!');
    console.log('실행하려면:');
    console.log('1. Sepolia 테스트넷 지갑 생성');
    console.log('2. https://sepoliafaucet.com/ 에서 테스트 ETH 받기');
    console.log('3. 개인키를 PRIVATE_KEY 변수에 설정');
    console.log('');
    return;
  }

  try {
    // 지갑 생성 및 Provider 연결
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    console.log('전송 정보:');
    console.log('  - 보내는 주소:', wallet.address);

    // 잔액 확인
    const balance = await provider.getBalance(wallet.address);
    const balanceEth = ethers.formatEther(balance);
    console.log('  - 현재 잔액:', balanceEth, 'ETH');

    if (balance === 0n) {
      console.log('\n잔액이 0입니다!');
      console.log('https://sepoliafaucet.com/ 에서 테스트 ETH를 받으세요');
      return;
    }

    // 트랜잭션 생성
    const tx = {
      to: '0x0000000000000000000000000000000000000000', // 받는 사람 주소
      value: ethers.parseEther('0.0001'), // 0.0001 ETH 전송
    };

    console.log('  - 받는 주소:', tx.to);
    console.log('  - 전송 금액:', '0.001 ETH');
    console.log('');

    // 가스 예측
    const gasEstimate = await wallet.estimateGas(tx);
    console.log('가스 정보:');
    console.log('  - 예상 가스:', gasEstimate.toString());

    const feeData = await provider.getFeeData();
    const gasCost = gasEstimate * feeData.gasPrice;
    const gasCostEth = ethers.formatEther(gasCost);
    console.log('  - 예상 수수료:', gasCostEth, 'ETH');
    console.log('');

    // 트랜잭션 전송
    console.log('트랜잭션 전송 중...');
    const txResponse = await wallet.sendTransaction(tx);
    
    console.log('  - 트랜잭션 해시:', txResponse.hash);
    console.log('  - Nonce:', txResponse.nonce);
    console.log('');

    // 트랜잭션 확인 대기
    console.log('블록에 포함되기를 기다리는 중...');
    const receipt = await txResponse.wait();

    console.log('');
    console.log('트랜잭션 완료!');
    console.log('  - 블록 번호:', receipt.blockNumber);
    console.log('  - 실제 사용된 가스:', receipt.gasUsed.toString());
    console.log('  - 상태:', receipt.status === 1 ? '성공' : '실패');
    console.log('');
    console.log('확인하기:', `https://sepolia.etherscan.io/tx/${receipt.hash}`);

  } catch (error) {
    console.error('에러:', error.message);
  }
}

// ============================================
// 4. 여러 트랜잭션 보내기 (Nonce 관리)
// ============================================

async function multipleTransactionsExample() {
  console.log('여러 트랜잭션 보내기\n');

  if (PRIVATE_KEY === 'YOUR_PRIVATE_KEY_HERE') {
    console.log('개인키가 설정되지 않았습니다!\n');
    return;
  }

  try {
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    // 현재 nonce 가져오기
    let nonce = await wallet.getNonce();
    console.log('현재 Nonce:', nonce);
    console.log('');

    // 3개의 트랜잭션 동시에 보내기
    const transactions = [];

    for (let i = 0; i < 3; i++) {
      const tx = {
        to: '0x0000000000000000000000000000000000000000',
        value: ethers.parseEther('0.00001'),
        nonce: nonce + i, // 각각 다른 nonce 사용
      };

      console.log(`트랜잭션 ${i + 1} 전송 (nonce: ${nonce + i})`);
      const txResponse = await wallet.sendTransaction(tx);
      transactions.push(txResponse);
      console.log('  - 해시:', txResponse.hash);
    }

    console.log('');
    console.log('모든 트랜잭션 확인 대기...');

    // 모든 트랜잭션이 완료될 때까지 대기
    await Promise.all(transactions.map(tx => tx.wait()));

    console.log('모든 트랜잭션 완료!');

  } catch (error) {
    console.error('에러:', error.message);
  }
}

// ============================================
// 5. 트랜잭션 모니터링
// ============================================

async function monitorTransactionExample() {
  console.log('트랜잭션 모니터링\n');

  if (PRIVATE_KEY === 'YOUR_PRIVATE_KEY_HERE') {
    console.log('개인키가 설정되지 않았습니다!\n');
    return;
  }

  try {
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const tx = {
      to: '0x0000000000000000000000000000000000000000',
      value: ethers.parseEther('0.00001'),
    };

    console.log('트랜잭션 전송...');
    const txResponse = await wallet.sendTransaction(tx);
    console.log('트랜잭션 해시:', txResponse.hash);
    console.log('');

    // 1개 블록 확인 대기
    console.log('1개 블록 확인 대기...');
    const receipt1 = await txResponse.wait(1);
    console.log('1개 블록 확인됨 (블록:', receipt1.blockNumber + ')');

    // 3개 블록 확인 대기 (더 안전)
    console.log('3개 블록 확인 대기...');
    const receipt3 = await txResponse.wait(3);
    console.log('3개 블록 확인됨 (블록:', receipt3.blockNumber + ')');

    console.log('');
    console.log('블록 확인 수가 많을수록 더 안전합니다');
    console.log('   - 소액 거래: 1-3개 블록');
    console.log('   - 중요한 거래: 12개 블록 이상 권장');

  } catch (error) {
    console.error('에러:', error.message);
  }
}

// ============================================
// 6. 실전 팁
// ============================================

console.log('트랜잭션 실전 팁\n');

console.log('1. 가스 설정:');
console.log('   - gasLimit: 너무 낮으면 실패, 너무 높으면 남은 가스는 환불됨');
console.log('   - estimateGas()로 미리 예측하는 게 좋습니다');
console.log('   - 예측값 * 1.2 정도로 여유를 두는 것이 안전');
console.log('');

console.log('2. 가스 가격:');
console.log('   - 높을수록 빨리 처리됨');
console.log('   - ethgasstation.info 같은 사이트에서 현재 가격 확인');
console.log('   - getFeeData()로 적정 가격 자동 설정');
console.log('');

console.log('3. Nonce:');
console.log('   - 자동으로 관리되므로 보통 신경 안써도 됨');
console.log('   - 여러 트랜잭션 동시 전송시 수동 관리 필요');
console.log('   - Nonce가 꼬이면 트랜잭션이 pending 상태로 남음');
console.log('');

// ============================================
// 7. 가스 최적화 예제
// ============================================

async function gasOptimizationExample() {
  console.log('가스 최적화 예제\n');

  if (PRIVATE_KEY === 'YOUR_PRIVATE_KEY_HERE') {
    console.log('개인키가 설정되지 않았습니다!\n');
    return;
  }

  try {
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const tx = {
      to: '0x0000000000000000000000000000000000000000',
      value: ethers.parseEther('0.00001'),
    };

    // 1. 가스 예측
    console.log('1. 가스 예측:');
    const gasEstimate = await wallet.estimateGas(tx);
    console.log('   예상 가스:', gasEstimate.toString());

    // 2. 현재 가스 가격 확인
    console.log('');
    console.log('2. 가스 가격 확인:');
    const feeData = await provider.getFeeData();
    console.log('   현재 가스 가격:', ethers.formatUnits(feeData.gasPrice, 'gwei'), 'Gwei');

    // 3. 총 비용 계산
    console.log('');
    console.log('3. 총 비용 계산:');
    const totalCost = gasEstimate * feeData.gasPrice;
    console.log('   예상 수수료:', ethers.formatEther(totalCost), 'ETH');


    console.log('');
    console.log('가스비 절약 팁:');
    console.log('   - 네트워크가 한산할 때 전송 (새벽 시간대)');
    console.log('   - 급하지 않으면 가스 가격을 낮게 설정');
    console.log('   - 여러 작업을 한 번에 묶어서 실행');
    console.log('   - L2 솔루션 사용 (Arbitrum, Optimism 등)');

  } catch (error) {
    console.error('에러:', error.message);
  }
}

// ============================================
// 실행
// ============================================

console.log('\n사용법:');
console.log('1. Sepolia 테스트넷 준비:');
console.log('   - MetaMask 같은 지갑에서 Sepolia 네트워크 추가');
console.log('   - https://sepoliafaucet.com/ 에서 테스트 ETH 받기');
console.log('');
console.log('2. 개인키 설정:');
console.log('   - PRIVATE_KEY 변수에 테스트 지갑 개인키 입력');
console.log('   - 테스트 지갑만 사용하세요!');
console.log('');
console.log('3. 함수 실행:');
console.log('   sendEthExample();');
console.log('   multipleTransactionsExample();');
console.log('   monitorTransactionExample();');
console.log('   gasOptimizationExample();');
console.log('');

// ============================================
// 실행 방법 선택
// ============================================

// 방법 1: 한 번에 하나씩 실행 (추천)
// ⚠️ 한 번에 하나씩만 주석 해제하세요!

//sendEthExample();
//multipleTransactionsExample();
//monitorTransactionExample();
gasOptimizationExample();
