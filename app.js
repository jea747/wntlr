// ==== 유저 정보 (관리자 + 일반 유저) ====
const users = {
  wjdwogus: { password: "wjdwogus", role: "admin", balance: 100000, loans: [], stocks: {} },
};

for(let i=1; i<=23; i++){
  if(i === 20) continue; // 20번 없음
  users[`user${i}`] = { password: "5118", role: "user", balance: 50000, loans: [], stocks: {} };
}

// ==== 회사 정보 (초기 6개) ====
let companies = {
  "당근유성": { price: getRandomPrice(), history: [] },
  "트러플마켓": { price: getRandomPrice(), history: [] },
  "서준머니": { price: getRandomPrice(), history: [] },
  "IG전자": { price: getRandomPrice(), history: [] },
  "에메존": { price: getRandomPrice(), history: [] },
  "샘숭전자": { price: getRandomPrice(), history: [] }
};

let currentUser = null;

const loginSection = document.getElementById("login-section");
const mainSection = document.getElementById("main-section");
const adminSection = document.getElementById("admin-section");
const userSection = document.getElementById("user-section");

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const welcomeMsg = document.getElementById("welcome-msg");
const loginMsg = document.getElementById("login-msg");

const balanceSpan = document.getElementById("balance");
const stocksList = document.getElementById("stocks-list");
const companiesList = document.getElementById("companies-list");
const loanMsg = document.getElementById("loan-msg");
const loanInput = document.getElementById("loan-amount");
const loanApplyBtn = document.getElementById("loan-apply-btn");

const adminLoanRequestsList = document.getElementById("admin-loan-requests");

const chartCanvas = document.getElementById("price-chart").getContext("2d");

let loanRequests = []; // { userId, amount, approved }

// ======= 함수 =======

// 랜덤 가격 생성 (10 ~ 20 사이)
function getRandomPrice() {
  return +(10 + Math.random() * 10).toFixed(2);
}

// 로그인 메시지 출력
function showLoginMsg(msg) {
  loginMsg.textContent = msg;
}
function clearLoginMsg() {
  loginMsg.textContent = "";
}

// 로그인 처리
loginBtn.addEventListener("click", () => {
  const id = document.getElementById("userid").value.trim();
  const pw = document.getElementById("password").value.trim();

  if (!users[id]) {
    showLoginMsg("존재하지 않는 아이디입니다.");
    return;
  }
  if (users[id].password !== pw) {
    showLoginMsg("비밀번호가 틀렸습니다.");
    return;
  }

  currentUser = { id, ...users[id] };
  loginSection.style.display = "none";
  mainSection.style.display = "block";

  welcomeMsg.textContent = `${currentUser.id}님 환영합니다!`;

  if (currentUser.role === "admin") {
    adminSection.style.display = "block";
  } else {
    adminSection.style.display = "none";
  }
  clearLoginMsg();
  updateUI();
  renderCompanies();
  renderStocks();
  renderLoanRequests();
  updateChart();
});

// 로그아웃
logoutBtn.addEventListener("click", () => {
  currentUser = null;
  loginSection.style.display = "block";
  mainSection.style.display = "none";
  adminSection.style.display = "none";

  document.getElementById("userid").value = "";
  document.getElementById("password").value = "";
  clearLoginMsg();
});

// UI 업데이트 : 잔액 표시 등
function updateUI() {
  balanceSpan.textContent = `${currentUser.balance.toFixed(2)} 서창`;
  renderStocks();
  renderLoanStatus();
}

// 보유 주식 렌더링
function renderStocks() {
  stocksList.innerHTML = "";
  const stocks = currentUser.stocks || {};
  if(Object.keys(stocks).length === 0){
    stocksList.textContent = "보유한 주식이 없습니다.";
    return;
  }
  for(const company in stocks){
    const li = document.createElement("li");
    li.textContent = `${company}: ${stocks[company]}주`;
    stocksList.appendChild(li);
  }
}

// 회사 리스트 렌더링(매수/매도 버튼 포함)
function renderCompanies() {
  companiesList.innerHTML = "";
  for(const name in companies){
    const company = companies[name];

    const div = document.createElement("div");
    div.style.border = "1px solid #ddd";
    div.style.margin = "5px";
    div.style.padding = "5px";

    const title = document.createElement("h4");
    title.textContent = `${name} - 현재가: ${company.price.toFixed(2)} 서창`;
    div.appendChild(title);

    // 매수 버튼
    const buyBtn = document.createElement("button");
    buyBtn.textContent = "매수 1주";
    buyBtn.onclick = () => buyStock(name);
    div.appendChild(buyBtn);

    // 매도 버튼
    const sellBtn = document.createElement("button");
    sellBtn.textContent = "매도 1주";
    sellBtn.onclick = () => sellStock(name);
    div.appendChild(sellBtn);

    companiesList.appendChild(div);
  }
}

