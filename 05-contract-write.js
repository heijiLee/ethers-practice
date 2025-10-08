/**
 * ✍️ 예제 5: Contract Write - 스마트 컨트랙트 쓰기
 * 
 * 컨트랙트에 데이터를 쓰는 작업입니다.
 * 토큰 전송, NFT 민팅, DEX 거래 등이 모두 여기에 해당합니다.
 * 
 * ⚠️ 주의:
 * - 가스비가 필요합니다
 * - Wallet (개인키)이 필요합니다
 * - 되돌릴 수 없으니 테스트넷에서 먼저 연습하세요!
 */

// .env 파일에서 환경 변수 불러오기
require('dotenv').config();

const { ethers } = require('ethers');

// ============================================
// 1. 기본 설정
// ============================================

// 테스트넷 Provider (Sepolia)
const SEPOLIA_RPC = process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org';
const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);

// .env 파일에서 개인키 가져오기
const PRIVATE_KEY = process.env.PRIVATE_KEY || 'YOUR_PRIVATE_KEY_HERE';

// ERC-20 ABI (전송에 필요한 함수들)
const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
];

// ============================================
// 2. 읽기 vs 쓰기 비교
// ============================================

console.log('📚 읽기 vs 쓰기 비교\n');

console.log('읽기 (view/pure 함수):');
console.log('  ✅ 무료 (가스비 없음)');
console.log('  ✅ 즉시 결과 반환');
console.log('  ✅ Provider만 필요');
console.log('  예: balanceOf(), name(), symbol()');
console.log('');

console.log('쓰기 (상태 변경 함수):');
console.log('  ⚠️ 가스비 필요');
console.log('  ⚠️ 트랜잭션 확인 대기');
console.log('  ⚠️ Wallet (개인키) 필요');
console.log('  예: transfer(), approve(), mint()');
console.log('');

// ============================================
// 3. ERC-20 토큰 전송 예제
// ============================================

