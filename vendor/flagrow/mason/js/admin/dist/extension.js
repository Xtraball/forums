'use strict';

System.register('flagrow/mason/addMasonFieldsPane', ['flarum/extend', 'flarum/app', 'flarum/components/AdminNav', 'flarum/components/AdminLinkButton', 'flagrow/mason/panes/MasonFieldsPane'], function (_export, _context) {
    "use strict";

    var extend, app, AdminNav, AdminLinkButton, MasonFieldsPane;

    _export('default', function () {
        // create the route
        app.routes['flagrow-mason-fields'] = {
            path: '/flagrow/mason',
            component: MasonFieldsPane.component()
        };

        // bind the route we created to the three dots settings button
        app.extensionSettings['flagrow-mason'] = function () {
            return m.route(app.route('flagrow-mason-fields'));
        };

        extend(AdminNav.prototype, 'items', function (items) {
            // add the Image Upload tab to the admin navigation menu
            items.add('flagrow-mason-fields', AdminLinkButton.component({
                href: app.route('flagrow-mason-fields'),
                icon: 'check-square',
                children: 'Mason',
                description: app.translator.trans('flagrow-mason.admin.menu.description')
            }));
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsAdminNav) {
            AdminNav = _flarumComponentsAdminNav.default;
        }, function (_flarumComponentsAdminLinkButton) {
            AdminLinkButton = _flarumComponentsAdminLinkButton.default;
        }, function (_flagrowMasonPanesMasonFieldsPane) {
            MasonFieldsPane = _flagrowMasonPanesMasonFieldsPane.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('flagrow/mason/addPermissions', ['flarum/extend', 'flarum/app', 'flarum/components/PermissionGrid'], function (_export, _context) {
    "use strict";

    var extend, app, PermissionGrid;

    _export('default', function () {
        extend(PermissionGrid.prototype, 'viewItems', function (items) {
            items.add('flagrow-mason-update-own-fields', {
                icon: 'check-square',
                label: app.translator.trans('flagrow-mason.admin.permissions.update-own-fields'),
                permission: 'flagrow.mason.update-own-fields'
            });
        });

        extend(PermissionGrid.prototype, 'viewItems', function (items) {
            items.add('flagrow-mason-update-other-fields', {
                icon: 'check-square',
                label: app.translator.trans('flagrow-mason.admin.permissions.update-other-fields'),
                permission: 'flagrow.mason.update-other-fields',
                allowGuest: true
            });
        });

        extend(PermissionGrid.prototype, 'viewItems', function (items) {
            items.add('flagrow-mason-skip-required-fields', {
                icon: 'check-square',
                label: app.translator.trans('flagrow-mason.admin.permissions.skip-required-fields'),
                permission: 'flagrow.mason.skip-required-fields'
            });
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsPermissionGrid) {
            PermissionGrid = _flarumComponentsPermissionGrid.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('flagrow/mason/components/AnswerEdit', ['flarum/app', 'flarum/helpers/icon', 'flarum/Component', 'flarum/components/Button', 'flarum/components/Switch'], function (_export, _context) {
    "use strict";

    var app, icon, Component, Button, Switch, FieldEdit;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
        }, function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumComponentsSwitch) {
            Switch = _flarumComponentsSwitch.default;
        }],
        execute: function () {
            FieldEdit = function (_Component) {
                babelHelpers.inherits(FieldEdit, _Component);

                function FieldEdit() {
                    babelHelpers.classCallCheck(this, FieldEdit);
                    return babelHelpers.possibleConstructorReturn(this, (FieldEdit.__proto__ || Object.getPrototypeOf(FieldEdit)).apply(this, arguments));
                }

                babelHelpers.createClass(FieldEdit, [{
                    key: 'init',
                    value: function init() {
                        this.answer = this.props.answer;
                        this.dirty = false;
                        this.processing = false;
                    }
                }, {
                    key: 'view',
                    value: function view() {
                        var _this2 = this;

                        return m('form.Mason-Box', [
                        // Only suggested answers can be reordered
                        this.answer.is_suggested() ? [m('span.fa.fa-arrows.Mason-Box--handle.js-answer-handle'), ' '] : null, m('span', {
                            onclick: function onclick() {
                                var newContent = prompt('Edit content', _this2.answer.content());

                                if (newContent) {
                                    _this2.updateAttribute('content', newContent);
                                }
                            }
                        }, [this.answer.content(), ' ', icon('pencil')]), Switch.component({
                            state: this.answer.is_suggested(),
                            onchange: function onchange(value) {
                                _this2.updateAttribute('is_suggested', value);

                                // Save right away, because updating the model with immediately trigger a redraw of the UI
                                // And the unsaved state won't be preserved because the AnswerEdit component changes its place
                                _this2.saveAnswer();
                            },
                            children: app.translator.trans('flagrow-mason.admin.fields.is_suggested')
                        }), m('.ButtonGroup', [Button.component({
                            type: 'submit',
                            className: 'Button Button--primary',
                            children: app.translator.trans('flagrow-mason.admin.buttons.save-answer'),
                            loading: this.processing,
                            disabled: !this.readyToSave(),
                            onclick: this.saveAnswer.bind(this)
                        }), Button.component({
                            type: 'submit',
                            className: 'Button Button--danger',
                            children: app.translator.trans('flagrow-mason.admin.buttons.delete-answer'),
                            loading: this.processing,
                            onclick: this.deleteAnswer.bind(this)
                        })])]);
                    }
                }, {
                    key: 'updateAttribute',
                    value: function updateAttribute(attribute, value) {
                        this.answer.pushAttributes(babelHelpers.defineProperty({}, attribute, value));

                        this.dirty = true;
                    }
                }, {
                    key: 'readyToSave',
                    value: function readyToSave() {
                        return this.dirty;
                    }
                }, {
                    key: 'saveAnswer',
                    value: function saveAnswer() {
                        var _this3 = this;

                        this.processing = true;

                        this.answer.save(this.answer.data.attributes).then(function () {
                            _this3.processing = false;
                            _this3.dirty = false;

                            m.redraw();
                        }).catch(function (err) {
                            _this3.processing = false;

                            throw err;
                        });
                    }
                }, {
                    key: 'deleteAnswer',
                    value: function deleteAnswer() {
                        var _this4 = this;

                        if (!confirm(app.translator.trans('flagrow-mason.admin.messages.delete-answer-confirmation', {
                            content: this.answer.content()
                        }))) {
                            return;
                        }

                        this.processing = true;

                        this.answer.delete().then(function () {
                            _this4.processing = false;

                            m.redraw();
                        }).catch(function (err) {
                            _this4.processing = false;

                            throw err;
                        });
                    }
                }]);
                return FieldEdit;
            }(Component);

            _export('default', FieldEdit);
        }
    };
});;
'use strict';

System.register('flagrow/mason/components/FieldAnswersEdit', ['flarum/app', 'flarum/helpers/icon', 'flarum/Component', 'flarum/components/Button', 'flagrow/mason/components/AnswerEdit', 'flagrow/mason/helpers/sortByAttribute'], function (_export, _context) {
    "use strict";

    var app, icon, Component, Button, AnswerEdit, sortByAttribute, FieldAnswersEdit;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
        }, function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flagrowMasonComponentsAnswerEdit) {
            AnswerEdit = _flagrowMasonComponentsAnswerEdit.default;
        }, function (_flagrowMasonHelpersSortByAttribute) {
            sortByAttribute = _flagrowMasonHelpersSortByAttribute.default;
        }],
        execute: function () {
            FieldAnswersEdit = function (_Component) {
                babelHelpers.inherits(FieldAnswersEdit, _Component);

                function FieldAnswersEdit() {
                    babelHelpers.classCallCheck(this, FieldAnswersEdit);
                    return babelHelpers.possibleConstructorReturn(this, (FieldAnswersEdit.__proto__ || Object.getPrototypeOf(FieldAnswersEdit)).apply(this, arguments));
                }

                babelHelpers.createClass(FieldAnswersEdit, [{
                    key: 'init',
                    value: function init() {
                        this.field = this.props.field;
                        this.processing = false;
                        this.new_content = '';
                        this.showUserAnswers = false;
                    }
                }, {
                    key: 'config',
                    value: function config() {
                        var _this2 = this;

                        this.$('.js-answers-container').sortable({
                            handle: '.js-answer-handle'
                        }).on('sortupdate', function () {
                            var sorting = _this2.$('.js-answer-data').map(function () {
                                return $(this).data('id');
                            }).get();

                            _this2.updateSort(sorting);
                        });
                    }
                }, {
                    key: 'view',
                    value: function view() {
                        var _this3 = this;

                        if (!this.field.exists) {
                            return m('div', app.translator.trans('flagrow-mason.admin.fields.save-field-for-answers'));
                        }

                        var suggestedAnswers = [];
                        var userAnswers = [];

                        this.field.all_answers().forEach(function (answer) {
                            // When answers are deleted via store.delete() they stay as an "undefined" relationship
                            // We ignore these deleted answers
                            if (typeof answer === 'undefined') {
                                return;
                            }

                            if (answer.is_suggested()) {
                                suggestedAnswers.push(answer);
                            } else {
                                userAnswers.push(answer);
                            }
                        });

                        return m('div', [m('.Mason-Container.js-answers-container', sortByAttribute(suggestedAnswers).map(function (answer) {
                            return m('.js-answer-data', {
                                key: answer.id(),
                                'data-id': answer.id()
                            }, AnswerEdit.component({
                                answer: answer
                            }));
                        })), userAnswers.length ? [m('.Button.Button--block.Mason-Box-Header', {
                            onclick: function onclick() {
                                _this3.showUserAnswers = !_this3.showUserAnswers;
                            }
                        }, [m('.Mason-Box-Header-Title', app.translator.trans('flagrow-mason.admin.buttons.show-user-answers', {
                            count: userAnswers.length
                        })), m('div', [icon(this.showUserAnswers ? 'chevron-up' : 'chevron-down')])]),
                        // The list of user answers can't be re-ordered
                        this.showUserAnswers ? m('.Mason-Container', sortByAttribute(userAnswers, 'content').map(function (answer) {
                            return m('div', {
                                key: answer.id()
                            }, AnswerEdit.component({
                                answer: answer
                            }));
                        })) : null] : null, m('form', [m('.Form-group', [m('label', 'New answer'), m('input.FormControl', {
                            value: this.new_content,
                            oninput: m.withAttr('value', function (value) {
                                _this3.new_content = value;
                            }),
                            placeholder: app.translator.trans('flagrow-mason.admin.fields.new-answer-placeholder')
                        })]), m('.Form-group', [Button.component({
                            type: 'submit',
                            className: 'Button Button--primary',
                            children: app.translator.trans('flagrow-mason.admin.buttons.add-answer'),
                            loading: this.processing,
                            disabled: !this.new_content,
                            onclick: this.saveField.bind(this)
                        })])])]);
                    }
                }, {
                    key: 'saveField',
                    value: function saveField() {
                        var _this4 = this;

                        this.processing = true;

                        app.request({
                            method: 'POST',
                            url: app.forum.attribute('apiUrl') + this.field.apiEndpoint() + '/answers',
                            data: {
                                data: {
                                    attributes: {
                                        content: this.new_content,
                                        is_suggested: true
                                    }
                                }
                            }
                        }).then(function (result) {
                            app.store.pushPayload(result);

                            _this4.new_content = '';
                            _this4.processing = false;
                            m.redraw();
                        });
                    }
                }, {
                    key: 'updateSort',
                    value: function updateSort(sorting) {
                        app.request({
                            method: 'POST',
                            url: app.forum.attribute('apiUrl') + this.field.apiEndpoint() + '/answers/order',
                            data: {
                                sort: sorting
                            }
                        }).then(function (result) {
                            // Update sort attributes
                            app.store.pushPayload(result);
                            m.redraw();
                        });
                    }
                }]);
                return FieldAnswersEdit;
            }(Component);

            _export('default', FieldAnswersEdit);
        }
    };
});;
'use strict';

System.register('flagrow/mason/components/FieldEdit', ['flarum/app', 'flarum/helpers/icon', 'flarum/Component', 'flarum/components/Button', 'flarum/components/Switch', 'flagrow/mason/models/Field', 'flagrow/mason/components/FieldAnswersEdit'], function (_export, _context) {
    "use strict";

    var app, icon, Component, Button, Switch, Field, FieldAnswersEdit, FieldEdit;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
        }, function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumComponentsSwitch) {
            Switch = _flarumComponentsSwitch.default;
        }, function (_flagrowMasonModelsField) {
            Field = _flagrowMasonModelsField.default;
        }, function (_flagrowMasonComponentsFieldAnswersEdit) {
            FieldAnswersEdit = _flagrowMasonComponentsFieldAnswersEdit.default;
        }],
        execute: function () {
            FieldEdit = function (_Component) {
                babelHelpers.inherits(FieldEdit, _Component);

                function FieldEdit() {
                    babelHelpers.classCallCheck(this, FieldEdit);
                    return babelHelpers.possibleConstructorReturn(this, (FieldEdit.__proto__ || Object.getPrototypeOf(FieldEdit)).apply(this, arguments));
                }

                babelHelpers.createClass(FieldEdit, [{
                    key: 'init',
                    value: function init() {
                        this.field = this.props.field;
                        this.dirty = false;
                        this.processing = false;
                        this.toggleFields = false;

                        if (this.field === null) {
                            this.initNewField();
                        }
                    }
                }, {
                    key: 'initNewField',
                    value: function initNewField() {
                        this.field = app.store.createRecord('flagrow-mason-field', {
                            attributes: {
                                name: '',
                                description: '',
                                min_answers_count: 0,
                                max_answers_count: 1,
                                user_values_allowed: false,
                                show_when_empty: false,
                                validation: '',
                                icon: ''
                            }
                        });
                    }
                }, {
                    key: 'boxTitle',
                    value: function boxTitle() {
                        if (this.field.exists) {
                            return this.field.name();
                        }

                        return app.translator.trans('flagrow-mason.admin.buttons.new-field');
                    }
                }, {
                    key: 'view',
                    value: function view() {
                        var _this2 = this;

                        return m('.Mason-Box', [this.field.exists ? m('span.fa.fa-arrows.Mason-Box--handle.js-field-handle') : null, m('.Button.Button--block.Mason-Box-Header', {
                            onclick: function onclick() {
                                _this2.toggleFields = !_this2.toggleFields;
                            }
                        }, [m('.Mason-Box-Header-Title', this.boxTitle()), m('div', [this.field.exists ? [app.translator.trans('flagrow-mason.admin.buttons.edit-field'), ' '] : null, icon(this.toggleFields ? 'chevron-up' : 'chevron-down')])]), this.toggleFields ? this.viewFields() : null]);
                    }
                }, {
                    key: 'viewFields',
                    value: function viewFields() {
                        var _this3 = this;

                        return m('form', [m('.Mason-Box--row', [m('.Mason-Box--column', [m('h4', 'Field settings'), m('.Form-group', [m('label', app.translator.trans('flagrow-mason.admin.fields.name')), m('input.FormControl', {
                            value: this.field.name(),
                            oninput: m.withAttr('value', this.updateAttribute.bind(this, 'name'))
                        }), m('.helpText', app.translator.trans('flagrow-mason.admin.fields.name-help'))]), m('.Form-group', [m('label', app.translator.trans('flagrow-mason.admin.fields.description')), m('input.FormControl', {
                            value: this.field.description(),
                            oninput: m.withAttr('value', this.updateAttribute.bind(this, 'description'))
                        }), m('.helpText', app.translator.trans('flagrow-mason.admin.fields.description-help'))]), m('.Form-group', [m('label', [
                        // TODO: while multiple answers are still in the work, show the "min answers" field as a checkbox
                        Switch.component({
                            state: this.field.min_answers_count() === 1,
                            onchange: function onchange(value) {
                                _this3.updateAttribute('min_answers_count', value ? 1 : 0);
                            },
                            children: app.translator.trans('flagrow-mason.admin.fields.required')
                        })])]),
                        /*m('.Form-group', [
                            m('label', app.translator.trans('flagrow-mason.admin.fields.min_answers_count')),
                            m('input.FormControl', {
                                type: 'number',
                                min: 0,
                                max: 1, // TODO: remove when multiple answers is ready
                                value: this.field.min_answers_count(),
                                oninput: m.withAttr('value', this.updateAttribute.bind(this, 'min_answers_count')),
                            }),
                        ]),
                        m('.Form-group', [
                            m('label', app.translator.trans('flagrow-mason.admin.fields.max_answers_count')),
                            m('input.FormControl', {
                                type: 'number',
                                min: 1,
                                disabled: true, // TODO: remove when multiple answers is ready
                                value: this.field.max_answers_count(),
                                oninput: m.withAttr('value', this.updateAttribute.bind(this, 'max_answers_count')),
                            }),
                        ]),*/
                        m('.Form-group', [m('label', [Switch.component({
                            state: this.field.show_when_empty(),
                            onchange: this.updateAttribute.bind(this, 'show_when_empty'),
                            children: app.translator.trans('flagrow-mason.admin.fields.show_when_empty')
                        })]), m('.helpText', app.translator.trans('flagrow-mason.admin.fields.show_when_empty-help'))]), m('.Form-group', [m('label', [Switch.component({
                            state: this.field.user_values_allowed(),
                            onchange: this.updateAttribute.bind(this, 'user_values_allowed'),
                            children: app.translator.trans('flagrow-mason.admin.fields.user_values_allowed')
                        })]), m('.helpText', app.translator.trans('flagrow-mason.admin.fields.user_values_allowed-help'))]), m('.Form-group', [m('label', app.translator.trans('flagrow-mason.admin.fields.validation')), m('input.FormControl', {
                            disabled: !this.field.user_values_allowed(),
                            placeholder: this.field.user_values_allowed() ? '' : app.translator.trans('flagrow-mason.admin.fields.enable-user-values-for-validation'),
                            value: this.field.validation(),
                            oninput: m.withAttr('value', this.updateAttribute.bind(this, 'validation'))
                        }), m('.helpText', app.translator.trans('flagrow-mason.admin.fields.validation-help', {
                            a: m('a[href=https://laravel.com/docs/5.1/validation#available-validation-rules][_target=blank]')
                        }))]), m('.Form-group', [m('label', [app.translator.trans('flagrow-mason.admin.fields.icon'), this.iconPreview(this.field.icon())]), m('input.FormControl', {
                            value: this.field.icon(),
                            oninput: m.withAttr('value', this.updateAttribute.bind(this, 'icon'))
                        }), m('.helpText', app.translator.trans('flagrow-mason.admin.fields.icon-help', {
                            a: m('a[href=http://fontawesome.io/icons/][_target=blank]')
                        }))])]), m('.Mason-Box--column', [m('h4', 'Field answers'), m('.Form-group', FieldAnswersEdit.component({
                            field: this.field
                        }))])]), m('li.ButtonGroup', [Button.component({
                            type: 'submit',
                            className: 'Button Button--primary',
                            children: app.translator.trans('flagrow-mason.admin.buttons.' + (this.field.exists ? 'save' : 'add') + '-field'),
                            loading: this.processing,
                            disabled: !this.readyToSave(),
                            onclick: this.saveField.bind(this)
                        }), this.field.exists ? Button.component({
                            type: 'submit',
                            className: 'Button Button--danger',
                            children: app.translator.trans('flagrow-mason.admin.buttons.delete-field'),
                            loading: this.processing,
                            onclick: this.deleteField.bind(this)
                        }) : ''])]);
                    }
                }, {
                    key: 'updateAttribute',
                    value: function updateAttribute(attribute, value) {
                        this.field.pushAttributes(babelHelpers.defineProperty({}, attribute, value));

                        this.dirty = true;
                    }
                }, {
                    key: 'readyToSave',
                    value: function readyToSave() {
                        // TODO: check required fields
                        return this.dirty;
                    }
                }, {
                    key: 'saveField',
                    value: function saveField() {
                        var _this4 = this;

                        this.processing = true;

                        var createNewRecord = !this.field.exists;

                        this.field.save(this.field.data.attributes).then(function () {
                            if (createNewRecord) {
                                _this4.initNewField();
                                _this4.toggleFields = false;
                            }

                            _this4.processing = false;
                            _this4.dirty = false;

                            m.redraw();
                        }).catch(function (err) {
                            _this4.processing = false;

                            throw err;
                        });
                    }
                }, {
                    key: 'deleteField',
                    value: function deleteField() {
                        var _this5 = this;

                        if (!confirm(app.translator.trans('flagrow-mason.admin.messages.delete-field-confirmation', {
                            name: this.field.name()
                        }))) {
                            return;
                        }

                        this.processing = true;

                        this.field.delete().then(function () {
                            _this5.processing = false;

                            m.redraw();
                        }).catch(function (err) {
                            _this5.processing = false;

                            throw err;
                        });
                    }
                }, {
                    key: 'iconPreview',
                    value: function iconPreview(value) {
                        if (!value) {
                            return '';
                        }

                        return [' (', app.translator.trans('flagrow-mason.admin.fields.icon-preview', {
                            preview: icon(value)
                        }), ')'];
                    }
                }]);
                return FieldEdit;
            }(Component);

            _export('default', FieldEdit);
        }
    };
});;
'use strict';

