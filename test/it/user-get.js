const utils = require('../utils');
const okta = require('../../');
let orgUrl = process.env.OKTA_CLIENT_ORGURL;
let mockServer = false;

if (process.env.OKTA_USE_MOCK) {
  orgUrl = `${orgUrl}/user-get`;
  mockServer = true;
}

const client = new okta.Client({
  orgUrl: orgUrl,
  token: process.env.OKTA_CLIENT_TOKEN
});

describe('User API Tests', () => {
  it('should get user by ID & Login', async () => {
    // 1. Create a user
    const newUser = {
      profile: {
        firstName: 'John',
        lastName: 'Get-User',
        email: 'john-get-user@example.com',
        login: 'john-get-user@example.com'
      },
      credentials: {
        password: { value: 'Abcd1234' }
      }
    };

    // Cleanup the user if user exists
    if (!mockServer) {
      await utils.cleanup(client, newUser);
    }

    let queryParameters = { activate : 'false' };
    const createdUser = await client.createUser(newUser, queryParameters);
    utils.validateUser(createdUser, newUser);

    // 2. Get the user by user ID
    const userByID = await client.getUser(createdUser.id);
    utils.validateUser(userByID, createdUser);

    // 3. Get the user by user login
    const userByLogin = await client.getUser(createdUser.profile.login);
    utils.validateUser(userByLogin, createdUser);

    // 4. Delete the user
    await utils.deleteUser(createdUser);
  });
});
