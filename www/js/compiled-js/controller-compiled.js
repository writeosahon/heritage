'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Created by UTOPIA SOFTWARE on 22/03/2018.
 */

/**
 * file defines all View-Models, Controllers and Event Listeners used by the app
 *
 * The 'utopiasoftware_app_namespace' namespace variable has being defined in the base js file.
 * The author uses the terms 'method' and function interchangeably; likewise the terms 'attribute' and 'property' are
 * also used interchangeably
 */

// define the controller namespace
utopiasoftware[utopiasoftware_app_namespace].controller = {

    /**
     * property holds the Map objects which will contain a reference to dynamically loaded ES modules.
     * NOTE: modules MUST BE deleted from this property i.e. the Map object when no longer need.
     * This is to enable garbage collection and prevent memory leaks.
     * NOTE: the keys used within the map will be identical to the same map value used in the SystemJS.config()
     */
    LOADED_MODULES: new Map(),

    /**
     * method contains the stratup/bootstrap code needed to initiate app logic execution
     */
    startup: function startup() {

        // initialise the app libraries and plugins
        ons.ready(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            // set the default handler for the app
                            ons.setDefaultDeviceBackButtonListener(function () {
                                // does nothing for now!!
                            });

                            // displaying prepping message
                            $('#loader-modal-message').html("Loading App...");
                            $('#loader-modal').get(0).show(); // show loader

                            // load the main-menu page
                            $('ons-splitter').get(0).content.load("app-main-template");

                            // START ALL CORDOVA PLUGINS CONFIGURATIONS
                            try {
                                // lock the orientation of the device to 'PORTRAIT'
                                screen.orientation.lock('portrait');
                            } catch (err) {}

                            try {// START ALL THE CORDOVA PLUGINS CONFIGURATION WHICH REQUIRE PROMISE SYNTAX

                                // note: for most promises, we weill use async-wait syntax
                                // var a = await Promise.all([SystemJS.import('@syncfusion/ej2-base'), SystemJS.import('@syncfusion/ej2-dropdowns')]);
                            } catch (err) {} finally {
                                // set status bar color
                                StatusBar.backgroundColorByHexString("#004700");
                                navigator.splashscreen.hide(); // hide the splashscreen

                                utopiasoftware[utopiasoftware_app_namespace].model.isAppReady = true; // true that app is fully loaded and ready
                            }

                        case 6:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }))); // end of ons.ready()
    },

    /**
     * view-model/controller for app side-menu
     */
    sideMenuPageViewModel: {

        /**
         * method is used to handle the click event on the side menu items
         *
         * @param menuItemLabel {String}
         */
        sideMenuItemClicked: function sideMenuItemClicked(menuItemLabel) {

            // close the side menu
            $('ons-splitter').get(0).left.close();

            // use a switch-case to determine what items where clicked
            switch (menuItemLabel) {
                case "main menu":
                    $('#app-main-navigator').get(0).resetToPage("main-menu-page.html", { pop: true });
                    break;

                case "facebook feed":
                    $('#app-main-navigator').get(0).bringPageTop("facebook-feed-page.html");
                    break;

                case "twitter feed":
                    $('#app-main-navigator').get(0).bringPageTop("twitter-feed-page.html");
                    break;
            }
        }
    },

    /**
     * this is the view-model/controller for the Main Menu page
     */
    mainMenuPageViewModel: {

        /**
         * method is triggered when page is initialised
         * @param event
         */
        pageInit: function pageInit(event) {

            //function is used to initialise the page if the app is fully ready for execution
            var loadPageOnAppReady = function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                        _context2.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context2.abrupt('return');

                                case 3:

                                    // listen for the back button event
                                    $('#app-main-navigator').get(0).topPage.onDeviceBackButton = utopiasoftware[utopiasoftware_app_namespace].controller.mainMenuPageViewModel.backButtonClicked;

                                    $('#loader-modal').get(0).hide(); // hide the loader

                                case 5:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this);
                }));

                return function loadPageOnAppReady() {
                    return _ref2.apply(this, arguments);
                };
            }();

            var $thisPage = $(event.target); // get a reference to the current page

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();
        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function pageShow() {
            // add background animation class
            $('#main-menu-page .page--material__background').addClass('apply-moving-background-animation');
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: function pageHide() {
            // remove background animation class
            $('#main-menu-page .page--material__background').removeClass('apply-moving-background-animation');
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function pageDestroy() {},

        /**
         * method is triggered when back button or device back button is clicked
         */
        backButtonClicked: function backButtonClicked() {

            // check if the side menu is open
            if ($('ons-splitter').get(0).left.isOpen) {
                // side menu open, so close it
                $('ons-splitter').get(0).left.close();
                return; // exit the method
            }

            ons.notification.confirm('Do you want to close the app?', { title: 'Quit App',
                buttonLabels: ['No', 'Yes'] }) // Ask for confirmation
            .then(function (index) {
                if (index === 1) {
                    // OK button
                    navigator.app.exitApp(); // Close the app
                }
            });
        },

        /**
         * method is called when items for the app's main menu are clicked
         *
         * @param menuItemLabel {String} the label for the menu item that was clicked
         */
        mainMenuItemClicked: function mainMenuItemClicked(menuItemLabel) {

            // use a switch-case to determine what page to load
            switch (menuItemLabel) {
                case "twitter":
                    $('#app-main-navigator').get(0).pushPage("twitter-feed-page.html");
                    break;

                case "facebook":
                    $('#app-main-navigator').get(0).pushPage("facebook-feed-page.html");
                    break;
            }
        }
    },

    /**
     * view-model/controller object for Twitter Feed page
     */
    twitterFeedPageViewModel: {

        twitterWidgetCode: '<a class="twitter-timeline"  href="https://twitter.com/HeritageAssembl"\n        data-widget-id="739091831535898624" data-width="98%" data-height="100%">Tweets by @HeritageAssembl</a>',

        /**
         * method is triggered when page is initialised
         * @param event
         */
        pageInit: function pageInit(event) {

            //function is used to initialise the page if the app is fully ready for execution
            var loadPageOnAppReady = function () {
                var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                        _context3.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context3.abrupt('return');

                                case 3:
                                    if (!(navigator.connection.type === Connection.NONE)) {
                                        _context3.next = 6;
                                        break;
                                    }

                                    // no Internet Connection
                                    // inform the user that they cannot proceed without Internet
                                    window.plugins.toast.showWithOptions({
                                        message: "Twitter Feed cannot be retrieved without an Internet Connection",
                                        duration: 4000,
                                        position: "top",
                                        styling: {
                                            opacity: 1,
                                            backgroundColor: '#ff0000', //red
                                            textColor: '#FFFFFF',
                                            textSize: 14
                                        }
                                    }, function (toastEvent) {
                                        if (toastEvent && toastEvent.event == "touch") {
                                            // user tapped the toast, so hide toast immediately
                                            window.plugins.toast.hide();
                                        }
                                    });

                                    return _context3.abrupt('return');

                                case 6:

                                    // listen for the back button event
                                    $('#app-main-navigator').get(0).topPage.onDeviceBackButton = utopiasoftware[utopiasoftware_app_namespace].controller.twitterFeedPageViewModel.backButtonClicked;

                                    if (twttr.widgets) {
                                        _context3.next = 10;
                                        break;
                                    }

                                    // twitter widget library not loaded yet
                                    // wait for 1 second and try again
                                    window.setTimeout(loadPageOnAppReady, 1000);
                                    return _context3.abrupt('return');

                                case 10:

                                    // insert the twitter widget into the app
                                    $('#twitter-feed-container', $thisPage).html(utopiasoftware[utopiasoftware_app_namespace].controller.twitterFeedPageViewModel.twitterWidgetCode);
                                    // instantiate the twitter widget
                                    twttr.widgets.load($('#twitter-feed-container', $thisPage).get(0));

                                    $('#loader-modal').get(0).hide(); // hide the loader

                                    window.setTimeout(function () {
                                        // wait for 2 seconds before hiding the page preloader
                                        // hide the page preloader
                                        $('.page-preloader', $thisPage).css("display", "none");
                                    }, 2000);

                                case 14:
                                case 'end':
                                    return _context3.stop();
                            }
                        }
                    }, _callee3, this);
                }));

                return function loadPageOnAppReady() {
                    return _ref3.apply(this, arguments);
                };
            }();

            var $thisPage = $(event.target); // get a reference to the current page

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();
        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function pageShow() {},

        /**
         * method is triggered when page is hidden
         */
        pageHide: function pageHide() {},

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function pageDestroy() {
            // remove the twitter content
            $('#twitter-feed-page #twitter-feed-container').html('');
            // show the page preloader
            $('#twitter-feed-page .page-preloader').css("display", "block");
        },

        /**
         * method is triggered when back button or device back button is clicked
         */
        backButtonClicked: function backButtonClicked() {

            // check if the side menu is open
            if ($('ons-splitter').get(0).left.isOpen) {
                // side menu open, so close it
                $('ons-splitter').get(0).left.close();
                return; // exit the method
            }

            $('#app-main-navigator').get(0).popPage(); // display the previous page in the stack
        },

        /**
         * method is triggered when "Refresh" button is clicked
         */
        refreshButtonClicked: function refreshButtonClicked() {

            // check if Internet Connection is available before proceeding
            if (navigator.connection.type === Connection.NONE) {
                // no Internet Connection
                // inform the user that they cannot proceed without Internet
                window.plugins.toast.showWithOptions({
                    message: "Twitter Feed cannot be retrieved without an Internet Connection",
                    duration: 4000,
                    position: "top",
                    styling: {
                        opacity: 1,
                        backgroundColor: '#ff0000', //red
                        textColor: '#FFFFFF',
                        textSize: 14
                    }
                }, function (toastEvent) {
                    if (toastEvent && toastEvent.event == "touch") {
                        // user tapped the toast, so hide toast immediately
                        window.plugins.toast.hide();
                    }
                });

                return; // exit method immediately
            }

            if (!twttr.widgets) {
                // twitter widget library not loaded yet
                // wait for 1 second and try again
                window.setTimeout(utopiasoftware[utopiasoftware_app_namespace].controller.twitterFeedPageViewModel.refreshButtonClicked, 1000);
                return;
            }

            // remove the twitter content
            $('#twitter-feed-page #twitter-feed-container').html('');
            // show the page preloader
            $('#twitter-feed-page .page-preloader').css("display", "block");

            // insert the twitter widget into the app
            $('#twitter-feed-page #twitter-feed-container').html(utopiasoftware[utopiasoftware_app_namespace].controller.twitterFeedPageViewModel.twitterWidgetCode);
            window.setTimeout(function () {
                // wait for 2 seconds before initiating the twitter-feed loading
                // instantiate the twitter widget
                twttr.widgets.load($('#twitter-feed-page #twitter-feed-container').get(0));
                // hide the page preloader
                $('#twitter-feed-page .page-preloader').css("display", "none");
            }, 2000);
        }
    },

    /**
     * view-model/controller object for Twitter Feed page
     */
    facebookFeedPageViewModel: {

        /**
         * property holds the code use tfo generate the facebook widget
         */
        facebookWidgetCode: '',

        /**
         * method is triggered when page is initialised
         * @param event
         */
        pageInit: function pageInit(event) {

            //function is used to initialise the page if the app is fully ready for execution
            var loadPageOnAppReady = function () {
                var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                    var faceBookFeedDimensions;
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                        while (1) {
                            switch (_context4.prev = _context4.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                        _context4.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context4.abrupt('return');

                                case 3:
                                    if (!(navigator.connection.type === Connection.NONE)) {
                                        _context4.next = 6;
                                        break;
                                    }

                                    // no Internet Connection
                                    // inform the user that they cannot proceed without Internet
                                    window.plugins.toast.showWithOptions({
                                        message: "Facebook Feed cannot be retrieved without an Internet Connection",
                                        duration: 4000,
                                        position: "top",
                                        styling: {
                                            opacity: 1,
                                            backgroundColor: '#ff0000', //red
                                            textColor: '#FFFFFF',
                                            textSize: 14
                                        }
                                    }, function (toastEvent) {
                                        if (toastEvent && toastEvent.event == "touch") {
                                            // user tapped the toast, so hide toast immediately
                                            window.plugins.toast.hide();
                                        }
                                    });

                                    return _context4.abrupt('return');

                                case 6:

                                    // listen for the back button event
                                    $('#app-main-navigator').get(0).topPage.onDeviceBackButton = utopiasoftware[utopiasoftware_app_namespace].controller.facebookFeedPageViewModel.backButtonClicked;

                                    faceBookFeedDimensions = { width: Math.round($("#facebook-feed-container", $thisPage).width()),
                                        height: Math.round($("#facebook-feed-container", $thisPage).height()) }; // get the dimensions for the facebook widget container
                                    // update the string code for the facebook widget

                                    utopiasoftware[utopiasoftware_app_namespace].controller.facebookFeedPageViewModel.facebookWidgetCode = '<iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fheritageassemblychurch&tabs=timeline&width=' + faceBookFeedDimensions.width + '&height=' + faceBookFeedDimensions.height + '&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId=1724754357799229" style="border:none;overflow:hidden; width: 95%; height: 100%;" scrolling="no" frameborder="0" allowTransparency="true"></iframe>';

                                    $('#loader-modal').get(0).hide(); // hide the loader

                                    window.setTimeout(function () {
                                        // wait for 2 seconds before proceding with complete page loading
                                        // remove any previous content from the container
                                        $("#facebook-feed-container", $thisPage).html('');
                                        // re-insert a fresh facebook widget now
                                        $("#facebook-feed-container", $thisPage).html(utopiasoftware[utopiasoftware_app_namespace].controller.facebookFeedPageViewModel.facebookWidgetCode);
                                        // hide the page preloader
                                        $('.page-preloader', $thisPage).css("display", "none");
                                    }, 2000);

                                case 11:
                                case 'end':
                                    return _context4.stop();
                            }
                        }
                    }, _callee4, this);
                }));

                return function loadPageOnAppReady() {
                    return _ref4.apply(this, arguments);
                };
            }();

            var $thisPage = $(event.target); // get a reference to the current page

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();
        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function pageShow() {},

        /**
         * method is triggered when page is hidden
         */
        pageHide: function pageHide() {},

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function pageDestroy() {
            // remove the facebook content
            $('#facebook-feed-page #facebook-feed-container').html('');
            // show the page preloader
            $('#facebook-feed-page .page-preloader').css("display", "block");
        },

        /**
         * method is triggered when back button or device back button is clicked
         */
        backButtonClicked: function backButtonClicked() {

            // check if the side menu is open
            if ($('ons-splitter').get(0).left.isOpen) {
                // side menu open, so close it
                $('ons-splitter').get(0).left.close();
                return; // exit the method
            }

            $('#app-main-navigator').get(0).popPage(); // display the previous page in the stack
        },

        /**
         * method is triggered when "Refresh" button is clicked
         */
        refreshButtonClicked: function refreshButtonClicked() {

            // check if Internet Connection is available before proceeding
            if (navigator.connection.type === Connection.NONE) {
                // no Internet Connection
                // inform the user that they cannot proceed without Internet
                window.plugins.toast.showWithOptions({
                    message: "Facebook Feed cannot be retrieved without an Internet Connection",
                    duration: 4000,
                    position: "top",
                    styling: {
                        opacity: 1,
                        backgroundColor: '#ff0000', //red
                        textColor: '#FFFFFF',
                        textSize: 14
                    }
                }, function (toastEvent) {
                    if (toastEvent && toastEvent.event == "touch") {
                        // user tapped the toast, so hide toast immediately
                        window.plugins.toast.hide();
                    }
                });

                return; // exit method immediately
            }

            // remove the facebook content
            $('#facebook-feed-page #facebook-feed-container').html('');
            // show the page preloader
            $('#facebook-feed-page .page-preloader').css("display", "block");

            window.setTimeout(function () {
                // wait for 2 seconds before initiating the twitter-feed loading

                // insert the facebook widget into the app
                $('#facebook-feed-page #facebook-feed-container').html(utopiasoftware[utopiasoftware_app_namespace].controller.facebookFeedPageViewModel.facebookWidgetCode);
                // hide the page preloader
                $('#facebook-feed-page .page-preloader').css("display", "none");
            }, 2000);
        }
    }
};

//# sourceMappingURL=controller-compiled.js.map