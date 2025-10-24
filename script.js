const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const themeSelect = document.getElementById("themeSelect");
const fontSelect = document.getElementById("fontSelect");

const searches = [
  "how to make cookies", "how to make cake", "how to build a pc", "how to code a game",
  "how to fix a car", "how to learn guitar", "how to invest money", "best travel destinations",
  "funny jokes", "how to learn javascript", "how to lose weight", "how to gain muscle",
  "history of soccer", "world capitals", "best free ai tools", "how to meditate", "how to cook rice",
  "how to make pizza", "how to start a business", "how to get better sleep", "how to train a dog",
  "how to get a job", "how to study effectively", "how to be confident", "how to save money",
  "how to write a resume", "best movies 2025", "how to make a website", "how to stay motivated",
  "how to clean a computer", "best laptops 2025", "how to use photoshop", "how to improve memory",
  "how to make friends", "how to learn python", "how to start youtube channel", "best workout routines",
  "how to make coffee", "how to draw", "how to play piano", "how to paint", "how to garden",
  "how to repair phone", "how to make ice cream", "how to make a smoothie", "how to do taxes",
  "how to change a tire", "how to swim", "how to skateboard", "how to play chess",
  "how to cook steak", "how to write a book", "how to travel cheap", "how to fix wifi",
  "how to learn spanish", "how to fix keyboard", "how to make lasagna", "how to organize desk",
  "how to use blender 3d", "how to edit video", "how to make pasta", "how to start podcast",
  "how to bake bread", "how to write essay", "how to get stronger", "how to cook eggs",
  "how to fix phone screen", "how to learn french", "how to take good photos", "how to start investing",
  "how to play soccer", "how to start garden", "how to be productive", "how to design logo",
  "how to learn coding", "how to use excel", "how to make smoothie bowl", "how to make cookies easy",
  "how to make salad", "how to fix slow computer", "how to buy stocks", "how to build muscle fast",
  "how to stop procrastinating", "how to get better grades", "how to stretch properly",
  "how to do pushups", "how to eat healthy", "how to sleep better", "how to start small business",
  "how to make money online", "how to fix printer", "how to reset password", "how to be happier",
  "how to relax", "how to start running", "how to clean room", "how to learn typing", 
  "how to play guitar", "how to get rid of acne", "how to focus better", "how to learn singing",
  "how to build confidence", "how to plan trip", "how to make soup", "how to fix mouse",
  "how to use photoshop free", "how to cook chicken", "how to make pancakes", "how to learn math",
  "how to fix broken screen", "how to play basketball"
];

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  resultsDiv.innerHTML = "";

  if (query.trim() === "") return;

  const filtered = searches.filter(s =>
    s.toLowerCase().includes(query) || similarity(s, query) > 0.5
  );

  if (filtered.length > 0) {
    filtered.forEach(result => {
      const div = document.createElement("div");
      div.className = "result";
      div.textContent = result;
      div.onclick = () => alert(`Redirecting to: ${result}`);
      resultsDiv.appendChild(div);
    });
  } else {
    const similar = searches.find(s => similarity(s, query) > 0.3);
    resultsDiv.innerHTML = similar
      ? `<p>We don’t have that, but check this out: <strong>${similar}</strong></p>`
      : `<p>No results found.</p>`;
  }
});

function similarity(a, b) {
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;
  return (longerLength - editDistance(longer, shorter)) / longerLength;
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  const costs = new Array();
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) costs[j] = j;
      else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

themeSelect.addEventListener("change", () => {
  document.body.dataset.theme = themeSelect.value;
  applyTheme();
});

fontSelect.addEventListener("change", () => {
  document.body.style.fontFamily = fontSelect.value;
});

function applyTheme() {
  const theme = document.body.dataset.theme;
  switch (theme) {
    case "dark":
      document.body.style.background = "#121212";
      document.body.style.color = "#eee";
      break;
    case "blue":
      document.body.style.background = "#eaf3ff";
      document.body.style.color = "#003366";
      break;
    default:
      document.body.style.background = "#fff";
      document.body.style.color = "#222";
  }
}
