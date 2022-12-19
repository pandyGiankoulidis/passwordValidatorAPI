const request = require('request');
var express = require('express');
var router = express.Router();
const sessions = require('express-session');
const db = require("../../models");
const User = db.user;
const url = require('url');


class TimeStamp {
  constructor(duration) {
    this._years = 0;
    this._months = 0;
    this._days = 0;
    this._hours = 0;
    this._minutes = 0;
    this._seconds = 0;

    while (duration > 0) {
      if (duration > (31536000 * 1000000)) {
        this._years = -1;
        break;
      }
      if (duration > 31536000) {
        this._years = this._years + 1;
        duration = duration - 31536000;
        continue;
      }

      if (duration > 2628000) {
        this._months = this._months + 1;
        duration = duration - 2628000;
        continue;
      }

      if (duration > 86400) {
        this._days = this._days + 1;
        duration = duration - 86400;
        continue;
      }

      if (duration > 3600) {
        this._hours = this._hours + 1;
        duration = duration - 3600;
        continue;
      }

      if (duration > 60) {
        this._minutes = this._minutes + 1;
        duration = duration - 60;
        continue;
      }

      this._seconds = Math.trunc(duration);
      break;
    }
  }

  get years() {
    return this._years;
  }

  get months() {
    return this._months;
  }

  get days() {
    return this._days;
  }

  get hours() {
    return this._hours;
  }

  get minutes() {
    return this._minutes;
  }

  get seconds() {
    return this._seconds;
  }
}



