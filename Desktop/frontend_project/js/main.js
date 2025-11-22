const textarea = document.getElementById("spamM");
const summary = document.querySelector(".summary");
const outtitle = document.querySelector(".outtitle");
const outputBox = document.querySelector(".output-box");
const btn = document.querySelector(".watch-result");


// 기본화면
function resetUI() {
    summary.textContent = "";
    summary.style.backgroundColor = "#FFFFFF";

    outtitle.style.backgroundColor = "rgba(100, 114, 197, 0.55)";
    outputBox.innerHTML = "";
    outputBox.style.backgroundColor = "#FFFFFF";

    btn.textContent = "분석 결과 보기";
    textarea.value = "";
    textarea.disabled = false;
}


// 분석중 화면
function showLoadingUI() {

    outtitle.style.backgroundColor = "rgba(140, 150, 210, 0.65)";
    outputBox.innerHTML = `
        <p style="font-size:26px; margin-bottom:20px;">
            문자를 분석하는 중입니다
        </p>
        <div class="dots">
            <span></span><span></span><span></span>
        </div>
    `;

    textarea.disabled = true;
}


// 결과화면
function showResultUI(data) {

    // 안정
    if (data.type === "안전") {
        outtitle.style.backgroundColor = "#7BEA7F";
        summary.style.backgroundColor = "#7BEA7F";
    }
    // 경고
    else if (data.type === "주의") {
        outtitle.style.backgroundColor = "#F9DA8D";
        summary.style.backgroundColor = "#F9DA8D";
    }
    // 피싱
    else if (data.type === "피싱") {
        outtitle.style.backgroundColor = "#FE645E";
        summary.style.backgroundColor = "#FE645E";
    }

    summary.textContent = data.type;

    outputBox.innerHTML = `
        <p style="font-size:26px; margin-bottom:15px;">
           ${data.message}
        </p>

        <strong style="font-size:24px;">감지된 위험 요소</strong>
        <ul style="margin-bottom:20px;">
            ${data.danger.map(item => `<li>${item}</li>`).join("")}
        </ul>

        <strong style="font-size:24px;">해결 방법</strong>
        <ul>
            ${data.solve.map(item => `<li>${item}</li>`).join("")}
        </ul>
    `;

    btn.textContent = "다시하기";
}


// 분석 실행
async function analyze() {
    const text = textarea.value.trim();
    if (!text) {
        alert("문자 내용을 입력하세요!");
        return;
    }

    showLoadingUI();

    try {
        const res = await fetch("👉 너의 백엔드 주소 넣을 곳 👈", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ spamM: text })
        });

        const data = await res.json();
        showResultUI(data);

    } catch (err) {
        alert("오류 발생… 다시 시도해주세요.");
        resetUI();
    }
}


// 결과보기 -> 다시하기
btn.addEventListener("click", () => {
    if (btn.textContent === "다시하기") {
        resetUI();
    } else {
        analyze();
    }
});


// 첫 화면
resetUI();
