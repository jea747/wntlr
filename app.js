const loginSection = document.getElementById("loginSection");
const mainSection = document.getElementById("mainSection");

function login() {
  const inputId = document.getElementById("loginId").value.trim();
  const inputPw = document.getElementById("loginPw").value.trim();

  // 관리자 계정
  const adminId = "wjdwogus";
  const adminPw = "wjdwogus 5118dms rmsid tkdydwkfh";

  // 일반 유저: 1~23, 비밀번호 1234
  const idNum = Number(inputId);

  if (inputId === adminId && inputPw === adminPw) {
    alert("관리자 로그인 성공!");
    showMain("관리자");
  } else if (idNum >= 1 && idNum <= 23 && inputPw === "1234") {
    alert(`${idNum}번 일반 유저 로그인 성공!`);
    showMain(idNum);
  } else {
    alert("로그인 실패: 아이디 또는 비밀번호가 틀렸습니다.");
  }
}

function showMain(user) {
  loginSection.style.display = "none";
  mainSection.style.display = "block";
  mainSection.querySelector("p").textContent = `${user}님 환영합니다! 기능 준비중...`;
}

function logout() {
  mainSection.style.display = "none";
  loginSection.style.display = "flex";
  document.getElementById("loginId").value = "";
  document.getElementById("loginPw").value = "";
}

window.onload = () => {
  loginSection.style.display = "flex";
  mainSection.style.display = "none";
};
