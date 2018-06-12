<?php

use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Event\ConfigureWebApp;

return function (Dispatcher $events) {
    $events->listen(ConfigureWebApp::class, function (ConfigureWebApp $event) {
        if ($event->isForum()) {
            $event->addAssets(__DIR__.'/js/forum/dist/extension.js');
            $event->addBootstrapper('xtraball/flarum-custom/main');
        }
    });
};
