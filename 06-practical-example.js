/**
 * 실전 예제: 실제로 사용 가능한 유틸리티
 * 
 * 지금까지 배운 내용을 활용한 실용적인 예제들입니다.
 * 복사해서 실제 프로젝트에 바로 사용할 수 있습니다!
 */

const { ethers } = require('ethers');

// ============================================
// 1. ERC-20 토큰 정보 조회 유틸
// ============================================

/**
 * ERC-20 토큰의 모든 정보를 한번에 조회하는 함수
 */
async function getTokenInfo(tokenAddress, userAddress, providerUrl = 'https://ethereum-sepolia-rpc.publicnode.com') {
  const provider = new ethers.JsonRpcProvider(providerUrl);
  
  const ERC20_ABI = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address) view returns (uint256)',
  ];

  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

  try {
    // 병렬로 모든 정보 조회 (빠름!)
    const [name, symbol, decimals, totalSupply, balance] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply(),
      userAddress ? contract.balanceOf(userAddress) : Promise.resolve(0n),
    ]);

    return {
      address: tokenAddress,
      name,
      symbol,
      decimals,
      totalSupply: ethers.formatUnits(totalSupply, decimals),
      userBalance: userAddress ? ethers.formatUnits(balance, decimals) : null,
    };
  } catch (error) {
    throw new Error(`Failed to get token info: ${error.message}`);
  }
}

// 사용 예제
async function tokenInfoExample() {
  console.log('토큰 정보 조회 유틸 (Sepolia 테스트넷)\n');

  try {
    // Sepolia 테스트 토큰 주소 (예: Sepolia USDC)
    const TEST_TOKEN_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';
    const TEST_USER_ADDRESS = '0x0000000000000000000000000000000000000000'; // 본인 주소로 변경

    const info = await getTokenInfo(TEST_TOKEN_ADDRESS, TEST_USER_ADDRESS);

    console.log('Token Info:');
    console.log(`  Name: ${info.name}`);
    console.log(`  Symbol: ${info.symbol}`);
    console.log(`  Decimals: ${info.decimals}`);
    console.log(`  Total Supply: ${info.totalSupply}`);
    console.log(`  User Balance: ${info.userBalance}`);
    console.log('');

  } catch (error) {
    console.error('에러:', error.message);
  }
}

// ============================================
// 2. 여러 주소의 잔액 한번에 조회
// ============================================

/**
 * 여러 주소의 ETH & 토큰 잔액을 한번에 조회
 */
async function getMultipleBalances(addresses, tokenAddress = null, providerUrl = 'https://ethereum-sepolia-rpc.publicnode.com') {
  const provider = new ethers.JsonRpcProvider(providerUrl);
  
  const results = [];

  for (const address of addresses) {
    try {
      // ETH 잔액
      const ethBalance = await provider.getBalance(address);
      const ethBalanceFormatted = ethers.formatEther(ethBalance);

      const result = {
        address,
        ethBalance: ethBalanceFormatted,
        tokenBalance: null,
      };

      // 토큰 잔액 (있다면)
      if (tokenAddress) {
        const ERC20_ABI = ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'];
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
        
        const [balance, decimals] = await Promise.all([
          tokenContract.balanceOf(address),
          tokenContract.decimals(),
        ]);

        result.tokenBalance = ethers.formatUnits(balance, decimals);
      }

      results.push(result);
    } catch (error) {
      results.push({
        address,
        error: error.message,
      });
    }
  }

  return results;
}

// 사용 예제
async function multipleBalancesExample() {
  console.log('여러 주소 잔액 조회 (Sepolia 테스트넷)\n');

  try {
    // 본인의 테스트 주소들로 변경하세요
    const addresses = [
      '0x0000000000000000000000000000000000000000', // 테스트 주소 1
      '0x0000000000000000000000000000000000000001', // 테스트 주소 2
    ];

    const TEST_TOKEN_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'; // Sepolia USDC

    const balances = await getMultipleBalances(addresses, TEST_TOKEN_ADDRESS);

    balances.forEach((bal, index) => {
      if (bal.error) {
        console.log(`${index + 1}. ${bal.address}`);
        console.log(`   에러: ${bal.error}`);
      } else {
        console.log(`${index + 1}. ${bal.address}`);
        console.log(`   ETH: ${bal.ethBalance}`);
        console.log(`   USDC: ${bal.tokenBalance}`);
      }
      console.log('');
    });

  } catch (error) {
    console.error('에러:', error.message);
  }
}

