//Game states
var app = {};
app.question = '';
app.choices = []; 
app.answer = ''; 
app.difficulty = '';
app.wrongs = 0;  
app.rights = 0;  
app.omits = 0;
app.timer = 0; 
app.intervalF = function(){}; 
app.timeoutF = function(){};
app.questionNumber = 0;
app.questionsForThisGame = [];  
//game settings
app.introWaitTime = 5; 
app.intermissionWaitTime = 5; 
app.pauseTimeBetweenQuestions = 4; 
app.difficultySetting = {
  'Easy': 1,
  'Medium': 1,
  'Hard': 1
};
app.lifelines = ['phoneAFriend','pollTheAudience', 'fiftyFifty'];
app.difficultyTimer = {
  'Easy': 6,
  'Medium': 6,
  'Hard': 6
}

//logic for choosing questions for this round 
app.chooseQuestions = function () {
  console.log('choosing questions for this round');
  var that = this; 
  var Qs = []; 
  //for each difficulty setting
  for (var key in that.difficultySetting) {
    //take all questions of that difficulty, shuffle it, and pick n out of the set, where n is the value in the difficultySetting key-value pair
    Qs = Qs.concat(chance.pickset(chance.shuffle(_.filter(this.allQuestionsAnswers, (v) => (v.difficulty === key))), that.difficultySetting[key]));
  }
  //update game state: questions for this game 
  this.questionsForThisGame = Qs; 
}

//logic for showing solution if user waits out a question or answers incorrectly
app.noGoodAnswer = function(answered) {
  console.log("display solution");
  clearTimeout(this.timeoutF);
  var that = this;  
  //logic to determine if we should trigger next question or trigger either intermission or gameover
  if (this.questionNumber === this.difficultySetting.Easy){
    this.timeoutF = setTimeout(that.intermission.bind(that), that.pauseTimeBetweenQuestions * 1000);
  } else if (this.questionNumber === _.reduce(this.difficultySetting, (memo, value) => (memo + value))){
    this.timeoutF = setTimeout(that.gameOver.bind(that), that.pauseTimeBetweenQuestions * 1000);
  } else {
    this.timeoutF = setTimeout(that.nextQuestion.bind(that), that.pauseTimeBetweenQuestions * 1000);
  }
  //update game states
  if (answered) {
    this.wrongs++;
  } else {
    this.omits++; 
  }
  this.timer = that.pauseTimeBetweenQuestions;
  //update onscreen displays
  $('#question').text(`The correct answer is ${this.answer}`);
  $('#timeLeft').html(that.pauseTimeBetweenQuestions);
}

//logic for nextQuestion method 
app.nextQuestion = function () {
  console.log('moving onto next question')
  var that = this; 
  //update states
  this.question = this.questionsForThisGame[this.questionNumber].question;
  this.choices = this.questionsForThisGame[this.questionNumber].choices;
  this.answer = this.questionsForThisGame[this.questionNumber].answer;
  this.difficulty = this.questionsForThisGame[this.questionNumber].difficulty;
  this.questionNumber++; 
  this.timer = this.difficultyTimer[this.difficulty];
  //render updated states
  this.render();
  //if user times out, move to noGoodAnswer logic
  this.timeoutF = setTimeout(that.noGoodAnswer.bind(that), that.difficultyTimer[that.difficulty] * 1000);
}

//regular rendering logic
app.render = function () {
  console.log("rendering question info to DOM");
  var that = this; 
  $('#timeLeft').text(that.difficultyTimer[that.difficulty]);
  $('#QID').text(that.questionNumber);
  $('#Qdiff').text(that.difficulty);
  $('#question').text(that.question);
  //TODO: render buttons
}
//intermission logic
app.intermission = function(){
  console.log('intermission time!');
  var that = this; 
  $('#question').text("Now the game gets a lot tougher!  You have ${that.difficultyTimer.Medium} seconds to answer medium questions and ${that.difficultyTimer.Hard} seconds to answer hard questions. I hope you\'ve been saving your lifelines...")
   this.timeoutF = setTimeout(that.nextQuestion.bind(that), that.intermissionWaitTime * 1000);
   this.timer = that.intermissionWaitTime;
  $('#timeLeft').html(that.intermissionWaitTime);
}

//game over logic
app.gameOver = function(){
  console.log('game over!'); 
  clearInterval(this.intervalF);
  clearTimeout(this.timeoutF);
  $('#timeLeft').text('');
  $('#QID').text('');
  $('#Qdiff').text('');
  $('#question').text('Game over!');
}

//logic to update on screen count-down
app.updateTimer = function (){
  console.log("inside update timer");
  this.timer--;  
  $('#timeLeft').html(this.timer);
}