async function transferTokenExample() {
  console.log('💸 ERC-20 토큰 전송 예제\n');

  if (PRIVATE_KEY === 'YOUR_PRIVATE_KEY_HERE') {
    console.log('❌ 개인키가 설정되지 않았습니다!');
    console.log('💡 실행하려면:');
    console.log('1. Sepolia 테스트넷 지갑 준비');
    console.log('2. 테스트 토큰 받기 (Faucet 사용)');
    console.log('3. PRIVATE_KEY 변수에 개인키 설정\n');
    return;
  }

  try {
    // Wallet 생성 및 Provider 연결
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log('👛 지갑 주소:', wallet.address);
    console.log('');

    // 토큰 컨트랙트 주소 (예: Sepolia 테스트 USDC)
    // 실제로는 Sepolia에 배포된 ERC-20 토큰 주소를 사용하세요
    const TOKEN_ADDRESS = '0x...'; // 실제 토큰 주소로 교체

    // Wallet과 연결된 컨트랙트 생성 (쓰기 가능)
    const tokenContract = new ethers.Contract(
      TOKEN_ADDRESS,
      ERC20_ABI,
      wallet  // ⭐ Provider 대신 Wallet 사용!
    );

    // ------------------------------
    // 단계 1: 현재 잔액 확인
    // ------------------------------
    console.log('1️⃣ 현재 잔액 확인:');
    
    const balance = await tokenContract.balanceOf(wallet.address);
    const decimals = await tokenContract.decimals();
    const symbol = await tokenContract.symbol();
    const balanceFormatted = ethers.formatUnits(balance, decimals);
    
    console.log(`  - 잔액: ${balanceFormatted} ${symbol}`);
    console.log('');

    if (balance === 0n) {
      console.log('❌ 토큰이 없습니다!');
      console.log('💡 테스트 토큰을 먼저 받으세요\n');
      return;
    }

    // ------------------------------
    // 단계 2: 전송할 금액 설정
    // ------------------------------
    console.log('2️⃣ 전송 준비:');
    
    const recipientAddress = '0x0000000000000000000000000000000000000000'; // 받는 사람
    const amountToSend = ethers.parseUnits('10', decimals); // 10 토큰
    
    console.log(`  - 받는 주소: ${recipientAddress}`);
    console.log(`  - 전송 금액: 10 ${symbol}`);
    console.log('');

    // ------------------------------
    // 단계 3: 가스 예측
    // ------------------------------
    console.log('3️⃣ 가스 예측:');
    
    const gasEstimate = await tokenContract.transfer.estimateGas(
      recipientAddress,
      amountToSend
    );
    
    console.log(`  - 예상 가스: ${gasEstimate.toString()}`);
    
    const feeData = await provider.getFeeData();
    const gasCost = gasEstimate * feeData.gasPrice;
    console.log(`  - 예상 수수료: ${ethers.formatEther(gasCost)} ETH`);
    console.log('');

    // ------------------------------
    // 단계 4: 트랜잭션 전송
    // ------------------------------
    console.log('4️⃣ 트랜잭션 전송:');
    console.log('  📤 전송 중...');
    
    // transfer 함수 호출
    const tx = await tokenContract.transfer(recipientAddress, amountToSend);
    
    console.log(`  - 트랜잭션 해시: ${tx.hash}`);
    console.log('');

    // ------------------------------
    // 단계 5: 확인 대기
    // ------------------------------
    console.log('5️⃣ 확인 대기:');
    console.log('  ⏳ 블록에 포함되기를 기다리는 중...');
    
    const receipt = await tx.wait();
    
    console.log(`  ✅ 확인 완료!`);
    console.log(`  - 블록 번호: ${receipt.blockNumber}`);
    console.log(`  - 가스 사용: ${receipt.gasUsed.toString()}`);
    console.log(`  - 상태: ${receipt.status === 1 ? '성공' : '실패'}`);
    console.log('');

    // ------------------------------
    // 단계 6: 이벤트 확인
    // ------------------------------
    console.log('6️⃣ 이벤트 확인:');
    
    // Transfer 이벤트 파싱
    const transferEvent = receipt.logs
      .map(log => {
        try {
          return tokenContract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .filter(event => event && event.name === 'Transfer')[0];

    if (transferEvent) {
      console.log(`  - From: ${transferEvent.args.from}`);
      console.log(`  - To: ${transferEvent.args.to}`);
      console.log(`  - Amount: ${ethers.formatUnits(transferEvent.args.value, decimals)} ${symbol}`);
    }
    console.log('');

    console.log(`🔗 Etherscan: https://sepolia.etherscan.io/tx/${receipt.hash}`);

  } catch (error) {
    console.error('❌ 에러:', error.message);
    
    // 일반적인 에러 원인
    if (error.message.includes('insufficient funds')) {
      console.log('💡 원인: ETH 잔액 부족 (가스비용)');
    } else if (error.message.includes('execution reverted')) {
      console.log('💡 원인: 컨트랙트 실행 실패 (잔액 부족, 권한 없음 등)');
    }
  }
}

// ============================================
// 4. Approve & TransferFrom 패턴
// ============================================

async function approveAndTransferFromExample() {
  console.log('🔐 Approve & TransferFrom 패턴\n');

  console.log('이 패턴은 DEX(탈중앙화 거래소)에서 자주 사용됩니다:');
  console.log('1. approve(): 다른 주소에게 토큰 사용 권한 부여');
  console.log('2. transferFrom(): 권한 받은 주소가 토큰 전송');
  console.log('');

  console.log('예시: Uniswap에서 토큰 교환');
  console.log('1. 사용자가 Uniswap에 토큰 사용 권한 부여 (approve)');
  console.log('2. Uniswap이 사용자 토큰을 가져감 (transferFrom)');
  console.log('3. Uniswap이 다른 토큰을 사용자에게 전송');
  console.log('');

  if (PRIVATE_KEY === 'YOUR_PRIVATE_KEY_HERE') {
    console.log('❌ 개인키가 설정되지 않았습니다!\n');
    return;
  }

  try {
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const TOKEN_ADDRESS = '0x...'; // 실제 토큰 주소
    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, wallet);

    // ------------------------------
    // 단계 1: Approve (권한 부여)
    // ------------------------------
    console.log('1️⃣ Approve - 권한 부여:');
    
    const spenderAddress = '0x...'; // 권한을 받을 주소 (예: Uniswap Router)
    const approveAmount = ethers.parseUnits('100', 18); // 100 토큰
    
    console.log(`  - Spender: ${spenderAddress}`);
    console.log(`  - Amount: 100 토큰`);
    console.log('  📤 Approve 트랜잭션 전송 중...');
    
    const approveTx = await tokenContract.approve(spenderAddress, approveAmount);
    await approveTx.wait();
    
    console.log('  ✅ Approve 완료!');
    console.log('');

    // ------------------------------
    // 단계 2: Allowance 확인
    // ------------------------------
    console.log('2️⃣ Allowance 확인:');
    
    const allowance = await tokenContract.allowance(wallet.address, spenderAddress);
    console.log(`  - 허용된 금액: ${ethers.formatUnits(allowance, 18)} 토큰`);
    console.log('');

    // ------------------------------
    // 단계 3: 권한 취소 (선택)
    // ------------------------------
    console.log('3️⃣ Approve 취소 (보안):');
    console.log('  사용 후에는 권한을 0으로 재설정하는 것이 안전합니다');
    
    const revokeTx = await tokenContract.approve(spenderAddress, 0);
    await revokeTx.wait();
    
    console.log('  ✅ 권한 취소 완료!');
    console.log('');

  } catch (error) {
    console.error('❌ 에러:', error.message);
  }
}

// ============================================
// 5. 가스 최적화 - 트랜잭션 설정 커스터마이즈
// ============================================

async function customGasExample() {
  console.log('⛽ 가스 설정 커스터마이즈\n');

  if (PRIVATE_KEY === 'YOUR_PRIVATE_KEY_HERE') {
    console.log('❌ 개인키가 설정되지 않았습니다!\n');
    return;
  }

  try {
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const TOKEN_ADDRESS = '0x...';
    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, wallet);

    const recipientAddress = '0x...';
    const amount = ethers.parseUnits('10', 18);

    // ------------------------------
    // 방법 1: 자동 가스 설정 (기본)
    // ------------------------------
    console.log('1️⃣ 자동 가스 설정:');
    const tx1 = await tokenContract.transfer(recipientAddress, amount);
    console.log('  ✅ 자동으로 최적의 가스 설정');
    console.log('');

    // ------------------------------
    // 방법 2: 수동 가스 설정
    // ------------------------------
    console.log('2️⃣ 수동 가스 설정:');
    
    // 현재 가스 가격 조회
    const feeData = await provider.getFeeData();
    
    const tx2 = await tokenContract.transfer(recipientAddress, amount, {
      gasLimit: 100000,  // 가스 한도
      gasPrice: feeData.gasPrice,  // 가스 가격
    });
    
    console.log('  ✅ 수동으로 가스 설정');
    console.log(`  - Gas Limit: 100000`);
    console.log(`  - Gas Price: ${ethers.formatUnits(feeData.gasPrice, 'gwei')} Gwei`);
    console.log('');

    // ------------------------------
    // 방법 3: EIP-1559 가스 설정 (추천)
    // ------------------------------
    console.log('3️⃣ EIP-1559 가스 설정 (추천):');
    
    const tx3 = await tokenContract.transfer(recipientAddress, amount, {
      gasLimit: 100000,
      maxFeePerGas: feeData.maxFeePerGas,  // 최대 가스 가격
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,  // 팁
    });
    
    console.log('  ✅ EIP-1559 가스 설정');
    console.log(`  - Max Fee: ${ethers.formatUnits(feeData.maxFeePerGas, 'gwei')} Gwei`);
    console.log(`  - Priority Fee: ${ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei')} Gwei`);
    console.log('');

  } catch (error) {
    console.error('❌ 에러:', error.message);
  }
}

// ============================================
// 6. 이벤트 리스닝 (실시간 모니터링)
// ============================================

async function eventListeningExample() {
  console.log('👂 이벤트 리스닝 예제\n');

  const TOKEN_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // USDC
  const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider);

  console.log('🎧 Transfer 이벤트를 실시간으로 모니터링합니다...');
  console.log('(Ctrl+C로 중단)\n');

  try {
    // Transfer 이벤트 리스너 등록
    tokenContract.on('Transfer', (from, to, amount, event) => {
      console.log('📬 새 Transfer 감지!');
      console.log(`  From: ${from}`);
      console.log(`  To: ${to}`);
      console.log(`  Amount: ${ethers.formatUnits(amount, 6)} USDC`);
      console.log(`  Block: ${event.log.blockNumber}`);
      console.log(`  TX: ${event.log.transactionHash}`);
      console.log('');
    });

    // 10초 후 리스너 제거 (예제용)
    setTimeout(() => {
      tokenContract.removeAllListeners('Transfer');
      console.log('✅ 리스닝 중단');
    }, 10000);

  } catch (error) {
    console.error('❌ 에러:', error.message);
  }
}

