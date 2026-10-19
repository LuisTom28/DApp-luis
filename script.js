const questions = [
  {
    question: "¿Qué describe mejor una arquitectura de microservicios?",
    options: [
      "Una aplicación dividida en servicios pequeños que colaboran mediante interfaces",
      "Una única aplicación sin conexión a otros sistemas",
      "Una base de datos compartida por todos los usuarios",
      "Un programa que solo puede ejecutarse en un contenedor"
    ],
    answer: 0,
    explanation: "Los microservicios son servicios autónomos, cada uno responsable de una función, que se comunican a través de interfaces definidas."
  },
  {
    question: "¿Qué suele ocurrir al desplegar una aplicación monolítica?",
    options: [
      "Se despliega únicamente el módulo que cambió",
      "Se publica la aplicación como una sola unidad",
      "Cada equipo despliega su propia base de datos",
      "No hace falta probar la aplicación completa"
    ],
    answer: 1,
    explanation: "En un monolito, sus partes forman una unidad de despliegue; un cambio puede implicar publicar toda la aplicación."
  },
  {
    question: "¿Cuál es una responsabilidad habitual de un API Gateway?",
    options: [
      "Guardar todos los datos de cada servicio",
      "Crear imágenes de contenedores",
      "Recibir solicitudes y dirigirlas al servicio adecuado",
      "Reemplazar las pruebas automatizadas"
    ],
    answer: 2,
    explanation: "El API Gateway actúa como puerta de entrada y enruta las solicitudes hacia los servicios correspondientes."
  },
  {
    question: "¿Qué ventaja puede ofrecer la mensajería entre servicios?",
    options: [
      "Hace innecesario monitorear el sistema",
      "Permite comunicación asíncrona mediante eventos",
      "Garantiza que nunca haya fallos de red",
      "Obliga a todos los servicios a usar el mismo lenguaje"
    ],
    answer: 1,
    explanation: "Con mensajería, un servicio puede publicar un evento y otro procesarlo posteriormente, sin una respuesta inmediata."
  },
  {
    question: "En el enfoque de datos por servicio, ¿quién es responsable de los datos?",
    options: [
      "Un único servicio central siempre",
      "El API Gateway",
      "Cada servicio gestiona sus propios datos",
      "El navegador de la persona usuaria"
    ],
    answer: 2,
    explanation: "Cada servicio es dueño de sus datos. Esta autonomía reduce dependencias, aunque puede complicar las operaciones que abarcan varios servicios."
  },
  {
    question: "¿Para qué se usan los contenedores como Docker?",
    options: [
      "Para empaquetar una aplicación con sus dependencias",
      "Para reemplazar las APIs",
      "Para escribir automáticamente la lógica del negocio",
      "Para garantizar que una aplicación no tenga errores"
    ],
    answer: 0,
    explanation: "Un contenedor empaqueta un servicio y sus dependencias para ejecutarlo de forma consistente en distintos entornos."
  },
  {
    question: "¿Cuál es un desafío común de los sistemas distribuidos?",
    options: [
      "No se pueden escalar servicios por separado",
      "Nunca se puede cambiar el lenguaje de programación",
      "La red puede fallar o presentar demoras",
      "Las aplicaciones no pueden tener pruebas"
    ],
    answer: 2,
    explanation: "Los servicios se comunican por redes, que pueden fallar o demorarse; por eso se diseñan tiempos límite y estrategias de recuperación."
  },
  {
    question: "¿Cuál afirmación sobre microservicios es más sensata?",
    options: [
      "Siempre son la mejor opción, incluso para proyectos pequeños",
      "Eliminan toda la complejidad de una aplicación",
      "Pueden aportar flexibilidad, pero también aumentan la complejidad operativa",
      "No necesitan monitoreo si tienen un API Gateway"
    ],
    answer: 2,
    explanation: "Los microservicios aportan autonomía y escalado selectivo, pero requieren operar y observar más componentes; conviene elegirlos según el contexto."
  }
];

const questionView = document.querySelector("#quiz-question-view");
const questionText = document.querySelector("#question-text");
const questionCounter = document.querySelector("#question-counter");
const questionScore = document.querySelector("#question-score");
const answerOptions = document.querySelector("#answer-options");
const feedbackMessage = document.querySelector("#feedback-message");
const nextButton = document.querySelector("#next-question");
const progress = document.querySelector(".quiz-progress");
const progressBar = document.querySelector("#quiz-progress-bar");
const resultView = document.querySelector("#quiz-result");
const finalScore = document.querySelector("#final-score");
const finalPercentage = document.querySelector("#final-percentage");
const resultTitle = document.querySelector("#result-title");
const resultMessage = document.querySelector("#result-message");
const retryButton = document.querySelector("#retry-quiz");
const backToTopButton = document.querySelector("#back-to-top");
const navigation = document.querySelector("#mainNavigation");

