async function isLogged() {
  let resp = await fetch("/isLog");
  const data = await resp.json();
  if (data.status === 403) {
    window.history.pushState(null, "", "/auth");
  }
}
isLogged();