System.register('flagrow/mason/components/MasonSettings', ['flarum/app', 'flarum/utils/saveSettings', 'flarum/Component', 'flarum/components/Select', 'flarum/components/Switch'], function (_export, _context) {
    "use strict";

    var app, saveSettings, Component, Select, Switch, MasonSettings;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumUtilsSaveSettings) {
            saveSettings = _flarumUtilsSaveSettings.default;
        }, function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumComponentsSelect) {
            Select = _flarumComponentsSelect.default;
        }, function (_flarumComponentsSwitch) {
            Switch = _flarumComponentsSwitch.default;
        }],
        execute: function () {
            MasonSettings = function (_Component) {
                babelHelpers.inherits(MasonSettings, _Component);

                function MasonSettings() {
                    babelHelpers.classCallCheck(this, MasonSettings);
                    return babelHelpers.possibleConstructorReturn(this, (MasonSettings.__proto__ || Object.getPrototypeOf(MasonSettings)).apply(this, arguments));
                }

                babelHelpers.createClass(MasonSettings, [{
                    key: 'init',
                    value: function init() {
                        this.fieldsSectionTitle = m.prop(app.data.settings['flagrow.mason.fields-section-title'] || '');
                        this.columnCount = m.prop(app.data.settings['flagrow.mason.column-count'] || 1);
                        this.labelsAsPlaceholders = m.prop(app.data.settings['flagrow.mason.labels-as-placeholders'] > 0);
                        this.fieldsInHero = m.prop(app.data.settings['flagrow.mason.fields-in-hero'] > 0);
                        this.hideEmptyFieldsSection = m.prop(app.data.settings['flagrow.mason.hide-empty-fields-section'] > 0);
                        this.tagsAsFields = m.prop(app.data.settings['flagrow.mason.tags-as-fields'] > 0);
                        this.tagsFieldName = m.prop(app.data.settings['flagrow.mason.tags-field-name'] || '');

                        this.columnOptions = {};

                        for (var i = 1; i <= 3; i++) {
                            this.columnOptions[i] = app.translator.trans('flagrow-mason.admin.settings.n-columns', { count: i });
                        }
                    }
                }, {
                    key: 'view',
                    value: function view() {
                        return m('.Mason-Container', [m('.Form-group', [m('label', app.translator.trans('flagrow-mason.admin.settings.fields-section-title')), m('input.FormControl', {
                            value: this.fieldsSectionTitle(),
                            placeholder: app.translator.trans('flagrow-mason.admin.settings.fields-section-title-placeholder'),
                            onchange: m.withAttr('value', this.updateSetting.bind(this, this.fieldsSectionTitle, 'flagrow.mason.fields-section-title'))
                        }), m('.helpText', app.translator.trans('flagrow-mason.admin.settings.fields-section-title-help'))]), m('.Form-group', [m('label', app.translator.trans('flagrow-mason.admin.settings.column-count')), Select.component({
                            options: this.columnOptions,
                            value: this.columnCount(),
                            onchange: this.updateSetting.bind(this, this.columnCount, 'flagrow.mason.column-count')
                        })]), m('.Form-group', [m('label', Switch.component({
                            state: this.labelsAsPlaceholders(),
                            onchange: this.updateSetting.bind(this, this.labelsAsPlaceholders, 'flagrow.mason.labels-as-placeholders'),
                            children: app.translator.trans('flagrow-mason.admin.settings.labels-as-placeholders')
                        })), m('.helpText', app.translator.trans('flagrow-mason.admin.settings.labels-as-placeholders-help'))]), m('.Form-group', [m('label', Switch.component({
                            state: this.fieldsInHero(),
                            onchange: this.updateSetting.bind(this, this.fieldsInHero, 'flagrow.mason.fields-in-hero'),
                            children: app.translator.trans('flagrow-mason.admin.settings.fields-in-hero')
                        }))]), m('.Form-group', [m('label', Switch.component({
                            state: this.hideEmptyFieldsSection(),
                            onchange: this.updateSetting.bind(this, this.hideEmptyFieldsSection, 'flagrow.mason.hide-empty-fields-section'),
                            children: app.translator.trans('flagrow-mason.admin.settings.hide-empty-fields-section')
                        })), m('.helpText', app.translator.trans('flagrow-mason.admin.settings.hide-empty-fields-section-help'))]), m('.Form-group', [m('label', Switch.component({
                            state: this.tagsAsFields(),
                            onchange: this.updateSetting.bind(this, this.tagsAsFields, 'flagrow.mason.tags-as-fields'),
                            children: app.translator.trans('flagrow-mason.admin.settings.tags-as-field')
                        })), m('.helpText', app.translator.trans('flagrow-mason.admin.settings.tags-as-field-help'))]), this.tagsAsFields() ? m('.Form-group', [m('label', app.translator.trans('flagrow-mason.admin.settings.tags-field-name')), m('input.FormControl', {
                            value: this.tagsFieldName(),
                            placeholder: app.translator.trans('flagrow-mason.admin.settings.tags-field-name-placeholder'),
                            onchange: m.withAttr('value', this.updateSetting.bind(this, this.tagsFieldName, 'flagrow.mason.tags-field-name'))
                        })]) : null]);
                    }
                }, {
                    key: 'updateSetting',
                    value: function updateSetting(prop, setting, value) {
                        saveSettings(babelHelpers.defineProperty({}, setting, value));

                        prop(value);
                    }
                }]);
                return MasonSettings;
            }(Component);

            _export('default', MasonSettings);
        }
    };
});;
'use strict';

