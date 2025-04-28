import { Toast } from "../toast/toast.js";
import { Header } from "./DisplayHeader.js";
import { HomeBody } from "./HomdeBody.js";

export function HomePage() {
  Header();
  HomeBody();
  const welcome = localStorage.getItem("welcome");
  if (welcome) {
    Toast("Welcome back!");
    localStorage.removeItem("welcome");
  }
}
