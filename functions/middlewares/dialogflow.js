'use strict'

const {	dialogflow, Suggestions } = require('actions-on-google');
const language = require('@google-cloud/language');

const client = new language.LanguageServiceClient({
        keyFilename: './google.json'
});

const app = dialogflow({debug: true});
// how I keep track of each persons stats
var personOne = [];
var personTwo = [];
var collectiveData = [];
//get birthdates//
var secfourPhrases = ['section-four-1','section-four-2','section-four-3','section-four-4'];
var xRandom = Math.floor((Math.random() * 3) + 1);
var dinnerPersonSwitch = 0;
var moneyPersonSwitch = true;
var siblingsSwitch = true;
var familyDinnerDifference;
function replaceKeys(string, keys) {
  return Object.entries(keys || {})
    .reduce((acum, [key, value]) => {
      return acum.replace(`{${key}}`, value)
    }, string)
}

function getPhrase(subject, key, data = {}) {
  const text = app.phrases[subject][key];

  return replaceKeys(text, data);
}


app.intent('Default Welcome Intent', (conv) => {
  conv.ask(getPhrase('welcome','first-time'));
});

app.intent('Names', async(conv, {nameOne, nameTwo, LastName}) => {
  var nameOne_ = {nameOne};
  var nameTwo_ = {nameTwo};
  var lastName_ = {LastName};
  conv.data.userNameOne = nameOne;
  conv.data.userNameTwo = nameTwo;
  personOne.push(`${conv.data.userNameOne}`);
  personTwo.push(`${conv.data.userNameTwo}`);


  conv.ask(`<speak> Hello, ${conv.data.userNameOne} and ${conv.data.userNameTwo} Nice to meet you. Let's begin. I am going to talk to you through 2 diffent subjects.`+
      `Family background, and Communication. Some of these questions my feel insignificant but I assure you they are not. `+
      `First off lets talk a little bit about your past, we all bring “family rules” into our relationships, and most of the time we don’t even realize it.<break time="1s"/>`+
      `${conv.data.userNameOne}, how many times per week did you have dinner with your family as a child? </speak>`);
});

/////////////////////////////////////////////
/////////////////DINNER-TIME/////////////////
/////////////////////////////////////////////