/*Routing functions */
router.get('/validate', function (req, res, next) {
  const queryObject = url.parse(req.url, true).query

  if (queryObject.password) {

    const pword = new String(queryObject.password);

    let i = 0, score = 0;
    let number = 0, lowercase = 0, uppercase = 0, symbol = 0, tabsSpaces = 0, nonspecial = 0;

    const operationsPerSecond = 38 * (10 ** 14);

    while (i < pword.length) {
      /**
           * Count the non-special characters before the loop.
           * If the character at index i of the password does not belong to any of 
           * the categories number,lowercase,uppercase or spacetab, than the summary 
           * of the aforementioned char count occurances in the password 
           * 
           * number + lowercase + uppercase + tabsSpaces + symbol
           * 
           * shouldn't have been increased.
           * 
           * 
           */
      nonspecial = number + lowercase + uppercase + tabsSpaces + symbol;


      i++;
      /**
      * Perform string validation based on ascii numbers
      * 
      */

      /**
      * Case 1:Number
      */
      if (("0".charCodeAt(0) <= pword.charCodeAt(i)) && (pword.charCodeAt(i) <= "9".charCodeAt(0))) {
        number = number + 1;
      }

      /**
      * Case 2:Lower case letter
      */
      if (("a".charCodeAt(0) <= pword.charCodeAt(i)) && (pword.charCodeAt(i) <= "z".charCodeAt(0))) {
        lowercase = lowercase + 1;
      }

      /**
      * Case 3:Upper case letter
      */
      if (("A".charCodeAt(0) <= pword.charCodeAt(i)) && (pword.charCodeAt(i) <= "Z".charCodeAt(0))) {
        uppercase = uppercase + 1;
      }

      /**
      * Case 4:Tabs Spaces
      */
      if (pword.charCodeAt(i) == 32 || pword.charCodeAt(i) == 9) {
        tabsSpaces = tabsSpaces + 1;
      }

      /**
      * Case 5:Special symbol
      */
      if (nonspecial == (number + lowercase + uppercase + tabsSpaces + symbol)) {
        symbol = symbol + 1;
      }

    }
    symbol = symbol - 1; //Remove the counting of the \n character


    const uppercaseExists = uppercase > 0 ? 1 : 0;
    const numberExists = number > 0 ? 1 : 0;
    const lowercaseExists = lowercase > 0 ? 1 : 0;
    const symbolExists = symbol > 0 ? 1 : 0;
    const tabsExists = tabsSpaces > 0 ? 1 : 0;

    permutations = 1;
    for (j = 0; j < pword.length; j++) {
      permutations = permutations * (26 * uppercaseExists + 10 * numberExists + 26 * lowercaseExists + 64 * symbolExists + 2 * tabsExists);
    }

    const avgPermutations = permutations * 0.3465735;

    /* Time for brute force cracking without hashing */
    const UnhashedBestBruteForceCrackingTime = permutations / operationsPerSecond;
    const UnhashedAverageBruteForceCrackingTime = avgPermutations / operationsPerSecond;

    /* Time for brute force generating hashes of passwords*/
    const MD5hashTimePerMillionHashes = 0.6274 * (10 ** (-3));
    const MD5BestCaseBruteForceTimeToCrack = (permutations * MD5hashTimePerMillionHashes) / (10 ** 6);
    const MD5AverageCaseBruteForceTimeToCrack = (avgPermutations * MD5hashTimePerMillionHashes) / (10 ** 6);


    const SHA256hashTimePerMillionHashes = 0.7378 * (10 ** (-4));
    const SHA256BestCaseBruteForceTimeToCrack = (permutations * SHA256hashTimePerMillionHashes) / (10 ** 6);
    const SHA256AverageCaseBruteForceTimeToCrack = (avgPermutations * SHA256hashTimePerMillionHashes) / (10 ** 6);


    const BCrypthashTimePerMillionHashes = 0.988 * (10 ** (-5));
    const BCryptBestCaseBruteForceTimeToCrack = (permutations * BCrypthashTimePerMillionHashes) / (10 ** 6);
    const BCryptAverageCaseBruteForceTimeToCrack = (avgPermutations * BCrypthashTimePerMillionHashes) / (10 ** 6);

    /*Tranform the seconds in human readable format, YY-MM-DD,hh-mm-ss*/
    unhashedAvgTime = new TimeStamp(UnhashedAverageBruteForceCrackingTime);
    unhashedBestTime = new TimeStamp(UnhashedBestBruteForceCrackingTime);
    md5AvgTime = new TimeStamp(MD5AverageCaseBruteForceTimeToCrack);
    md5BestTime = new TimeStamp(MD5BestCaseBruteForceTimeToCrack);
    sha256AvgTime = new TimeStamp(SHA256AverageCaseBruteForceTimeToCrack);
    sha256BestTime = new TimeStamp(SHA256BestCaseBruteForceTimeToCrack);
    bcryptAvgTime = new TimeStamp(BCryptAverageCaseBruteForceTimeToCrack);
    bcryptBestTime = new TimeStamp(BCryptBestCaseBruteForceTimeToCrack);

    let strength = "Very Strong";
    if (UnhashedAverageBruteForceCrackingTime < 7200) {//less than two hours for cracking
      strength = "Very weak";
    } else {
      if (UnhashedAverageBruteForceCrackingTime < 86400) {//less than a day to crack
        strength = "Weak";
      } else {
        if (UnhashedAverageBruteForceCrackingTime < 864000) {//less than 10 days to crack
          strength = "Fair";
        } else {
          if (UnhashedAverageBruteForceCrackingTime < 2628000) {//less than a month to crack
            strength = "Strong";
          }
        }
      }
    }

    res.status(200).send({
      'UnhashedBruteForceCrackingTime': {
        'best_case': {
          years: unhashedBestTime.years == -1 ? 'More than 1.000.000' : unhashedBestTime.years,
          months: unhashedBestTime.months,
          days: unhashedBestTime.days,
          hours: unhashedBestTime.hours,
          minutes: unhashedBestTime.minutes,
          seconds: unhashedBestTime.seconds
        },
        'average_case': {
          years: unhashedAvgTime.years == -1 ? 'More than 1.000.000' : unhashedAvgTime.years,
          months: unhashedAvgTime.months,
          days: unhashedAvgTime.days,
          hours: unhashedAvgTime.hours,
          minutes: unhashedAvgTime.minutes,
          seconds: unhashedAvgTime.seconds
        }
      },
      'MD5bruteForceCrackingTime': {
        'best_case': {
          years: md5BestTime.years == -1 ? 'More than 1.000.000' : md5BestTime.years,
          months: md5BestTime.months,
          days: md5BestTime.days,
          hours: md5BestTime.hours,
          minutes: md5BestTime.minutes,
          seconds: md5BestTime.seconds
        },
        'average_case': {
          years: md5AvgTime.years == -1 ? 'More than 1.000.000' : md5AvgTime.years,
          months: md5AvgTime.months,
          days: md5AvgTime.days,
          hours: md5AvgTime.hours,
          minutes: md5AvgTime.minutes,
          seconds: md5AvgTime.seconds
        }
      },
      'SHA256bruteForceCrackingTime': {
        best_case: {
          years: sha256BestTime.years == -1 ? 'More than 1.000.000' : sha256BestTime.years,
          months: sha256BestTime.months,
          days: sha256BestTime.days,
          hours: sha256BestTime.hours,
          minutes: sha256BestTime.minutes,
          seconds: sha256BestTime.seconds
        },
        average_case: {
          years: sha256AvgTime.years == -1 ? 'More than 1.000.000' : sha256AvgTime.years,
          months: sha256AvgTime.months,
          days: sha256AvgTime.days,
          hours: sha256AvgTime.hours,
          minutes: sha256AvgTime.minutes,
          seconds: sha256AvgTime.seconds
        }
      },
      'BCryptbruteForceCrackingTime': {
        best_case: {
          years: bcryptBestTime.years == -1 ? 'More than 1.000.000' : bcryptBestTime.years,
          months: bcryptBestTime.months,
          days: bcryptBestTime.days,
          hours: bcryptBestTime.hours,
          minutes: bcryptBestTime.minutes,
          seconds: bcryptBestTime.seconds
        },
        average_case: {
          years: bcryptBestTime.years == -1 ? 'More than 1.000.000' : bcryptBestTime.years,
          months: bcryptBestTime.months,
          days: bcryptBestTime.days,
          hours: bcryptBestTime.hours,
          minutes: bcryptBestTime.minutes,
          seconds: bcryptBestTime.seconds
        }
      },
      'strength': { strength },
      'popularity': {
        'Average Edit Distances': {
          'levenshteinDistance': req.levenshteinDistance,
          'treeDistance': req.treeDistance
        },
        'guessingDifficulty': 10
      }
    });
  } else {
    res.status(200).send({ 'message': 'No password provided' });
  }
});


