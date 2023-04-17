const getGitHubLinks = require("./githubLinkService");
const getYoutubeLinks = require("./youtubeLinkService");

const checkFieldService = async (query, field) => {
  let displayLinks;
  if (field == "github" || field == "Github" || field == "repos" || field == "repository" ) {
    displayLinks = await getGitHubLinks(field, query);
  }
  else if(field == "youtube" || field == "Youtube" || field == "vidoes"){
    displayLinks = await getYoutubeLinks(field, query);
  }
  return displayLinks?.toString();
};
module.exports = checkFieldService;
