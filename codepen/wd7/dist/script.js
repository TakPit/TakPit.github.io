class LightBoxImage extends HTMLElement {
  get dialog() {
    const attr = this.getAttribute("dialog-id");
    return document.getElementById(attr);
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.image = this.querySelector("img");
    this.shadowRoot.innerHTML = this.setupToggle();
    this.toggle = this.shadowRoot.querySelector("button");
    this.toggle.addEventListener("click", this);
    this.dialog.addEventListener("click", this);
    this.dialog.addEventListener("cancel", this);
  }

  setupToggle() {
    return `
      <style>
        button {
          all: unset;
          outline: revert;
          display: grid;
          grid-template-areas: "box";
        }
        button > * {
          grid-area: box;
        }
        img {
          max-width: 100%;
          height: auto;
          visibility: hidden;
        }
      </style>
      <button aria-label="Open lightbox">
        ${this.image.outerHTML}
        <div>
          <slot></slot>
        </div>
      </button>
    `;
  }

  handleEvent(e) {
    this[`on${e.type}`](e);
  }

  onclick(e) {
    if (e.currentTarget === this.toggle) {
      this.moveImage(() => this.moveImageToTarget());
    }

    if (e.currentTarget === this.dialog) {
      this.dialogCallback(e);
    }
  }

  // Handle "escape" key dialog event
  oncancel(e) {
    this.dialogCallback(e);
  }

  dialogCallback(e) {
    if (this.dialog.contains(this.image)) {
      e.preventDefault();
      this.moveImage(() => this.moveImageBack());
    }
  }

  moveImage(fn) {
    if (!document.startViewTransition) {
      fn();
    } else {
      this.handleViewTransition(fn);
    }
  }

  async handleViewTransition(fn) {
    this.image.style.viewTransitionName = "active-lightbox-image";

    const transition = document.startViewTransition(() => fn());

    try {
      await transition.finished;
    } finally {
      this.image.style.removeProperty("view-transition-name");
    }
  }

  moveImageToTarget() {
    this.dialog.append(this.image);
    this.dialog.showModal();
  }

  moveImageBack(e) {
    this.append(this.image);
    this.dialog.close();
  }
}

customElements.define("lightbox-image", LightBoxImage);