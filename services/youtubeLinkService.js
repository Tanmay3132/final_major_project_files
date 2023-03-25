const { default: axios } = require("axios");

const getYoutubeLinks = async (field, queryData) => {
  try {
    const response = await axios.get(`http://127.0.0.1:5000/youtube`, {
      params: { query: queryData },
    });
    const listOfLinks = response?.data;
    let youtubeLinks = new Set(listOfLinks?.Videos);
    let testLInks = [],
      checkLinks;
    for (let items of youtubeLinks) {
      testLInks.push(items.toString() + "\n");
    }
    checkLinks = testLInks.toString().split(",").join(" ");
    return checkLinks.toString();
  } catch (error) {
    console.log({ error });
  }
};

module.exports = getYoutubeLinks;
