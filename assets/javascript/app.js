//Game states
var app = {};
app.choices = []; 
app.answer = ''; 
app.timer = 0; 
app.intervalF = function(){}; 
app.questionsForThisGame = [];  
//game settings
app.difficultySetting = {
  'Easy': 4,
  'Medium': 2,
  'Hard': 2
};
app.lifelines = ['phoneAFriend','pollTheAudience', 'fiftyFifty'];
app.difficultyTimer = {
  'Easy': 15,
  'Medium': 20,
  'Hard': 30
}

//logic for nextQuestion method 
app.nextQuestion = function () {
  console.log('nextQuestion is being called!')
}

//TODO: question rendering logic
app.updateTimer = function (){
  this.timer--;  
  $('#timeLeft').html(this.timer);
  console.log("inside update timer")
}

//initializing
app.initialize = function (){
  var that = this;  
  console.log('Game is starting')
  

  //reset values???
  //hide start button
  $('#startButton').toggle();
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
  //update the question text
  $('#question').text('Let the game begin! Note that you have three lifelines: Phone a Friend, Poll the Audience, and Fifty-fifty.  You can only use one lifeline per game because Chi was too lazy to figure out the extra logic.')
  var tenSeconds = 10; 
  this.timer = tenSeconds;  
  $('#timeLeft').html(tenSeconds);
  //active 5-sec time counter; 
  this.intervalF = setInterval(app.updateTimer.bind(that)
  , 1000)

  setTimeout(function(){
    console.log("trying to clear timeout")
    clearTimeout(app.intervalF); 
    app.nextQuestion();
  }, tenSeconds * 1000);
}

$('#startButton').on('click', () => (app.initialize()));

//all the questions and answers for the game
app.allQuestionsAnswers = [
  {"question": "Which organization is currently responsible for standardizing and improving Javascript?", 
    "choices": ["European Computer Manufacturers Association", "The Brogrammers", "AsheleyMadison.com", "The World Of Warcraft Community"], 
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

  {"question":"Which Function method CANNOT be used to manually set context for 'this'?",
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

  {"question":"Which of the following is NOT part of a 'MEAN' stack?", 
    "choices":["MongoDB", "Ember.js", "AngularJS", "Node.js"], 
    "answer":"Ember.js",
    "difficulty": "Medium"}, 

  //hard
  {"question":"In Javascript, which of the following CANNOT be considered an object under any circumstances?",
    "choices":["Null", "NaN", "Function", "Array"], 
    "answer":"NaN", 
    "difficulty": "Hard"}, 

  {"question":"What will the following code output to the console?<pre>var a =5;\nvar b=5;\n(function(){\n &nbsp;&nbsp;var a = b = 3;\n}\n\nconsole.log('a = ', a, ', b = ', b)</pre>",
    "choices":["a = 3, b = 3", "a = 5, b = 3", "a = 5, b = 5", "a = 3, b = 5"], 
    "answer":"a = 5, b = 3",
    "difficulty": "Hard"}, 

  {"question":"What will the following code output to the console?<pre>var a = 1\nfunction b() {\n &nbsp;&nbsp;a = 10;\n&nbsp;&nbsp;return;\n&nbsp;&nbsp;function a() {}\n}\nb();\nconsole.log(a)</pre>",
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