// ============================================
// 7. 과거 이벤트 조회
// ============================================

async function queryPastEventsExample() {
  console.log('📜 과거 이벤트 조회 예제\n');

  const TOKEN_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // USDC
  const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider);

  try {
    console.log('🔍 최근 10개 블록의 Transfer 이벤트 조회...\n');

    const currentBlock = await provider.getBlockNumber();
    const fromBlock = currentBlock - 10;
    const toBlock = currentBlock;

    // Transfer 이벤트 필터 생성
    const filter = tokenContract.filters.Transfer();

    // 이벤트 조회
    const events = await tokenContract.queryFilter(filter, fromBlock, toBlock);

    console.log(`📊 총 ${events.length}개의 Transfer 이벤트 발견\n`);

    // 처음 5개만 출력
    events.slice(0, 5).forEach((event, index) => {
      console.log(`${index + 1}. Transfer:`);
      console.log(`   From: ${event.args.from}`);
      console.log(`   To: ${event.args.to}`);
      console.log(`   Amount: ${ethers.formatUnits(event.args.value, 6)} USDC`);
      console.log(`   Block: ${event.blockNumber}`);
      console.log(`   TX: ${event.transactionHash}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ 에러:', error.message);
  }
}

// ============================================
// 8. 실전 팁
// ============================================

console.log('💡 컨트랙트 쓰기 실전 팁\n');

console.log('1. 가스 관리:');
console.log('   - estimateGas()로 미리 예측');
console.log('   - 예측값 * 1.2 정도로 여유 두기');
console.log('   - 급하지 않으면 가스 가격 낮추기');
console.log('');

console.log('2. 에러 처리:');
console.log('   - try-catch 필수');
console.log('   - 트랜잭션 실패 원인 로깅');
console.log('   - 사용자에게 친절한 에러 메시지');
console.log('');

console.log('3. 보안:');
console.log('   - approve는 필요한 만큼만');
console.log('   - 사용 후 allowance 0으로 리셋');
console.log('   - 트랜잭션 전 시뮬레이션 (Tenderly 등)');
console.log('');

console.log('4. UX 개선:');
console.log('   - 트랜잭션 상태 실시간 표시');
console.log('   - Etherscan 링크 제공');
console.log('   - 가스비 미리 표시');
console.log('   - 에러시 재시도 옵션');
console.log('');

// ============================================
// 실행
// ============================================

console.log('\n💡 사용법:');
console.log('1. Sepolia 테스트넷 준비:');
console.log('   - 테스트 지갑 생성');
console.log('   - Faucet에서 ETH 받기');
console.log('   - 테스트 토큰 받기 (있다면)');
console.log('');
console.log('2. 개인키 설정:');
console.log('   - PRIVATE_KEY 변수에 입력');
console.log('   - ⚠️ 테스트 지갑만 사용!');
console.log('');
console.log('3. 함수 실행:');
console.log('   transferTokenExample();');
console.log('   approveAndTransferFromExample();');
console.log('   customGasExample();');
console.log('   eventListeningExample();');
console.log('   queryPastEventsExample();');
console.log('');

// 주석 해제하고 실행:
// transferTokenExample();
// approveAndTransferFromExample();
// customGasExample();
// eventListeningExample();
// queryPastEventsExample();

console.log('🎉 모든 예제를 완료했습니다!');
console.log('이제 실전 프로젝트를 만들어보세요!\n');
