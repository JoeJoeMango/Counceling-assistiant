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
//get birthdates//

var dinnerPersonSwitch = true;
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
  //console.log(app.phrases);
  // Asks the user's permission to know their name, for personalization.
  conv.ask(`Welcome to marriage counselling assistant.
    Here we are going to discuss five tips to help you have some
    resolutions to your conflicts.We are going to take turns talking,
    and I will asses what you say and give some feedback based on what you say.
    and hope to give you some perspective on your issues. First things first,
    what are your names please?`);
});

app.intent('Names', async(conv, {nameOne, nameTwo, LastName}) => {
  var nameOne_ = {nameOne};
  var nameTwo_ = {nameTwo};
  var lastName_ = {LastName};
  conv.data.userNameOne = nameOne;
  conv.data.userNameTwo = nameTwo;
  personOne.push(`${conv.data.userNameOne}`);
  personTwo.push(`${conv.data.userNameTwo}`);


  conv.ask(`<speak> Thankyou, ${conv.data.userNameOne} and ${conv.data.userNameTwo}. I am going to talk to you through 3 diffent subjects.`+
      `Family baggage, Communication, and Conflict resolution. Some of these questions my feel insignificant but I assure you they are not. `+
      `First off Family baggage, we all bring “family rules” into our relationships, and most of the time we don’t even realize it.<break time="1s"/>`+
      `${conv.data.userNameOne}, How many nights a week did your family eat together as a child? </speak>`);
});

app.intent('dinner time', async(conv,{DOW}) => {
    conv.data.dow = DOW;
    if(dinnerPersonSwitch && conv.data.dow >= 0 && conv.data.dow <= 7){
      conv.ask(`Thankyou ${conv.data.userNameOne}, ${conv.data.userNameTwo} your turn.`);
      personOne.push(`${conv.data.dow}`);
      dinnerPersonSwitch = false;
    }else if (dinnerPersonSwitch != true && conv.data.dow >= 0 && conv.data.dow <= 7){

      conv.ask(`These are all questions that seem unrelated or unimportant,
       but every family answers them in different ways. The way your family handled
      these issues is not the way every family handles them. We unfairly project our
      family beliefs, or perspectives, into our new families and expect our spouses and or partner to follow our lead.
       ${conv.data.userNameTwo} do you have any silblings, if so how many and what sex?`);
      // conv.ask(new Suggestions('yes','no','sometimes','when I was older'));
      personTwo.push(`${conv.data.dow}`);

      dinnerPersonSwitch = 0;
      familyDinnerDifference = personOne[1] - personTwo[1];
      if(familyDinnerDifference < 0){
        familyDinnerDifference = familyDinnerDifference*-1;
      }
    }else{

        conv.ask(
          getPhrase('dinner-time', 'wrong-days', { dow: conv.data.dow })
          // getPhrase('dinner-time', 'something')
        );
      }
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
          //conv.ask(`Hmmmmm Interesting, and how is your relationship with them?`);
          conv.ask(getPhrase('siblings', 'something'));
          siblingsSwitch = false;
    }else{
        conv.ask(`${conv.data.userNameOne} how about you? any siblings?`);
        personTwo.push("no siblings");
        siblingsSwitch = false;
        }
    }else if (siblingsSwitch != true){
        if(conv.data.boysNum >= 1 || conv.data.girlsNum >= 1){
          personOne.push(`${conv.data.boysNum}`);
          personOne.push(`${conv.data.girlsNum}`);
          conv.ask(`and do you get along?`); // get-along-question
          siblingsSwitch = 0;
  }else{
      conv.ask(`${conv.data.userNameOne} how about you? any siblings?`);
      personTwo.push("no siblings");
      siblingsSwitch = 0;
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



app.intent('Default Fallback Intent', async conv => {

  let message = 'Oops';
  console.log(conv.query);
  try {
    const document = {
      content: conv.query,
      type: 'PLAIN_TEXT',
    };

    const [result] = await client.analyzeSentiment({ document })
    const sentiment = result.documentSentiment;

    console.log(result);
    console.log(`Sentiment score: ${sentiment.score}`);
    console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
    console.log('Sentences: ', result.sentences);
    console.log(!!sentiment.score);

    if(sentiment.score) {
      message = `You are happy ${sentiment.score}`;
    }

  } catch(e) {
    console.log('error messsage', e);
  }
  conv.ask(message);
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
