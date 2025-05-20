// 회사 리스트 초기화
const companies = [
  {name: "(주) 당근유성", price: 0},
  {name: "(주) 서준머니", price: 0},
  {name: "(주) IG전자", price: 0},
  {name: "(주) 에메존", price: 0},
  {name: "(주) 샘숭전자", price: 0},
  {name: "(주) 아뽀", price: 0},
];

// 사용자 정보 (관리자 + 일반 유저)
const users = {
  "wjdwogus": {password: "wjdwogus", role: "admin"},
};
for(let i=1; i<=23; i++){
  if(i === 20) continue; // 20번 없음
  users[i.toString()] = {password: "5118", role: "user"};
}

let currentUser = null;

// 초기 주가 1~20 서창 랜덤
function initPrices(){
  companies.forEach(c => {
    c.price = Math.floor(Math.random()*20) + 1;
  });
}

// 주가 5% 이내로 변동, 1~1000 서창 제한
function fluctuatePrices(){
  companies.forEach(c => {
    let percentChange = (Math.random()*10 - 5) / 100;
    let change = Math.floor(c.price * percentChange);
    c.price += change;
    if(c.price < 1) c.price = 1;
    if(c.price > 1000) c.price = 1000;
  });
  updateStockInfo();
}

// 화면에 주가 표시
function updateStockInfo(){
  const container = document.getElementById('stock-info');
  container.innerHTML = "";
  companies.forEach(c => {
    container.innerHTML += `<div>${c.name} : ${c.price} 서창</div>`;
  });
}

// 로그인 함수
function login(){
  const id = document.getElementById('userId').value.trim();
  const pw = document.getElementById('password').value.trim();
  const msg = document.getElementById('loginMsg');

  if(!users[id]){
    msg.textContent = "존재하지 않는 아이디입니다.";
    return;
  }
  if(users[id].password !== pw){
    msg.textContent = "비밀번호가 틀렸습니다.";
    return;
  }

  currentUser = {id, ...users[id]};
  document.getElementById('login-section').style.display = "none";
  document.getElementById('app').style.display = "block";
  msg.textContent = "";

  initPrices();
  updateStockInfo();
  setInterval(fluctuatePrices, 600000); // 10분마다 주가 변동
}

// 로그아웃
document.getElementById('logoutBtn').addEventListener('click', () => {
  currentUser = null;
  document.getElementById('login-section').style.display = "block";
  document.getElementById('app').style.display = "none";
  document.getElementById('userId').value = "";
  document.getElementById('password').value = "";
  document.getElementById('loginMsg').textContent = "";
});

// 로그인 버튼 클릭 이벤트 연결
document.getElementById('loginBtn').addEventListener('click', login);
