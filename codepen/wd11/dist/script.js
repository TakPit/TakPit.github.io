import { VFX } from "https://esm.sh/@vfx-js/core";

class ButtonEffect {
  constructor(button) {
    this.vfx = new VFX();
    button.addEventListener("mouseenter", (e) => {
      this.vfx.add(button, { shader: "glitch", overflow: 100 });
    });

    button.addEventListener("mouseleave", (e) => {
      this.vfx.remove(button);
    });

    button.addEventListener("click", () => {
      window.open("https://hookedtournament.com/", "_blank");
    });
  }
}

class h1Effect {
  constructor(h1) {
    this.vfx = new VFX();
    h1.addEventListener("mouseenter", (e) => {
      this.vfx.add(h1, { shader: "glitch", overflow: 100 });
    });

    h1.addEventListener("mouseleave", (e) => {
      this.vfx.remove(h1);
    });

    h1.addEventListener("click", () => {
      window.open("https://hookedtournament.com/", "_blank");
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ButtonEffect(document.querySelector("button"));
  new h1Effect(document.querySelector("h1"));
});