System.register('xtraball/flarum-custom/main', ['flarum/extend', 'flarum/components/SessionDropdown'], function (_export) {
  'use strict';

  var extend, SessionDropdown, config;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsSessionDropdown) {
      SessionDropdown = _flarumComponentsSessionDropdown['default'];
    }],
    execute: function () {
      config = {
        logoutRoute: 'https://www.siberiancms.com/logout-2'
      };

      app.initializers.add('xtraball-flarum-custom', function () {
        // We replace the login button with a redirect to WordPress Auth, previously hooked with our module!
        extend(SessionDropdown.prototype, 'items', function (items) {
          items.remove('logOut');
        });
      });
    }
  };
});