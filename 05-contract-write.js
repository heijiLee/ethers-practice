/**
 * 예제 5: Contract Write - 스마트 컨트랙트 쓰기
 * 
 * 컨트랙트에 데이터를 쓰는 작업입니다.
 * 토큰 전송, NFT 민팅, DEX 거래 등이 모두 여기에 해당합니다.
 * 
 * 주의:
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

console.log('읽기 vs 쓰기 비교\n');

console.log('읽기 (view/pure 함수):');
console.log('  무료 (가스비 없음)');
console.log('  즉시 결과 반환');
console.log('  Provider만 필요');
console.log('  예: balanceOf(), name(), symbol()');
console.log('');

console.log('쓰기 (상태 변경 함수):');
console.log('  가스비 필요');
console.log('  트랜잭션 확인 대기');
console.log('  Wallet (개인키) 필요');
console.log('  예: transfer(), approve(), mint()');
console.log('');

// ============================================
// 3. 새로운 ERC-20 토큰 생성 (배포)
// ============================================

/**
 * 간단한 ERC-20 토큰 컨트랙트 (미리 컴파일됨)
 * 
 * 이 바이트코드는 다음 Solidity 코드를 컴파일한 것입니다:
 * 
 * contract SimpleToken {
 *   string public name;
 *   string public symbol;
 *   uint8 public decimals = 18;
 *   uint256 public totalSupply;
 *   mapping(address => uint256) public balanceOf;
 *   mapping(address => mapping(address => uint256)) public allowance;
 *   
 *   event Transfer(address indexed from, address indexed to, uint256 value);
 *   event Approval(address indexed owner, address indexed spender, uint256 value);
 *   
 *   constructor(string memory _name, string memory _symbol, uint256 _initialSupply) {
 *     name = _name;
 *     symbol = _symbol;
 *     totalSupply = _initialSupply * 10**18;
 *     balanceOf[msg.sender] = totalSupply;
 *   }
 *   
 *   function transfer(address to, uint256 amount) public returns (bool) {
 *     require(balanceOf[msg.sender] >= amount, "Insufficient balance");
 *     balanceOf[msg.sender] -= amount;
 *     balanceOf[to] += amount;
 *     emit Transfer(msg.sender, to, amount);
 *     return true;
 *   }
 *   
 *   function approve(address spender, uint256 amount) public returns (bool) {
 *     allowance[msg.sender][spender] = amount;
 *     emit Approval(msg.sender, spender, amount);
 *     return true;
 *   }
 *   
 *   function transferFrom(address from, address to, uint256 amount) public returns (bool) {
 *     require(balanceOf[from] >= amount, "Insufficient balance");
 *     require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
 *     balanceOf[from] -= amount;
 *     balanceOf[to] += amount;
 *     allowance[from][msg.sender] -= amount;
 *     emit Transfer(from, to, amount);
 *     return true;
 *   }
 * }
 */

