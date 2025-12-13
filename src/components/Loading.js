export class Loading {
  constructor(documen) {
    this.mainElement = documen.querySelector(".main");
  }

  generateLoadingHtml() {
    return `
         <!-- loading -->
         <section class="loading">
            <p class="loading__word">
                <span>L</span>
                <span>o</span>
                <span>a</span>
                <span>d</span>
                <span>i</span>
                <span>n</span>
                <span>g</span>
            </p>
         </section>
        `;
  }

  activateLoading() {
    this.mainElement.insertAdjacentHTML(
      "beforeend",
      this.generateLoadingHtml()
    );

  }

  disableLoading() {
    const loadingElement = this.mainElement.querySelector(".loading");
    if (loadingElement) {
      loadingElement.classList.add("is-hidden");

      setTimeout(() => {
        if (loadingElement.parentElement) {
          loadingElement.parentElement.removeChild(loadingElement);
        }
      }, 500);
    }
  }
}
