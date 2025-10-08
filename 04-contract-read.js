/**
 * 📖 예제 4: Contract Read - 스마트 컨트랙트 읽기
 * 
 * 스마트 컨트랙트는 블록체인 위의 프로그램입니다.
 * 컨트랙트를 읽기 위해서는 2가지가 필요합니다:
 * 1. 컨트랙트 주소 (Contract Address)
 * 2. ABI (Application Binary Interface) - 사용 설명서
 * 
 * 이 예제에서는 읽기만 합니다 (무료, 가스비 없음)
 */

const { ethers } = require('ethers');

// ============================================
// 1. ABI란 무엇인가?
// ============================================

console.log('📋 ABI (Application Binary Interface)란?\n');

console.log('ABI는 스마트 컨트랙트의 "사용 설명서"입니다.');
console.log('컨트랙트에 어떤 함수가 있는지, 어떤 매개변수가 필요한지 알려줍니다.\n');

console.log('예시:');
console.log('컨트랙트: 자동판매기');
console.log('ABI: 사용 설명서 (어떤 버튼이 있는지, 돈을 얼마나 넣어야 하는지)\n');

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
console.log('\n💡 이렇게 사람이 읽기 쉬운 형식도 가능합니다!\n');

// ============================================
// 3. 컨트랙트 인스턴스 생성
// ============================================

// 컨트랙트 객체 생성
const testTokenContract = new ethers.Contract(
  TEST_TOKEN_ADDRESS,  // 컨트랙트 주소
  ERC20_ABI,           // ABI
  provider             // Provider (읽기만 할 경우)
);

console.log('✅ 테스트 토큰 컨트랙트 객체 생성 완료!\n');

// ============================================
// 4. 컨트랙트 읽기 예제
// ============================================

async function readContractExamples() {
  console.log('📖 컨트랙트 읽기 예제 (Sepolia 테스트넷)\n');

  try {
    // ------------------------------
    // 예제 4-1: 토큰 기본 정보 조회
    // ------------------------------
    console.log('1️⃣ 토큰 기본 정보:');
    
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
    console.log('2️⃣ 총 공급량:');
    
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
    console.log('3️⃣ 잔액 조회:');
    
    // 테스트 주소 (본인 주소로 변경하세요)
    const testAddress = '0x0000000000000000000000000000000000000000'; // 실제 Sepolia 주소로 변경
    const balance = await testTokenContract.balanceOf(testAddress);
    const balanceFormatted = ethers.formatUnits(balance, decimals);
    
    console.log('  - 주소:', testAddress);
    console.log('  - 잔액:', balanceFormatted, symbol);
    console.log('  💡 본인의 Sepolia 주소로 변경하면 실제 잔액을 볼 수 있습니다');
    console.log('');

    // ------------------------------
    // 예제 4-4: 여러 주소의 잔액 한번에 조회
    // ------------------------------
    console.log('4️⃣ 여러 주소 잔액 조회:');
    
    // 테스트 주소들 (본인 주소들로 변경하세요)
    const addresses = [
      '0x0000000000000000000000000000000000000000', // 테스트 주소 1
      '0x0000000000000000000000000000000000000001', // 테스트 주소 2
      '0x0000000000000000000000000000000000000002', // 테스트 주소 3
    ];

    // Promise.all로 병렬 조회 (빠름!)
    const balances = await Promise.all(
      addresses.map(addr => testTokenContract.balanceOf(addr))
    );

    addresses.forEach((addr, i) => {
      const bal = ethers.formatUnits(balances[i], decimals);
      console.log(`  ${addr}: ${bal} ${symbol}`);
    });
    console.log('  💡 본인의 Sepolia 주소들로 변경하세요');
    console.log('');

  } catch (error) {
    console.error('❌ 에러:', error.message);
  }

  console.log('✅ 읽기 예제 완료!\n');
}

// ============================================
// 5. 다른 컨트랙트 예제: Uniswap (Sepolia)
// ============================================

async function uniswapExample() {
  console.log('🦄 Uniswap 컨트랙트 읽기 (Sepolia 테스트넷)\n');

  console.log('💡 참고: Sepolia에는 Uniswap V2가 배포되어 있지 않을 수 있습니다.');
  console.log('대신 다른 테스트 DEX를 사용하거나, 직접 컨트랙트를 배포해야 합니다.');
  console.log('');
  
  console.log('메인넷 예제 (참고용):');
  console.log('- Uniswap V2 Factory: 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f');
  console.log('- getPair() 함수로 거래쌍 조회');
  console.log('- allPairsLength() 함수로 총 페어 개수 조회');
  console.log('');
  
  console.log('Sepolia에서 테스트하려면:');
  console.log('1. Sepolia에 배포된 DEX 찾기');
  console.log('2. 또는 직접 테스트 컨트랙트 배포');
  console.log('3. 컨트랙트 주소를 이 함수에 추가');
  console.log('');
}

