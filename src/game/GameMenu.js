export class GameMenu {
  constructor(doc) {
    this.document = doc;
  }

  generateGameMenuInitHTML() {
    return `
         <!-- Game -->
        <div class="game">
            <div class="game__box">
                <h1 class="game__box__title"><span class="throw">Throw</span><span class="show">-</span><span class="identy-color ar">AR</span></h1>
                <span class="bybox"><small class="by">By Alejandro Romero <span><a class="identy-color social-network" href="https://www.tiktok.com/@arflow.jv" target="_blank">ARFLOW</a></span></small></span>
                </div>
                <button type="button" class="game__box__startButton">
                Iniciar
                </button>
                
                </div>
                `;
  }

  addGameMenuInit() {
    if (this.document) {
      const gameElement = this.document.querySelector(".main");
      gameElement.insertAdjacentHTML(
        "beforeend",
        this.generateGameMenuInitHTML()
      );
    }
  }
  removeGameMenuInit() {
    const gameElement = this.document.querySelector(".game");
    if (gameElement) {
      gameElement.classList.add("is-hidden");
      
      setTimeout(() => {
        if (gameElement.parentElement) {
          gameElement.parentElement.removeChild(gameElement);
        }
      }, 500);
    }
  }

  addEventListenerButtonPlay(callback) {
    if (this.document) {
      this.document
        .querySelector(".game__box__startButton")
        .addEventListener("click", () => {
          this.removeGameMenuInit();
          callback();
        });
    }
  }
}
