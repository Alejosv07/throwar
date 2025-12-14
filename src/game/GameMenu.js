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
                Start game
                </button>
                
                </div>
                `;
  }

  generateGamePointHTML() {
    return `
         <!-- Point -->
         <div class="point">
              <p class="point__text">Score: <span class="point__score pointScore">0</span></p>
                <p class="point__text">Lifes: <span class="point__score lifeScore">3</span></p>
          </div>
                `;
  }

  generateResultHTML(){
    return `
         <!-- Result -->
         <div class="result">
         <div>
         <h2>Thank you for playing this level!</h2>
         <small>with love <span><a class="identy-color social-network" href="https://www.tiktok.com/@arflow.jv" target="_blank">ARFLOW</a></span></small>
         </div>
         <div>
         <p class="point__text">Score: <span class="point__score pointScore">0</span></p>
         </div>
<button type="button" class="btn--play--again" id="playAgain">Play again</button>         
          </div>
                `;
  }

  addGameResult() {
    if (this.document) {
      const gameElement = this.document.querySelector(".main");
      gameElement.insertAdjacentHTML(
        "beforeend",
        this.generateResultHTML()
      );
    }
  }

  addGamePoint() {
    if (this.document) {
      const gameElement = this.document.querySelector(".main");
      gameElement.insertAdjacentHTML(
        "beforeend",
        this.generateGamePointHTML()
      );
    }
  }

  updatePoint(points){
    for (const element of this.document.querySelectorAll(".pointScore")) {
      element.textContent = points;
    }
  }

  updateLife(lifes){
    this.document.querySelector(".lifeScore").textContent = lifes;
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

  
  removeGamePoint() {
    const gameElement = this.document.querySelector(".point");
    if (gameElement) {
      gameElement.classList.add("is-hidden");

      setTimeout(() => {
        if (gameElement.parentElement) {
          gameElement.parentElement.removeChild(gameElement);
        }
      }, 500);
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

  removeGameResult() {
    const gameElement = this.document.querySelector(".result");
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
  
  addEventListenerButtonPlayAgain(callback) {
    if (this.document) {
      this.document
        .querySelector("#playAgain")
        .addEventListener("click", () => {
          this.removeGameResult();
          callback();
        });
    }
  }
}