// ============================================
// 3. 가스 가격 추적기
// ============================================

/**
 * 현재 가스 가격을 추적하고 분석
 */
async function getGasAnalysis(providerUrl = 'https://ethereum-sepolia-rpc.publicnode.com') {
  const provider = new ethers.JsonRpcProvider(providerUrl);

  try {
    const feeData = await provider.getFeeData();

    return {
      gasPrice: ethers.formatUnits(feeData.gasPrice, 'gwei'),
      maxFeePerGas: feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, 'gwei') : null,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei') : null,
      // 표준 트랜잭션 비용 (21000 gas)
      standardTxCost: ethers.formatEther(feeData.gasPrice * 21000n),
      // 토큰 전송 비용 (약 65000 gas)
      tokenTransferCost: ethers.formatEther(feeData.gasPrice * 65000n),
    };
  } catch (error) {
    throw new Error(`Failed to get gas analysis: ${error.message}`);
  }
}

// 사용 예제
async function gasAnalysisExample() {
  console.log('가스 가격 분석 (Sepolia 테스트넷)\n');

  try {
    const gas = await getGasAnalysis();

    console.log('Current Gas Prices:');
    console.log(`  Gas Price: ${gas.gasPrice} Gwei`);
    
    if (gas.maxFeePerGas) {
      console.log(`  Max Fee: ${gas.maxFeePerGas} Gwei`);
      console.log(`  Priority Fee: ${gas.maxPriorityFeePerGas} Gwei`);
    }
    
    console.log('');
    console.log('Estimated Transaction Costs:');
    console.log(`  Standard ETH Transfer: ${gas.standardTxCost} ETH`);
    console.log(`  Token Transfer: ${gas.tokenTransferCost} ETH`);
    console.log('');

    // 가스 가격 평가
    const gasPriceNum = parseFloat(gas.gasPrice);
    if (gasPriceNum < 20) {
      console.log('가스 가격: 낮음 (전송하기 좋은 시간!)');
    } else if (gasPriceNum < 50) {
      console.log('가스 가격: 보통');
    } else {
      console.log('가스 가격: 높음 (가능하면 나중에 전송하세요)');
    }
    console.log('');

  } catch (error) {
    console.error('에러:', error.message);
  }
}

// ============================================
// 4. 트랜잭션 추적기
// ============================================

/**
 * 트랜잭션 상태를 계속 추적하고 업데이트 제공
 */
async function trackTransaction(txHash, providerUrl = 'https://ethereum-sepolia-rpc.publicnode.com') {
  const provider = new ethers.JsonRpcProvider(providerUrl);

  console.log(`트랜잭션 추적 시작: ${txHash}\n`);

  try {
    // 1. 트랜잭션 정보 가져오기
    console.log('1. 트랜잭션 정보 조회 중...');
    const tx = await provider.getTransaction(txHash);
    
    if (!tx) {
      console.log('트랜잭션을 찾을 수 없습니다');
      return null;
    }

    console.log(`   From: ${tx.from}`);
    console.log(`   To: ${tx.to}`);
    console.log(`   Value: ${ethers.formatEther(tx.value)} ETH`);
    console.log(`   Gas Limit: ${tx.gasLimit.toString()}`);
    console.log('');

    // 2. 확인 대기
    console.log('2. 블록 확인 대기 중...');
    const receipt = await tx.wait();
    
    console.log(`   확인됨!`);
    console.log(`   Status: ${receipt.status === 1 ? '성공' : '실패'}`);
    console.log(`   Block: ${receipt.blockNumber}`);
    console.log(`   Gas Used: ${receipt.gasUsed.toString()}`);
    
    // 실제 가스 비용 계산
    const gasCost = receipt.gasUsed * tx.gasPrice;
    console.log(`   Gas Cost: ${ethers.formatEther(gasCost)} ETH`);
    console.log('');

    // 3. Etherscan 링크
    console.log(`Sepolia Etherscan: https://sepolia.etherscan.io/tx/${txHash}`);
    console.log('');

    return {
      hash: txHash,
      from: tx.from,
      to: tx.to,
      value: ethers.formatEther(tx.value),
      status: receipt.status === 1 ? 'success' : 'failed',
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      gasCost: ethers.formatEther(gasCost),
    };

  } catch (error) {
    console.error('에러:', error.message);
    return null;
  }
}

