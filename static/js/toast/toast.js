export function Toast(message) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
}
