System.register('xtraball/flarum-custom/main', ['flarum/extend', 'flarum/components/HeaderSecondary', 'flarum/components/SessionDropdown', 'flarum/components/Button', 'flarum/components/SettingsPage'], function (_export) {
  'use strict';

  var extend, HeaderSecondary, SessionDropdown, Button, SettingsPage, config;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsHeaderSecondary) {
      HeaderSecondary = _flarumComponentsHeaderSecondary['default'];
    }, function (_flarumComponentsSessionDropdown) {
      SessionDropdown = _flarumComponentsSessionDropdown['default'];
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton['default'];
    }, function (_flarumComponentsSettingsPage) {
      SettingsPage = _flarumComponentsSettingsPage['default'];
    }],
    execute: function () {
      config = {
        loginRoute: 'https://www.siberiancms.com/wp-login.php?redirect_to=open-source',
        logoutRoute: 'https://www.siberiancms.com/logout-2'
      };

      app.initializers.add('xtraball-flarum-custom', function () {

        // We replace the login button with a redirect to WordPress Auth, previously hooked with our module!
        extend(HeaderSecondary.prototype, 'items', function (items) {
          if (!app.session.user) {
            items.remove('logIn');
            items.add('logIn', Button.component({
              children: app.translator.trans('core.forum.header.log_in_link'),
              className: 'Button Button--link',
              onclick: function onclick() {
                window.open(config.loginRoute);
              }
            }), 0);
          }
        });

        // We replace the logout button with a redirect to WordPress Auth, previously hooked with our module!
        extend(SessionDropdown.prototype, 'items', function (items) {
          items.remove('logOut');
          items.add('logOut', Button.component({
            icon: 'sign-out',
            children: app.translator.trans('core.forum.header.log_out_button'),
            onclick: function onclick() {
              window.open(config.logoutRoute);
            }
          }), -100);
        });

        // Removes all section "account" including change password/ change e-mail!
        extend(SettingsPage.prototype, 'settingsItems', function (settingsItems) {
          settingsItems.remove('account');
        });
      });
    }
  };
});