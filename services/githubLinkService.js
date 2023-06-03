const axios = require("axios");

const getGitHubLinks = async (field, queryData) => {
  try {
    const response = await axios.get(`http://127.0.0.1:5000/github`, {
      params: { query: queryData },
    });
    const listOfLinks = response?.data;
    let testLInks = [],
      checkLinks;
    for (let items of listOfLinks.URLS) {
      testLInks.push(items[0].toString() + "\n");
    }
    checkLinks = testLInks.toString().split(",").join(" ");
    return `Github Repositories For ${queryData} : \n` + checkLinks.toString();
  } catch (error) {
    console.log({ error });
  }
};

module.exports = getGitHubLinks;
