import { extend } from 'flarum/extend';
import SessionDropdown from 'flarum/components/SessionDropdown';

let config = {
  logoutRoute: 'https://www.siberiancms.com/logout-2'
};

app.initializers.add('xtraball-flarum-custom', function() {
  // We replace the login button with a redirect to WordPress Auth, previously hooked with our module!
  extend(SessionDropdown.prototype, 'items', function(items) {
    items.remove('logOut');
  });
});