System.register('flagrow/mason/helpers/sortByAttribute', [], function (_export, _context) {
    "use strict";

    _export('default', function (items) {
        var attr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'sort';

        return items.sort(function (a, b) {
            return a[attr]() - b[attr]();
        });
    });

    return {
        setters: [],
        execute: function () {}
    };
});;
'use strict';

System.register('flagrow/mason/main', ['flarum/app', 'flagrow/mason/models/Answer', 'flagrow/mason/models/Field', 'flagrow/mason/addMasonFieldsPane', 'flagrow/mason/addPermissions'], function (_export, _context) {
    "use strict";

    var app, Answer, Field, addMasonFieldsPane, addPermissions;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flagrowMasonModelsAnswer) {
            Answer = _flagrowMasonModelsAnswer.default;
        }, function (_flagrowMasonModelsField) {
            Field = _flagrowMasonModelsField.default;
        }, function (_flagrowMasonAddMasonFieldsPane) {
            addMasonFieldsPane = _flagrowMasonAddMasonFieldsPane.default;
        }, function (_flagrowMasonAddPermissions) {
            addPermissions = _flagrowMasonAddPermissions.default;
        }],
        execute: function () {

            app.initializers.add('flagrow-mason', function (app) {
                app.store.models['flagrow-mason-field'] = Field;
                app.store.models['flagrow-mason-answer'] = Answer;

                addMasonFieldsPane();
                addPermissions();
            });
        }
    };
});;
'use strict';