// ============================================
// 6. ENS (Ethereum Name Service) 예제
// ============================================

async function ensExample() {
  console.log('🏷️ ENS 컨트랙트 읽기\n');

  console.log('💡 참고: ENS는 메인넷에서만 완전히 지원됩니다.');
  console.log('Sepolia 테스트넷에서는 제한적으로 지원됩니다.');
  console.log('');
  
  console.log('메인넷 ENS 예제 (참고용):');
  console.log('- ENS Registry: 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e');
  console.log('- vitalik.eth 같은 이름을 주소로 변환');
  console.log('- provider.resolveName("vitalik.eth") 사용');
  console.log('');
  
  console.log('Sepolia에서 테스트하려면:');
  console.log('1. 메인넷 Provider 사용 (읽기만 하므로 무료)');
  console.log('2. 또는 Sepolia ENS 레지스트리 주소 사용 (제한적)');
  console.log('');
}

// ============================================
// 7. 실전 팁
// ============================================

console.log('💡 컨트랙트 읽기 실전 팁\n');

console.log('1. ABI 구하는 방법:');
console.log('   - Etherscan에서 Verified 컨트랙트의 ABI 복사');
console.log('   - 표준 컨트랙트 (ERC-20, ERC-721)는 표준 ABI 사용');
console.log('   - 필요한 함수만 추출해서 사용 가능 (Human-Readable ABI)');
console.log('');

console.log('2. 에러 처리:');
console.log('   - 컨트랙트 주소가 맞는지 확인');
console.log('   - ABI가 맞는지 확인');
console.log('   - 네트워크가 맞는지 확인 (메인넷 vs 테스트넷)');
console.log('');

console.log('3. 최적화:');
console.log('   - 여러 데이터를 조회할 땐 Promise.all 사용');
console.log('   - Multicall 컨트랙트로 한번에 조회 (고급)');
console.log('   - 자주 바뀌지 않는 데이터는 캐싱');
console.log('');

console.log('4. 유용한 도구:');
console.log('   - Etherscan: 컨트랙트 정보, ABI 확인');
console.log('   - Tenderly: 컨트랙트 디버깅');
console.log('   - The Graph: 컨트랙트 데이터 쿼리');
console.log('');

// ============================================
// 8. 전체 ABI vs Human-Readable ABI 비교
// ============================================

console.log('📚 ABI 형식 비교\n');

console.log('Human-Readable ABI (추천):');
console.log(`const abi = [
  'function name() view returns (string)',
  'function balanceOf(address) view returns (uint256)'
];`);
console.log('✅ 읽기 쉬움, 필요한 것만 작성\n');

console.log('Full JSON ABI:');
console.log(`const abi = [
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [{"type": "string"}],
    "stateMutability": "view"
  }
];`);
console.log('✅ 완전한 정보, Etherscan에서 복사\n');

// ============================================
// 9. ABI 얻는 방법 실습
// ============================================

console.log('🔍 ABI 얻는 방법\n');

console.log('방법 1: Etherscan에서 복사');
console.log('1. https://etherscan.io/ 접속');
console.log('2. 컨트랙트 주소 검색');
console.log('3. "Contract" 탭 클릭');
console.log('4. "Code" 섹션에서 ABI 복사');
console.log('');

console.log('방법 2: 표준 ABI 사용');
console.log('- ERC-20: @openzeppelin/contracts 패키지');
console.log('- ERC-721: @openzeppelin/contracts 패키지');
console.log('- Uniswap: @uniswap/v2-core 패키지');
console.log('');

console.log('방법 3: 최소 ABI 작성');
console.log('- 필요한 함수 시그니처만 작성');
console.log('- Human-Readable 형식 사용');
console.log('');

// ============================================
// 실행
// ============================================

console.log('\n💡 사용법 (Sepolia 테스트넷):');
console.log('주석을 해제하고 실행하세요:');
console.log('  readContractExamples();');
console.log('  uniswapExample();  // 참고용 (Sepolia에 배포 안됨)');
console.log('  ensExample();      // 참고용 (메인넷 기능)');
console.log('');
console.log('⚠️ 주의: Sepolia 테스트 토큰 주소를 사용합니다');
console.log('실제 토큰 잔액을 보려면 본인의 Sepolia 주소로 변경하세요');
console.log('');

// 주석 해제하고 실행:
// readContractExamples();
// uniswapExample();
// ensExample();

console.log('다음 단계: 05-contract-write.js에서 컨트랙트에 쓰기를 배워보세요!\n');
