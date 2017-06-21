const models = require('../src/models');
const expect = require('chai').expect;

function delay(t) {
  return new Promise(function (resolve) {
    setTimeout(resolve, t);
  });
}

function validateUser(user, expectedUser) {
  expect(user).to.be.an.instanceof(models.User);
  expect(user.profile.firstName).to.equal(expectedUser.profile.firstName);
  expect(user.profile.lastName).to.equal(expectedUser.profile.lastName);
  expect(user.profile.email).to.equal(expectedUser.profile.email);
  expect(user.profile.login).to.equal(expectedUser.profile.login);
}

function authenticateUser(userName, password, client) {
  const data = {
    username: userName,
    password: password,
  };

  let url = `${client.baseUrl}/api/v1/authn`;

  const request = client.http.postJson(url, {
    body: data
  });
  return request;
}

function validateGroup(group, expectedGroup) {
  expect(group).to.be.an.instanceof(models.Group);
  expect(group.profile.name).to.equal(expectedGroup.profile.name);
  expect(group.type).to.equal('OKTA_GROUP');
}

async function isUserInGroup(groupUser, group) {
  let userPresent = false;
  await group.listUsers().each(user => {
    if (user.id === groupUser.id) {
      userPresent = true;
      return false;
    }
  });
  return userPresent;
}

async function deleteUser(user) {
  await user.deactivate();
  await user.delete();
}

async function isUserPresent(client, expectedUser, queryParameters) {
  let userPresent = false;
  await client.listUsers(queryParameters).each(user => {
    expect(user).to.be.an.instanceof(models.User);
    if (user.profile.login === expectedUser.profile.login) {
      userPresent = true;
      return false;
    }
  });
  return userPresent;
}

async function isGroupPresent(client, expectedGroup, queryParameters) {
  let groupPresent = false;
  await client.listGroups(queryParameters).each(group => {
    expect(group).to.be.an.instanceof(models.Group);
    if (group.profile.name === expectedGroup.profile.name) {
      groupPresent = true;
      return false;
    }
  });
  return groupPresent;
}

module.exports = {
  delay: delay,
  validateUser: validateUser,
  authenticateUser: authenticateUser,
  validateGroup: validateGroup,
  isUserInGroup: isUserInGroup,
  deleteUser: deleteUser,
  isUserPresent: isUserPresent,
  isGroupPresent: isGroupPresent
};