// 간단한 ERC-20 토큰 컨트랙트 바이트코드 (Solidity 0.8.0으로 컴파일)
const SIMPLE_TOKEN_BYTECODE = '0x60806040523480156200001157600080fd5b5060405162000f6438038062000f648339810160408190526200003491620001db565b82516200004990600090602086019062000068565b5081516200005f90600190602085019062000068565b50505062000277565b8280546200007690620002245750601260ff19909116178155506200009d6012600a62000356565b620000a9908362000371565b600381905533600081815260046020908152604080832085905551938452919290917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3505062000393565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200012657600080fd5b81516001600160401b0380821115620001435762000143620000fe565b604051601f8301601f19908116603f011681019082821181831017156200016e576200016e620000fe565b816040528381526020925086838588010111156200018b57600080fd5b600091505b83821015620001af578582018301518183018401529082019062000190565b83821115620001c15760008385830101525b9695505050505050565b805163ffffffff81168114620001e057600080fd5b919050565b600080600060608486031215620001fb57600080fd5b83516001600160401b03808211156200021357600080fd5b620002218783880162000114565b945060208601519150808211156200023857600080fd5b50620002478682870162000114565b9250506200025860408501620001cb565b90509250925092565b600181811c908216806200027657607f821691505b602082108114156200029857634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b600181815b80851115620002f5578160001904821115620002d957620002d96200029e565b80851615620002e757918102915b93841c9390800290620002b9565b509250929050565b6000826200030e5750600162000350565b816200031d5750600062000350565b8160018114620003365760028114620003415762000361565b600191505062000350565b60ff8411156200035557620003556200029e565b50506001821b62000350565b5060208310610133831016604e8410600b841016171562000386575081810a62000350565b620003928383620002b4565b8060001904821115620003a957620003a96200029e565b029392505050565b6000620003c260ff841683620002fd565b9392505050565b6000816000190483118215151615620003e657620003e66200029e565b500290565b610bbd80620003fb6000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c806342966c681161007157806342966c681461012357806370a082311461013857806395d89b4114610161578063a9059cbb14610169578063dd62ed3e1461017c57600080fd5b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100ef57806323b872dd14610101578063313ce56714610114575b600080fd5b6100b66101b5565b6040516100c3919061095d565b60405180910390f35b6100df6100da3660046109ce565b610243565b60405190151581526020016100c3565b6003545b6040519081526020016100c3565b6100df61010f3660046109f8565b610310565b604051601281526020016100c3565b610136610131366004610a34565b6104b0565b005b6100f3610146366004610a4d565b6001600160a01b031660009081526004602052604090205490565b6100b6610568565b6100df6101773660046109ce565b610575565b6100f361018a366004610a6f565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205490565b600080546101c290610aa2565b80601f01602080910402602001604051908101604052809291908181526020018280546101ee90610aa2565b801561023b5780601f106102105761010080835404028352916020019161023b565b820191906000526020600020905b81548152906001019060200180831161021e57829003601f168201915b505050505081565b3360008181526005602090815260408083206001600160a01b038716808552925280832085905551919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925906102e09086815260200190565b60405180910390a350600192915050565b60006001600160a01b03841661033a5760405162461bcd60e51b815260040161033190610add565b60405180910390fd5b6001600160a01b0384166000908152600460205260409020548211156103725760405162461bcd60e51b815260040161033190610add565b6001600160a01b0384163314801590610394575061038f836101b5565b151590505b156103ea576001600160a01b0384166000908152600560209081526040808320338452909152902054821115610325576040516310c1b05560e01b815260040160405180910390fd5b6001600160a01b03808516600090815260046020526040808220805485900390559185168152208054830190556001600160a01b03841633141561044c576001600160a01b03808516600090815260056020908152604080832033845290915281208054859003905580610480576104808486610b38565b6104655783610480576104808486610b38565b836001600160a01b0316856001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856040516104a291815260200190565b60405180910390a350600195945050505050565b336000908152600460205260409020548111156104df5760405162461bcd60e51b815260040161033190610add565b33600090815260046020526040812080548392906104fe908490610b50565b9250508190555080600360008282546105179190610b50565b90915550506040518181526000903390600080516020610b688339815191529060200160405180910390a350565b60018054610b5590610aa2565b80601f016020809104026020016040519081016040528092919081815260200182805461058190610aa2565b80156105ce5780601f106105a3576101008083540402835291602001916105ce565b820191906000526020600020905b8154815290600101906020018083116105b157829003601f168201915b505050505081565b60006001600160a01b03831661062e5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a207472616e7366657220746f207a65726f20616464726573730060448201526064016103eb565b3360009081526004602052604090205482111561065d5760405162461bcd60e51b815260040161033190610add565b336000908152600460205260408120805484929061067c908490610b50565b90915550506001600160a01b038316600090815260046020526040812080548492906106a9908490610b67565b92505081905550826001600160a01b0316336001600160a01b0316600080516020610b688339815191528460405161009291815260200190565b600060208083528351808285015260005b81811015610928578581018301518582016040015282016108ac565b8181111561093a576000604083870101525b50601f01601f1916929092016040019392505050565b80356001600160a01b038116811461096757600080fd5b919050565b6000806040838503121561097f57600080fd5b61098883610950565b946020939093013593505050565b6000806000606084860312156109ab57600080fd5b6109b484610950565b92506109c260208501610950565b9150604084013590509250925092565b6000602082840312156109e457600080fd5b5035919050565b6000602082840312156109fd57600080fd5b610a0682610950565b9392505050565b60008060408385031215610a2057600080fd5b610a2983610950565b9150602083013563ffffffff81168114610a4257600080fd5b809150509250929050565b600181811c90821680610a6157607f821691505b60208210811415610a8257634e487b7160e01b600052602260045260246000fd5b50919050565b60208082526026908201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604082015265616c616e636560d01b606082015260800190565b634e487b7160e01b600052601160045260246000fd5b600082821015610af557610af5610ace565b500390565b600082610b1757634e487b7160e01b600052601260045260246000fd5b500490565b6000816000190483118215151615610b3657610b36610ace565b500290565b60008219821115610b4e57610b4e610ace565b500190565b60008282101561034157610341610ace56feddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa264697066735822122089e4b6d8c49c80c8c9bba7c6bba6e6a2d8e5a6f5f5e5e5e5e5e5e5e5e5e5e564736f6c63430008090033';