// 사용 예제
async function trackTransactionExample() {
  console.log('트랜잭션 추적 예제 (Sepolia 테스트넷)\n');

  console.log('사용법:');
  console.log('1. Sepolia 테스트넷에서 트랜잭션을 먼저 전송하세요');
  console.log('2. 받은 트랜잭션 해시를 아래 코드에 입력하세요');
  console.log('3. 주석을 해제하고 실행하세요');
  console.log('');
  
  // 예제: 실제 Sepolia 트랜잭션 해시로 교체하세요
  // const txHash = 'YOUR_SEPOLIA_TX_HASH';
  // await trackTransaction(txHash);
}

// ============================================
// 5. 토큰 전송 헬퍼 (안전 체크 포함)
// ============================================

/**
 * 안전 체크가 포함된 토큰 전송 함수
 */
async function safeTransferToken(
  privateKey,
  tokenAddress,
  recipientAddress,
  amount,
  providerUrl = 'https://ethereum-sepolia-rpc.publicnode.com'
) {
  const provider = new ethers.JsonRpcProvider(providerUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  const ERC20_ABI = [
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function balanceOf(address) view returns (uint256)',
    'function transfer(address, uint256) returns (bool)',
  ];

  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);

  try {
    console.log('안전 토큰 전송 시작\n');

    // 1. 토큰 정보 가져오기
    console.log('1. 토큰 정보 확인...');
    const [symbol, decimals] = await Promise.all([
      tokenContract.symbol(),
      tokenContract.decimals(),
    ]);
    console.log(`   Token: ${symbol}`);
    console.log('');

    // 2. 잔액 확인
    console.log('2. 잔액 확인...');
    const balance = await tokenContract.balanceOf(wallet.address);
    const balanceFormatted = ethers.formatUnits(balance, decimals);
    console.log(`   Current Balance: ${balanceFormatted} ${symbol}`);

    const amountWei = ethers.parseUnits(amount, decimals);
    
    if (balance < amountWei) {
      throw new Error(`잔액 부족! (보유: ${balanceFormatted} ${symbol}, 필요: ${amount} ${symbol})`);
    }
    console.log('');

    // 3. 주소 검증
    console.log('3️⃣ 주소 검증...');
    if (!ethers.isAddress(recipientAddress)) {
      throw new Error('유효하지 않은 받는 주소');
    }
    if (recipientAddress === wallet.address) {
      throw new Error('자기 자신에게 전송할 수 없습니다');
    }
    console.log('   주소 유효');
    console.log('');

    // 4. ETH 잔액 확인 (가스비)
    console.log('4. 가스비 확인...');
    const ethBalance = await provider.getBalance(wallet.address);
    const gasEstimate = await tokenContract.transfer.estimateGas(recipientAddress, amountWei);
    const feeData = await provider.getFeeData();
    const gasCost = gasEstimate * feeData.gasPrice;
    
    console.log(`   Estimated Gas: ${gasEstimate.toString()}`);
    console.log(`   Gas Cost: ${ethers.formatEther(gasCost)} ETH`);

    if (ethBalance < gasCost) {
      throw new Error(`ETH 잔액 부족! (가스비: ${ethers.formatEther(gasCost)} ETH)`);
    }
    console.log('');

    // 5. 사용자 확인 (실제로는 UI에서)
    console.log('5. 전송 내역 확인:');
    console.log(`   To: ${recipientAddress}`);
    console.log(`   Amount: ${amount} ${symbol}`);
    console.log(`   Gas Cost: ${ethers.formatEther(gasCost)} ETH`);
    console.log('');

    // 6. 전송
    console.log('6. 전송 중...');
    const tx = await tokenContract.transfer(recipientAddress, amountWei);
    console.log(`   TX Hash: ${tx.hash}`);
    console.log('');

    // 7. 확인 대기
    console.log('7. 확인 대기...');
    const receipt = await tx.wait();
    
    if (receipt.status === 1) {
      console.log('   전송 성공!');
      console.log(`   Block: ${receipt.blockNumber}`);
      console.log(`   Actual Gas Used: ${receipt.gasUsed.toString()}`);
    } else {
      console.log('   전송 실패');
    }
    console.log('');

    return {
      success: receipt.status === 1,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
    };

  } catch (error) {
    console.error('❌ 에러:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================
// 6. 포트폴리오 조회 (여러 토큰 한번에)
// ============================================

/**
 * 사용자의 전체 포트폴리오 조회
 */
async function getPortfolio(userAddress, tokenAddresses, providerUrl = 'https://ethereum-sepolia-rpc.publicnode.com') {
  const provider = new ethers.JsonRpcProvider(providerUrl);

  console.log(`포트폴리오 조회: ${userAddress}\n`);

  const portfolio = {
    address: userAddress,
    eth: null,
    tokens: [],
  };

  try {
    // ETH 잔액
    const ethBalance = await provider.getBalance(userAddress);
    portfolio.eth = ethers.formatEther(ethBalance);

    // 각 토큰 잔액
    const ERC20_ABI = [
      'function symbol() view returns (string)',
      'function decimals() view returns (uint8)',
      'function balanceOf(address) view returns (uint256)',
    ];

    for (const tokenAddress of tokenAddresses) {
      try {
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
        
        const [symbol, decimals, balance] = await Promise.all([
          contract.symbol(),
          contract.decimals(),
          contract.balanceOf(userAddress),
        ]);

        const balanceFormatted = ethers.formatUnits(balance, decimals);

        portfolio.tokens.push({
          address: tokenAddress,
          symbol,
          balance: balanceFormatted,
          balanceRaw: balance.toString(),
        });

      } catch (error) {
        portfolio.tokens.push({
          address: tokenAddress,
          error: error.message,
        });
      }
    }

    return portfolio;

  } catch (error) {
    throw new Error(`Failed to get portfolio: ${error.message}`);
  }
}

// 사용 예제
async function portfolioExample() {
  console.log('포트폴리오 조회 예제 (Sepolia 테스트넷)\n');

  try {
    // 본인의 Sepolia 주소로 변경하세요
    const testAddress = '0x0000000000000000000000000000000000000000';
    
    // Sepolia 테스트 토큰 주소들 (실제 배포된 주소로 변경)
    const tokens = [
      '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Sepolia USDC
      // 추가 테스트 토큰 주소들...
    ];

    const portfolio = await getPortfolio(testAddress, tokens);

    console.log('Portfolio:');
    console.log(`  ETH: ${portfolio.eth}`);
    console.log('');
    console.log('  Tokens:');
    portfolio.tokens.forEach(token => {
      if (token.error) {
        console.log(`    ${token.address}: Error - ${token.error}`);
      } else {
        console.log(`    ${token.symbol}: ${token.balance}`);
      }
    });
    console.log('');

  } catch (error) {
    console.error('에러:', error.message);
  }
}

// ============================================
// 실행 메뉴
// ============================================

console.log('실전 예제 모음 (Sepolia 테스트넷)\n');
console.log('다음 함수들을 실행해보세요:');
console.log('');
console.log('1. tokenInfoExample() - 토큰 정보 조회');
console.log('2. multipleBalancesExample() - 여러 주소 잔액 조회');
console.log('3. gasAnalysisExample() - 가스 가격 분석');
console.log('4. trackTransactionExample() - 트랜잭션 추적');
console.log('5. portfolioExample() - 포트폴리오 조회');
console.log('');
console.log('중요: 본인의 Sepolia 주소로 변경하세요!');
console.log('이 함수들을 복사해서 실제 프로젝트에 사용하세요!');
console.log('');

// 주석 해제하고 실행:
// tokenInfoExample();
// multipleBalancesExample();
// gasAnalysisExample();
// trackTransactionExample();
// portfolioExample();

// ============================================
// 모듈 export (다른 파일에서 사용하려면)
// ============================================

module.exports = {
  getTokenInfo,
  getMultipleBalances,
  getGasAnalysis,
  trackTransaction,
  safeTransferToken,
  getPortfolio,
};
