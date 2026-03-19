anime({
  targets: "#maintitle span",
  translateY: [100, 0],
  opacity: [0, 1],
  delay: anime.stagger(200),
  duration: 1000,
  easing: "easeOutExpo"
});

anime({
  targets: "#Quote",
  opacity: [0, 1],
  delay: 1500,
  duration: 1000
});

anime({
  targets: "#Getstarted",
  opacity: [0, 1],
  delay: 1800,
  duration: 1000
});

const timmy = document.getElementById("liltimmy");
const bubble = document.getElementById("timmyBubble");
const btn = document.getElementById("Getstarted");

function getButtonPos() {
  const rect = btn.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height
  };
}

