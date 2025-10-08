/**
 * 👛 예제 2: Wallet - 지갑 생성 및 관리
 * 
 * Wallet은 계정을 관리하고 트랜잭션에 서명하는 도구입니다.
 * 신분증이자 도장 같은 역할을 합니다.
 * 
 * ⚠️ 주의: 개인키는 절대 공유하거나 공개하지 마세요!
 */

// .env 파일에서 환경 변수 불러오기
require('dotenv').config();

const { ethers } = require('ethers');

// .env 파일에서 개인키 가져오기
const PRIVATE_KEY = process.env.PRIVATE_KEY || 'YOUR_PRIVATE_KEY_HERE';

// ============================================
// 1. Wallet 생성하기
// ============================================

// console.log('👛 지갑 생성 예제\n');

// ------------------------------
// 방법 1: 새로운 랜덤 지갑 생성
// ------------------------------
// console.log('📝 방법 1: 새 지갑 생성');

// const wallet1 = ethers.Wallet.createRandom();

// console.log('  - 주소:', wallet1.address);
// console.log('  - 개인키:', wallet1.privateKey);
// console.log('  ⚠️ 실제로는 개인키를 절대 출력하면 안됩니다!\n');

// ------------------------------
// 방법 2: 기존 개인키로 지갑 복원
// ------------------------------
console.log('🔑 방법 2: 개인키로 지갑 복원');

const wallet2 = new ethers.Wallet(PRIVATE_KEY);

console.log('  - 주소:', wallet2.address);
console.log('  (개인키가 같으면 항상 같은 주소가 나옵니다)\n');

// ------------------------------
// 방법 3: 니모닉(시드 구문)으로 지갑 생성
// ------------------------------
// console.log('🎯 방법 3: 니모닉으로 지갑 생성');

// // 랜덤 니모닉 생성
// const mnemonic = ethers.Wallet.createRandom().mnemonic;
// console.log('  - 니모닉:', mnemonic.phrase);
// console.log('  (이 12개 단어로 지갑을 복원할 수 있습니다)\n');

// // 니모닉으로 지갑 복원
// const wallet3 = ethers.Wallet.fromPhrase(mnemonic.phrase);
// console.log('  - 복원된 주소:', wallet3.address);
// console.log('');

// ============================================
// 2. Provider와 Wallet 연결
// ============================================

console.log('🔗 Provider와 Wallet 연결\n');

// Provider 생성 (블록체인과 통신) - Sepolia 테스트넷
const provider = new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');

// Wallet을 Provider에 연결 (이제 트랜잭션을 보낼 수 있음!)
const connectedWallet = wallet2.connect(provider);

console.log('  ✅ 지갑이 Provider에 연결되었습니다');
console.log('  이제 이 지갑으로 트랜잭션을 보낼 수 있습니다!\n');

// ============================================
// 3. Wallet으로 할 수 있는 것들
// ============================================

async function walletExamples() {
  console.log('🔧 Wallet 기능 예제\n');

  // Provider에 연결된 지갑 생성 - Sepolia 테스트넷
  const provider = new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
  const wallet = connectedWallet;

  try {
    // ------------------------------
    // 예제 3-1: 지갑 정보 조회
    // ------------------------------
    console.log('📋 지갑 정보:');
    console.log('  - 주소:', wallet.address);
    console.log('  - 개인키:', '(보안상 표시 안함)');
    console.log('');

    // ------------------------------
    // 예제 3-2: 잔액 조회
    // ------------------------------
    console.log('💰 잔액 조회:');
    const balance = await wallet.provider.getBalance(wallet.address);
    const balanceEth = ethers.formatEther(balance);
    console.log('  - 잔액:', balanceEth, 'ETH');
    console.log('  (새로 만든 지갑이라 0 ETH입니다)\n');

    // ------------------------------
    // 예제 3-3: 메시지 서명하기
    // ------------------------------
    console.log('✍️ 메시지 서명:');
    
    const message = 'Hello, Ethereum!';
    const signature = await wallet.signMessage(message);
    
    console.log('  - 원본 메시지:', message);
    console.log('  - 서명:', signature);
    console.log('');

    // ------------------------------
    // 예제 3-4: 서명 검증하기
    // ------------------------------
    console.log('🔍 서명 검증:');
    
    // 서명에서 서명자의 주소를 복원
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    console.log('  - 원본 메시지:', message);
    console.log('  - 서명자 주소:', recoveredAddress);
    console.log('  - 지갑 주소:', wallet.address);
    console.log('  - 일치 여부:', recoveredAddress === wallet.address ? '✅ 일치' : '❌ 불일치');
    console.log('');

    // ------------------------------
    // 예제 3-5: 트랜잭션 서명 (전송은 안함)
    // ------------------------------
    console.log('📝 트랜잭션 서명:');
    
    const tx = {
      to: '0x0000000000000000000000000000000000000000',
      value: ethers.parseEther('0.001'),
      gasLimit: 21000,
    };

    // 트랜잭션 서명만 하고 전송은 안함
    const signedTx = await wallet.signTransaction(tx);
    console.log('  - 서명된 트랜잭션:', signedTx.slice(0, 50) + '...');
    console.log('  (실제로 전송하지는 않았습니다)\n');

  } catch (error) {
    console.error('❌ 에러:', error.message);
  }

  console.log('✅ Wallet 예제 완료!\n');
}

// // ============================================
// // 4. 실전 팁: 환경 변수로 개인키 관리
// // ============================================

// console.log('💡 실전 팁: 개인키 안전하게 관리하기\n');

// console.log('❌ 나쁜 예: 코드에 직접 작성');
// console.log('   const wallet = new ethers.Wallet("0x123...");');
// console.log('   -> Git에 올라가면 해킹당합니다!\n');

// console.log('✅ 좋은 예: 환경 변수 사용');
// console.log('   1. .env 파일 생성:');
// console.log('      PRIVATE_KEY=0x123...');
// console.log('');
// console.log('   2. .gitignore에 추가:');
// console.log('      .env');
// console.log('');
// console.log('   3. 코드에서 사용:');
// console.log('      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);');
// console.log('');


// ============================================
// 실행
// ============================================

// 주석을 해제하고 실행해보세요!
walletExamples();


console.log('💡 사용법:');
console.log('1. 코드를 읽고 주석을 이해하세요');
console.log('2. 맨 아래 주석을 해제하고 실행하세요:');
console.log('   node 02-wallet.js');
console.log('');
console.log('⚠️ 중요: 개인키는 절대 공유하지 마세요!');
console.log('테스트용 지갑만 사용하고, 메인넷에서는 극도로 조심하세요!\n');
