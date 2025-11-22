const textarea = document.getElementById("spamM");
const summary = document.querySelector(".summary");
const outtitle = document.querySelector(".outtitle");
const outputBox = document.querySelector(".output-box");
const btn = document.querySelector(".watch-result");

// ========= 슬라이더 관련 변수 =========
let index = 0;
const totalSlides = 3;
let slideWrap;
let dotsContainer;
let autoSlideInterval;


// ========= 슬라이더 초기화 =========
document.addEventListener("DOMContentLoaded", () => {
    slideWrap = document.getElementById("slideWrap");
    dotsContainer = document.getElementById("dotsContainer");

    if (slideWrap && dotsContainer) {
        startAutoSlide();
        showSlide(0);

        console.log("슬라이더 초기화 성공");
    } else {
        console.log("슬라이더 요소 없음 → 슬라이더 비활성화");
    }
});


// ========= 슬라이더 함수들 =========
function showSlide(n) {
    if (!slideWrap) return;

    index = (n + totalSlides) % totalSlides;
    slideWrap.style.transform = `translateX(-${index * 100}%)`;

    const dots = dotsContainer.querySelectorAll(".dot");
    dots.forEach(dot => dot.classList.remove("active"));
    dots[index].classList.add("active");
}

function nextSlide() {
    showSlide(index + 1);
    resetAutoSlide();
}

function prevSlide() {
    showSlide(index - 1);
    resetAutoSlide();
}

function currentSlide(n) {
    showSlide(n);
    resetAutoSlide();
}

function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 6000);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}


// ========= 기본화면 UI =========
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


// ========= 분석중 화면 =========
function showLoadingUI() {
    outtitle.style.backgroundColor = "rgba(140, 150, 210, 0.65)";

    outputBox.innerHTML = `
        <p style="font-size:34px; margin-bottom:40px;">
            문자를 분석하는 중입니다
        </p>
        <div class="dots">
            <span></span><span></span><span></span>
        </div>
    `;

    textarea.disabled = true;
}


// ========= 분석 결과 화면 =========
function showResultUI(data) {
    if (data.type === "안전") {
        outtitle.style.backgroundColor = "#7BEA7F";
        summary.style.backgroundColor = "#7BEA7F";
    }
    else if (data.type === "주의") {
        outtitle.style.backgroundColor = "#F9DA8D";
        summary.style.backgroundColor = "#F9DA8D";
    }
    else if (data.type === "피싱") {
        outtitle.style.backgroundColor = "#FE645E";
        summary.style.backgroundColor = "#FE645E";
    }

    summary.textContent = data.type;

    if (data.type === "안전") {
        outputBox.innerHTML = `
            <div style="font-size:26px;">
                ${data.message}
            </div>
        `;
        btn.textContent = "다시하기";
        return;
    }

    
    outputBox.innerHTML = `
        <div style="font-size:26px; margin-bottom:10px;">
            ${data.message}
        </div>

        <div class="result-section">
            <strong style="font-size:20px;">감지된 위험 요소</strong>
            <ul style="margin-top:10px;">
                ${data.danger.map(item => `<li>${item}</li>`).join("")}
            </ul>
        </div>

        <div class="result-section">
            <strong style="font-size:20px;">해결 방법</strong>
            <ul style="margin-top:10px;">
                ${data.solve.map(item => `<li>${item}</li>`).join("")}
            </ul>
        </div>
    `;

    btn.textContent = "다시하기";
}


// ========= 분석 실행 =========
async function analyze() {
    const text = textarea.value.trim();

    console.log("입력된 텍스트:", text);

    if (!text) {
        alert("문자 내용을 입력하세요");
        return;
    }

    showLoadingUI();

    try {
        const res = await fetch("https://odontophorous-nicky-uncavilling.ngrok-free.dev/api/classify/", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true"  
            },
            body: JSON.stringify({ text: text })
        });

        console.log("응답 상태:", res.status);

        if (!res.ok) {
            const errorData = await res.json();
            console.error("에러 응답:", errorData);
            alert(`오류: ${errorData.error || '서버 오류'}`);
            resetUI();
            return;
        }

        const data = await res.json();
        showResultUI(data);

    } catch (err) {
        console.error("요청 실패:", err);
        alert("다시 시도해주세요.");
        resetUI();
    }
}


// ========= 버튼 이벤트 =========
btn.addEventListener("click", () => {
    if (btn.textContent === "다시하기") {
        resetUI();
    } else {
        analyze();
    }
});


// ========= 첫 화면 초기화 =========
resetUI();
