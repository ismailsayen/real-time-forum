export function SetUrl(path) {
  return window.history.pushState(null, "", path);
}
