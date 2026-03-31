
anime({
  targets: "#maintitle span",
  translateY: [100, 0],
  opacity: [0, 1],
  delay: anime.stagger(300),
  duration: 1200,

script.js
1 KB
﻿
anime({
  targets: "#maintitle span",
  translateY: [100, 0],
  opacity: [0, 1],
  delay: anime.stagger(300),
  duration: 1200,
  easing: "easeOutExpo"
});

anime({
  targets: "#Quote",
  opacity: [0, 1],
  delay: 2000,
  duration: 1200,
  easing: "easeOutExpo"
});
anime({
  targets: "#Getstarted",
  opacity: [0, 0.8],
  delay: 2500,
  duration: 1200,
  easing: "easeOutExpo"
})



const hint = document.getElementById("scrollHint");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    hint.style.opacity = "0";
  } else {
    hint.style.opacity = "1";
  }
});

function getButtonPos() {
  const rect = getStarted.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height
  };
}

anime ({
  targets: "#liltimmy",
  opacity: [0, 1],
  delay: 3000,
  duration: 1200,
  easing: "easeOutExpo"
});

