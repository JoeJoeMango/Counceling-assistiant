app.intent('Child-money',async(conv, {sensitive, sibling}) => {
    var sen = {sensitive};
    var sib = {sibling};
    conv.data.sibling_ = sibling;
    // conv.data.sensistiveNotification = sensitive;
    // NEED FOLLOW UP INTENT FOR HOW DID THAT MAKE YOU FEEL???????????
    if (moneyPersonSwitch){

      if(conv.data.sibling_ == "sister"){
        conv.contexts.set('Child-money-thoughts', 1);
        conv.ask(`sister thankyou for sharing, ${conv.data.userNameTwo}. How does that make you feel? `);
      }else if (conv.data.sibling_ == "brother"){
        conv.contexts.set('Child-money-thoughts', 1);
        conv.ask(`brother thankyou for sharing, ${conv.data.userNameTwo}. How does that make you feel?`);
      }else{
        conv.contexts.set('Child-money-thoughts', 1);
        conv.ask(`thankyou for sharing, ${conv.data.userNameTwo}. Did you enjoy being an only child? or did you wish you had siblings?`);
      }
      moneyPersonSwitch = false;
    }else if(moneyPersonSwitch != true){
      //conv.contexts.set('child-money-sensitive-no-person-switch', 2);
      if(conv.data.sibling_ == "sister"){
        conv.contexts.set('Child-money-thoughts', 1);
        conv.ask(`was your sister older then you?`);
      }else if (conv.data.sibling_ == "brother"){
        conv.contexts.set('Child-money-thoughts', 1);
        conv.ask(`Thankyou ${conv.data.userNameOne}. Did you enjoy being an only child? or did you wish you had siblings?`);
      }else{
        conv.ask(`thankyou for sharing, ${conv.data.userNameOne}. This brings me to Communication which
          at it's core a way to reduce conflict and create a more effective way for not just you and your partner
          but everyone and everthing to share what you are feeling in order to come to some understanding of the matter at hand.
          So as you can imagin when Communication ceases to exist or is not effective turmoil and misunderstanding can occur.
          From what I can see so far...  ${conv.data.userNameTwo} what would you say your most common fights or arguments are about? `);
      }
      moneyPersonSwitch = 0;
    }
  });
//////sibling stuff



        if(conv.data.boysNum >= 1 || conv.data.girlsNum >= 1){
        conv.ask(`${getPhrase('siblings','reaction-negitive-siblings')}`);
        }else{
          conv.ask(`<speak> ${getPhrase('siblings','reaction-negitive-no-siblings')} <break time="1s"/> </speak>`);
        }



      if(conv.data.boysNum >= 1 || conv.data.girlsNum >= 1){
      conv.ask(`<speak> ${getPhrase('siblings','reaction-negitive-siblings-2')} <break time="1s"/> </speak>`);
        }else{
      conv.ask(`<speak> ${getPhrase('siblings','reaction-negitive-no-siblings-2')} <break time="1s"/> </speak>`);
        }




/*

        app.intent('dinner time', async(conv, { DOW, DOW1 }) => {
        	conv.data.dow = DOW;
          conv.data.dow1 = DOW1;

          console.log("....................." + conv.data.dow);
          console.log("..................... " + conv.data.dow1);
          console.log("..............din........ " + dinnerPersonSwitch);

        	if (dinnerPersonSwitch === 0 && conv.data.dow1 >= 0 && conv.data.dow1 <= 7) {
            dinnerPersonSwitch = 1;
        		conv.ask(`Thankyou ${conv.data.userNameOne}, ${conv.data.userNameTwo} and you?`);
        		personOne.push(`${conv.data.dow1}`);

            console.log("===================== " + conv.data.dow1);
            console.log("===================== " + conv.data.dow);
            console.log("========din============= " + dinnerPersonSwitch);

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
        		} else {
        			conv.ask(getPhrase('dinner-time', 'wrong-days', {dow: conv.data.dow1}));
              console.log("china")
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

        */