app.intent('dinner time', async(conv, { DOW }) => {
	conv.data.dow = DOW;
	if (dinnerPersonSwitch === 0 && conv.data.dow >= 0 && conv.data.dow <= 7) {
		conv.ask(`Thankyou ${conv.data.userNameOne}, ${conv.data.userNameTwo} and you?`);
		personOne.push(`${conv.data.dow}`);
		dinnerPersonSwitch = 1;

	} else if (dinnerPersonSwitch === 1 && conv.data.dow >= 0 && conv.data.dow <= 7) {
		personTwo.push(`${conv.data.dow}`);

		familyDinnerDifference = personOne[1] - personTwo[1];
		if (familyDinnerDifference < 0) {
			familyDinnerDifference = familyDinnerDifference * -1;
		}
		collectiveData.push(familyDinnerDifference);

		console.log("familyDinnerDifference     " + familyDinnerDifference);
		if (familyDinnerDifference >= 6 && familyDinnerDifference <= 7) {
			conv.ask(`<speak> ${getPhrase('dinner-time', 'section-one')} <break time="1s"/> ${getPhrase('dinner-time', 'eating-together')} </speak>`);
			dinnerPersonSwitch = 2;
		} else if (familyDinnerDifference >= 4 && familyDinnerDifference <= 5) {
			conv.ask(`<speak> ${getPhrase('dinner-time', 'section-two')} <break time="1s"/> ${getPhrase('dinner-time', 'eating-together')} </speak>`);
			dinnerPersonSwitch = 2;
		} else if (familyDinnerDifference >= 2 && familyDinnerDifference <= 3) {
			conv.ask(`<speak>${getPhrase('dinner-time', 'section-three')} <break time="1s"/> ${getPhrase('dinner-time', 'eating-together')}</speak>`);
			dinnerPersonSwitch = 2;
		} else if (familyDinnerDifference >= 1 && familyDinnerDifference <= 0 || familyDinnerDifference === 0) {
			conv.ask(`<speak> ${getPhrase('dinner-time', secfourPhrases[xRandom])} <break time="1s"/> ${getPhrase('dinner-time', 'eating-together')} </speak>`);

			dinnerPersonSwitch = 2;
		} else {
			conv.ask(`not a group`);
		}

	} else if (dinnerPersonSwitch === 2 && conv.data.dow >= 0 && conv.data.dow <= 1) {
    conv.contexts.set('dinner-time-thoughts', 1);
		conv.ask(`<speak> ${getPhrase('dinner-time','thoughts-0-1')}</speak>`);
		collectiveData.push(conv.data.dow);
    console.log("HHHHHHHHHHKHKHKHJKHJKHKHKHN    "  +  conv.query)
	} else if (dinnerPersonSwitch === 2 && conv.data.dow >= 2 && conv.data.dow <= 3) {
    conv.contexts.set('dinner-time-thoughts', 1);
		conv.ask(`<speak> ${getPhrase('dinner-time','thoughts-2-3')}</speak>`);
		collectiveData.push(conv.data.dow);
	} else if (dinnerPersonSwitch === 2 && conv.data.dow >= 4 && conv.data.dow <= 5) {
    conv.contexts.set('dinner-time-thoughts', 1);
		conv.ask(`<speak> ${getPhrase('dinner-time','thoughts-4-5')}</speak>`);
		collectiveData.push(conv.data.dow);
	} else if (dinnerPersonSwitch === 2 && conv.data.dow >= 6 && conv.data.dow <= 7) {
    conv.contexts.set('dinner-time-thoughts', 1);
		conv.ask(`<speak> ${getPhrase('dinner-time','thoughts-6-7')}</speak>`);
		collectiveData.push(conv.data.dow);
	} else {
		conv.ask(getPhrase('dinner-time', 'wrong-days', {
			dow: conv.data.dow
		}));
	}
  console.log("HHHHHHHHHHKHKHKHJKHJKHKHKHN    "  +  conv.query)
});


app.intent('siblings', async(conv, {boysNumber, girlsNumber}) => {
var boysNum = {boysNumber};
var girlsNum_ = {girlsNumber};
conv.data.boysNum = boysNumber;
conv.data.girlsNum = girlsNumber;
    if (siblingsSwitch){
        if(conv.data.boysNum >= 1 || conv.data.girlsNum >= 1){
          personTwo.push(`${conv.data.boysNum}`);
          personTwo.push(`${conv.data.girlsNum}`);
          conv.contexts.set('siblings-feelings', 1);
          conv.ask(`Hmmmmm Interesting, and how is your relationship with them?`);
          conv.ask(getPhrase('siblings', 'something'));
          siblingsSwitch = false;
          //////SENTIMENT ANALISYS HERE//////
    }else{
        conv.ask(`${conv.data.userNameOne} how about you? any siblings?`);
        personTwo.push("no siblings");
        siblingsSwitch = false;

      //////SENTIMENT ANALISYS HERE//////
        }
    }else if (siblingsSwitch != true){
        if(conv.data.boysNum >= 1 || conv.data.girlsNum >= 1){
          personOne.push(`${conv.data.boysNum}`);
          personOne.push(`${conv.data.girlsNum}`);
          conv.ask(`and do you get along?`); // get-along-question
          siblingsSwitch = 0;
      //////SENTIMENT ANALISYS HERE//////
  }else{
      conv.ask(`${conv.data.userNameOne} how about you? any siblings?`);
      personTwo.push("no siblings");
      siblingsSwitch = 0;
      //////SENTIMENT ANALISYS HERE//////
      }
  }
});



