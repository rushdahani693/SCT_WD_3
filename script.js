const allQuestions = {
  single: [
    { question: "What is the capital city of Australia?", options: ["Sydney","Melbourne","Canberra","Brisbane"], correctAnswer:"Canberra" },
    { question: "Who painted the Mona Lisa?", options: ["Vincent Van Gogh","Pablo Picasso","Leonardo da Vinci","Claude Monet"], correctAnswer:"Leonardo da Vinci" },
    { question: "What gas do plants absorb from the atmosphere?", options:["Oxygen","Carbon dioxide","Nitrogen","Helium"], correctAnswer:"Carbon dioxide" },
    { question: "Which country hosted the 2016 Summer Olympics?", options:["China","Brazil","United Kingdom","Russia"], correctAnswer:"Brazil" },
    { question: "Which is the smallest planet in our Solar System?", options:["Mercury","Venus","Mars","Pluto"], correctAnswer:"Mercury" }
  ],
  multi: [
    { question: "Which of the following are prime numbers?", options: ["2","4","5","9"], correctAnswers: ["2","5"] },
    { question: "Select the colors in the flag of Germany:", options:["Black","Red","Yellow","Green"], correctAnswers:["Black","Red","Yellow"] },
    { question: "Which of the following animals are reptiles?", options:["Snake","Frog","Crocodile","Dolphin"], correctAnswers:["Snake","Crocodile"] },
    { question: "Choose the longest rivers in the world:", options:["Amazon","Nile","Yangtze","Thames"], correctAnswers:["Amazon","Nile","Yangtze"] },
    { question: "Select the planets that have rings:", options:["Earth","Saturn","Jupiter","Mars"], correctAnswers:["Saturn","Jupiter"] }
  ],
  fillblank: [
    { question:"The largest desert in the world is the __________.", correctAnswer:"Sahara" },
    { question:"The chemical symbol for iron is __________.", correctAnswer:"Fe" },
    { question:"The Great Pyramid of Giza is located in __________.", correctAnswer:"Egypt" },
    { question:"The process by which plants make their own food is called __________.", correctAnswer:"Photosynthesis" },
    { question:"The author of 'Harry Potter' series is __________.", correctAnswer:"J.K. Rowling" }
  ]
};

let currentQuestionIndex=0, userAnswers=[], quizType=null, quizQuestions=[];
const homeScreen=document.getElementById("home-screen");
const quizScreen=document.getElementById("quiz-screen");
const resultScreen=document.getElementById("result-screen");
const closingScreen=document.getElementById("closing-screen");
const questionContainer=document.getElementById("question-container");
const quizTitle=document.getElementById("quiz-title");
const progressBarInner=document.getElementById("progress-bar-inner");
const nextBtn=document.getElementById("next-btn");
const scoreText=document.getElementById("score-text");
const resultsDetails=document.getElementById("results-details");
const finishBtn=document.getElementById("finish-btn");
const restartBtn=document.getElementById("restart-btn");

document.querySelectorAll(".quiz-option").forEach(option=>{
  option.addEventListener("click",()=>{
    quizType=option.dataset.type;
    quizQuestions=allQuestions[quizType];
    currentQuestionIndex=0;
    userAnswers=[];
    homeScreen.style.display="none";
    quizScreen.classList.add("active");
    showQuestion();
  });
});