// 컨트랙트 ABI (생성자 + ERC-20 기본 함수)
const SIMPLE_TOKEN_ABI = [
  'constructor(string name, string symbol, uint256 initialSupply)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
];

async function createNewTokenExample() {
  console.log('새로운 ERC-20 토큰 생성하기\n');

  if (PRIVATE_KEY === 'YOUR_PRIVATE_KEY_HERE') {
    console.log('개인키가 설정되지 않았습니다!');
    console.log('.env 파일에 PRIVATE_KEY를 설정하세요\n');
    return;
  }

  try {
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log('배포자 주소:', wallet.address);
    console.log('');

    // ETH 잔액 확인
    const balance = await provider.getBalance(wallet.address);
    const balanceEth = ethers.formatEther(balance);
    console.log('ETH 잔액:', balanceEth, 'ETH');
    
    if (balance === 0n) {
      console.log('ETH가 없습니다! Faucet에서 테스트 ETH를 받으세요.');
      console.log('https://sepoliafaucet.com/\n');
      return;
    }
    console.log('');

    // ------------------------------
    // 단계 1: 토큰 정보 설정
    // ------------------------------
    console.log('1. 토큰 정보 설정:');
    
    const tokenName = 'My Test Token';
    const tokenSymbol = 'MTT';
    const initialSupply = 1000000; // 1,000,000 토큰
    
    console.log(`  - 이름: ${tokenName}`);
    console.log(`  - 심볼: ${tokenSymbol}`);
    console.log(`  - 초기 공급량: ${initialSupply.toLocaleString()} ${tokenSymbol}`);
    console.log('');

    // ------------------------------
    // 단계 2: 컨트랙트 팩토리 생성
    // ------------------------------
    console.log('2. 컨트랙트 팩토리 생성:');
    
    const contractFactory = new ethers.ContractFactory(
      SIMPLE_TOKEN_ABI,
      SIMPLE_TOKEN_BYTECODE,
      wallet
    );
    
    console.log('  팩토리 생성 완료');
    console.log('');

    // ------------------------------
    // 단계 3: 가스 예측
    // ------------------------------
    console.log('3. 배포 가스 예측:');
    
    const deployTx = contractFactory.getDeployTransaction(
      tokenName,
      tokenSymbol,
      initialSupply
    );
    
    const gasEstimate = await provider.estimateGas(deployTx);
    const feeData = await provider.getFeeData();
    const gasCost = gasEstimate * feeData.gasPrice;
    
    console.log(`  - 예상 가스: ${gasEstimate.toString()}`);
    console.log(`  - 예상 비용: ${ethers.formatEther(gasCost)} ETH`);
    console.log('');

    // ------------------------------
    // 단계 4: 컨트랙트 배포
    // ------------------------------
    console.log('4. 컨트랙트 배포 중...');
    console.log('  트랜잭션 전송 중... (1-2분 소요)');
    
    const contract = await contractFactory.deploy(
      tokenName,
      tokenSymbol,
      initialSupply
    );
    
    console.log(`  배포 트랜잭션 해시: ${contract.deploymentTransaction().hash}`);
    console.log('  블록 확인 대기 중...');
    
    await contract.waitForDeployment();
    
    const tokenAddress = await contract.getAddress();
    
    console.log('');
    console.log('  배포 완료!');
    console.log(`  토큰 주소: ${tokenAddress}`);
    console.log('');

    // ------------------------------
    // 단계 5: 배포된 토큰 정보 확인
    // ------------------------------
    console.log('5. 배포된 토큰 확인:');
    
    const name = await contract.name();
    const symbol = await contract.symbol();
    const decimals = await contract.decimals();
    const totalSupply = await contract.totalSupply();
    const ownerBalance = await contract.balanceOf(wallet.address);
    
    console.log(`  - 이름: ${name}`);
    console.log(`  - 심볼: ${symbol}`);
    console.log(`  - Decimals: ${decimals}`);
    console.log(`  - 총 공급량: ${ethers.formatUnits(totalSupply, decimals)} ${symbol}`);
    console.log(`  - 내 잔액: ${ethers.formatUnits(ownerBalance, decimals)} ${symbol}`);
    console.log('');

    // ------------------------------
    // 단계 6: Etherscan 링크
    // ------------------------------
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 배포 정보 요약:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log(`토큰 주소: ${tokenAddress}`);
    console.log('');
    console.log('Sepolia Etherscan:');
    console.log(`   https://sepolia.etherscan.io/address/${tokenAddress}`);
    console.log('');
    console.log('배포 트랜잭션:');
    console.log(`   https://sepolia.etherscan.io/tx/${contract.deploymentTransaction().hash}`);
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    
    console.log('다음 단계:');
    console.log('1. 위 토큰 주소를 .env 파일에 저장하세요:');
    console.log(`   TOKEN_ADDRESS=${tokenAddress}`);
    console.log('');
    console.log('2. 이 토큰으로 전송 테스트를 할 수 있습니다!');
    console.log('');

    return tokenAddress;

  } catch (error) {
    console.error('에러:', error.message);
    
    if (error.message.includes('insufficient funds')) {
      console.log('원인: ETH 잔액 부족 (가스비용)');
      console.log('Faucet: https://sepoliafaucet.com/');
    }
  }
}