app.intent('Child-money',async(conv, {sensitive, sibling}) => {
    var sen = {sensitive};
    var sib = {sibling};
    conv.data.sibling_ = sibling;
    // conv.data.sensistiveNotification = sensitive;
// NEED FOLLOW UP INTENT FOR HOW DID THAT MAKE YOU FEEL???????????
    if (moneyPersonSwitch){

      conv.contexts.set('child-money-sensitive', 2);
      if(conv.data.sibling_ == "sister"){
        conv.ask(`sister thankyou for sharing, ${conv.data.userNameTwo}. How does that make you feel? `);
      }else if (conv.data.sibling_ == "brother"){
        conv.ask(`brother thankyou for sharing, ${conv.data.userNameTwo}. How does that make you feel?`);
      }else{
        conv.ask(`thankyou for sharing, ${conv.data.userNameTwo}. Did you enjoy being an only child? or did you wish you had siblings?`);
      }
      moneyPersonSwitch = false;
    }else if(moneyPersonSwitch != true){
      //conv.contexts.set('child-money-sensitive-no-person-switch', 2);
      if(conv.data.sibling_ == "sister"){
        conv.ask(`was your sister older then you?`);
      }else if (conv.data.sibling_ == "brother"){
        conv.ask(`Thankyou ${conv.data.userNameOne}. Did you enjoy being an only child? or did you wish you had siblings?`);
      }else{
        conv.ask(`thankyou for sharing, ${conv.data.userNameOne}. Now lets move onto Communication. Communication`+
          ` at it's core a way to reduce conflict and create a more effective way for not just you and your partner`+
          ` but everyone and everthing to share what you are feeling in order to come to some understanding of the matter at hand.`+
          ` So as you can imagin when Communication ceases to exist or is not effective turmoil and misunderstanding can occur.`+
          ` From what I can see so far...  ${conv.data.userNameTwo} what would you say your most common fights or arguments are about? `);
      }
      moneyPersonSwitch = 0;
    }
  });


  // take a statment from both parties!!!!!!! send to get a sentiment score and return statement /////
////    is there a way I can just log everything someone says and not throw an err   /////


app.intent('communinication', async(conv)=>{

});

app.intent('you she he', async(conv,{blame})=>{
  var blame_ = {blame};
  conv.data.blame__ = blame;

  if (conv.data.blame__ == "he" || conv.data.blame__ == "his"){
    conv.ask(`this is if it contains he or him`);
  }else if (conv.data.blame__ == "her" || conv.data.blame__ == "she"){
    conv.ask(`this is if it contains her or she`);
  }
});

app.intent('sex life', async(conv,{sexLife})=>{
  conv.ask(`I want to hear more about that`);
});
//
app.intent('somthing positive', async(conv)=>{
  // Grab a sentiment score here from a testimonial.

});

app.intent('somthing nigitive', async(conv)=>{
  // Grab a sentiment score here from a testimonial.

});

app.intent('final assessment', async(conv)=>{
  // collective content delivery for both people //
});

app.intent('dinner time - fallback', async conv => {
  const score = await sentiment(conv.query);
  if(score <= 1 && score >= 0.49999999){
    conv.ask('happy');
  }else if(score <= 0.5 && score >= 0.1){
    conv.ask('happy');
  }else if(score <= 0 && score >= -.5){
    conv.ask('happy');
  }else if(score <= -.5 && score >= -1){
    conv.ask('happy');
  }else if(score <= ___ && score >= ___){

  }


})

// app.intent('Default Fallback Intent', async conv => {
//   let message = 'Oops';
//   console.log(conv.query);
//   const score = await sentiment(conv.query);
//   conv.ask(message);
// });


async function sentiment(text) {
  try {
    const document = {
      content: text,
      type: 'PLAIN_TEXT',
    };
    const [result] = await client.analyzeSentiment({ document })
    const sentiment = result.documentSentiment;
    console.log(result);
    console.log(`Sentiment score: ${sentiment.score}`);
    console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
    console.log('Sentences: ', result.sentences);
    console.log(!!sentiment.score);
    return sentiment.score;
  } catch(e) {
    console.log('error messsage', e);
  }

  return null;
}

function getAllPermutations(string) {
  var results = [];
  if (string.length === 1) {
    results.push(string);
    return results;
  }
  for (var i = 0; i < string.length; i++) {
    var firstChar = string[i];
    var charsLeft = string.substring(0, i) + string.substring(i + 1);
    var innerPermutations = getAllPermutations(charsLeft);
    for (var j = 0; j < innerPermutations.length; j++) {
      results.push(firstChar + innerPermutations[j]);
    }
  }
  return results;
}

module.exports = app;
