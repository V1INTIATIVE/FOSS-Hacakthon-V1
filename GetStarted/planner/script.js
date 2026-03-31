const user = JSON.parse(localStorage.getItem("tulipUser"));

document.getElementById("welcome").textContent = "Hi " + user.name;

let points = user.points || 0;
document.getElementById("points").textContent = "Points: " + points;

let treeData = [];

async function generatePlan() {
  const res = await fetch("https://api.sarvam.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + user.apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "sarvam",
      messages: [
        {
          role: "user",
          content: `Create 7 actionable steps for this goal: ${user.goal}. Return ONLY JSON array like [{"title":"..."}]`
        }
      ]
    })
  });

  const data = await res.json();

  let parsed;
  try {
    parsed = JSON.parse(data.choices[0].message.content);
  } catch {
    parsed = [
      { title: "Start" },
      { title: "Learn basics" },
      { title: "Practice" },
      { title: "Build project" },
      { title: "Improve" },
      { title: "Test skills" },
      { title: "Achieve goal" }
    ];
  }

  treeData = parsed.map((item, i) => ({
    id: i + Date.now(),
    title: item.title,
    done: false
  }));

  renderTree();
}

function renderTree() {
  const container = document.getElementById("tree");
  container.innerHTML = "";

  const level = document.createElement("div");
  level.className = "level";

  treeData.forEach(node => {
    const div = document.createElement("div");
    div.className = "node" + (node.done ? " done" : "");
    div.textContent = node.title;

    div.onclick = () => completeNode(node.id);

    level.appendChild(div);
  });

  container.appendChild(level);
}

function completeNode(id) {
  const node = treeData.find(n => n.id === id);
  if (!node || node.done) return;

  node.done = true;

  points++;
  user.points = points;
  localStorage.setItem("tulipUser", JSON.stringify(user));
  document.getElementById("points").textContent = "Points: " + points;

  checkCollapse();
  renderTree();
}

function checkCollapse() {
  const allDone = treeData.every(n => n.done);

  if (allDone && treeData.length > 1) {
    const next = [];

    for (let i = 0; i < treeData.length; i += 2) {
      next.push({
        id: Date.now() + i,
        title: "Next Stage",
        done: false
      });
    }

    treeData = next;
  }
}

generatePlan(); 