// ============================================
// 4. ERC-20 토큰 전송 예제
// ============================================

async function transferTokenExample(tokenAddress = null) {
  console.log('ERC-20 토큰 전송 예제\n');

  if (PRIVATE_KEY === 'YOUR_PRIVATE_KEY_HERE') {
    console.log('개인키가 설정되지 않았습니다!');
    console.log('실행하려면:');
    console.log('1. Sepolia 테스트넷 지갑 준비');
    console.log('2. 테스트 토큰 받기 (Faucet 사용)');
    console.log('3. PRIVATE_KEY 변수에 개인키 설정\n');
    return;
  }

  try {
    // Wallet 생성 및 Provider 연결
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log('지갑 주소:', wallet.address);
    console.log('');

    // 토큰 주소 (.env에서 가져오거나 파라미터로 전달받음)
    const TOKEN_ADDRESS = tokenAddress || 
                          process.env.TOKEN_ADDRESS || 
                          '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'; // Sepolia USDC
    
    if (!tokenAddress && !process.env.TOKEN_ADDRESS) {
      console.log('팁: .env 파일에 TOKEN_ADDRESS를 설정하거나');
      console.log('       createNewTokenExample()로 새 토큰을 만드세요!\n');
    }

    // Wallet과 연결된 컨트랙트 생성 (쓰기 가능)
    const tokenContract = new ethers.Contract(
      TOKEN_ADDRESS,
      ERC20_ABI,
      wallet  // ⭐ Provider 대신 Wallet 사용!
    );

    // ------------------------------
    // 단계 1: 현재 잔액 확인
    // ------------------------------
    console.log('1. 현재 잔액 확인:');
    
    const balance = await tokenContract.balanceOf(wallet.address);
    const decimals = await tokenContract.decimals();
    const symbol = await tokenContract.symbol();
    const balanceFormatted = ethers.formatUnits(balance, decimals);
    
    console.log(`  - 잔액: ${balanceFormatted} ${symbol}`);
    console.log('');

    if (balance === 0n) {
      console.log('토큰이 없습니다!');
      console.log('테스트 토큰을 먼저 받으세요\n');
      return;
    }

    // ------------------------------
    // 단계 2: 전송할 금액 설정
    // ------------------------------
    console.log('2. 전송 준비:');
    
    // .env에서 받는 주소 가져오기
    const recipientAddress = process.env.SUBMIT_ADDRESS || 
                            process.env.WALLET_ADDRESS_2 || 
                            '0x0000000000000000000000000000000000000001';
    const amountToSend = ethers.parseUnits('10', decimals); // 10 토큰
    
    console.log(`  - 받는 주소: ${recipientAddress}`);
    console.log(`  - 전송 금액: 10 ${symbol}`);
    console.log('');

    // ------------------------------
    // 단계 3: 가스 예측
    // ------------------------------
    console.log('3. 가스 예측:');
    
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
    console.log('4. 트랜잭션 전송:');
    console.log('  전송 중...');
    
    // transfer 함수 호출
    const tx = await tokenContract.transfer(recipientAddress, amountToSend);
    
    console.log(`  - 트랜잭션 해시: ${tx.hash}`);
    console.log('');

    // ------------------------------
    // 단계 5: 확인 대기
    // ------------------------------
    console.log('5. 확인 대기:');
    console.log('  블록에 포함되기를 기다리는 중...');
    
    const receipt = await tx.wait();
    
    console.log(`  확인 완료!`);
    console.log(`  - 블록 번호: ${receipt.blockNumber}`);
    console.log(`  - 가스 사용: ${receipt.gasUsed.toString()}`);
    console.log(`  - 상태: ${receipt.status === 1 ? '성공' : '실패'}`);
    console.log('');

    // ------------------------------
    // 단계 6: 이벤트 확인
    // ------------------------------
    console.log('6. 이벤트 확인:');
    
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

    console.log(`Etherscan: https://sepolia.etherscan.io/tx/${receipt.hash}`);

  } catch (error) {
    console.error('에러:', error.message);
    
    // 일반적인 에러 원인
    if (error.message.includes('insufficient funds')) {
      console.log('원인: ETH 잔액 부족 (가스비용)');
    } else if (error.message.includes('execution reverted')) {
      console.log('원인: 컨트랙트 실행 실패 (잔액 부족, 권한 없음 등)');
    }
  }
}

