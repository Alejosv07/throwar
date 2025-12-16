# Throw-AR 🎯

**Throw-AR** es un juego de simulación física en 3D desarrollado con **Three.js** y **Cannon-es**. Originalmente concebido para Realidad Aumentada, esta versión está optimizada para navegadores web estándar, ofreciendo una experiencia de tiro precisa y adictiva basada en físicas reales.

📍 **Demo en vivo:** [alejosv07.github.io/throwar/](https://www.google.com/search?q=https://alejosv07.github.io/throwar/)

---

##🎮 Sobre el JuegoEl objetivo es simple pero desafiante: utiliza una pelota con físicas dinámicas para derribar una estructura de cubos. El juego pone a prueba tu puntería y el cálculo de potencia mediante un sistema de interacción por deslizamiento (drag-and-shoot).

###Características principales:* **Motor de Física Real:** Gracias a `cannon-es`, cada impacto, rebote y caída de los cubos se calcula de forma realista.
* **Sistema de Puntuación Inteligente:** Los puntos se otorgan solo cuando los cubos son efectivamente derribados (basado en su ángulo de inclinación).
* **Control Intuitivo:** Soporte completo para Mouse y pantallas Táctiles mediante un sistema de Raycasting que detecta la dirección de tu disparo.
* **Gestión de Intentos:** Tienes un número limitado de vidas para lograr la mayor puntuación posible.

---

##🚀 Tecnologías Utilizadas* **[Three.js](https://threejs.org/):** Renderizado de gráficos 3D y gestión de la escena.
* **[Cannon-es](https://pmndrs.github.io/cannon-es/):** Motor de físicas para colisiones dinámicas.
* **[GSAP](https://greensock.com/gsap/):** Animaciones fluidas de cámara y transiciones de interfaz.
* **JavaScript (ES6+):** Lógica del juego estructurada en módulos.

---

##🛠️ Mecánicas Técnicas Destacadas###Detección de Reposo (Sleep Detection)Para mejorar el flujo del juego, se implementó una lógica personalizada en la clase `Tick` que detecta cuando la pelota se ha detenido o se mueve a una velocidad insignificante. Esto permite resetear el tiro automáticamente sin esperar a que el usuario lo haga manualmente.

###Bloqueo de InteracciónSe integró un sistema de estados (`isBallInPlay`) que bloquea nuevos disparos mientras la pelota actual está en movimiento, evitando interferencias accidentales en los cálculos físicos.

###Cálculo de Potencia DinámicaLa fuerza del lanzamiento se calcula en base al tiempo que el usuario mantiene presionado el click/touch, permitiendo tiros cortos precisos o lanzamientos potentes a larga distancia.

---

##📦 Instalación y Uso Local1. Clona este repositorio:
```bash
git clone https://github.com/tu-usuario/throwar.git

```


2. Asegúrate de tener un servidor local (como *Live Server* de VS Code) para evitar problemas con la carga de texturas y módulos.
3. Abre `index.html` en tu navegador.

---

##👤 Autor**Alejandro Romero**

* [Perfil de GitHub](https://www.google.com/search?q=https://github.com/alejosv07)
* [ARFLOW](https://www.google.com/search?q=https://tu-link-de-arflow.com)

---

*Este proyecto fue desarrollado con un enfoque inicial en WebXR, evolucionando hacia una experiencia web 3D optimizada y accesible.*
