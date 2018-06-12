System.register('xtraball/flarum-custom/main', ['flarum/extend', 'flarum/components/HeaderSecondary', 'flarum/components/Button', 'flarum/components/SettingsPage'], function (_export) {
  'use strict';

  var extend, HeaderSecondary, Button, SettingsPage, config;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsHeaderSecondary) {
      HeaderSecondary = _flarumComponentsHeaderSecondary['default'];
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton['default'];
    }, function (_flarumComponentsSettingsPage) {
      SettingsPage = _flarumComponentsSettingsPage['default'];
    }],
    execute: function () {
      config = {
        loginRoute: 'https://www.siberiancms.com/wp-login.php?redirect_to=open-source'
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

        // Removes all section "account" including change password/ change e-mail!
        extend(SettingsPage.prototype, 'settingsItems', function (settingsItems) {
          settingsItems.remove('account');
        });
      });
    }
  };
});