function showQuestion(){
  const currentQuestion=quizQuestions[currentQuestionIndex];
  questionContainer.innerHTML="";
  nextBtn.disabled=true;

  const qElem=document.createElement("div");
  qElem.className="question";
  qElem.textContent=currentQuestion.question;
  questionContainer.appendChild(qElem);

  if(quizType==="single"){
    const optionsDiv=document.createElement("div"); optionsDiv.className="options";
    currentQuestion.options.forEach(opt=>{
      const label=document.createElement("label");
      const input=document.createElement("input"); input.type="radio"; input.name="answer"; input.value=opt;
      input.addEventListener("change",()=>{ nextBtn.disabled=false; });
      label.appendChild(input); label.appendChild(document.createTextNode(opt));
      optionsDiv.appendChild(label);
    });
    questionContainer.appendChild(optionsDiv);
  } else if(quizType==="multi"){
    const optionsDiv=document.createElement("div"); optionsDiv.className="options";
    currentQuestion.options.forEach(opt=>{
      const label=document.createElement("label");
      const input=document.createElement("input"); input.type="checkbox"; input.value=opt;
      input.addEventListener("change",()=>{ 
        const anyChecked=Array.from(document.querySelectorAll("input[type=checkbox]")).some(cb=>cb.checked);
        nextBtn.disabled=!anyChecked;
      });
      label.appendChild(input); label.appendChild(document.createTextNode(opt));
      optionsDiv.appendChild(label);
    });
    questionContainer.appendChild(optionsDiv);
  } else if(quizType==="fillblank"){
    const input=document.createElement("input");
    input.type="text"; input.placeholder="Type your answer here..."; input.className="blank-input";
    input.addEventListener("input",()=>{ nextBtn.disabled=input.value.trim()===""; });
    questionContainer.appendChild(input);
  }

  quizTitle.textContent=`Question ${currentQuestionIndex+1} of ${quizQuestions.length}`;
  updateProgressBar();
}

function updateProgressBar(){
  progressBarInner.style.width=((currentQuestionIndex)/quizQuestions.length)*100+"%";
}

nextBtn.addEventListener("click",()=>{
  saveAnswer(); currentQuestionIndex++;
  if(currentQuestionIndex<quizQuestions.length){ showQuestion(); }
  else{ showResults(); }
});

function saveAnswer(){
  let answer=null;
  if(quizType==="single"){
    const selected=document.querySelector("input[name=answer]:checked"); answer=selected?selected.value:null;
  } else if(quizType==="multi"){
    const selected=Array.from(document.querySelectorAll("input[type=checkbox]:checked")).map(cb=>cb.value); answer=selected;
  } else if(quizType==="fillblank"){
    const input=document.querySelector(".blank-input"); answer=input.value.trim();
  }
  userAnswers.push(answer);
}

function showResults(){
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");
  resultsDetails.innerHTML="";
  let score=0;

  quizQuestions.forEach((q,i)=>{
    const userAnswer=userAnswers[i]; let correct=false;
    if(quizType==="single"||quizType==="fillblank"){
      correct=(userAnswer && userAnswer.toString().toLowerCase()===q.correctAnswer.toString().toLowerCase());
    } else if(quizType==="multi"){
      correct=(Array.isArray(userAnswer) && userAnswer.length===q.correctAnswers.length && userAnswer.every(val=>q.correctAnswers.includes(val)));
    }
    if(correct) score++;

    const resultQ=document.createElement("div");
    resultQ.className="result-question";
    resultQ.textContent=`${i+1}. ${q.question}`;
    resultsDetails.appendChild(resultQ);

    const userAnswerElem=document.createElement("div");
    userAnswerElem.className="answer";
    if(Array.isArray(userAnswer)) userAnswerElem.innerHTML="Your answer: <br>"+userAnswer.join("<br>");
    else userAnswerElem.innerHTML="Your answer: "+(userAnswer||"<em>No answer</em>");
    resultsDetails.appendChild(userAnswerElem);

    const correctAnswerElem=document.createElement("div");
    correctAnswerElem.className="answer";
    if(quizType==="multi") correctAnswerElem.innerHTML="Correct answer: <span class='"+(correct?"correct":"incorrect")+"'><br>"+q.correctAnswers.join("<br>")+"</span>";
    else correctAnswerElem.innerHTML="Correct answer: <span class='"+(correct?"correct":"incorrect")+"'>"+q.correctAnswer+"</span>";
    resultsDetails.appendChild(correctAnswerElem);
  });

  scoreText.textContent=`You scored ${score} out of ${quizQuestions.length}.`;
  progressBarInner.style.width="100%";
}

finishBtn.addEventListener("click",()=>{
  resultScreen.classList.remove("active");
  closingScreen.classList.add("active");
});
restartBtn.addEventListener("click",()=>{
  closingScreen.classList.remove("active");
  homeScreen.style.display="flex";
});
