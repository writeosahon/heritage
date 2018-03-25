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
    startup: function(){

        // initialise the app libraries and plugins
        ons.ready(async function () {
            // set the default handler for the app
            ons.setDefaultDeviceBackButtonListener(function(){
                // does nothing for now!!
            });

            // displaying prepping message
            $('#loader-modal-message').html("Loading App...");
            $('#loader-modal').get(0).show(); // show loader

            // load the main-menu page
            $('ons-splitter').get(0).content.load("app-main-template");



            // START ALL CORDOVA PLUGINS CONFIGURATIONS
            try{
                // lock the orientation of the device to 'PORTRAIT'
                 screen.orientation.lock('portrait');
            }
            catch(err){}

            try { // START ALL THE CORDOVA PLUGINS CONFIGURATION WHICH REQUIRE PROMISE SYNTAX

                // note: for most promises, we weill use async-wait syntax
                // var a = await Promise.all([SystemJS.import('@syncfusion/ej2-base'), SystemJS.import('@syncfusion/ej2-dropdowns')]);
            }
            catch(err){
            }
            finally{
                // set status bar color
                 StatusBar.backgroundColorByHexString("#004700");
                 navigator.splashscreen.hide(); // hide the splashscreen

                 utopiasoftware[utopiasoftware_app_namespace].model.isAppReady = true; // true that app is fully loaded and ready
            }

        }); // end of ons.ready()

    },

    /**
     * this is the view-model/controller for the Main Menu page
     */
    mainMenuPageViewModel: {

        /**
         * method is triggered when page is initialised
         * @param event
         */
        pageInit: function(event){
            var $thisPage = $(event.target); // get a reference to the current page

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            async function loadPageOnAppReady(){
                // check to see if onsen is ready and if all app loading has been completed
                if(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false){
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // listen for the back button event
                $('#app-main-navigator').get(0).topPage.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.mainMenuPageViewModel.backButtonClicked;

                $('#loader-modal').get(0).hide(); // hide the loader
            }
        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            // add background animation class
            $('#main-menu-page .page--material__background').addClass('apply-moving-background-animation');
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: function(){
            // remove background animation class
            $('#main-menu-page .page--material__background').removeClass('apply-moving-background-animation');
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){},

        /**
         * method is triggered when back button or device back button is clicked
         */
        backButtonClicked: function(){

            // check if the side menu is open
            if($('ons-splitter').get(0).left.isOpen){ // side menu open, so close it
                $('ons-splitter').get(0).left.close();
                return; // exit the method
            }

            ons.notification.confirm('Do you want to close the app?', {title: 'Quit App',
                    buttonLabels: ['No', 'Yes']}) // Ask for confirmation
                .then(function(index) {
                    if (index === 1) { // OK button
                        navigator.app.exitApp(); // Close the app
                    }
                });
        },

        /**
         * method is called when items for the app's main menu are clicked
         *
         * @param menuItemLabel {String} the label for the menu item that was clicked
         */
        mainMenuItemClicked: function(menuItemLabel){

            // use a switch-case to determine what page to load
            switch(menuItemLabel){
                case "twitter":
                    $('#app-main-navigator').get(0).pushPage("twitter-feed-page.html");
                    break;

                case "facebook":
                    $('#app-main-navigator').get(0).pushPage("facebook-feed-page.html");
                    break;
            }
        }
    },


    twitterFeedPageViewModel: {

        twitterWidgetCode: `<a class="twitter-timeline"  href="https://twitter.com/HeritageAssembl"
        data-widget-id="739091831535898624" data-width="98%" data-height="100%">Tweets by @HeritageAssembl</a>`,

        /**
         * method is triggered when page is initialised
         * @param event
         */
        pageInit: function(event){
            var $thisPage = $(event.target); // get a reference to the current page

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            async function loadPageOnAppReady(){
                // check to see if onsen is ready and if all app loading has been completed
                if(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false){
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // check if Internet Connection is available before proceeding
                if(navigator.connection.type === Connection.NONE){ // no Internet Connection
                    // inform the user that they cannot proceed without Internet
                    window.plugins.toast.showWithOptions({
                        message: "Twitter Feed cannot be created without an Internet Connection",
                        duration: 4000,
                        position: "top",
                        styling: {
                            opacity: 1,
                            backgroundColor: '#ff0000', //red
                            textColor: '#FFFFFF',
                            textSize: 14
                        }
                    }, function(toastEvent){
                        if(toastEvent && toastEvent.event == "touch"){ // user tapped the toast, so hide toast immediately
                            window.plugins.toast.hide();
                        }
                    });

                    return; // exit method immediately
                }

                if(!twttr.widgets){ // twitter widget library not loaded yet
                    // wait for 1 second and try again
                    window.setTimeout(loadPageOnAppReady, 1000);
                    return;
                }

                // listen for the back button event
                $('#app-main-navigator').get(0).topPage.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.twitterFeedPageViewModel.backButtonClicked;

                // insert the twitter widget into the app
                $('#twitter-feed-container', $thisPage).html(utopiasoftware[utopiasoftware_app_namespace].controller.
                twitterFeedPageViewModel.twitterWidgetCode);
                // instantiate the twitter widget
                twttr.widgets.load(
                    $('#twitter-feed-container', $thisPage).get(0)
                );

                $('#loader-modal').get(0).hide(); // hide the loader

                window.setTimeout(function(){ // wait for 2 seconds before hiding the page preloader
                    // hide the page preloader
                    $('.page-preloader', $thisPage).css("display", "none");
                }, 2000);
            }
        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: function(){
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){
            // remove the twitter content
            $('#twitter-feed-page #twitter-feed-container').html('');
            // show the page preloader
            $('#twitter-feed-page .page-preloader').css("display", "block");
        },

        /**
         * method is triggered when back button or device back button is clicked
         */
        backButtonClicked: function(){

            // check if the side menu is open
            if($('ons-splitter').get(0).left.isOpen){ // side menu open, so close it
                $('ons-splitter').get(0).left.close();
                return; // exit the method
            }

            $('#app-main-navigator').get(0).popPage(); // display the previous page in the stack
        },

        /**
         * method is triggered when "Refresh" button is clicked
         */
        refreshButtonClicked: function(){

            // check if Internet Connection is available before proceeding
            if(navigator.connection.type === Connection.NONE){ // no Internet Connection
                // inform the user that they cannot proceed without Internet
                window.plugins.toast.showWithOptions({
                    message: "Twitter Feed cannot be created without an Internet Connection",
                    duration: 4000,
                    position: "top",
                    styling: {
                        opacity: 1,
                        backgroundColor: '#ff0000', //red
                        textColor: '#FFFFFF',
                        textSize: 14
                    }
                }, function(toastEvent){
                    if(toastEvent && toastEvent.event == "touch"){ // user tapped the toast, so hide toast immediately
                        window.plugins.toast.hide();
                    }
                });

                return; // exit method immediately
            }

            if(!twttr.widgets){ // twitter widget library not loaded yet
                // wait for 1 second and try again
                window.setTimeout(utopiasoftware[utopiasoftware_app_namespace].controller.
                    twitterFeedPageViewModel.refreshButtonClicked, 1000);
                return;
            }

            // remove the twitter content
            $('#twitter-feed-page #twitter-feed-container').html('');
            // show the page preloader
            $('#twitter-feed-page .page-preloader').css("display", "block");

            // insert the twitter widget into the app
            $('#twitter-feed-page #twitter-feed-container').html(utopiasoftware[utopiasoftware_app_namespace].controller.
                twitterFeedPageViewModel.twitterWidgetCode);
            window.setTimeout(function(){ // wait for 2 seconds before initiating the twitter-feed loading
                // instantiate the twitter widget
                twttr.widgets.load(
                    $('#twitter-feed-page #twitter-feed-container').get(0)
                );
                // hide the page preloader
                $('#twitter-feed-page .page-preloader').css("display", "none");
            }, 2000);
        }
    }
};


