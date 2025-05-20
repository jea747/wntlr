// ==== 유저 정보 (관리자 + 일반 유저) ====
const users = {
  wjdwogus: { password: "wjdwogus", role: "admin", balance: 100000, loans: [], stocks: {} },
};

for(let i=1; i<=23; i++){
  if(i === 20) continue; // 20번 없음
  users[`user${i}`] = { password: "1234", role: "user", balance: 50000, loans: [], stocks: {} };
}

// ==== 회사 정보 (초기 6개, 가격은 정수, 10~19 사이) ====
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

const addSeedUserIdInput = document.getElementById("add-seed-userid");
const addSeedAmountInput = document.getElementById("add-seed-amount");
const addSeedBtn = document.getElementById("add-seed-btn");

const chartCanvas = document.getElementById("price-chart").getContext("2d");

let loanRequests = []; // { userId, amount, approved }

// ======= 함수 =======

// 랜덤 가격 생성 (10 ~ 19 사이 정수)
function getRandomPrice() {
  return Math.floor(10 + Math.random() * 10);
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
  if (users아, 거기서 끊겼구나!  
내가 이어서 완성된 `app.js` 전체 코드를 다시 정리해서 올릴게.  
로그인부터 시작해서 시드머니 추가, 대출 신청 및 승인, 주식 매수/매도, 주가 변동, 그래프까지 다 포함된 완전한 코드야.  

---

```js
// ==== 유저 정보 (관리자 + 일반 유저) ====
const users = {
  wjdwogus: { password: "wjdwogus", role: "admin", balance: 100000, loans: [], stocks: {} },
};

for(let i=1; i<=23; i++){
  if(i === 20) continue; // 20번은 없음
  users[`user${i}`] = { password: "1234", role: "user", balance: 50000, loans: [], stocks: {} };
}

// ==== 회사 정보 (초기 6개, 가격은 10~19 사이 정수) ====
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

const addSeedUserIdInput = document.getElementById("add-seed-userid");
const addSeedAmountInput = document.getElementById("add-seed-amount");
const addSeedBtn = document.getElementById("add-seed-btn");

const chartCanvas = document.getElementById("price-chart").getContext("2d");

let loanRequests = []; // { userId, amount, approved }

// ======= 함수 =======

// 랜덤 가격 생성 (10 ~ 19 사이 정수)
function getRandomPrice() {
  return Math.floor(10 + Math.random() * 10);
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

  currentUser = id;
  clearLoginMsg();
  loginSection.style.display = "none";
  mainSection.style.display = "block";

  welcomeMsg.textContent = `${currentUser}님 환영합니다!`;

  if(users[currentUser].role === "admin"){
    adminSection.style.display = "block";
  } else {
    adminSection.style.display = "none";
  }

  refreshUI();
});

// 로그아웃
logoutBtn.addEventListener("click", () => {
  currentUser = null;
  loginSection.style.display = "flex";
  mainSection.style.display = "none";
  document.getElementById("userid").value = "";
  document.getElementById("password").value = "";
  clearLoginMsg();
  loanMsg.textContent = "";
});

// UI 갱신 함수
function refreshUI() {
  balanceSpan.textContent = users[currentUser].balance;
  renderStocks();
  renderCompanies();
  renderLoanRequests();
}

// 보유 주식 렌더링
function renderStocks() {
  stocksList.innerHTML = "";
  const stocks = users[currentUser].stocks;
  if(Object.keys(stocks).length === 0){
    stocksList.innerHTML = "<li>보유 주식이 없습니다.</li>";
    return;
  }
  for(const company in stocks){
    stocksList.innerHTML += `<li>${company}: ${stocks[company]}주</li>`;
  }
}

// 회사 목록 렌더링
function renderCompanies() {
  companiesList.innerHTML = "";
  for(const company in companies){
    const price = companies[company].price;
    const div = document.createElement("div");
    div.innerHTML = `
      <h4>${company}</h4>
      <p>현재가: ${price} 서창</p>
      <input type="number" id="buy-${company}" placeholder="매수 주식 수" min="1" style="width:120px" />
      <button onclick="buyStock('${company}')">매수</button>
      <input type="number" id="sell-${company}" placeholder="매도 주식 수" min="1" style="width:120px" />
      <button onclick="sellStock('${company}')">매도</button>
    `;
    companiesList.appendChild(div);
  }
}

// 주식 매수
function buyStock(company){
  if(!currentUser) return alert("로그인 해주세요.");

  const input = document.getElementById(`buy-${company}`);
  const buyCount = Math.floor(Number(input.value));
  if(!buyCount || buyCount <= 0) return alert("매수할 주식 수를 올바르게 입력하세요.");

  const price = companies[company].price;
  const cost = price * buyCount;

  if(users[currentUser].balance < cost){
    alert("잔액이 부족합니다.");
    return;
  }

  users[currentUser].balance -= cost;
  if(!users[currentUser].stocks[company]) users[currentUser].stocks[company] = 0;
  users[currentUser].stocks[company] += buyCount;

  input.value = "";
  refreshUI();
}

// 주식 매도
function sellStock(company){
  if(!currentUser) return alert("로그인 해주세요.");

  const input = document.getElementById(`sell-${company}`);
  const sellCount = Math.floor(Number(input.value));
  if(!sellCount || sellCount <= 0) return alert("매도할 주식 수를 올바르게 입력하세요.");

  const owned = users[currentUser].stocks[company] || 0;
  if(sellCount > owned){
    alert("보유한 주식 수보다 많이 매도할 수 없습니다.");
    return;
  }

  const price = companies[company].price;
  const income = price * sellCount;

  users[currentUser].stocks[company] -= sellCount;
  if(users[currentUser].stocks[company] === 0) delete users[currentUser].stocks[company];

  users[currentUser].balance += income;

  input.value = "";
  refreshUI();
}

// 대출 신청
loanApplyBtn.addEventListener("click", () => {
  if(!currentUser) return alert("로그인 해주세요.");
  if(users[currentUser].role === "admin") return alert("관리자는 대출 신청할 수 없습니다.");

  const amount = Math.floor(Number(loanInput.value));
  if(!amount || amount <= 0){
    loanMsg.textContent = "대출 금액을 올바르게 입력하세요.";
    return;
  }

  // 이미 대출 신청 중인지 체크
  if(loanRequests.some(r => r.userId === currentUser && !r.approved)){
    loanMsg.textContent = "이미 대출 신청 중입니다. 관리자의 승인을 기다리세요.";
    return;
  }

  loanRequests.push({ userId: currentUser, amount: amount, approved: false });
  loanMsg.textContent = `대출 신청 완료: ${amount} 서창. 관리자의 승인을 기다려주세요.`;
  loanInput.value = "";

  renderLoanRequests();
});

// 관리자 대출 신청 목록 렌더링
function renderLoanRequests(){
  if(users[currentUser].role !== "admin"){
    adminLoanRequestsList.innerHTML = "";
    return;
  }

  let html = "";
  loanRequests.forEach((req, idx) => {
    if(req.approved) return;
    html += `
      <div style="border:1px solid #ccc; margin-bottom:8px; padding:8px; border-radius:8px;">
        <p>신청자: ${req.userId}</p>
        <p>금액: ${req.amount} 서창</p>
        <button onclick="approveLoan(${idx})">승인</button>
        <button onclick="rejectLoan(${idx})">거절</button>
      </div>
    `;
  });

  adminLoanRequestsList.innerHTML = html || "<p>승인 대기중인 대출 신청이 없습니다.</p>";
}

// 대출 승인
window.approveLoan = function(idx){
  const req = loanRequests[idx];
  if(!req) return alert("잘못된 요청입니다.");

  req.approved = true;
  users[req.userId].balance += req.amount;
  users[req.userId].loans.push(req.amount);

  renderLoanRequests();
  if(req.userId === currentUser) refreshUI();
}

// 대출 거절
window.rejectLoan = function(idx){
  loanRequests.splice(idx, 1);
  renderLoanRequests();
}

// 관리자 시드머니 추가
addSeedBtn.addEventListener("click", () => {
  if(users[currentUser].role !== "admin") return alert("관리자만 시드머니를 추가할 수 있습니다.");

  const userid = addSeedUserIdInput.value.trim();
  const amount = Math.floor(Number(addSeedAmountInput.value));

  if(!userid || !users[userid]){
    alert("존재하는 유저 아이디를 입력하세요.");
    return;
  }
  if(!amount || amount <= 0){
    alert("추가할 시드머니를 올바르게 입력하세요.");
    return;
  }

  users[userid].balance += amount;
  alert(`${userid}님에게 ${amount} 서창을 추가했습니다.`);

  addSeedUserIdInput.value = "";
  addSeedAmountInput.value = "";

  if(userid === currentUser) refreshUI();
});

// 주가 10분마다 변동 (테스트용 10초 간격)
function updateStockPrices(){
  for(const company in companies){
    let change = Math.floor(Math.random() * 5) - 2; // -2 ~ +2 사이 변화
    let newPrice = companies[company].price + change;
    if(newPrice < 1) newPrice = 1;
    companies[company].price = newPrice;

    // 가격 기록 저장 (최대 30개)
    companies[company].history.push(newPrice);
    if(companies[company].history.length > 30) {
      companies[company].history.shift();
    }
  }
  refreshUI();
  updateChart();
}

// 차트 객체
let priceChart = null;

// 차트 업데이트
function updateChart(){
  const labels = Array.from({length: 30}, (_, i) => i + 1);

  const datasets = Object.keys(companies).map(company => {
    return {
      label: company,
      data: companies[company].history,
      borderColor: getRandomColor(company),
      fill: false,
      tension: 0.3
    }
  });

  if(priceChart) {
    priceChart.data.labels = labels;
    priceChart.data.datasets = datasets;
    priceChart.update();
  } else {
    priceChart = new Chart(chartCanvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: '주가 변동 그래프 (최근 30회)'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }
}

// 회사별 고정 색상
const colorMap = {
  "당근유성": "#f28b82",
  "트러플마켓": "#fbbc04",
  "서준머니": "#34a853",
  "IG전자": "#4285f4",
  "에메존": "#9c27b0",
  "샘숭전자": "#ff6d01"
};
function getRandomColor(company){
  return colorMap[company] || "#" + Math.floor(Math.random()*16777215).toString(16);
}

// 초기 히스토리 값 채우기
for(const c in companies){
  companies[c].history = Array(30).fill(companies[c].price);
}

// 주가 업데이트 주기 
setInterval(updateStockPrices, 600000);

// 페이지 로드 시 초기화
window.onload = () => {
  loginSection.style.display = "flex";
  mainSection.style.display = "none";
};
