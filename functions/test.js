const language = require('@google-cloud/language');

// Instantiates a client
const client = new language.LanguageServiceClient({
	keyFilename: './google.json'
});

// The text to analyze
const text = 'I\'m very happy!';

const document = {
  content: text,
  type: 'PLAIN_TEXT',
};

// Detects the sentiment of the text
client
  .analyzeSentiment({document: document})
  .then(results => {
    const sentiment = results[0].documentSentiment;
	console.log(results[0]);
    console.log(`Text: ${text}`);
    console.log(`Sentiment score: ${sentiment.score}`);
    console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
    console.log('Sentences: ', results[0].sentences);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
