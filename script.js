function signup() {
  const name = document.getElementById("name").value;
  let goal = document.getElementById("goal").value;
  const key = document.getElementById("apikey").value;

  if (!name || !goal || !key) return;

  const user = {
    name: name,
    goal: goal,
    apiKey: key,
    points: 0
  };

  localStorage.setItem("tulipUser", JSON.stringify(user));

  window.location.href = "planner.html";
}


export let goal;
