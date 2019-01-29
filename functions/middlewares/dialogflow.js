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
var secOnePhrases = ['section-one-1','section-one-2','section-one-3','section-one-4'];
var secTwoPhrases = ['section-two-1','section-two-2','section-two-3','section-two-4'];
var secThreePhrases = ['section-three-1','section-three-2','section-three-3','section-three-4'];
var xRandom = Math.floor((Math.random() * 3) + 1);
var dinnerPersonSwitch = 0;
var moneyPersonSwitch = true;
var siblingsSwitch = true;
var siblingReaction = true;
var familyDinnerDifference;


var communicationSwitch = true;
var communicationReaction = true;


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
  dinnerPersonSwitch = 0;


  conv.ask(`<speak> Hello, ${conv.data.userNameOne} and ${conv.data.userNameTwo} Nice to meet you. Let's begin. I am going to talk to you through 2 diffent subjects.`+
      `Family background, and Communication. Some of these questions my feel insignificant but I assure you they are not. `+
      `First off lets talk a little bit about your past, we all bring “family rules” into our relationships, and most of the time we don’t even realize it.<break time="1s"/>`+
      `${conv.data.userNameOne}, how many times per week did you have dinner with your family as a child? </speak>`);
});

/////////////////////////////////////////////
/////////////////DINNER-TIME/////////////////
/////////////////////////////////////////////
console.log("========din============= " + dinnerPersonSwitch);
app.intent('dinner time', async(conv, { DOW, DOW1 }) => {
	conv.data.dow = DOW;
  conv.data.dow1 = DOW1;
console.log("========din2============= " + dinnerPersonSwitch);
	if (conv.data.dow1 >= 0 && conv.data.dow1 <= 7 && dinnerPersonSwitch === 0) {

		conv.ask(`Thankyou ${conv.data.userNameOne}, ${conv.data.userNameTwo} and you?`);
		personOne.push(`${conv.data.dow1}`);

    console.log("===================== " + conv.data.dow1);
    console.log("===================== " + conv.data.dow);
    console.log("========din3============= " + dinnerPersonSwitch);

    dinnerPersonSwitch = 1;
	} else if (dinnerPersonSwitch === 1 && conv.data.dow1 >= 0 && conv.data.dow1 <= 7) {
		personTwo.push(`${conv.data.dow1}`);

    		familyDinnerDifference = personOne[1] - personTwo[1];

    		if (familyDinnerDifference < 0) {
    			familyDinnerDifference = familyDinnerDifference * -1;
    		}
    		collectiveData.push(familyDinnerDifference);

    		if (familyDinnerDifference >= 6 && familyDinnerDifference <= 7) {
    			conv.ask(`<speak> ${getPhrase('dinner-time', secOnePhrases[xRandom])} <break time="1s"/> ${getPhrase('dinner-time', 'eating-together')} </speak>`);
    			dinnerPersonSwitch = 2;
    		} else if (familyDinnerDifference >= 4 && familyDinnerDifference <= 5) {
    			conv.ask(`<speak> ${getPhrase('dinner-time', secTwoPhrases[xRandom])} <break time="1s"/> ${getPhrase('dinner-time', 'eating-together')} </speak>`);
    			dinnerPersonSwitch = 2;
    		} else if (familyDinnerDifference >= 2 && familyDinnerDifference <= 3) {
    			conv.ask(`<speak>${getPhrase('dinner-time', secThreePhrases[xRandom])} <break time="1s"/> ${getPhrase('dinner-time', 'eating-together')}</speak>`);
    			dinnerPersonSwitch = 2;
    		} else if (familyDinnerDifference >= 1 && familyDinnerDifference <= 0 || familyDinnerDifference === 0) {
    			conv.ask(`<speak> ${getPhrase('dinner-time', secfourPhrases[xRandom])} <break time="1s"/> ${getPhrase('dinner-time', 'eating-together')} </speak>`);
    			dinnerPersonSwitch = 2;
    		}

	} else if (dinnerPersonSwitch === 2 && conv.data.dow1 >= 0 && conv.data.dow1 <= 1) {
    conv.contexts.set('dinner-time-thoughts', 1);
		conv.ask(`<speak> ${getPhrase('dinner-time','thoughts-0-1')}</speak>`);
		collectiveData.push(conv.data.dow1);
    dinnerPersonSwitch = 3;

	} else if (dinnerPersonSwitch === 2 && conv.data.dow1 >= 2 && conv.data.dow1 <= 3) {
    conv.contexts.set('dinner-time-thoughts', 1);
		conv.ask(`<speak> ${getPhrase('dinner-time','thoughts-2-3')}</speak>`);
		collectiveData.push(conv.data.dow1);
    dinnerPersonSwitch = 3;

	} else if (dinnerPersonSwitch === 2 && conv.data.dow1 >= 4 && conv.data.dow1 <= 5) {
    conv.contexts.set('dinner-time-thoughts', 1);
		conv.ask(`<speak> ${getPhrase('dinner-time','thoughts-4-5')}</speak>`);
		collectiveData.push(conv.data.dow1);
    dinnerPersonSwitch = 3;

	} else if (dinnerPersonSwitch === 2 && conv.data.dow1 >= 6 && conv.data.dow1 <= 7) {
    conv.contexts.set('dinner-time-thoughts', 1);
		conv.ask(`<speak> ${getPhrase('dinner-time','thoughts-6-7')} </speak>`);
		collectiveData.push(conv.data.dow1);
    dinnerPersonSwitch = 3;

	} else {
		conv.ask(getPhrase('dinner-time', 'wrong-days', {
			dow1: conv.data.dow1
    }));
	}
});