// ============================================
// 5. 토큰 생성 + 전송 테스트 (완전한 예제)
// ============================================

async function createAndTestToken() {
  console.log('토큰 생성 및 전송 완전 테스트\n');
  console.log('이 함수는 다음을 수행합니다:');
  console.log('1. 새로운 ERC-20 토큰 생성');
  console.log('2. 생성된 토큰으로 전송 테스트');
  console.log('3. 잔액 확인\n');
  console.log('약 2-3분 소요됩니다...\n');

  if (PRIVATE_KEY === 'YOUR_PRIVATE_KEY_HERE') {
    console.log('개인키가 설정되지 않았습니다!\n');
    return;
  }

  try {
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    // 단계 1: 토큰 생성
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('단계 1: 토큰 생성');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const tokenAddress = await createNewTokenExample();
    
    if (!tokenAddress) {
      console.log('❌ 토큰 생성 실패');
      return;
    }

    // 3초 대기
    console.log('3초 대기 중...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 단계 2: 토큰 전송 테스트
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('단계 2: 토큰 전송 테스트');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
    
    // 테스트 전송 - .env에서 받는 주소 가져오기
    const recipientAddress = process.env.WALLET_ADDRESS || 
                            '0x0000000000000000000000000000000000000001';
    const decimals = await tokenContract.decimals();
    const symbol = await tokenContract.symbol();
    const sendAmount = ethers.parseUnits('100', decimals);
    
    console.log(`📤 ${ethers.formatUnits(sendAmount, decimals)} ${symbol} 전송 중...`);
    console.log(`   받는 주소: ${recipientAddress}`);
    console.log('');
    
    const tx = await tokenContract.transfer(recipientAddress, sendAmount);
    console.log(`   트랜잭션 해시: ${tx.hash}`);
    console.log('   확인 대기 중...');
    
    const receipt = await tx.wait();
    console.log('   전송 완료!');
    console.log('');

    // 단계 3: 잔액 확인
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('단계 3: 최종 잔액 확인');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const myBalance = await tokenContract.balanceOf(wallet.address);
    const recipientBalance = await tokenContract.balanceOf(recipientAddress);
    
    console.log(`내 잔액: ${ethers.formatUnits(myBalance, decimals)} ${symbol}`);
    console.log(`받는 사람 잔액: ${ethers.formatUnits(recipientBalance, decimals)} ${symbol}`);
    console.log('');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('모든 테스트 완료!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('.env 파일에 저장하세요:');
    console.log(`TOKEN_ADDRESS=${tokenAddress}\n`);
    
    console.log('Etherscan에서 확인:');
    console.log(`https://sepolia.etherscan.io/address/${tokenAddress}\n`);

  } catch (error) {
    console.error('에러:', error.message);
  }
}

// ============================================
// 6. Approve & TransferFrom 패턴
// ============================================

async function approveAndTransferFromExample() {
  console.log('Approve & TransferFrom 패턴\n');

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
    console.log('개인키가 설정되지 않았습니다!\n');
    return;
  }

  try {
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const TOKEN_ADDRESS = '0x...'; // 실제 토큰 주소
    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, wallet);

    // ------------------------------
    // 단계 1: Approve (권한 부여)
    // ------------------------------
    console.log('1. Approve - 권한 부여:');
    
    const spenderAddress = '0x...'; // 권한을 받을 주소 (예: Uniswap Router)
    const approveAmount = ethers.parseUnits('100', 18); // 100 토큰
    
    console.log(`  - Spender: ${spenderAddress}`);
    console.log(`  - Amount: 100 토큰`);
    console.log('  Approve 트랜잭션 전송 중...');
    
    const approveTx = await tokenContract.approve(spenderAddress, approveAmount);
    await approveTx.wait();
    
    console.log('  Approve 완료!');
    console.log('');

    // ------------------------------
    // 단계 2: Allowance 확인
    // ------------------------------
    console.log('2. Allowance 확인:');
    
    const allowance = await tokenContract.allowance(wallet.address, spenderAddress);
    console.log(`  - 허용된 금액: ${ethers.formatUnits(allowance, 18)} 토큰`);
    console.log('');

    // ------------------------------
    // 단계 3: 권한 취소 (선택)
    // ------------------------------
    console.log('3. Approve 취소 (보안):');
    console.log('  사용 후에는 권한을 0으로 재설정하는 것이 안전합니다');
    
    const revokeTx = await tokenContract.approve(spenderAddress, 0);
    await revokeTx.wait();
    
    console.log('  권한 취소 완료!');
    console.log('');

  } catch (error) {
    console.error('에러:', error.message);
  }
}

