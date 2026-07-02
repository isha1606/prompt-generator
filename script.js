
const toastContainer = document.getElementById("toastContainer");

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "toast" + (type === "error" ? " error" : "");
  toast.textContent = message;
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}


const scrollProgress = document.getElementById("scrollProgress");

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = percent + "%";
}

window.addEventListener("scroll", updateScrollProgress);
updateScrollProgress();


const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach((el) => revealObserver.observe(el));

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("data-nav") === id);
      });
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach((section) => spyObserver.observe(section));


const hamburgerBtn = document.getElementById("hamburgerBtn");
const navList = document.getElementById("navList");
const backdrop = document.getElementById("backdrop");

function closeMenu() {
  navList.classList.remove("open");
  hamburgerBtn.classList.remove("open");
  hamburgerBtn.setAttribute("aria-expanded", "false");
  backdrop.classList.remove("open");
}

function toggleMenu() {
  const isOpen = navList.classList.toggle("open");
  hamburgerBtn.classList.toggle("open", isOpen);
  hamburgerBtn.setAttribute("aria-expanded", isOpen);
  backdrop.classList.toggle("open", isOpen);
}

hamburgerBtn.addEventListener("click", toggleMenu);
backdrop.addEventListener("click", closeMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});


const promptForm = document.getElementById("promptForm");
const textarea = document.getElementById("requirement");
const categorySelect = document.getElementById("category");
const toneSelect = document.getElementById("tone");
const charCount = document.getElementById("charCount");

const output = document.getElementById("output");
const copyButton = document.getElementById("copyBtn");
const downloadButton = document.getElementById("downloadBtn");
const clearButton = document.getElementById("clearBtn");
const generateBtn = document.getElementById("generateBtn");
const generateSpinner = document.getElementById("generateSpinner");

const historyList = document.getElementById("historyList");
const historyEmpty = document.getElementById("historyEmpty");
const statCount = document.getElementById("statCount");

let promptHistory = [];
let generatedCount = 0;

textarea.addEventListener("input", () => {
  charCount.textContent = textarea.value.length;
});

function buildPrompt(requirement, category, tone) {
  return `Act as an expert in ${category}.

Your tone should be ${tone}.

Task:
${requirement}

Provide a detailed, well-structured, and high-quality response.`;
}

function renderHistory() {
  historyList.innerHTML = "";

  if (promptHistory.length === 0) {
    historyEmpty.style.display = "block";
    return;
  }

  historyEmpty.style.display = "none";

  promptHistory.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="history-meta">${item.category} · ${item.tone}</span>
      <span class="history-snippet">${item.requirement}</span>
    `;
    li.addEventListener("click", () => {
      textarea.value = item.requirement;
      categorySelect.value = item.category;
      toneSelect.value = item.tone;
      charCount.textContent = item.requirement.length;
      output.textContent = item.prompt;
      window.scrollTo({ top: document.getElementById("output-section").offsetTop - 70, behavior: "smooth" });
    });
    historyList.appendChild(li);
  });
}

promptForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const requirement = textarea.value.trim();
  const category = categorySelect.value;
  const tone = toneSelect.value;

  if (requirement === "") {
    showToast("Please enter your requirement.", "error");
    return;
  }

  generateBtn.classList.add("loading");

  setTimeout(() => {
    const prompt = buildPrompt(requirement, category, tone);
    output.textContent = prompt;

    promptHistory.unshift({ requirement, category, tone, prompt });
    if (promptHistory.length > 5) promptHistory.pop();
    renderHistory();

    generatedCount++;
    statCount.textContent = generatedCount;

    generateBtn.classList.remove("loading");
    showToast("Prompt generated successfully!");

    document.getElementById("output-section").scrollIntoView({ behavior: "smooth", block: "start" });
  }, 450);
});

clearButton.addEventListener("click", function () {
  promptForm.reset();
  charCount.textContent = "0";
  textarea.focus();
});

copyButton.addEventListener("click", function () {
  const text = output.textContent;

  if (text === "" || text.trim() === "Your generated prompt will appear here.") {
    showToast("Generate a prompt first!", "error");
    return;
  }

  navigator.clipboard.writeText(text);
  showToast("Prompt copied to clipboard!");
});

downloadButton.addEventListener("click", function () {
  const text = output.textContent;

  if (text === "" || text.trim() === "Your generated prompt will appear here.") {
    showToast("Generate a prompt first!", "error");
    return;
  }

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "prompt.txt";
  link.click();
  URL.revokeObjectURL(url);

  showToast("Prompt downloaded!");
});

const accordionItems = document.querySelectorAll(".accordion-item");

accordionItems.forEach((item) => {
  const trigger = item.querySelector(".accordion-trigger");
  trigger.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    accordionItems.forEach((other) => other.classList.remove("open"));
    if (!isOpen) item.classList.add("open");
  });
});

const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  backToTopBtn.classList.toggle("visible", window.scrollY > 400);
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const feedbackForm = document.getElementById("feedbackForm");

feedbackForm.addEventListener("submit", function (event) {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (name === "" || email === "" || message === "") {
    event.preventDefault();
    showToast("Please fill in all fields.", "error");
    return;
  }

  showToast("Thank you for your feedback, " + name + "!");
});