app.intent('siblings', async(conv, {boysNumber, girlsNumber}) => {
var boysNum = {boysNumber};
var girlsNum_ = {girlsNumber};
conv.data.boysNum = boysNumber;
conv.data.girlsNum = girlsNumber;

    if (siblingsSwitch){
        if(conv.data.boysNum >= 1 || conv.data.girlsNum >= 1){
          personOne.push(`${conv.data.boysNum}`);
          personOne.push(`${conv.data.girlsNum}`);
          conv.contexts.set('siblings-feelings', 1);
          conv.ask(getPhrase('siblings', 'yes'));
          siblingsSwitch = false;
    }else{
        conv.contexts.set('siblings-feelings', 2);
        conv.ask(`Okay. And what was your experience growing up?`);
        personTwo.push("no siblings");
        siblingsSwitch = false;

        }
    }else if (siblingsSwitch === false){
        if(conv.data.boysNum >= 1 || conv.data.girlsNum >= 1){
          conv.contexts.set('siblings-feelings', 2);
          personOne.push(`${conv.data.boysNum}`);
          personOne.push(`${conv.data.girlsNum}`);
          conv.ask(`and do you get along?`);
          siblingsSwitch = 0;
  }else{
      conv.contexts.set('siblings-feelings', 2);
      conv.ask(`Okay. And what was your experience growing up?`);
      personTwo.push("no siblings");
      siblingsSwitch = 0;
      }
  }
});

/////////////////////////////////  COMMUNICATION  //////////////////////

app.intent('communication', async(conv, {scaleValue})=>{
// conv.contexts.set('communication-feelings', 1);
var val = {scaleValue};
conv.data.Value = scaleValue;
  if(communicationSwitch ){
    if(conv.data.Value >= 1 && conv.data.Value <= 3){
      conv.ask(`${getPhrase('communication','q1-not-very-challenging')}. Now ${getPhrase('communication','confession')}`);
      conv.contexts.set('communication-feelings ', 2);
      personOne.push(conv.data.Value);
      communicationSwitch = false;
    }else if(conv.data.Value >= 4 && conv.data.Value <= 7){

      conv.ask(`${getPhrase('communication','q1-moderately-challenging')}. Now ${getPhrase('communication','confession')}`);
      conv.contexts.set('communication-feelings ', 2);
      personOne.push(conv.data.Value);
      communicationSwitch = false;
    }else if(conv.data.Value >= 8 && conv.data.Value <= 10){

      conv.ask(`${getPhrase('communication','q1-highly-challenging')}. Now ${getPhrase('communication','confession')}`);
      conv.contexts.set('communication-feelings', 2);
      personOne.push(conv.data.Value);
      communicationSwitch = false;
    }else{
      conv.ask(`I do beleave I said 1 through 10`);
    }
  } else if (communicationSwitch === false){
    if(conv.data.Value >= 1 && conv.data.Value <= 3){

      conv.ask(`${getPhrase('communication','q1-not-very-challenging')}. Now ${getPhrase('communication','confession')}`);
      conv.contexts.set('communication-feelings', 2);
      personTwo.push(conv.data.Value);
      communicationSwitch = 0;
    }else if(conv.data.Value >= 4 && conv.data.Value <= 7){

      conv.ask(`${getPhrase('communication','q1-moderately-challenging')}. Now ${getPhrase('communication','confession')}`);
        conv.contexts.set('communication-feelings', 2);
      personTwo.push(conv.data.Value);
      communicationSwitch = 0;
    }else if(conv.data.Value >= 8 && conv.data.Value <= 10){

      conv.ask(`${getPhrase('communication','q1-highly-challenging')}. Now ${getPhrase('communication','confession')}`);
      conv.contexts.set('communication-feelings', 2);
      personTwo.push(conv.data.Value);
      communicationSwitch = 0;
    }else{
      conv.ask(`I do beleave I said 1 through 10`);
    }
  }

});

