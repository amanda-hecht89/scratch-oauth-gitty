const exCodeForToken = async (code) => {
  return `MOCK_TOKEN_FOR_CODE_${code}`;
};

const getGithubProfile = async (token) => {
  console.log(`MOCK INVOKED: getGithubProfile(${token})`, 'gross'); 
  return {
    login: 'im_not_real',
    avatar_url: 'https://stock.adobe.com/images/cute-turle-cartoon/70550106',
    email: 'fake_person@example.com',
  };
};

module.exports = { exCodeForToken, getGithubProfile };
