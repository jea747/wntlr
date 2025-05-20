// ==== 회사 정보 초기화 ====
let companies = [
  { name: "(주) 당근유성", price: 0, history: [] },
  { name: "(주) 서준머니", price: 0, history: [] },
  { name: "(주) IG전자", price: 0, history: [] },
  { name: "(주) 에메존", price: 0, history: [] },
  { name: "(주) 샘숭전자", price: 0, history: [] },
  { name: "(주) 아뽀", price: 0, history: [] },
];

// ==== 사용자 초기 데이터 ====
// 관리자: id = wjdwogus, pw = wjdwogus
// 일반 사용자: id = 1~23 (20 없음), pw = 5118
const users = {
  "wjdwogus": { password: "wjdwogus", role: "admin", balance: 10000, portfolio: {}, loans: [] }
};
for (let i = 1; i <= 23; i++) {
  if (i === 20) continue;
  users[i.toString()] = { password: "5118", role: "user", balance: 1000, portfolio: {}, loans: [] };
}

// ==== 현재 로그인 사용자 ====
let currentUser = null;

// ==== 대출 신청 내역 ====
let loanRequests = [];

// ==== 초기 주가 설정 ====
function initPrices() {
  companies.forEach(c => {
    c.price = Math.floor(Math.random() * 20) + 1; // 1~20 서창 사이
    c.history = [c.price];
  });
}

// ==== 주가 변동 (10분마다 호출 예정) ====
// 주가 ±5% 랜덤 변동, 1~1000 서창 제한, 히스토리 50개까지만 저장
function fluctuatePrices() {
  companies.forEach(c => {
    const percentChange = (Math.random() * 10 - 5) / 100;
    let change = Math.floor(c.price * percentChange);
    c.price += change;
    if (c.price < 1) c.price = 1;
    if (c.price > 1000) c.price = 1000;
    c.history.push(c.price);
    if (c.history.length > 50) c.history.shift();
  });
  updateStockInfo();
  updatePortfolioInfo();
  updateChart();
}

// ==== 화면 업데이트 함수들 ====

// 회사별 주가 정보 표시
function updateStockInfo() {
  const container = document.getElementById('stock-info');
  container.innerHTML = "";
  companies.forEach(c => {
    container.innerHTML += `<div>${c.name} : ${c.price.toLocaleString()} 서창</div>`;
  });

  const tradeSelect = document.getElementById('trade-company');
  tradeSelect.innerHTML = "";
  companies.forEach((c, i) => {
    let opt = document.createElement('option');
    opt.value = i;
    opt.textContent = c.name;
    tradeSelect.appendChild(opt);
  });

  updateListedCompanies();
}

// 내 주식 보유 현황 표시
function updatePortfolioInfo() {
  if (!currentUser) return;
  const container = document.getElementById('portfolio-info');
  const userData = users[currentUser.id];
  container.innerHTML = "";

  if (!userData || Object.keys(userData.portfolio).length === 0) {
    container.textContent = "보유 주식이 없습니다.";
    return;
  }
  Object.entries(userData.portfolio).forEach(([idx, amount]) => {
    container.innerHTML += `<div>${companies[idx].name} : ${amount} 주</div>`;
  });
}

// 잔액 표시
function updateBalance() {
  if (!currentUser) return;
  const balElem = document.getElementById('balance');
  balElem.textContent = users[currentUser.id].balance.toLocaleString();
}

// 대출 신청 목록 화면 표시 (관리자 전용)
function updateLoanRequests() {
  const loanSection = document.getElementById('loan-requests-section');
  const loanContainer = document.getElementById('loan-requests');
  loanContainer.innerHTML = "";

  if (!currentUser || users[currentUser.id].role !== "admin") {
    loanSection.style.display = "none";
    return;
  }
  loanSection.style.display = "block";

  loanRequests.forEach((req, i) => {
    if (req.approved) return;
    const div = document.createElement('div');
    div.innerHTML = `${req.userId} 님의 대출 신청: ${req.amount.toLocaleString()} 서창 
      <button onclick="approveLoan('${req.userId}', ${i})">승인</button>`;
    loanContainer.appendChild(div);
  });
}

// 상장된 회사 리스트 표시 및 폐지 버튼(관리자 전용)
function updateListedCompanies() {
  const container = document.getElementById('listed-companies');
  const mgmtSection = document.getElementById('company-management');
  container.innerHTML = "";

  if (!currentUser || users[currentUser.id].role !== "admin") {
    mgmtSection.style.display = "none";
    return;
  }
  mgmtSection.style.display = "block";

  companies.forEach((c, i) => {
    const div = document.createElement('div');
    div.innerHTML = `${c.name} <button onclick="delistCompany(${i})">폐지</button>`;
    container.appendChild(div);
  });
}