// SENTIMENT ///////////////////////////////////////////////////////////////// SENTIMENT ///////////////////////////////////////////////////////////////// SENTIMENT //

/////////////////////////////////SIBLINGS //////////////////////


app.intent('siblings - fallback', async conv =>{

  const score = await sentiment(conv.query);
//////FIEST PERSON/////////////////////////////////////
if(siblingReaction){
  if(score >= -1 && score <= -0.5){
      if(conv.data.boysNum >= 1 || conv.data.girlsNum >= 1){
      conv.ask(`<speak>${getPhrase('siblings','reaction-negitive-siblings')}. <break time="1s"/>
          ${conv.data.userNameTwo} ${getPhrase('siblings','person-switch')} </speak>`);
          personOne.push(score);
          siblingReaction = false;
      }else{
        conv.ask(`<speak> ${getPhrase('siblings','reaction-negitive-no-siblings')}  <break time="1s"/>
           ${conv.data.userNameTwo} ${getPhrase('siblings','person-switch')} </speak>`);
           siblingReaction = false;
           personOne.push(score);
      }
  }else if(score >= -0.5 && score <= 0){
      if(conv.data.boysNum >= 1 || conv.data.girlsNum >= 1){
      conv.ask(`<speak> ${getPhrase('siblings','reaction-negitive-siblings-2')} <break time="1s"/>
          ${conv.data.userNameTwo} ${getPhrase('siblings','person-switch')}  </speak>`);
            siblingReaction = false;
            personOne.push(score);
        }else{
      conv.ask(`<speak> ${getPhrase('siblings','reaction-negitive-no-siblings-2')} <break time="1s"/>
          ${conv.data.userNameTwo} ${getPhrase('siblings','person-switch')} </speak>`);
          siblingReaction = false;
          personOne.push(score);
        }
  }else if(score >= 0 && score <= 0.5){
        if(conv.data.boysNum >= 1 || conv.data.girlsNum >= 1){
          conv.ask(`Thankyou for sharing ${conv.data.userNameOne}. ${conv.data.userNameTwo}, ${getPhrase('siblings','person-switch')}`);
            siblingReaction = false;
            personOne.push(score)
        }else{
          conv.ask(`Thankyou for sharing ${conv.data.userNameOne}. ${conv.data.userNameTwo}, ${getPhrase('siblings','person-switch')} `);
            siblingReaction = false;
            personOne.push(score);
        }
  }else if(score >= 0.5 && score <= 1.0){
        if(conv.data.boysNum >= 1 || conv.data.girlsNum >= 1){
          conv.ask(`${getPhrase('siblings','reaction-positive')} ${conv.data.userNameTwo}, ${getPhrase('siblings','person-switch')}`);
              siblingReaction = false;
              personOne.push(score);
        }else{
          conv.ask(`I can see you are happy. ${conv.data.userNameTwo}, ${getPhrase('siblings','person-switch')} `);
              siblingReaction = false;
              personOne.push(score);
        }
      }
///////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////PERSON TWO////////////////////
///////////////////////////////////////////////////////////////////////////

    }else if(siblingReaction != true){
      if(score >= -1.0 && score <= -0.5){
        conv.contexts.set('communication-feelings', 1);
          if(conv.data.boysNum >= 1 || conv.data.girlsNum >= 1){
          conv.ask(`<speak>${getPhrase('siblings','reaction-negitive-siblings')}. <break time="1s"/>
          ${getPhrase('communication','intro')}. ${conv.data.userNameOne} ${getPhrase('communication','q1')}</speak>`);
          siblingReaction = false;
          personTwo.push(score);
          }else{
            conv.ask(`<speak> ${getPhrase('siblings','reaction-negitive-no-siblings')}.<break time="1s"/>
            ${getPhrase('communication','intro')}. ${conv.data.userNameOne} ${getPhrase('communication','q1')}</speak>`);
              siblingReaction = false;
              personTwo.push(score);
          }
      }else if(score >= -0.5 && score <= 0.0){
          if(conv.data.boysNum >= 1 || conv.data.girlsNum >= 1){
          conv.ask(`<speak> ${getPhrase('siblings','reaction-negitive-siblings-2')}. <break time="1s"/>
          ${getPhrase('communication','intro')}. ${conv.data.userNameOne} ${getPhrase('communication','q1')}</speak>`);
          siblingReaction = false;
            personTwo.push(score);
            }else{
          conv.ask(`<speak> ${getPhrase('siblings','reaction-negitive-no-siblings-2')}. <break time="1s"/>
          ${conv.data.userNameOne} ${getPhrase('communication','q1')}</speak>`);
          siblingReaction = false;
            personTwo.push(score);
            }
      }else if(score >= 0.0 && score <= 0.5){
            if(conv.data.boysNum >= 1 || conv.data.girlsNum >= 1){
              conv.ask(`<speak> Thankyou for sharing ${conv.data.userNameOne}. ${conv.data.userNameOne} ${getPhrase('communication','q1')}</speak>`);
                personTwo.push(score);
            }else{
              conv.ask(`<speak> Thankyou for sharing ${conv.data.userNameOne}. ${conv.data.userNameOne} ${getPhrase('communication','q1')} </speak>`);
                personTwo.push(score);
            }
      }else if(score >= 0.5 && score <= 1){
            if(conv.data.boysNum >= 1 || conv.data.girlsNum >= 1){
              conv.ask(`<speak> ${getPhrase('siblings','reaction-positive')}. ${conv.data.userNameOne} ${getPhrase('communication','q1')} </speak>`);
               personTwo.push(score);
            }else{
              conv.ask(`I can see you are happy. ${conv.data.userNameOne} ${getPhrase('communication','q1')}</speak>`);
                personTwo.push(score);
            }
          }
    }
});