//initializing logic
app.initialize = function (){
  console.log('Game is starting')
  var that = this;  
  //reset values
  this.questionsForThisGame = []; 
  this.wrongs = 0;  
  this.rights = 0;  
  this.omits = 0;
  this.questionNumber = 0;
  //active intro wait time trigger; 
  this.timer = this.introWaitTime; 
  this.initRender(this.timer);
  this.timeoutF = setTimeout(that.nextQuestion.bind(that), that.introWaitTime * 1000);
  //activate non-stop timer logic
  this.intervalF = setInterval(that.updateTimer.bind(that)
  ,1000);
  this.chooseQuestions();
}

//logic for initial rendering
app.initRender = function (time) {
  console.log('rendering initial message and images')
  var that = this;  
  //hide start button
  $('#startButton').toggle();
  //hide all choice buttons
  $('.choices').hide();
  //render host image
  $('#IMGcontainer').html('<img id="regis" src="assets/images/regis.jpg">');
  //create and render lifelines
  _.each(this.lifelines, (v) => {
    //logic for creating lifeline divs
    var LLdiv = $('<div>');
    LLdiv.addClass('col-xs-4');
    LLdiv.attr('data', v);
    //logic for creating lifeline images
    var LLimg = $('<img>');
    LLimg.attr('src', `assets/images/${v}.png`)
    LLdiv.append(LLimg);
    //attach click event listener
    LLdiv.on('click', function() {
      $(this).addClass('hidden');
      that[$(this).attr('data')]();
    })
    //add it to DOM
    $('#LLcontainer').append(LLdiv);
  })
  //update timer
  $('#timeLeft').html(time);
  //update the question text
  $('#question').text(`Let the game begin! You have ${that.difficultyTimer.Easy} seconds to answer each easy question!  Note that you have three lifelines: Phone a Friend, Poll the Audience, and Fifty-fifty.  You can only use one lifeline per game because Chi was too lazy to figure out the extra logic.`)
}

$('#startButton').on('click', () => (app.initialize()));

//all the questions and answers for the game
app.allQuestionsAnswers = [
  {"question": "Which organization is currently responsible for standardizing and improving Javascript?", 
    "choices": ["European Computer Manufacturers Association", "The Brogrammers", "AshleyMadison.com", "The World Of Warcraft Community"], 
    "answer": "European Computer Manufacturers Association",
    "difficulty": "Easy"},

  {"question":"In a computer network, 'who' responds to data/resources requests from 'clients?",
    "choices": ["The Waiter", "The Server", "The Hostess", "The Salesman"], 
    "answer":"The Server",
    "difficulty": "Easy"},

  {"question":"Together with Javascript and CSS, which other language forms the 'three pillars of the Web'?",
    "choices": ["Klingon", "HyperText Markup Language", "Poor English", "LOLCODE"],
    "answer":"HyperText Markup Language",
    "difficulty": "Easy"},

  {"question":"In software engineering, what is the acronym DRY referring to?",
    "choices":["Don't Repeat Youself", "Defensive Rushing Yards", "Data Request, yo", "Death Row Youth"], 
    "answer":"Don't Repeat Youself",
    "difficulty": "Easy"},

  {"question":"Websites sometimes send small pieces of data to be stored on the user's computer.  What are they called?",
    "choices":["Cookies", "California rolls", "Cheerios", "Choicken of the Sea"],
    "answer":"Cookies",
    "difficulty": "Easy"},

  {"question":"In software, what is the name commonly given to a malicious softwares disguised as a legitimate software?",
    "choices":["Tokyo Drift", "Trojan Horse", "Italian Stallion", "Texas Chainsaw Massacre"],
    "answer":"Trojan Horse",
    "difficulty": "Easy"},

  {"question":"In computer network communication, what HTTP error message is given when the client tries to access a broken link?",
    "choices":["404 Not Found", "187 Dead on Arrival", "777 Lucky Sevens", "101 Intro to Economics"], 
    "answer":"404 Not Found",
    "difficulty": "Easy"},

  {"question":"In software communication, what is the name commonly given to an unwanted electronic message?",
    "choices": ["Spam", "Dick Pic", "Slurpee", "Worm"],
    "answer":"Spam",
    "difficulty": "Easy"}, 

  {"question":"Which Javascript Function method CANNOT be used to manually set context for 'this'?",
    "choices": [".bind", ".call", ".apply", ".toSource"], 
    "answer":".toSource",
    "difficulty": "Medium"}, 

  {"question":"In Javascript, when you are in the global scope, which technique makes it possible for you to modify a local variable?",
    "choices":["Closure", "Variable Hoisting", "Callback Hell", "Prototypal Inheritance"],
    "answer":"Closure",
    "difficulty": "Medium"}, 

  {"question":"Which of the following Javascript keywords does something significantly different from the other three?", 
    "choices":["var", "let", "const", "new"],
    "answer":"new",
    "difficulty": "Medium"}, 

  {"question":"Which of the following technology is NOT part of a 'MEAN' stack?", 
    "choices":["MongoDB", "Ember.js", "AngularJS", "Node.js"], 
    "answer":"Ember.js",
    "difficulty": "Medium"}, 

  //hard
  {"question":"In Javascript, which of the following CANNOT be considered an object under any circumstances?",
    "choices":["Null", "NaN", "Function", "Array"], 
    "answer":"NaN", 
    "difficulty": "Hard"}, 

  {"question":`What will the following code output to the console?\nvar a =5;\nvar b=5;\n(function(){\nvar a = b = 3;\n}\n\nconsole.log('a = ', a, ', b = ', b)`,
    "choices":["a = 3, b = 3", "a = 5, b = 3", "a = 5, b = 5", "a = 3, b = 5"], 
    "answer":"a = 5, b = 3",
    "difficulty": "Hard"}, 

  {"question":`What will the following code output to the console?\nvar a = 1\nfunction b() {\na = 10;\nreturn;\nfunction a() {}\n}\nb();\nconsole.log(a)`,
    "choices":["1", "undefined", "10", "function (){}"],
    "answer":"1",
    "difficulty": "Hard"}, 

  {"question":"Which of the following is a common misconception about a hash table?",
    "choices":["Its hashing function encrypts the keys", "At best, it offers constant-time lookup", "At best, it offers constant-time insertion", "It is an unordered data sctructure"], 
    "answer":"Its hashing function encrypts keys",
    "difficulty": "Hard"}
]