// ============================================
// 7. 가스 최적화 - 트랜잭션 설정 커스터마이즈
// ============================================

async function customGasExample() {
  console.log('가스 설정 커스터마이즈\n');

  if (PRIVATE_KEY === 'YOUR_PRIVATE_KEY_HERE') {
    console.log('개인키가 설정되지 않았습니다!\n');
    return;
  }

  try {
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS || '0x...';
    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, wallet);

    // .env에서 받는 주소 가져오기
    const recipientAddress = process.env.SUBMIT_ADDRESS || 
                            process.env.WALLET_ADDRESS_2 || 
                            '0x0000000000000000000000000000000000000001';
    const amount = ethers.parseUnits('10', 18);

    // ------------------------------
    // 방법 1: 자동 가스 설정 (기본)
    // ------------------------------
    console.log('1. 자동 가스 설정:');
    const tx1 = await tokenContract.transfer(recipientAddress, amount);
    console.log('  자동으로 최적의 가스 설정');
    console.log('');

    // ------------------------------
    // 방법 2: 수동 가스 설정
    // ------------------------------
    console.log('2. 수동 가스 설정:');
    
    // 현재 가스 가격 조회
    const feeData = await provider.getFeeData();
    
    const tx2 = await tokenContract.transfer(recipientAddress, amount, {
      gasLimit: 100000,  // 가스 한도
      gasPrice: feeData.gasPrice,  // 가스 가격
    });
    
    console.log('  수동으로 가스 설정');
    console.log(`  - Gas Limit: 100000`);
    console.log(`  - Gas Price: ${ethers.formatUnits(feeData.gasPrice, 'gwei')} Gwei`);
    console.log('');

    // ------------------------------
    // 방법 3: EIP-1559 가스 설정 (추천)
    // ------------------------------
    console.log('3. EIP-1559 가스 설정 (추천):');
    
    const tx3 = await tokenContract.transfer(recipientAddress, amount, {
      gasLimit: 100000,
      maxFeePerGas: feeData.maxFeePerGas,  // 최대 가스 가격
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,  // 팁
    });
    
    console.log('  EIP-1559 가스 설정');
    console.log(`  - Max Fee: ${ethers.formatUnits(feeData.maxFeePerGas, 'gwei')} Gwei`);
    console.log(`  - Priority Fee: ${ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei')} Gwei`);
    console.log('');

  } catch (error) {
    console.error('에러:', error.message);
  }
}

// ============================================
// 8. 이벤트 리스닝 (실시간 모니터링)
// ============================================