// 차트 초기화 및 업데이트
let chart = null;
function updateChart() {
  const ctx = document.getElementById('priceChart').getContext('2d');

  const labels = [];
  for (let i = 0; i < 50; i++) {
    labels.push(i + 1);
  }

  const datasets = companies.map(c => ({
    label: c.name,
    data: c.history.slice(-50),
    borderColor: getRandomColor(c.name),
    fill: false,
    tension: 0.3
  }));

  if (chart) {
    chart.data.labels = labels;
    chart.data.datasets = datasets;
    chart.update();
  } else {
    chart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}

// 색깔 고정 함수 (회사명 기반)
function getRandomColor(str) {
  let hash = 0;
  for(let i=0; i<str.length; i++){
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

// ==== 로그인 ====
function login() {
  const id = document.getElementById('userId').value.trim();
  const pw = document.getElementById('password').value.trim();
  const msg = document.getElementById('loginMsg');

  if (!users[id]) {
    msg.textContent = "존재하지 않는 아이디입니다.";
    return;
  }
  if (users[id].password !== pw) {
    msg.textContent = "비밀번호가 틀렸습니다.";
    return;
  }

  currentUser = { id, role: users[id].role };
  msg.textContent = "";
  document.getElementById('login-section').style.display = "none";
  document.getElementById('app').style.display = "block";

  document.getElementById('welcome').textContent = `${id}님 환영합니다! (${users[id].role === "admin" ? "관리자" : "사용자"})`;

  updateBalance();
  updateStockInfo();
  updatePortfolioInfo();
  updateLoanRequests();
  updateChart();
}

// ==== 로그아웃 ====
function logout() {
  currentUser = null;
  document.getElementById('app').style.display = "none";
  document.getElementById('login-section').style.display = "block";
  document.getElementById('userId').value = "";
  document.getElementById('password').value = "";
}

// ==== 매수 ====
function buyStock() {
  if (!currentUser) return;
  const idx = parseInt(document.getElementById('trade-company').value);
  const amount = parseInt(document.getElementById('trade-amount').value);
  const msg = document.getElementById('trade-msg');
  msg.style.color = "red";
  msg.textContent = "";

  if (isNaN(amount) || amount <= 0) {
    msg.textContent = "수량을 올바르게 입력하세요.";
    return;
  }

  const user = users[currentUser.id];
  const price = companies[idx].price;
  const total = price * amount;

  if (user.balance < total) {
    msg.textContent = "잔액이 부족합니다.";
    return;
  }

  user.balance -= total;
  user.portfolio[idx] = (user.portfolio[idx] || 0) + amount;

  msg.style.color = "green";
  msg.textContent = `${companies[idx].name} ${amount} 주 매수 완료!`;

  updateBalance();
  updatePortfolioInfo();
  document.getElementById('trade-amount').value = "";
}

// ==== 매도 ====
function sellStock() {
  if (!currentUser) return;
  const idx = parseInt(document.getElementById('trade-company').value);
  const amount = parseInt(document.getElementById('trade-amount').value);
  const msg = document.getElementById('trade-msg');
  msg.style.color = "red";
  msg.textContent = "";

  if (isNaN(amount) || amount <= 0) {
    msg.textContent = "수량을 올바르게 입력하세요.";
    return;
  }

  const user = users[currentUser.id];
  if (!user.portfolio[idx] || user.portfolio[idx] < amount) {
    msg.textContent = "보유한 주식 수량이 부족합니다.";
    return;
  }

  const price = companies[idx].price;
  const total = price * amount;

  user.portfolio[idx] -= amount;
  if (user.portfolio[idx] === 0) delete user.portfolio[idx];
  user.balance += total;

  msg.style.color = "green";
  msg.textContent = `${companies[idx].name} ${amount} 주 매도 완료!`;

  updateBalance();
  updatePortfolioInfo();
  document.getElementById('trade-amount').value = "";
}

// ==== 대출 신청 ====
function applyLoan() {
  if (!currentUser) return;
  if (users[currentUser.id].role === "admin") return; // 관리자는 대출 불가

  const amount = parseInt(document.getElementById('loan-amount').value);
  const msg = document.getElementById('loan-msg');
  msg.style.color = "red";
  msg.textContent = "";

  if (isNaN(amount) || amount <= 0) {
    msg.textContent = "대출 금액을 올바르게 입력하세요.";
    return;
  }

  // 중복 신청 방지
  if (loanRequests.find(r => r.userId === currentUser.id && !r.approved)) {
    msg.textContent = "이미 대출 신청 중입니다.";
    return;
  }

  loanRequests.push({ userId: currentUser.id, amount: amount, approved: false });
  msg.style.color = "green";
  msg.textContent = "대출 신청 완료! 관리자의 승인을 기다려주세요.";

  document.getElementById('loan-amount').value = "";
  updateLoanRequests();
}

// ==== 대출 승인 (관리자만 가능) ====
function approveLoan(userId, idx) {
  if (!currentUser || users[currentUser.id].role !== "admin") return;
  const request = loanRequests[idx];
  if (!request || request.approved) return;

  request.approved = true;
  users[userId].balance += request.amount;
  users[userId].loans.push({
    amount: request.amount,
    date: new Date(),
    interestRate: 0.05, // 주 5%
  });

  updateLoanRequests();
  if (currentUser.id === userId) updateBalance();
}

// ==== 회사 상장 ====
function addCompany() {
  if (!currentUser || users[currentUser.id].role !== "admin") return;
  const input = document.getElementById('new-company-name');
  const name = input.value.trim();

  if (!name) {
    alert("회사 이름을 입력하세요.");
    return;
  }

  // 이미 존재하는 회사인지 확인
  const exists = companies.some(c => c.name === name);
  if (exists) {
    alert("이미 존재하는 회사명입니다.");
    return;
  }

  // 새 회사 추가, 초기 주가는 1~20 사이 랜덤
  companies.push({
    name: name,
    price: Math.floor(Math.random() * 20) + 1,
    history: []
  });
  companies[companies.length - 1].history.push(companies[companies.length - 1].price);

  input.value = "";
  updateStockInfo();
  updateListedCompanies();
  updateChart();
  alert(`${name} 회사가 상장되었습니다!`);
}

