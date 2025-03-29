let audio = document.getElementById("audioEjetar");
let bt_ejetar = document.getElementById("bt-ejetar");
let bt_parar = document.getElementById("bt-parar");
let vibrationActive = true;
let vibrationInterval;
let progressInterval; // Variável para controlar o intervalo da porcentagem

function isSafari() {
  console.log(navigator.userAgent);
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

const switcher = document.getElementById("switcher");
if (isSafari()) {
  switcher.style.display = "none";
  vibrationActive = false;
}

const audioVibrationButton = document.getElementById("audio-vibration");
const audioButton = document.getElementById("audio");

audioVibrationButton.addEventListener("click", () => {
  audioVibrationButton.classList.add("active");
  audioVibrationButton.classList.remove("inactive");
  audioButton.classList.add("inactive");
  audioButton.classList.remove("active");
  vibrationActive = true;
  console.log("Vibração ativada");
});

audioButton.addEventListener("click", () => {
  audioButton.classList.add("active");
  audioButton.classList.remove("inactive");
  audioVibrationButton.classList.add("inactive");
  audioVibrationButton.classList.remove("active");
  vibrationActive = false;
  console.log("Vibração desativada");
});

const ejetar = () => {
  if (vibrationActive) {
    vibrar();
  }
  audio.play();
  console.log("Ejetando...");
  bt_ejetar.style.display = "none";
  bt_parar.style.display = "block";

  // Reiniciando a porcentagem corretamente
let duration = audio.duration;
let currentTime = 0;
bt_parar.style.backgroundColor = "#007bbd"; // Azul mais claro quando ativo
clearInterval(progressInterval);

let dotIndex = 0;
const dots = ["", ".", "..", "..."]; // Ciclo de pontos

// Definir o texto imediatamente para evitar atraso
let percent = Math.round((currentTime / duration) * 100);
bt_parar.innerText = `Ejetando Água${dots[dotIndex]}\n${percent}%`;

progressInterval = setInterval(() => {
  if (currentTime >= duration) {
    clearInterval(progressInterval);
    bt_parar.innerText = "Parar";
    bt_parar.style.backgroundColor = "";
  } else {
    currentTime += 0.5;
    percent = Math.round((currentTime / duration) * 100);
    dotIndex = (dotIndex + 1) % dots.length; // Alterna os pontos
    bt_parar.innerText = `Ejetando Água${dots[dotIndex]}\n${percent}%`;
  }
}, 500);

  audio.addEventListener("ended", () => {
    alert("Água ejetada com sucesso, se for necessário repita o processo!");
    parar();
  });
};

const parar = () => {
  pararVibracao();
  audio.pause();
  audio.currentTime = 0;
  console.log("Parei!");
  bt_ejetar.style.display = "block";
  bt_parar.style.display = "none";

  // Zerando a porcentagem e limpando o intervalo
  clearInterval(progressInterval);
  bt_parar.innerText = "Parar";
};

const vibrar = () => {
  if ("vibrate" in navigator) {
    vibrationInterval = setInterval(() => {
      navigator.vibrate([1000]);
    }, 1000); // Vibrar a cada segundo
  }
  audio.addEventListener("ended", pararVibracao);
};

function pararVibracao() {
  if (vibrationInterval) {
    clearInterval(vibrationInterval);
  }
  if ("vibrate" in navigator) {
    navigator.vibrate(0);
  } else {
    console.log("A API de vibração não é suportada por este dispositivo.");
  }
}

bt_ejetar.addEventListener("click", ejetar);
bt_parar.addEventListener("click", parar);