router.get('/checkRequirements', function (req, res, next) {
  if (sessions.user) {
    User.find({ username: sessions.user.username }).exec((err, pref) => {
      if (err) {
        res.status(500);
      }

      const queryObject = url.parse(req.url, true).query

      if (queryObject.password) {
        const pword = queryObject.password;
        let number = 0, lowercase = 0, uppercase = 0, symbol = 0, tabsSpaces = 0, nonspecial = 0, i = 0;

        while (i < pword.length) {

          /**
           * Count the non-special characters before the loop.
           * If the character at index i of the password does not belong to any of 
           * the categories number,lowercase,uppercase or spacetab, than the summary 
           * of the aforementioned char count occurances in the password 
           * 
           * number + lowercase + uppercase + tabsSpaces + symbol
           * 
           * shouldn't have been increased.
           * 
           * 
           */
          nonspecial = number + lowercase + uppercase + tabsSpaces + symbol;


          /**
          * Case 1:Number
          */
          if (("0".charCodeAt(0) <= pword.charCodeAt(i)) && (pword.charCodeAt(i) <= "9".charCodeAt(0))) {
            number = number + 1;
          }

          /**
          * Case 2:Lower case letter
          */
          if (("a".charCodeAt(0) <= pword.charCodeAt(i)) && (pword.charCodeAt(i) <= "z".charCodeAt(0))) {
            lowercase = lowercase + 1;
          }

          /**
          * Case 3:Upper case letter
          */
          if (("A".charCodeAt(0) <= pword.charCodeAt(i)) && (pword.charCodeAt(i) <= "Z".charCodeAt(0))) {
            uppercase = uppercase + 1;
          }

          /**
          * Case 4:Tabs Spaces
          */
          if (pword.charCodeAt(i) == 32 || pword.charCodeAt(i) == 9) {
            tabsSpaces = tabsSpaces + 1;
          }

          /**
          * Case 5:Special symbol
          */
          if (nonspecial === (number + lowercase + uppercase + tabsSpaces + symbol)) {
            symbol = symbol + 1;
          }
          i = i + 1;
        }

        let unevenLength = pref[0].length > pword.length;
        let unevenLowercase = pref[0].lowerCase > lowercase;
        let unevenUppercase = pref[0].upperCase > uppercase;
        let unevenNumbers = pref[0].numbers > number;
        let unevenSpecialChar = pref[0].specialCharacters > symbol;
        let unevenTabsSpaces = pref[0].tabsSpaces > tabsSpaces;

        if (unevenLength) {
          res.status(200).send({ message: "Length of password is smaller than required.Minimum length of password must be " + pref[0].length + " characters long" });
        } else if (unevenLowercase) {
          res.status(200).send({ message: "Lowercase letters are fewer than required.There must be at least " + pref[0].lowerCase + " lowercase letters" });
        } else if (unevenUppercase) {
          res.status(200).send({ message: "Uppercase letters are fewer than required.There must be at least " + pref[0].upperCase + " uppercase letters" });
        } else if (unevenNumbers) {
          res.status(200).send({ message: "Digits are fewer than required.There must be at least " + pref[0].numbers + " digits" });
        } else if (unevenSpecialChar) {
          res.status(200).send({ message: "Special characters are fewer than required.There must be at least " + pref[0].specialCharacters + " special characters" });
        } else if (unevenTabsSpaces) {
          res.status(200).send({ message: "Tabs and spaces are fewer than required.There must be at least " + pref[0].tabsSpaces + " tabs or spaces" });
        } else {
          res.status(200).send({ message: "All requirements are met.Password is valid", preferences: pref[0] });
        }
      } else {
        res.status(200).send({ message: "Password for validation not provided!" });
      }
    })
  } else {
    res.status(500).send({ message: "Token provided is invalid" });
  }
})

module.exports = router;
