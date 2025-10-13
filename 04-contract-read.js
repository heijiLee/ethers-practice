/**
 * 예제 4: Contract Read - 스마트 컨트랙트 읽기
 * 
 * 스마트 컨트랙트는 블록체인 위의 프로그램입니다.
 * 컨트랙트를 읽기 위해서는 2가지가 필요합니다:
 * 1. 컨트랙트 주소 (Contract Address)
 * 2. ABI (Application Binary Interface) - 사용 설명서
 * 
 * 이 예제에서는 읽기만 합니다 (무료, 가스비 없음)
 */

// .env 파일에서 환경 변수 불러오기
require('dotenv').config();

const { ethers } = require('ethers');

// ============================================
// 1. ABI란 무엇인가?
// ============================================

console.log('ABI (Application Binary Interface)란?\n');

console.log('ABI는 스마트 컨트랙트의 "사용 설명서"입니다.');
console.log('컨트랙트에 어떤 함수가 있는지, 어떤 매개변수가 필요한지 알려줍니다.\n');


// ============================================
// 2. ERC-20 토큰 읽기 (가장 기본적인 예제)
// ============================================

// Provider 설정 - Sepolia 테스트넷
const SEPOLIA_RPC = process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org';
const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);

// 테스트 ERC-20 토큰 주소 (Sepolia 테스트넷)
// 예: Sepolia USDC 또는 직접 배포한 테스트 토큰
const TEST_TOKEN_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'; // Sepolia USDC

// ERC-20 표준 ABI (간소화 버전 - 주요 함수만)
const ERC20_ABI = [
  // 읽기 함수들 (view/pure - 가스비 없음)
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  
  // 쓰기 함수들 (가스비 필요 - 다음 예제에서)
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  
  // 이벤트
  'event Transfer(address indexed from, address indexed to, uint256 value)',
];

console.log('ERC-20 ABI 예시:');
console.log(ERC20_ABI);
console.log('\n이렇게 사람이 읽기 쉬운 형식도 가능합니다!\n');

// ============================================
// 3. 컨트랙트 인스턴스 생성
// ============================================

// 컨트랙트 객체 생성
const testTokenContract = new ethers.Contract(
  TEST_TOKEN_ADDRESS,  // 컨트랙트 주소
  ERC20_ABI,           // ABI
  provider             // Provider (읽기만 할 경우)
);

console.log('테스트 토큰 컨트랙트 객체 생성 완료!\n');

// ============================================
// 4. 컨트랙트 읽기 예제
// ============================================

async function readContractExamples() {
  console.log('컨트랙트 읽기 예제 (Sepolia 테스트넷)\n');

  try {
    // ------------------------------
    // 예제 4-1: 토큰 기본 정보 조회
    // ------------------------------
    console.log('1. 토큰 기본 정보:');
    
    const name = await testTokenContract.name();
    const symbol = await testTokenContract.symbol();
    const decimals = await testTokenContract.decimals();
    
    console.log('  - 이름:', name);
    console.log('  - 심볼:', symbol);
    console.log('  - 소수점:', decimals);
    console.log('');

    // ------------------------------
    // 예제 4-2: 총 공급량 조회
    // ------------------------------
    console.log('2. 총 공급량:');
    
    const totalSupply = await testTokenContract.totalSupply();
    
    // 원시 값 (매우 큰 숫자)
    console.log('  - 원시 값:', totalSupply.toString());
    
    // 읽기 쉽게 변환 (decimals 적용)
    const totalSupplyFormatted = ethers.formatUnits(totalSupply, decimals);
    console.log('  - 변환 값:', totalSupplyFormatted, symbol);
    console.log('');

    // ------------------------------
    // 예제 4-3: 특정 주소의 잔액 조회
    // ------------------------------
    console.log('3. 잔액 조회:');
    
    // .env 파일에서 지갑 주소 가져오기
    const myAddress = process.env.WALLET_ADDRESS || '0x0000000000000000000000000000000000000000';
    const balance = await testTokenContract.balanceOf(myAddress);
    const balanceFormatted = ethers.formatUnits(balance, decimals);
    
    console.log('  - 주소:', myAddress);
    console.log('  - 잔액:', balanceFormatted, symbol);
    
    if (myAddress === '0x0000000000000000000000000000000000000000') {
      console.log('  .env 파일에 WALLET_ADDRESS를 설정하면 실제 잔액을 볼 수 있습니다');
    }
    console.log('');

    // ------------------------------
    // 예제 4-4: 여러 주소의 잔액 한번에 조회
    // ------------------------------
    console.log('4. 여러 주소 잔액 조회:');
    
    // .env 파일에서 여러 지갑 주소 가져오기
    const addresses = [];
    
    // WALLET_ADDRESS (메인 주소)
    if (process.env.WALLET_ADDRESS) {
      addresses.push(process.env.WALLET_ADDRESS);
    }
    
    // WALLET_ADDRESS_2 (추가 주소 1)
    if (process.env.WALLET_ADDRESS_2) {
      addresses.push(process.env.WALLET_ADDRESS_2);
    }
    
    // WALLET_ADDRESS_3 (추가 주소 2)
    if (process.env.WALLET_ADDRESS_3) {
      addresses.push(process.env.WALLET_ADDRESS_3);
    }
    
    // 주소가 없으면 기본 주소 사용
    if (addresses.length === 0) {
      addresses.push('0x0000000000000000000000000000000000000000');
      addresses.push('0x0000000000000000000000000000000000000001');
      addresses.push('0x0000000000000000000000000000000000000002');
    }

    // Promise.all로 병렬 조회 (빠름!)
    const balances = await Promise.all(
      addresses.map(addr => testTokenContract.balanceOf(addr))
    );

    addresses.forEach((addr, i) => {
      const bal = ethers.formatUnits(balances[i], decimals);
      console.log(`  ${addr}: ${bal} ${symbol}`);
    });
    
    if (!process.env.WALLET_ADDRESS) {
      console.log('  .env 파일에 WALLET_ADDRESS, WALLET_ADDRESS_2 등을 설정하세요');
    }
    console.log('');

  } catch (error) {
    console.error('에러:', error.message);
  }

  console.log('읽기 예제 완료!\n');
}



//https://etherscan.io/address/0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f
// console.log('ABI 얻는 방법\n');

// console.log('방법 1: Etherscan에서 복사');
// console.log('1. https://etherscan.io/ 접속');
// console.log('2. 컨트랙트 주소 검색');
// console.log('3. "Contract" 탭 클릭');
// console.log('4. "Code" 섹션에서 ABI 복사');
// console.log('');

// console.log('방법 2: 표준 ABI 사용');
// console.log('- ERC-20: @openzeppelin/contracts 패키지');
// console.log('- ERC-721: @openzeppelin/contracts 패키지');
// console.log('- Uniswap: @uniswap/v2-core 패키지');
// console.log('');

// console.log('방법 3: 최소 ABI 작성');
// console.log('- 필요한 함수 시그니처만 작성');
// console.log('- Human-Readable 형식 사용');
// console.log('');

readContractExamples();

