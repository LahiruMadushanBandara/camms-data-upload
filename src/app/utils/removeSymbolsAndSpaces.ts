export function removeSymbolsAndSpaces(inputString: string) {
  // Use regular expression to remove symbols and spaces
  var cleanedString = inputString.replace(/[^\w\s]| /gi, '');

  // Split the cleaned string into an array of words
  var wordsArray = cleanedString.split(' ');

  // Filter out any empty strings
  var filteredArray = wordsArray.filter(function (word) {
    return word !== '';
  });

  // Join the filtered array of words into a single string
  var result = filteredArray.join(' ');
  var truncateResult = truncateString(result);
  return truncateResult;
}

function truncateString(str: string): string {
  if (str.length > 30) {
    return str.substring(0, 30);
  }
  return str;
}