//EXTRA STUFF
app.fiftyFifty = function () {
  console.log('invoking fiftyFifty')
}

//logic for "Phone a friend" life line
app.phoneAFriend = function(){
  console.log('invoking phoneAFriend')
  // var sentences = {};
  // var friendGuess; 
  // //Confidence-related logic, to randomize what the friend would say  
  //   //confidence levels 
  //   var confidenceArr = ['high', 'mid', 'low'];
  //   //randomly assigns a confidence level to the "friend"
  //   var friendConfidence = confidenceArr[Math.floor(Math.random() * 3)];
  //   //for high confidence, the friend would always give the correct answer 
  //   if (friendConfidence === 'high') {
  //     friendGuess = this.correctAnswer; 
  //   //for mid confidence, the friend gives the correct answer 70% of the time for 4 choices
  //   } else if (friendConfidence === 'mid') {
  //     var midConfidenceRandom = Math.random(); 
  //     if (midConfidenceRandom < 0.6) {
  //       friendGuess = this.correctAnswer;
  //     } else {
  //       friendGuess = this.choices[_.random(0,3)];
  //     }
  //   //for low confidence, the friend gives the correct answer 25% of the time for 4 choices
  //   } else {
  //       friendGuess = this.choices[_.random(0,3)];
  //   }
  //   sentences.high = `The answer is ${friendGuess}, final answer.`;
  //   sentences.mid = `I just read about this, let's see; I believe the answer is ${friendGuess}.`;  
  //   sentences.low = `uhh, I would guess the answer is ${friendGuess}, but I really don't know.`;
  // //Logic for choosing a specific friend & voice
  //   //array of names and associated voices
  //   var voices = [["UK English Female", "Isabelle"], ["UK English Male", "Archie"],["US English Female", "Carol Ann"],["US English Male", "Billy"]];
  //   //randomly choose a friend 
  //   var friendProps = voices[Math.floor(Math.random() * voices.length)];
  //   var friendName = friendProps[1];
  //   var friendVoice = friendProps[0];
  // //TODO: rendering logic
  // console.log(`Using the 'Phone A Friend Lifeline' to call ${friendName}...`)
  // //responsiveVoice specific logic
  // responsiveVoice.speak(sentences[friendConfidence], friendVoice, {onend: app.timerResume});

}

//logic for 'Poll The Audience' life line
app.pollTheAudience = function (){
  console.log('invoking pollTheAudience')
  console.log(Chart)
  //logic for swapping Regis picture with the bar chart 
  $('#IMGcontainer').empty();
  var canvas = $('<canvas>');
  canvas.attr('id', 'pollChart');
  $('#IMGcontainer').append(canvas);
  var pollDataArr; 
  //logic to generate random vote numbers for poll data 


  //chart.js logic
  var ctx = document.getElementById("pollChart").getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          //red, blue, yellow, green
          labels: this.choices,
          datasets: [{
              label: '# of Votes',
              data: pollDataArr,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });
}