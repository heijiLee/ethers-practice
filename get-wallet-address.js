/**
 * 🔑 지갑 주소 계산 유틸리티
 * 
 * .env 파일의 PRIVATE_KEY에서 WALLET_ADDRESS를 자동으로 계산합니다.
 * 
 * 사용법:
 * node get-wallet-address.js
 */

require('dotenv').config();
const { ethers } = require('ethers');

console.log('🔑 지갑 주소 계산 유틸리티\n');

// .env에서 개인키 가져오기
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY || PRIVATE_KEY === 'YOUR_PRIVATE_KEY_HERE' || PRIVATE_KEY === '0x여기에_개인키_입력') {
  console.log('❌ .env 파일에 PRIVATE_KEY가 설정되지 않았습니다!');
  console.log('');
  console.log('📝 설정 방법:');
  console.log('1. .env 파일 열기');
  console.log('2. PRIVATE_KEY=0x여기에_개인키_입력');
  console.log('3. 실제 개인키로 교체');
  console.log('');
  console.log('💡 MetaMask에서 개인키 가져오기:');
  console.log('   계정 메뉴 → 계정 세부정보 → 개인 키 내보내기');
  console.log('');
  process.exit(1);
}

try {
  // 개인키로 지갑 생성
  const wallet = new ethers.Wallet(PRIVATE_KEY);
  
  console.log('✅ 계산 완료!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 지갑 정보:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('지갑 주소:');
  console.log(wallet.address);
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('📝 .env 파일에 추가하세요:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log(`WALLET_ADDRESS=${wallet.address}`);
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  
  // .env 파일의 현재 WALLET_ADDRESS 확인
  const currentWalletAddress = process.env.WALLET_ADDRESS;
  
  if (currentWalletAddress && currentWalletAddress !== '0x여기에_지갑_주소_입력') {
    console.log('🔍 .env 파일의 WALLET_ADDRESS:');
    console.log(currentWalletAddress);
    console.log('');
    
    if (currentWalletAddress.toLowerCase() === wallet.address.toLowerCase()) {
      console.log('✅ 일치합니다! 올바르게 설정되어 있습니다.');
    } else {
      console.log('⚠️ 불일치합니다! .env 파일을 업데이트해야 합니다.');
      console.log('');
      console.log('📝 다음 명령어로 업데이트하세요:');
      console.log('');
      console.log(`echo "WALLET_ADDRESS=${wallet.address}" >> .env`);
    }
  } else {
    console.log('💡 .env 파일에 WALLET_ADDRESS가 설정되지 않았습니다.');
    console.log('위의 줄을 .env 파일에 추가하세요!');
  }
  
  console.log('');
  
} catch (error) {
  console.error('❌ 에러:', error.message);
  console.log('');
  console.log('💡 가능한 원인:');
  console.log('- 개인키 형식이 잘못됨 (0x로 시작해야 함)');
  console.log('- 개인키 길이가 잘못됨 (64자의 16진수)');
  console.log('');
}
