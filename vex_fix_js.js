
const Sarvam_API_Key = "Enter Your Sarvam API Key Here";
const Sarvam_ENDPOINT = "https://api.sarvam.ai/v1/chat/completions";

let data = null;
let currentNode = null;

// 🚀 INITIALIZE
document.addEventListener("DOMContentLoaded", () => {
    const goal = localStorage.getItem("savedData") || "Become Pilot";
    document.getElementById("goalHeading").innerText = `GOAL TO BECOME: ${goal}`;
    
    generateRoadmap(goal);

    // Enter Key support for the "Prompt Thingy"
    document.getElementById("quizInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter") submitAnswer();
    });
});

async function generateRoadmap(goal) {
    try {
        const res = await fetch(Sarvam_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Sarvam_API_Key}`
            },
            body: JSON.stringify({
                model: "sarvam-105b",
                messages: [
                    { role: "system", content: "Return roadmap in steps only. Step 1: Title\n- task\n- task. No talk." },
                    { role: "user", content: goal }
                ]
            })
        });
        const json = await res.json();
        const reply = json?.choices?.[0]?.message?.content;
        if (!reply) return fallback();

        data = parseRoadmap(reply, goal);
        initTree();
    } catch (e) { fallback(); }
}

function parseRoadmap(text, goal) {
    const lines = text.split("\n").map(l => l.replace(/[-*0-9.]/g, "").trim()).filter(l => l.length > 3);
    let children = [];
    let currentStep = null;

    lines.forEach(line => {
        if (line.toLowerCase().includes("step")) {
            currentStep = { name: line, completed: false, children: [] };
            children.push(currentStep);
        } else if (currentStep) {
            currentStep.children.push({ name: line, completed: false, children: [] });
        }
    });
    return { name: goal, completed: false, children };
}

function fallback() {
    data = {
        name: "Become Pilot", completed: false,
        children: [{ name: "Step 1: Ground School", completed: false, children: [{ name: "Study Aerodynamics", completed: false }] }]
    };
    initTree();
}

// 🎨 D3 SETUP
const svg = d3.select("#graph");
const g = svg.append("g");

// 🔥 FIXED SPACING: Using nodeSize to prevent overlapping
const treeLayout = d3.tree()
    .nodeSize([300, 180]) // [Horizontal Spacing, Vertical Spacing]
    .separation((a, b) => (a.parent === b.parent ? 1.2 : 1.8));

svg.call(d3.zoom().on("zoom", (e) => g.attr("transform", e.transform)));

function initTree() {
    update();
    // Center the view initially
    d3.zoom().scaleTo(svg, 0.7);
    d3.zoom().translateTo(svg, 0, 150);
}

function update() {
    const root = d3.hierarchy(data);
    treeLayout(root);

    // PROGRESS LOGIC
    calculateProgress();

    // LINKS
    const links = g.selectAll(".link").data(root.links(), d => d.target.data.name);
    links.enter().append("path").attr("class", "link")
        .merge(links)
        .attr("d", d3.linkVertical().x(d => d.x).y(d => d.y));
    links.exit().remove();

    // NODES
    const nodes = g.selectAll(".node").data(root.descendants(), d => d.data.name);
    const enter = nodes.enter().append("g").attr("class", "node")
        .on("click", (e, d) => toggleNode(d))
        .on("dblclick", (e, d) => openQuiz(d));

    enter.append("rect").attr("rx", 12);
    enter.append("text").attr("text-anchor", "middle").attr("dy", "0.35em").style("fill", "white").style("font-size", "12px");

    const merged = enter.merge(nodes);
    merged.attr("transform", d => `translate(${d.x},${d.y})`);
    
    merged.select("text").text(d => d.data.name)
        .each(function(d) { d.bbox = this.getBBox(); });

    merged.select("rect")
        .attr("fill", d => d.data.completed ? "#22c55e" : "#1e293b")
        .attr("stroke", d => d.data.children.length > 0 ? "#6366f1" : "none")
        .attr("stroke-width", 2)
        .attr("x", d => -d.bbox.width / 2 - 15)
        .attr("y", d => -d.bbox.height / 2 - 10)
        .attr("width", d => d.bbox.width + 30)
        .attr("height", d => d.bbox.height + 20);

    nodes.exit().remove();
}

function toggleNode(d) {
    if (d.data.children.length === 0 && !d.data._children) return;
    if (d.data.children.length > 0) {
        d.data._children = d.data.children;
        d.data.children = [];
    } else {
        d.data.children = d.data._children;
        d.data._children = null;
    }
    update();
}

// 🧠 QUIZ LOGIC
async function openQuiz(d) {
    if (d.data.children && d.data.children.length > 0) return; // Only for leaf nodes
    currentNode = d.data;
    
    const modal = document.getElementById("quizModal");
    const qLabel = document.getElementById("quizQuestion");
    
    modal.classList.remove("hidden");
    qLabel.innerText = "Fetching AI Challenge...";

    try {
        const res = await fetch(Sarvam_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Sarvam_API_Key}` },
            body: JSON.stringify({
                model: "sarvam-105b",
                messages: [{ role: "system", content: "Ask one short question about this topic." }, { role: "user", content: currentNode.name }]
            })
        });
        const json = await res.json();
        qLabel.innerText = json?.choices?.[0]?.message?.content || "What is a key concept of this step?";
    } catch (e) { qLabel.innerText = "Briefly describe this step to pass."; }
}

function submitAnswer() {
    const val = document.getElementById("quizInput").value;
    if (val.length < 2) return;
    
    currentNode.completed = true;
    updateNodeCompletion(data);
    update();
    closeQuiz();
}

function closeQuiz() {
    document.getElementById("quizModal").classList.add("hidden");
    document.getElementById("quizInput").value = "";
}

// 📈 UTILS
function updateNodeCompletion(node) {
    if (node.children && node.children.length > 0) {
        const allDone = node.children.every(c => updateNodeCompletion(c));
        node.completed = allDone;
        return allDone;
    }
    return node.completed;
}

function calculateProgress() {
    const root = d3.hierarchy(data);
    const leaves = root.leaves();
    const completedLeaves = leaves.filter(d => d.data.completed).length;
    const percent = Math.round((completedLeaves / leaves.length) * 100);

    document.getElementById("progressBar").style.width = percent + "%";
    document.getElementById("progressText").innerText = percent + "%";
}
