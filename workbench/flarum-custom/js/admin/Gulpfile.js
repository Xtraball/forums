var flarum = require('flarum-gulp');

flarum({
  modules: {
    'xtraball/flarum-custom': [
      'src/**/*.js'
    ]
  }
});
