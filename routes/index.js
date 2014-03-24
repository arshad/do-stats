
/*
 * GET home page.
 */
var request = require('request');
var data = {};
var hostname = 'http://do-api.heroku.com';

exports.index = function(req, res){
  options = { title: 'Drupal.org Stats' }

  if (username = req.query.username) {
    options.title = 'Stats for ' + username;
    options.source = {
      html: req.headers.host + '?username=' + username, 
      json: req.headers.host + '?username=' + username + '&json=1',
    };

    getUserInfo(username, data, function(data) {
      options.data = data;

      if (req.query.json) {
        res.json(data);
      } else {
        res.render('index', options);
      }
    });

  } else {
    res.render('index', options);
  }
};

var getUserInfo = function(username, data, callback) {
  request(hostname + '/api/user/' + username, function(error, response, body) {
    // Handle user not found.
    if (response.statusCode == 404) {
      data.error = "User not found.";
      callback(data);
    }
    else if (!error && response.statusCode == 200) {
      data.info = JSON.parse(body);
      getUserCommit(username, data, callback);
    }
  });
}

var getUserCommit = function(username, data, callback) {
  request(hostname + '/api/user/commits/count/' + username, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      data.commits = JSON.parse(body);
      getUserProjects(username, data, callback);
    }
  });
}

var getUserProjects = function(username, data, callback) {
  request(hostname + '/api/user/projects/' + username, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      data.projects = {};
      data.projects.projects = JSON.parse(body);
      data.projects.count = data.projects.projects.length;
      callback(data);
    }
  }); 
}

var getProjectInfo = function(name, data, projects) {
  request(hostname + '/api/project/' + name, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      return JSON.parse(body);
    }
  });
}
