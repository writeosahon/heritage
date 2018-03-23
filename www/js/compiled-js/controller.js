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
                 screen.lockOrientation('portrait');
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
                 StatusBar.backgroundColorByHexString("#008000");
                 navigator.splashscreen.hide(); // hide the splashscreen

                 utopiasoftware[utopiasoftware_app_namespace].model.isAppReady = true; // true that app is fully loaded and ready
            }

        }); // end of ons.ready()

    },

    /**
     * this is the view-model/controller for the Main Menu page
     */
    mainMenuPageViewModel: {

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
            $('.page--material__background', $thisPage).addClass('apply-moving-background-animation');
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: function(){
            // remove background animation class
            $('.page--material__background', $thisPage).removeClass('apply-moving-background-animation');
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
        }
    }
};


