/* ===== PROMPT GENERATOR ===== */
const promptForm = document.getElementById("promptForm");
const textarea = document.querySelector("textarea");
const selects = document.querySelectorAll("select");

const output = document.getElementById("output");
const copyButton = document.getElementById("copyBtn");

promptForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const requirement = textarea.value.trim();
  const category = selects[0].value;
  const tone = selects[1].value;

  if (requirement === "") {
    alert("Please enter your requirement.");
    return;
  }

  const prompt = `Act as an expert in ${category}.

Your tone should be ${tone}.

Task:
${requirement}

Provide a detailed, well-structured, and high-quality response.`;

  output.textContent = prompt;
});

copyButton.addEventListener("click", function () {
  const text = output.textContent;

  if (text === "" || text.trim() === "Your generated prompt will appear here.") {
    alert("Generate a prompt first!");
    return;
  }

  navigator.clipboard.writeText(text);
  alert("Prompt copied successfully!");
});

/* ===== FEEDBACK FORM ===== */
const feedbackForm = document.getElementById("feedbackForm");

feedbackForm.addEventListener("submit", function (event) {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (name === "" || email === "" || message === "") {
    event.preventDefault();
    alert("Please fill in all fields.");
    return;
  }

  alert("Thank you for your feedback, " + name + "!");
});

/* ===== HAMBURGER MENU ===== */
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navList = document.getElementById("navList");
const navLinks = document.querySelectorAll(".nav-link");

hamburgerBtn.addEventListener("click", function () {
  const isOpen = navList.classList.toggle("open");
  hamburgerBtn.classList.toggle("open", isOpen);
  hamburgerBtn.setAttribute("aria-expanded", isOpen);
});

navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    navList.classList.remove("open");
    hamburgerBtn.classList.remove("open");
    hamburgerBtn.setAttribute("aria-expanded", "false");

    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});