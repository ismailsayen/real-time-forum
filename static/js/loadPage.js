export function LoadPage() {
  let container = document.querySelector(".container");
  let path = location.pathname;
  container.innerHTML = "";
  switch (path) {
    case "/auth":
      const tilte = (document.createElement("h1").textContent = "authPage");
      container.append(tilte);
  }
}