System.register('flagrow/mason/models/Answer', ['flarum/app', 'flarum/Model', 'flarum/utils/mixin'], function (_export, _context) {
    "use strict";

    var app, Model, mixin, Answer;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumUtilsMixin) {
            mixin = _flarumUtilsMixin.default;
        }],
        execute: function () {
            Answer = function (_mixin) {
                babelHelpers.inherits(Answer, _mixin);

                function Answer() {
                    babelHelpers.classCallCheck(this, Answer);
                    return babelHelpers.possibleConstructorReturn(this, (Answer.__proto__ || Object.getPrototypeOf(Answer)).apply(this, arguments));
                }

                babelHelpers.createClass(Answer, [{
                    key: 'apiEndpoint',
                    value: function apiEndpoint() {
                        return '/flagrow/mason/answers' + (this.exists ? '/' + this.data.id : '');
                    }
                }]);
                return Answer;
            }(mixin(Model, {
                content: Model.attribute('content'),
                is_suggested: Model.attribute('is_suggested'),
                sort: Model.attribute('sort'),
                field: Model.hasOne('field')
            }));

            _export('default', Answer);
        }
    };
});;
'use strict';

System.register('flagrow/mason/models/Field', ['flarum/app', 'flarum/Model', 'flarum/utils/mixin', 'flarum/utils/computed'], function (_export, _context) {
    "use strict";

    var app, Model, mixin, computed, Field;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumUtilsMixin) {
            mixin = _flarumUtilsMixin.default;
        }, function (_flarumUtilsComputed) {
            computed = _flarumUtilsComputed.default;
        }],
        execute: function () {
            Field = function (_mixin) {
                babelHelpers.inherits(Field, _mixin);

                function Field() {
                    babelHelpers.classCallCheck(this, Field);
                    return babelHelpers.possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).apply(this, arguments));
                }

                babelHelpers.createClass(Field, [{
                    key: 'apiEndpoint',
                    value: function apiEndpoint() {
                        return '/flagrow/mason/fields' + (this.exists ? '/' + this.data.id : '');
                    }
                }]);
                return Field;
            }(mixin(Model, {
                name: Model.attribute('name'),
                description: Model.attribute('description'),
                min_answers_count: Model.attribute('min_answers_count'),
                max_answers_count: Model.attribute('max_answers_count'),
                show_when_empty: Model.attribute('show_when_empty'),
                user_values_allowed: Model.attribute('user_values_allowed'),
                validation: Model.attribute('validation'),
                icon: Model.attribute('icon'),
                sort: Model.attribute('sort'),
                deleted_at: Model.attribute('deleted_at', Model.transformDate),
                all_answers: Model.hasMany('all_answers'),
                suggested_answers: Model.hasMany('suggested_answers'),
                required: computed('min_answers_count', function (min_answers_count) {
                    return min_answers_count > 0;
                }),
                multiple: computed('max_answers_count', function (max_answers_count) {
                    return max_answers_count > 1;
                })
            }));

            _export('default', Field);
        }
    };
});;
'use strict';

