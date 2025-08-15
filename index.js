
import inquirer from 'inquirer';
import fs from 'fs';
import chalk from 'chalk';

const pronouns = {
  "present": ["yo", "tú", "él/ella/usted", "nosotros/nosotras", "ellos/ellas/ustedes"],
  "preterite": ["yo", "tú", "él/ella/usted", "nosotros/nosotras", "ellos/ellas/ustedes"],
  "imperfect": ["yo", "tú", "él/ella/usted", "nosotros/nosotras", "ellos/ellas/ustedes"],
  "conditional": ["yo", "tú", "él/ella/usted", "nosotros/nosotras", "ellos/ellas/ustedes"],
  "future": ["yo", "tú", "él/ella/usted", "nosotros/nosotras", "ellos/ellas/ustedes"],
  "imperative": ["tú", "usted", "nosotros", "ustedes"]
};

const main = async () => {
  const verbsData = JSON.parse(fs.readFileSync('verbs.json', 'utf8'));
  const tenses = Object.keys(verbsData.verbs[0].tenses);
  const tenseDefs = JSON.parse(fs.readFileSync('tenses.json', 'utf8'));
  const imperatives = Object.keys(verbsData.verbs[0].imperative);

  const choices = [...tenses, ...imperatives].map(key => {
    return {name: `${key}: ${tenseDefs[key]}`, value: key}
  });

  const { tense } = await inquirer.prompt([
    {
      type: 'list',
      name: 'tense',
      message: 'Which tense would you like to practice?',
      choices,
    },
  ]);

  const practice = async () => {
    const randomVerb = verbsData.verbs[Math.floor(Math.random() * verbsData.verbs.length)];
    const isTense = tenses.includes(tense);
    const randomPronounIndex = Math.floor(Math.random() * (isTense ? pronouns[tense].length : pronouns.imperative.length));
    const pronoun = isTense ? pronouns[tense][randomPronounIndex] : pronouns.imperative[randomPronounIndex];
    const correctAnswer = isTense ? randomVerb.tenses[tense][randomPronounIndex] : randomVerb.imperative[tense][randomPronounIndex];

    const { answer } = await inquirer.prompt([
      {
        type: 'input',
        name: 'answer',
        message: `${randomVerb.verb} for ${chalk.magenta(pronoun)}:`,
      },
    ]);

    if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
      console.log(chalk.green('Correct!'));
    } else {
      console.log(chalk.red('Incorrect'), `The correct answer is: ${chalk.yellow(correctAnswer)}`);
    }

    practice();
  };

  setTimeout(() => {
    console.log("Time's up! ¡Adiós!");
    process.exit();
  }, 300000);

  practice();
};

main();
