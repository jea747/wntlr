// ==== 사용자 정보 ====
const users = {
  wjdwogus: { password: "wjdwogus", role: "admin", balance: 100000, loans: [], stocks: {} },
};

for (let i = 1; i <= 23; i++) {
  if (i === 20) continue;
  users[`51${i}`] = { password: "1234", role: "user", balance: 50000, loans: [], stocks: {} };
}

let currentUser = null;

// ==== 회사 정보 ====
let companies = {
  "당근유성": { price: getRandomPrice(), history: [] },
  "서준머니": { price: getRandomPrice(), history: [] },
  "샘숭전자": { price: getRandomPrice(), history: [] },
  "IG전자": { price: getRandomPrice(), history: [] },
  "에메존": { price: getRandomPrice(), history: [] }
};

let loanRequests = [];

// ==== 유틸 함수 ====
function getRandomPrice() {
  return Math.floor(10 + Math.random() * 10); // 10~20
}

function updateUI() {
  document.getElementById("balance").textContent = `${currentUser.balance} 서창`;
  renderStocks();
  renderCompanies();
  renderLoanStatus();
  renderLoanRequests();
}

function renderStocks() {
  const ul = document.getElementById("stocks-list");
  ul.innerHTML = "";

  const stocks = currentUser.stocks || {};
  if (Object.keys(stocks).length === 0) {
    ul.innerHTML = "<li>보유한 주식이 없습니다.</li>";
    return;
  }

  for (const name in stocks) {
    const li = document.createElement("li");
    li.textContent = `${name}: ${stocks[name]}주`;
    ul.appendChild(li);
  }
}

function renderCompanies() {
  const div = document.getElementById("companies-list");
  div.innerHTML = "";

  for (const name in companies) {
    const company = companies[name];
    const container = document.createElement("div");
    container.innerHTML = `
      <h4>${name} - ${company.price} 서창</h4>
      <button onclick="buyStock('${name}')">매수</button>
      <button onclick="sellStock('${name}')">매도</button>
    `;
    div.appendChild(container);
  }
}

function buyStock(name) {
  const price = companies[name].price;
  if (currentUser.balance < price) {
    alert("잔액이 부족합니다.");
    return;
  }
  currentUser.balance -= price;
  currentUser.stocks[name] = (currentUser.stocks[name] || 0) + 1;
  updateUI();
}

function sellStock(name) {
  const owned = currentUser.stocks[name] || 0;
  if (owned < 1) {
    alert("보유한 주식이 없습니다.");
    return;
  }
  currentUser.stocks[name] -= 1;
  currentUser.balance += companies[name].price;
  updateUI();
}

function applyLoan() {
  const amount = parseInt(document.getElementById("loan-amount").value);
  if (isNaN(amount) || amount <= 0) {
    alert("유효한 금액을 입력해주세요.");
    return;
  }

  if (loanRequests.find(req => req.userId === currentUser.id && !req.approved)) {
    alert("이미 대출 신청 중입니다.");
    return;
  }

  loanRequests.push({ userId: currentUser.id, amount, approved: false });
  alert("대출 신청이 접수되었습니다.");
  renderLoanRequests();
}

function renderLoanStatus() {
  const div = document.getElementById("loan-status");
  const myLoans = loanRequests.filter(r => r.userId === currentUser.id);
  div.innerHTML = myLoans.map(r => `${r.amount} 서창 - ${r.approved ? "승인됨" : "대기중"}`).join("<br>");
}

function renderLoanRequests() {
  const container = document.getElementById("admin-loan-requests");
  if (!currentUser || currentUser.role !== "admin") {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = "";
  loanRequests.forEach((req, idx) => {
    if (!req.approved) {
      const div = document.createElement("div");
      div.innerHTML = `${req.userId} - ${req.amount} 서창 <button onclick="approveLoan(${idx})">승인</button>`;
      container.appendChild(div);
    }
  });
}

function approveLoan(idx) {
  const req = loanRequests[idx];
  req.approved = true;
  users[req.userId].balance += req.amount;
  if (currentUser.id === req.userId) {
    currentUser.balance += req.amount;
  }
  renderLoanRequests();
  updateUI();
}

function updatePrices() {
  for (const name in companies) {
    let price = companies[name].price;
    const change = Math.floor(price * ((Math.random() - 0.5) * 0.1));
    price = Math.max(1, price + change);
    companies[name].price = price;
    companies[name].history.push(price);
    if (companies[name].history.length > 50) companies[name].history.shift();
  }
  updateUI();
}

// ==== 로그인 처리 ====
document.getElementById("login-btn").addEventListener("click", () => {
  const id = document.getElementById("userid").value.trim();
  const pw = document.getElementById("password").value.trim();

  if (!users[id]) {
    alert("존재하지 않는 ID입니다.");
    return;
  }

  if (users[id].password !== pw) {
    alert("비밀번호가 틀렸습니다.");
    return;
  }

  currentUser = { id, ...users[id] };
  document.getElementById("login-section").style.display = "none";
  document.getElementById("main-section").style.display = "block";
  document.getElementById("welcome-msg").textContent = `${id}님 환영합니다`;

  if (currentUser.role === "admin") {
    document.getElementById("admin-section").style.display = "block";
  }

  updateUI();
});

// 시드머니 지급 (관리자용)
function giveSeedMoney() {
  const targetId = prompt("시드머니 지급할 유저 ID 입력:");
  const amount = parseInt(prompt("지급할 금액 입력:"));

  if (!users[targetId]) {
    alert("존재하지 않는 유저입니다.");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    alert("유효한 금액을 입력해주세요.");
    return;
  }

  users[targetId].balance += amount;
  alert(`${targetId}에게 ${amount} 서창 지급 완료!`);

  if (currentUser.id === targetId) {
    currentUser.balance += amount;
    updateUI();
  }
}

// 주가 자동 업데이트 (10분마다)
setInterval(updatePrices, 600000);
