var assert  = require("assert"),
    _       = require('lodash');
module.exports = function() {
  var u = this.user;

  var userData  = {
    "name": 'joe research',
    "email": 'u@r.edu',
    "password": 'password'
  };

  var userDetails  = {
    "job-title": 'Researcher',
    "company": 'Two Sigma',
    "bio": 'I got data all around me'
  };

  var projectBase = {
    name: 'Sandbox',
    description: 'Sandbox'
  };

  this.Given(/^I'm signed in as a researcher$/, function() {
    var _this = this;
    return u.signUp(userData)
    .then(function() {
      return _this.user.updateUser(_.merge(userData, userDetails));
    })
    .then(function() {
      return _this.user.getDetails();
    })
    .then(function(u) {
      var projectData = _.merge(_.cloneDeep(projectBase), {'owner-id': u['public-id']});
      return _this.notebook.createProject(projectData);
    })
    .then(function() {
      return _this.driver.get(_this.route.signIn).then(function() {
        return new _this.Widgets.SignInForm().submitWith(_.pick(userData, 'email', 'password'));
      });
    })
    .then(function() {
      return new _this.Widgets.AppHeader().ensureSignedIn();
    });
  });

  this.Given(/^I signed up as a researcher$/, function() {
    return u.signUp(userData);
  });

  this.Given(/^I'm not signed in$/, function() {
    return this.driver.get(this.route.home);
  });

  this.When(/^I go to the sign in page$/, function() {
    return this.driver.get(this.route.signIn);
  });

  this.When(/^I go to the edit user page$/, function() {
    return new this.Widgets.AppHeader().editUserInfo();
  });

  this.When(/^I fill in the edit user form with:$/, function(table) {
    return new this.Widgets.EditUserForm().submitWith(table.hashes()[0]);
  });

  this.When(/^I should see an error message of "([^"]*)"$/, function(message) {
    return new this.Widgets.EditUserMessage().getMessage()
      .should.eventually.eql(message);
  });

  this.When(/^I fill in the sign in form with:$/, function(table) {
    return new this.Widgets.SignInForm().submitWith(table.hashes()[0]);
  });

  this.Then(/^I should see the header greeting "([^"]*)"$/, function(expected) {
    var appHeader = new this.Widgets.AppHeader();
    return appHeader.getCurrentUserName().should.eventually.eql(expected)
  });

  this.When(/^I click the sign out link$/, function() {
    return new this.Widgets.AppHeader().signOut();
  });

  this.Then(/^I should see I've been signed out$/, function() {
    var landing = new this.Widgets.LandingPage();

    return landing.isPresent().should.eventually.eql(true);
  });

  this.Then(/^I should see the sign in form$/, function() {
    var signInForm = new this.Widgets.SignInForm()
    return signInForm.isPresent().should.eventually.equal(true);
  });

  this.Then(/^I should see navigation$/, function() {
    return new this.Widgets.MainNav().navList().then(function(nav) {
      return nav.isDisplayed().should.eventually.be.true;
    });
  });

  this.Then(/^I shouldn't see navigation$/, function() {
    return new this.Widgets.MainNav().navList().then(function(nav) {
      return nav.isDisplayed().should.eventually.be.false;
    });
  });
};
