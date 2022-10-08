export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const returnFirstSentence = (longString) => {
  const arrayOfSentences = longString.split(".");
  const firstSentence = arrayOfSentences[0] + ".";
  if (firstSentence.length > 40) {
    return "Explore user to read bio";
  }
  return firstSentence;
};