System.register('flagrow/mason/panes/MasonFieldsPane', ['flarum/app', 'flarum/Component', 'flagrow/mason/components/FieldEdit', 'flagrow/mason/helpers/sortByAttribute', 'flagrow/mason/components/MasonSettings'], function (_export, _context) {
    "use strict";

    var app, Component, FieldEdit, sortByAttribute, MasonSettings, MasonFieldsPane;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flagrowMasonComponentsFieldEdit) {
            FieldEdit = _flagrowMasonComponentsFieldEdit.default;
        }, function (_flagrowMasonHelpersSortByAttribute) {
            sortByAttribute = _flagrowMasonHelpersSortByAttribute.default;
        }, function (_flagrowMasonComponentsMasonSettings) {
            MasonSettings = _flagrowMasonComponentsMasonSettings.default;
        }],
        execute: function () {
            MasonFieldsPane = function (_Component) {
                babelHelpers.inherits(MasonFieldsPane, _Component);

                function MasonFieldsPane() {
                    babelHelpers.classCallCheck(this, MasonFieldsPane);
                    return babelHelpers.possibleConstructorReturn(this, (MasonFieldsPane.__proto__ || Object.getPrototypeOf(MasonFieldsPane)).apply(this, arguments));
                }

                babelHelpers.createClass(MasonFieldsPane, [{
                    key: 'init',
                    value: function init() {
                        app.request({
                            method: 'GET',
                            url: app.forum.attribute('apiUrl') + '/flagrow/mason/fields'
                        }).then(function (result) {
                            app.store.pushPayload(result);
                            m.redraw();
                        });
                    }
                }, {
                    key: 'config',
                    value: function config() {
                        var _this2 = this;

                        this.$('.js-fields-container').sortable({
                            handle: '.js-field-handle'
                        }).on('sortupdate', function () {
                            var sorting = _this2.$('.js-field-data').map(function () {
                                return $(this).data('id');
                            }).get();

                            _this2.updateSort(sorting);
                        });
                    }
                }, {
                    key: 'view',
                    value: function view() {
                        var fields = app.store.all('flagrow-mason-field');

                        var fieldsList = [];

                        sortByAttribute(fields).forEach(function (field) {
                            // Build array of fields to show.
                            fieldsList.push(m('.js-field-data', {
                                key: field.id(),
                                'data-id': field.id()
                            }, FieldEdit.component({
                                field: field
                            })));
                        });

                        return m('.container', [m('h2', app.translator.trans('flagrow-mason.admin.titles.fields')), m('.Mason-Container', [m('.js-fields-container', fieldsList), FieldEdit.component({
                            key: 'new',
                            field: null
                        })]), m('h2', app.translator.trans('flagrow-mason.admin.titles.settings')), MasonSettings.component()]);
                    }
                }, {
                    key: 'updateSort',
                    value: function updateSort(sorting) {
                        app.request({
                            method: 'POST',
                            url: app.forum.attribute('apiUrl') + '/flagrow/mason/fields/order',
                            data: {
                                sort: sorting
                            }
                        }).then(function (result) {
                            // Update sort attributes
                            app.store.pushPayload(result);
                            m.redraw();
                        });
                    }
                }]);
                return MasonFieldsPane;
            }(Component);

            _export('default', MasonFieldsPane);
        }
    };
});