async function eventListeningExample() {
  console.log('실시간 이벤트 리스닝 예제 (QuickNode/PublicNode)\n');

  try {
    // HTTP URL을 WebSocket URL로 변환
    let wsUrl;
    
    // .env에서 RPC URL 가져오기
    const httpUrl = process.env.SEPOLIA_RPC_URL || SEPOLIA_RPC;
    
    console.log('현재 RPC:', httpUrl);
    
    // HTTP를 WebSocket으로 변환
    if (httpUrl.includes('publicnode.com')) {
      // PublicNode: https → wss
      wsUrl = httpUrl.replace('https://', 'wss://');
      console.log('PublicNode WebSocket:', wsUrl);
    } else if (httpUrl.includes('quicknode')) {
      // QuickNode: https → wss
      wsUrl = httpUrl.replace('https://', 'wss://');
      console.log('QuickNode WebSocket:', wsUrl);
    } else if (httpUrl.includes('alchemy')) {
      // Alchemy
      wsUrl = httpUrl.replace('https://', 'wss://').replace('/v3/', '/v3/');
      console.log('Alchemy WebSocket:', wsUrl);
    } else if (httpUrl.includes('infura')) {
      // Infura
      wsUrl = httpUrl.replace('https://', 'wss://');
      console.log('Infura WebSocket:', wsUrl);
    } else {
      // 기본: PublicNode 사용
      wsUrl = 'wss://ethereum-sepolia-rpc.publicnode.com';
      console.log('기본 WebSocket (PublicNode):', wsUrl);
    }
    
    console.log('');
    console.log('Transfer 이벤트를 실시간으로 모니터링합니다...');
    console.log('10초간 모니터링 (Ctrl+C로 중단)\n');

    // WebSocket Provider 생성
    const wsProvider = new ethers.WebSocketProvider(wsUrl);
    
    // 에러 처리
    wsProvider.on('error', (error) => {
      console.error('WebSocket 에러:', error.message);
    });

    // 토큰 주소 (.env에서 가져오기)
    const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS || 
                          '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'; // Sepolia USDC
    
    console.log('모니터링 중인 토큰:', TOKEN_ADDRESS);
    console.log('');
    
    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, wsProvider);

    // Transfer 이벤트 리스너 등록
    let eventCount = 0;
    
    tokenContract.on('Transfer', async (from, to, amount, event) => {
      eventCount++;
      console.log(`Transfer #${eventCount} 감지!`);
      console.log(`  From: ${from.slice(0, 10)}...`);
      console.log(`  To: ${to.slice(0, 10)}...`);
      
      try {
        const decimals = await tokenContract.decimals();
        const symbol = await tokenContract.symbol();
        console.log(`  Amount: ${ethers.formatUnits(amount, decimals)} ${symbol}`);
      } catch {
        console.log(`  Amount: ${amount.toString()}`);
      }
      
      console.log(`  Block: ${event.log.blockNumber}`);
      console.log(`  TX: ${event.log.transactionHash.slice(0, 20)}...`);
      console.log('');
    });

    // 10초 후 리스너 제거 및 연결 종료
    setTimeout(async () => {
      tokenContract.removeAllListeners('Transfer');
      await wsProvider.destroy();
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`리스닝 중단 (총 ${eventCount}개 이벤트 감지)`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      if (eventCount === 0) {
        console.log('이벤트가 없었습니다!');
        console.log('   - 테스트 토큰이 활발하지 않을 수 있습니다');
        console.log('   - queryPastEventsExample()로 과거 이벤트 확인하세요');
        console.log('   - 또는 본인 토큰을 생성하고 전송해보세요\n');
      }
    }, 10000);

  } catch (error) {
    console.error('에러:', error.message);
    
    if (error.message.includes('404') || error.message.includes('Unexpected server response')) {
      console.log('\nWebSocket 연결 실패!');
      console.log('   - RPC가 WebSocket을 지원하지 않을 수 있습니다');
      console.log('   - queryPastEventsExample()을 대신 사용하세요\n');
    }
  }
}

// ============================================
// 9. 과거 이벤트 조회 (향상된 버전)
// ============================================

async function queryPastEventsDetailedExample() {
  console.log('과거 이벤트 상세 조회 (QuickNode/PublicNode)\n');

  // .env에서 토큰 주소 가져오기 (없으면 Sepolia USDC 사용)
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS || 
                        '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'; // Sepolia USDC
  
  console.log('🔍 조회 정보:');
  console.log(`  - RPC: ${SEPOLIA_RPC}`);
  console.log(`  - 토큰: ${TOKEN_ADDRESS}`);
  console.log('');
  
  const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider);

  try {
    // 토큰 정보 먼저 확인
    console.log('📋 토큰 정보 확인 중...');
    const [name, symbol, decimals] = await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.decimals(),
    ]);
    
    console.log(`  - 이름: ${name}`);
    console.log(`  - 심볼: ${symbol}`);
    console.log(`  - Decimals: ${decimals}`);
    console.log('');

    // 현재 블록 확인
    const currentBlock = await provider.getBlockNumber();
    console.log(`📊 현재 블록: ${currentBlock}`);
    
    // 최근 1000블록 조회 (약 3-4시간)
    const fromBlock = Math.max(0, currentBlock - 1000);
    const toBlock = currentBlock;
    
    console.log(`🔎 블록 범위: ${fromBlock} ~ ${toBlock} (${toBlock - fromBlock}개 블록)`);
    console.log('⏳ 이벤트 조회 중...\n');

    // Transfer 이벤트 필터 생성
    const filter = tokenContract.filters.Transfer();

    // 이벤트 조회
    const events = await tokenContract.queryFilter(filter, fromBlock, toBlock);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 총 ${events.length}개의 Transfer 이벤트 발견`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (events.length === 0) {
      console.log('💡 이벤트가 없습니다!\n');
      console.log('다음 중 하나를 시도하세요:');
      console.log('1. createAndTestToken() - 새 토큰 생성 + 전송');
      console.log('2. transferTokenExample() - 기존 토큰 전송');
      console.log('3. 다른 활발한 토큰 주소 사용');
      console.log('');
      console.log('그 후 다시 이 함수를 실행하면 이벤트를 볼 수 있습니다!\n');
    } else {
      // 최대 10개까지 출력
      const displayCount = Math.min(10, events.length);
      
      console.log(`최근 ${displayCount}개 이벤트:\n`);
      
      events.slice(0, displayCount).forEach((event, index) => {
        console.log(`${index + 1}. Transfer:`);
        console.log(`   From: ${event.args.from}`);
        console.log(`   To: ${event.args.to}`);
        console.log(`   Amount: ${ethers.formatUnits(event.args.value, decimals)} ${symbol}`);
        console.log(`   Block: ${event.blockNumber}`);
        console.log(`   TX Hash: ${event.transactionHash}`);
        console.log(`   🔗 https://sepolia.etherscan.io/tx/${event.transactionHash}`);
        console.log('');
      });
      
      if (events.length > displayCount) {
        console.log(`... 그리고 ${events.length - displayCount}개 더\n`);
      }
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 이벤트 통계:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // 총 전송량 계산
      let totalTransferred = 0n;
      events.forEach(event => {
        totalTransferred += event.args.value;
      });
      
      console.log(`총 이벤트: ${events.length}개`);
      console.log(`총 전송량: ${ethers.formatUnits(totalTransferred, decimals)} ${symbol}`);
      console.log(`블록 범위: ${events[events.length - 1]?.blockNumber} ~ ${events[0]?.blockNumber}`);
      console.log('');
      
      console.log(`🔗 Etherscan: https://sepolia.etherscan.io/address/${TOKEN_ADDRESS}#events`);
      console.log('');
    }

  } catch (error) {
    console.error('에러:', error.message);
    
    if (error.message.includes('invalid address')) {
      console.log('💡 원인: 토큰 주소가 잘못되었습니다');
      console.log('   .env 파일에 올바른 TOKEN_ADDRESS를 설정하세요');
    } else if (error.message.includes('network')) {
      console.log('💡 원인: 네트워크 연결 문제');
      console.log('   RPC URL을 확인하거나 다른 RPC를 사용해보세요');
    }
  }
}

