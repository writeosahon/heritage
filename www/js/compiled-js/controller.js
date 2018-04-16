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

            // add listener for when the Internet network connection is offline
            document.addEventListener("offline", function(){

                // display a toast message to let user no there is no Internet connection
                window.plugins.toast.showWithOptions({
                    message: "No Internet Connection. App functionality will be limited",
                    duration: 4000, // 4000 ms
                    position: "bottom",
                    styling: {
                        opacity: 1,
                        backgroundColor: '#000000',
                        textColor: '#FFFFFF',
                        textSize: 14
                    }
                });

            }, false);

            // add listener for when the Internet network connection is online
            document.addEventListener("online", function(){

                // display a toast message to let user no there is an active Internet connection
                window.plugins.toast.showWithOptions({
                    message: "Internet Connection is active",
                    duration: 4000, // 4000 ms
                    position: "bottom",
                    styling: {
                        opacity: 1,
                        backgroundColor: '#000000',
                        textColor: '#FFFFFF',
                        textSize: 14
                    }
                });

            }, false);


            // START ALL CORDOVA PLUGINS CONFIGURATIONS
            try{
                // lock the orientation of the device to 'PORTRAIT'
                 screen.orientation.lock('portrait');
            }
            catch(err){}

            try { // START ALL THE CORDOVA PLUGINS CONFIGURATION WHICH REQUIRE PROMISE SYNTAX

                // prepare the inapp browser plugin
                window.open = cordova.InAppBrowser.open;

                // note: for most promises, we weill use async-wait syntax
                // var a = await Promise.all([SystemJS.import('@syncfusion/ej2-base'), SystemJS.import('@syncfusion/ej2-dropdowns')]);
            }
            catch(err){ // catch any errors that may have occurred during app starup
                window.plugins.toast.showWithOptions({
                    message: "Startup Error. App functionality may be limited. Always update the app to " +
                    "get the best secure experience. Please contact us if problem continues",
                    duration: 5000, // 5000 ms
                    position: "bottom",
                    styling: {
                        opacity: 1,
                        backgroundColor: '#000000',
                        textColor: '#FFFFFF',
                        textSize: 14
                    }
                });
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
     * view-model/controller for app side-menu
     */
    sideMenuPageViewModel: {

        /**
         * method is used to handle the click event on the side menu items
         *
         * @param menuItemLabel {String}
         */
        sideMenuItemClicked: function(menuItemLabel){

            // close the side menu
            $('ons-splitter').get(0).left.close();

            // use a switch-case to determine what items where clicked
            switch(menuItemLabel){
                case "main menu":
                    $('#app-main-navigator').get(0).resetToPage("main-menu-page.html", {pop: true});
                    break;

                case "video messages":
                    $('#app-main-navigator').get(0).bringPageTop("video-messages-page.html");
                    break;

                case "visit website":
                    // open the website
                    window.open('http://heritageassembly.net/', '_system');
                    break;

                case "facebook feed":
                    $('#app-main-navigator').get(0).bringPageTop("facebook-feed-page.html");
                    break;

                case "twitter feed":
                    $('#app-main-navigator').get(0).bringPageTop("twitter-feed-page.html");
                    break;

                case "contact us":
                    $('#app-main-navigator').get(0).bringPageTop("contact-us-page.html");
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

                case "video messages":
                    $('#app-main-navigator').get(0).pushPage("video-messages-page.html");
                    break;

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
                        message: "Twitter Feed cannot be retrieved without an Internet Connection",
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

                // listen for the back button event
                $('#app-main-navigator').get(0).topPage.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.twitterFeedPageViewModel.backButtonClicked;


                if(!twttr.widgets){ // twitter widget library not loaded yet
                    // wait for 1 second and try again
                    window.setTimeout(loadPageOnAppReady, 1000);
                    return;
                }

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
                    message: "Twitter Feed cannot be retrieved without an Internet Connection",
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
                        message: "Facebook Feed cannot be retrieved without an Internet Connection",
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

                // listen for the back button event
                $('#app-main-navigator').get(0).topPage.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.facebookFeedPageViewModel.backButtonClicked;

                var faceBookFeedDimensions = {width: Math.round($("#facebook-feed-container", $thisPage).width()),
                    height: Math.round($("#facebook-feed-container", $thisPage).height())}; // get the dimensions for the facebook widget container
                // update the string code for the facebook widget
                utopiasoftware[utopiasoftware_app_namespace].controller.
                    facebookFeedPageViewModel.facebookWidgetCode = '<iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fheritageassemblychurch&tabs=timeline&width='
                    + faceBookFeedDimensions.width + '&height=' + faceBookFeedDimensions.height +
                    '&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId=1724754357799229" style="border:none;overflow:hidden; width: 95%; height: 100%;" scrolling="no" frameborder="0" allowTransparency="true"></iframe>'


                $('#loader-modal').get(0).hide(); // hide the loader

                window.setTimeout(function(){ // wait for 2 seconds before proceding with complete page loading
                    // remove any previous content from the container
                    $("#facebook-feed-container", $thisPage).html('');
                    // re-insert a fresh facebook widget now
                    $("#facebook-feed-container", $thisPage).html(
                        utopiasoftware[utopiasoftware_app_namespace].controller.
                            facebookFeedPageViewModel.facebookWidgetCode);
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
            // remove the facebook content
            $('#facebook-feed-page #facebook-feed-container').html('');
            // show the page preloader
            $('#facebook-feed-page .page-preloader').css("display", "block");
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
                    message: "Facebook Feed cannot be retrieved without an Internet Connection",
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


            // remove the facebook content
            $('#facebook-feed-page #facebook-feed-container').html('');
            // show the page preloader
            $('#facebook-feed-page .page-preloader').css("display", "block");

            window.setTimeout(function(){ // wait for 2 seconds before initiating the twitter-feed loading

                // insert the facebook widget into the app
                $('#facebook-feed-page #facebook-feed-container').html(utopiasoftware[utopiasoftware_app_namespace].controller.
                    facebookFeedPageViewModel.facebookWidgetCode);
                // hide the page preloader
                $('#facebook-feed-page .page-preloader').css("display", "none");
            }, 2000);
        }
    },

    /**
     * this is the view-model/controller for the Contact Us page
     */
    contactUsPageViewModel: {

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
                    utopiasoftware[utopiasoftware_app_namespace].controller.contactUsPageViewModel.backButtonClicked;

                $('#loader-modal').get(0).hide(); // hide the loader
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

            $('#app-main-navigator').get(0).popPage(); // display the previous page in the stack
        },

        /**
         * method is triggered when email addresses from the "contact us" list are clicked
         * @param emailAddress {String}
         */
        contactEmailButtonClicked: function(emailAddress){
            window.open('mailto:' + emailAddress, '_system');
        },

        /**
         * method is triggered when telephone numbers from the "contact us" list are clicked
         * @param telephoneNumber {String}
         */
        contactTelephoneButtonClicked: function(telephoneNumber){
            window.open('tel:' + telephoneNumber, '_system');
        }
    },

    /**
     * view-model/controller object for Video Messages page
     */
    videoMessagesPageViewModel: {

        /**
         * holds the unique Id for the the Youtube Channel. Id is generated by Youtube
         */
        youtubeChannelId: "UC8Pgm2oZAQdAgIm2VKHLn6Q",

        /**
         * holds the Id for the playlist to be played from th Youtube Channel
         */
        playlistId: "",

        /**
         * holds the width used for video messages
         */
        videoMessageWidth: 100,

        /**
         * holds the height used for video messages
         */
        videoMessageHeight: 50,

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
                    utopiasoftware[utopiasoftware_app_namespace].controller.videoMessagesPageViewModel.backButtonClicked;

                // calculate the width & height used to display video messages
                var videoDimensions =
                    {width: Math.round($("#video-messages-list .e-card-content", $thisPage).width()),
                    height: Math.round($("#video-messages-list .e-card-content", $thisPage).height())}; // get the dimensions for the video messages container
                // calculate the dimensions for the video messages display
                utopiasoftware[utopiasoftware_app_namespace].controller.
                    videoMessagesPageViewModel.videoMessageWidth = videoDimensions.width - 56;
                utopiasoftware[utopiasoftware_app_namespace].controller.
                    videoMessagesPageViewModel.videoMessageHeight = Math.round(videoDimensions.width * 0.5625);

                // call the refreshButtonClicked() method to load the video messages content
                utopiasoftware[utopiasoftware_app_namespace].controller.videoMessagesPageViewModel.refreshButtonClicked();
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
        refreshButtonClicked: async function(){

            // check if Internet Connection is available before proceeding
            if(navigator.connection.type === Connection.NONE){ // no Internet Connection
                // inform the user that they cannot proceed without Internet
                window.plugins.toast.showWithOptions({
                    message: "Video Messages cannot be loaded without an Internet Connection",
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


            // remove the previous csontent from the list
            $('#video-messages-page #video-messages-list').html('');
            // show the page preloader
            $('#video-messages-page .page-preloader').css("display", "block");

            var listContent = ''; // holds ther contents of the video messages list

            try{
                // retrieve the id playlist for 'uploads'
                var serverResponse = await Promise.resolve($.ajax(
                    {
                        url: "https://www.googleapis.com/youtube/v3/channels",
                        type: "get",
                        dataType: "json",
                        //crossDomain: true,
                        //xhrFields: {withCredentials: true},
                        timeout: 240000, // wait for 4 minutes before timeout of request
                        processData: false,
                        data: "key=AIzaSyD2UwTMxQhlv-Mb3gdj5PqlIcE3Bri_i9A&part=" +
                        encodeURIComponent("id,contentDetails,snippet") + "&id=" +
                        encodeURIComponent(utopiasoftware[utopiasoftware_app_namespace].controller.
                            videoMessagesPageViewModel.youtubeChannelId) +
                        "&fields=" +
                        encodeURIComponent("items(contentDetails/relatedPlaylists/uploads,id,snippet(title,thumbnails/high))")
                    }
                ));

                // store the 'upload' playlist id
                utopiasoftware[utopiasoftware_app_namespace].controller.videoMessagesPageViewModel.playlistId =
                    serverResponse.items[0].contentDetails.relatedPlaylists.uploads;

                //retrieve the playlist items in the 'upload' playlist
                serverResponse = await Promise.resolve($.ajax(
                    {
                        url: "https://www.googleapis.com/youtube/v3/playlistItems",
                        type: "get",
                        dataType: "json",
                        //crossDomain: true,
                        //xhrFields: {withCredentials: true},
                        timeout: 240000, // wait for 4 minutes before timeout of request
                        processData: false,
                        data: "key=AIzaSyD2UwTMxQhlv-Mb3gdj5PqlIcE3Bri_i9A&part=" +
                        encodeURIComponent("contentDetails") + "&playlistId=" +
                        encodeURIComponent(utopiasoftware[utopiasoftware_app_namespace].controller.videoMessagesPageViewModel.playlistId) +
                        "&maxResults=5&fields=" +
                        encodeURIComponent("items/contentDetails/videoId")
                    }
                ));

                // get the video ids and iframe html for the video contained in the upload playlistg
                serverResponse = await (function(playListItemsResponse){

                    var videoIdsArray = []; // holds all ids for videos which are to be loaded
                    var promisesArray = []; // holds the array of all Promises

                    // loop through all the return items and extract the video ids into the array
                    for(var index = 0; index < playListItemsResponse.items.length; index++)
                    {
                        videoIdsArray[index] = playListItemsResponse.items[index].contentDetails.videoId;
                        promisesArray[index] = $.ajax( // make a request for videos using the ids that were retrieved
                            {
                                url: "https://www.googleapis.com/youtube/v3/videos",
                                type: "get",
                                dataType: "json",
                                //crossDomain: true,
                                //xhrFields: {withCredentials: true},
                                timeout: 240000, // wait for 4 minutes before timeout of request
                                processData: false,
                                data: "key=AIzaSyD2UwTMxQhlv-Mb3gdj5PqlIcE3Bri_i9A&part=" +
                                encodeURIComponent("snippet,player") + "&id=" +
                                videoIdsArray[index] +
                                "&fields=" +
                                encodeURIComponent("items(snippet(title,publishedAt),player)")
                            }
                        );
                    }

                    return Promise.all(promisesArray);
                })(serverResponse);

                // map the contents of the returned array using the helper function
                serverResponse = await videoMessagesMapping(serverResponse);
                for(let index = 0; index < serverResponse.length; index++){

                    listContent += `<ons-list-item modifier="nodivider" lock-on-drag="true" style="background-color: transparent">
                        <div class="e-card" style="background-color: #e8e8e8">
                            <div class="e-card-content" style="margin-left: auto !important; margin-right: auto !important;">
                                ${serverResponse[index].items[0].player.embedHtml}
                            </div>
                            <div class="e-card-header">
                                <div class="e-card-header-caption">
                                    <div class="e-card-header-title">${serverResponse[index].items[0].snippet.title}</div>
                                    <div class="e-card-sub-title">Date: ${kendo.toString(new Date(serverResponse[index].items[0].snippet.publishedAt), "D")}</div>
                                </div>
                            </div>
                        </div>
                    </ons-list-item>`;
                } // end of for-loop

                // append generated listContent to the list
                $('#video-messages-page #video-messages-list').append(listContent);
                // hide the page preloader
                $('#video-messages-page .page-preloader').css("display", "none");
                // scroll to the top of the list
                $('#video-messages-page .page__content').scrollTop(0);

            }
            catch (err){
                console.log("ERROR ", err);
            }


            /**
             * function is a helper used to update the contents of the video messages display elements
             *
             * @param videoMessagesArray
             * @returns {Promise<any>}
             */
            function videoMessagesMapping(videoMessagesArray){

                return new Promise(function(resolve, reject){
                    resolve(videoMessagesArray.map(function(arrayElem){ // map/transform each element in the array
                        // updatge the iframe html content is that the video messages can be rightly displayed in-app
                        arrayElem.items[0].player.embedHtml =
                            arrayElem.items[0].player.embedHtml.replace("//", "https://").replace('width="480"',
                                'width="' + utopiasoftware[utopiasoftware_app_namespace].controller.videoMessagesPageViewModel.videoMessageWidth + '"').
                            replace('height="360"', 'height="' + utopiasoftware[utopiasoftware_app_namespace].controller.videoMessagesPageViewModel.
                                videoMessageHeight + '"');

                        //return the update element
                        return arrayElem;
                    }));
                });
            }
        }
    }
};