let quizQuestions = [...questions];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let hasAnswered = false;

function renderQuestion() {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;

  questionCounter.textContent = `Pregunta ${questionNumber} de ${quizQuestions.length}`;
  questionScore.textContent = `${correctAnswers} ${correctAnswers === 1 ? "correcta" : "correctas"}`;
  progress.setAttribute("aria-valuenow", String(questionNumber));
  progressBar.style.width = `${(questionNumber / quizQuestions.length) * 100}%`;
  questionText.textContent = currentQuestion.question;
  answerOptions.replaceChildren();
  feedbackMessage.hidden = true;
  feedbackMessage.textContent = "";
  feedbackMessage.className = "feedback-message";
  nextButton.disabled = true;
  nextButton.innerHTML = currentQuestionIndex === quizQuestions.length - 1
    ? "Ver resultado <span aria-hidden=\"true\">→</span>"
    : "Siguiente <span aria-hidden=\"true\">→</span>";
  hasAnswered = false;

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");
    const letter = document.createElement("span");
    const label = document.createElement("span");

    button.type = "button";
    button.className = "answer-option";
    button.dataset.answerIndex = String(index);
    letter.className = "answer-letter";
    letter.setAttribute("aria-hidden", "true");
    letter.textContent = String.fromCharCode(65 + index);
    label.textContent = option;
    button.append(letter, label);
    button.addEventListener("click", () => selectAnswer(index));
    answerOptions.append(button);
  });
}

function selectAnswer(selectedIndex) {
  if (hasAnswered) return;

  hasAnswered = true;
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isCorrect = selectedIndex === currentQuestion.answer;
  const buttons = answerOptions.querySelectorAll(".answer-option");

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === currentQuestion.answer) button.classList.add("is-correct");
    if (index === selectedIndex && !isCorrect) button.classList.add("is-incorrect");
  });

  if (isCorrect) correctAnswers += 1;
  questionScore.textContent = `${correctAnswers} ${correctAnswers === 1 ? "correcta" : "correctas"}`;
  feedbackMessage.classList.add(isCorrect ? "feedback-correct" : "feedback-incorrect");
  feedbackMessage.textContent = `${isCorrect ? "¡Correcto!" : "No exactamente."} ${currentQuestion.explanation}`;
  feedbackMessage.hidden = false;
  nextButton.disabled = false;
  nextButton.focus();
}

function showResults() {
  const percentage = Math.round((correctAnswers / quizQuestions.length) * 100);

  questionView.hidden = true;
  resultView.hidden = false;
  progress.setAttribute("aria-valuenow", String(quizQuestions.length));
  progressBar.style.width = "100%";
  finalScore.textContent = String(correctAnswers);
  finalPercentage.textContent = `${percentage} % de respuestas correctas`;

  if (percentage < 50) {
    resultTitle.textContent = "Sigue practicando";
    resultMessage.textContent = "Vuelve a repasar los conceptos y prueba otra vez. Cada intento ayuda a consolidar lo aprendido.";
  } else if (percentage < 80) {
    resultTitle.textContent = "¡Buen trabajo!";
    resultMessage.textContent = "Ya tienes una buena base sobre microservicios. Repasa los desafíos y sigue explorando.";
  } else {
    resultTitle.textContent = "¡Excelente dominio!";
    resultMessage.textContent = "Has comprendido muy bien los fundamentos. ¡Sigue construyendo y aprendiendo!";
  }

  retryButton.focus();
}

function shuffle(items) {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[randomIndex]] = [shuffledItems[randomIndex], shuffledItems[index]];
  }

  return shuffledItems;
}

nextButton.addEventListener("click", () => {
  if (!hasAnswered) return;

  if (currentQuestionIndex === quizQuestions.length - 1) {
    showResults();
    return;
  }

  currentQuestionIndex += 1;
  renderQuestion();
  questionText.focus();
});

retryButton.addEventListener("click", () => {
  quizQuestions = shuffle(questions);
  currentQuestionIndex = 0;
  correctAnswers = 0;
  resultView.hidden = true;
  questionView.hidden = false;
  renderQuestion();
  questionText.focus();
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
renderQuestion();

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("js-reveal");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
}

function updateBackToTopVisibility() {
  backToTopButton.classList.toggle("is-visible", window.scrollY > 500);
}

window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
updateBackToTopVisibility();

backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelectorAll("#mainNavigation a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 991.98px)").matches && navigation.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(navigation).hide();
    }
  });
});