// ============================================
// 10. 실전 팁
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
console.log('');
console.log('🆕 새로운 기능: 토큰 생성!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('옵션 1: 새 토큰 만들기');
console.log('  createNewTokenExample();');
console.log('  → 나만의 ERC-20 토큰을 배포합니다');
console.log('');
console.log('옵션 2: 토큰 생성 + 전송 테스트 (추천!)');
console.log('  createAndTestToken();');
console.log('  → 토큰 생성부터 전송까지 한번에!');
console.log('');
console.log('옵션 3: 기존 토큰으로 전송');
console.log('  transferTokenExample();');
console.log('  → .env의 TOKEN_ADDRESS 사용');
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('📋 준비사항:');
console.log('1. Sepolia 테스트넷 준비');
console.log('   - 테스트 지갑 생성');
console.log('   - Faucet에서 ETH 받기 (https://sepoliafaucet.com/)');
console.log('');
console.log('2. .env 파일 설정');
console.log('   - PRIVATE_KEY=0x...');
console.log('   - WALLET_ADDRESS=0x...');
console.log('   - TOKEN_ADDRESS=0x... (선택사항)');
console.log('');
console.log('3. 함수 실행 (주석 해제)');
console.log('');

// ============================================
// 실행 선택
// ============================================

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🚀 실행할 함수를 선택하세요 (한 번에 하나씩!):');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// 주석 해제하고 실행:
// 
// 🌟 추천 순서:
// 
// 🎯 실행 예제 (주석 해제하여 사용):
//
// 1단계: 과거 이벤트 조회 (HTTP - 안전)
// queryPastEventsDetailedExample();
//
// 2단계: 실시간 이벤트 리스닝 (WebSocket - QuickNode/PublicNode)
//eventListeningExample();
// queryPastEventsDetailedExample();
//
// 3단계: 토큰 생성
createNewTokenExample();
//
// 4단계: 토큰 생성+전송+이벤트 확인 (완전한 테스트)
// createAndTestToken();
//
// 개별 실행:
// transferTokenExample();
// approveAndTransferFromExample();
// customGasExample();

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('💡 팁:');
console.log('- eventListeningExample(): WebSocket으로 실시간 모니터링 (10초)');
console.log('- queryPastEventsDetailedExample(): 과거 이벤트 조회 (HTTP)');
console.log('- 한 번에 하나씩만 실행하세요!\n');

console.log('🔧 현재 RPC 설정:');
console.log(`   ${process.env.SEPOLIA_RPC_URL || SEPOLIA_RPC}`);
console.log('   (HTTP → WebSocket으로 자동 변환)\n');