/////////////////////////////////////////////////////////////////
/////////////////////////////////DINER TIME SENTIMENT/////////////
/////////////////////////////////////////////////////////////////

app.intent('dinner time - fallback', async conv => {
  const score = await sentiment(conv.query);
  if(score >= -1 && score <= -0.5){

      conv.ask(`<speak> ${getPhrase('dinner-time','very-negitive')} <break time="1s"/>
        ${conv.data.userNameOne}, ${getPhrase('dinner-time','sibling-followup')} </speak>`);
        collectiveData.push(score);

  }else if(score >= -0.5 && score <= 0){

      conv.ask(`<speak> ${getPhrase('dinner-time','annoyed')} <break time="3s"/>
        ${conv.data.userNameOne}, ${getPhrase('dinner-time','sibling-followup')} </speak>`);
        collectiveData.push(score);

  }else if(score >= 0 && score <= 0.5){

      conv.ask(`<speak> ${getPhrase('dinner-time','positive')} <break time="1s"/>
        ${conv.data.userNameOne}, ${getPhrase('dinner-time','sibling-followup')} </speak>`);
        collectiveData.push(score);

  } else if(score >= 0.5 && score <= 1){

    conv.ask(`<speak> ${getPhrase('dinner-time','very-positive')} <break time="1s"/>
      ${conv.data.userNameOne}, ${getPhrase('dinner-time','sibling-followup')} </speak>`);
      collectiveData.push(score);
  }
});
/////////////////////////////////////////////////////////////////
/////////////////////////////////COMMUNICATION SENTIMENT/////////
/////////////////////////////////////////////////////////////////

app.intent('communication - fallback', async conv =>{
  const score = await sentiment(conv.query);
if(communicationReaction){
  if(score >= -1.0 && score <= -0.5){
    conv.ask(`${getPhrase('comminication','frustrated')} ${getPhrase('comminication','person-switch')} `);
  } else if(score >= -0.5 && score <= 0){
    conv.ask(`${getPhrase('comminication','less-frustrated')} ${getPhrase('comminication','person-switch')}`);
  } else if(score >= 0 && score <= 0.5){
    conv.ask(`${getPhrase('comminication','nutral')} ${getPhrase('comminication','person-switch')}`);
  } else if(score >= 0.5 && score <= 1){
    conv.ask(`${getPhrase('comminication','good')} ${getPhrase('comminication','person-switch')}`);
  }
}else if(communicationReaction === true){
  if(score >= -1.0 && score <= -0.5){
    conv.close(`${getPhrase('comminication','frustrated')} ${conv.data.userNameTwo} and ${conv.data.userNameOne},
    ${getPhrase('comminication','conclustion')}
    ${getPhrase('comminication','wisdom-1')}`);
  } else if(score >= -0.5 && score <= 0){
    conv.close(`${getPhrase('comminication','less-frustrated')} ${conv.data.userNameTwo} and ${conv.data.userNameOne}
    ${getPhrase('comminication','conclustion')} ${getPhrase('comminication','wisdom-2')}`);

  } else if(score >= 0 && score <= 0.5){
    conv.close(`${getPhrase('comminication','nutral')} ${conv.data.userNameTwo} and ${conv.data.userNameOne}
    ${getPhrase('comminication','conclustion')}   ${getPhrase('comminication','wisdom-2')}`);

  } else if(score >= 0.5 && score <= 1){
    conv.close(`${getPhrase('comminication','good')} ${conv.data.userNameTwo} and ${conv.data.userNameOne}
    ${getPhrase('comminication','conclustion')}
    ${getPhrase('comminication','wisdom-2')}`);
  }
}

});

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