// 주식 매수
function buyStock(companyName) {
  const price = companies[companyName].price;
  if(currentUser.balance < price){
    alert("잔액이 부족합니다.");
    return;
  }
  currentUser.balance -= price;
  currentUser.stocks[companyName] = (currentUser.stocks[companyName] || 0) + 1;
  updateUI();
  alert(`${companyName} 1주 매수 완료!`);
}

// 주식 매도
function sellStock(companyName) {
  if(!currentUser.stocks[companyName] || currentUser.stocks[companyName] <= 0){
    alert("보유한 주식이 없습니다.");
    return;
  }
  const price = companies[companyName].price;
  currentUser.stocks[companyName]--;
  if(currentUser.stocks[companyName] === 0) delete currentUser.stocks[companyName];
  currentUser.balance += price;
  updateUI();
  alert(`${companyName} 1주 매도 완료!`);
}

// 대출 신청
loanApplyBtn.addEventListener("click", () => {
  const amount = Number(loanInput.value);
  if(isNaN(amount) || amount <= 0){
    loanMsg.textContent = "유효한 금액을 입력하세요.";
    return;
  }
  loanMsg.textContent = "";

  // 중복 신청 확인
  if(loanRequests.find(r => r.userId === currentUser.id && !r.approved)){
    loanMsg.textContent = "이미 대출 신청이 대기중입니다.";
    return;
  }

  loanRequests.push({ userId: currentUser.id, amount, approved: false });
  alert("대출 신청이 접수되었습니다. 관리자의 승인을 기다려주세요.");
  loanInput.value = "";
  renderLoanStatus();
  renderLoanRequests();
});

// 내 대출 상태 표시
function renderLoanStatus(){
  const userLoans = loanRequests.filter(r => r.userId === currentUser.id);
  if(userLoans.length === 0) {
    loanMsg.textContent = "대출 신청 내역이 없습니다.";
  } else {
    loanMsg.textContent = "대출 내역:\n" + userLoans.map(l => `${l.amount} 서창 - ${l.approved ? "승인됨" : "대기중"}`).join("\n");
  }
}

// 관리자 대출 승인 목록 렌더링
function renderLoanRequests(){
  if(currentUser.role !== "admin") {
    adminLoanRequestsList.innerHTML = "";
    return;
  }
  adminLoanRequestsList.innerHTML = "";

  loanRequests.forEach((loan, idx) => {
    if(loan.approved) return;
    const div = document.createElement("div");
    div.textContent = `${loan.userId} 님이 ${loan.amount} 서창 대출 신청함. `;

    const approveBtn = document.createElement("button");
    approveBtn.textContent = "승인";
    approveBtn.onclick = () => {
      approveLoan(idx);
    };

    div.appendChild(approveBtn);
    adminLoanRequestsList.appendChild(div);
  });
}

// 대출 승인 처리
function approveLoan(idx){
  const loan = loanRequests[idx];
  loan.approved = true;
  users[loan.userId].balance += loan.amount;
  if(currentUser.id === loan.userId) currentUser.balance += loan.amount;
  renderLoanRequests();
  alert(`${loan.userId} 님의 대출이 승인되어 ${loan.amount} 서창이 지급되었습니다.`);
  updateUI();
}

// 주가 10분마다 자동 변동 (예: 10초마다 테스트용)
function updateStockPrices(){
  for(const name in companies){
    let company = companies[name];
    // 랜덤 변동: -5% ~ +5%
    let changeRate = (Math.random() - 0.5) * 0.1;
    let newPrice = company.price * (1 + changeRate);
    if(newPrice < 1) newPrice = 1;
    company.price = +newPrice.toFixed(2);

    // 가격 기록 히스토리에 저장 (최대 50개)
    company.history.push(company.price);
    if(company.history.length > 50) company.history.shift();
  }
  renderCompanies();
  renderStocks();
  updateChart();
}

// 그래프 업데이트 (Chart.js 사용 가정)
let chart = null;
function updateChart(){
  const labels = companies["당근유성"].history.map((_,i) => i + 1);

  const datasets = Object.keys(companies).map(name => ({
    label: name,
    data: companies[name].history,
    borderColor: getRandomColor(name),
    fill: false,
    tension: 0.3,
  }));

  if(chart) chart.destroy();

  chart = new Chart(chartCanvas, {
    type: "line",
    data: { labels, datasets },
    options: { responsive: true, animation: false }
  });
}

function getRandomColor(seed){
  const colors = {
    "당근유성":"#ff6384",
    "트러플마켓":"#36a2eb",
    "서준머니":"#cc65fe",
    "IG전자":"#ffce56",
    "에메존":"#2ecc71",
    "샘숭전자":"#e67e22"
  };
  return colors[seed] || "#000000";
}

// 초기 세팅
function init(){
  // 각 회사 초기 가격 기록 히스토리 세팅
  for(const name in companies){
    companies[name].history.push(companies[name].price);
  }
  // 주가 자동 업데이트 10분마다 (테스트용 10초)
  setInterval(updateStockPrices, 10000);
}

init();
