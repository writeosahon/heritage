/**
 * Created by UTOPIA SOFTWARE on [DATE].
 */



// define the model namespace
utopiasoftware[utopiasoftware_app_namespace].model = {

    /**
     * property acts as a flag that indicates that all hybrid plugins and DOM content
     * have been successfully loaded. It relies on the ons.ready() method
     *
     * @type {boolean} flag for if the hybrid plugins and DOM content are ready for execution
     */
    isAppReady: false

};

// call the method to startup the app
utopiasoftware[utopiasoftware_app_namespace].controller.startup();

// listen for the initialisation of the MAIN MENU page
$(document).on("init", "#main-menu-page", utopiasoftware[utopiasoftware_app_namespace].controller.mainMenuPageViewModel.pageInit);

// listen for when the MAIN MENU page is shown
$(document).on("show", "#main-menu-page", utopiasoftware[utopiasoftware_app_namespace].controller.mainMenuPageViewModel.pageShow);

// listen for when the MAIN MENU page is hidden
$(document).on("hide", "#main-menu-page", utopiasoftware[utopiasoftware_app_namespace].controller.mainMenuPageViewModel.pageHide);

// listen for when the MAIN MENU page is destroyed
$(document).on("destroy", "#main-menu-page", utopiasoftware[utopiasoftware_app_namespace].controller.mainMenuPageViewModel.pageDestroy);

// listen for the initialisation of the TWITTER FEED page
$(document).on("init", "#twitter-feed-page", utopiasoftware[utopiasoftware_app_namespace].controller.twitterFeedPageViewModel.pageInit);

// listen for when the TWITTER FEED page is shown
$(document).on("show", "#twitter-feed-page", utopiasoftware[utopiasoftware_app_namespace].controller.twitterFeedPageViewModel.pageShow);

// listen for when the TWITTER FEED page is hidden
$(document).on("hide", "#twitter-feed-page", utopiasoftware[utopiasoftware_app_namespace].controller.twitterFeedPageViewModel.pageHide);

// listen for when the TWITTER FEED page is destroyed
$(document).on("destroy", "#twitter-feed-page", utopiasoftware[utopiasoftware_app_namespace].controller.twitterFeedPageViewModel.pageDestroy);

// listen for the initialisation of the FACEBOOK FEED page
$(document).on("init", "#facebook-feed-page", utopiasoftware[utopiasoftware_app_namespace].controller.facebookFeedPageViewModel.pageInit);

// listen for when the FACEBOOK FEED page is shown
$(document).on("show", "#facebook-feed-page", utopiasoftware[utopiasoftware_app_namespace].controller.facebookFeedPageViewModel.pageShow);

// listen for when the FACEBOOK FEED page is hidden
$(document).on("hide", "#facebook-feed-page", utopiasoftware[utopiasoftware_app_namespace].controller.facebookFeedPageViewModel.pageHide);

// listen for when the FACEBOOK FEED page is destroyed
$(document).on("destroy", "#facebook-feed-page", utopiasoftware[utopiasoftware_app_namespace].controller.facebookFeedPageViewModel.pageDestroy);

// listen for the initialisation of the CONTACT US page
$(document).on("init", "#contact-us-page", utopiasoftware[utopiasoftware_app_namespace].controller.contactUsPageViewModel.pageInit);

// listen for when the CONTACT US page is shown
$(document).on("show", "#contact-us-page", utopiasoftware[utopiasoftware_app_namespace].controller.contactUsPageViewModel.pageShow);

// listen for when the CONTACT US page is hidden
$(document).on("hide", "#contact-us-page", utopiasoftware[utopiasoftware_app_namespace].controller.contactUsPageViewModel.pageHide);

// listen for when the CONTACT US page is destroyed
$(document).on("destroy", "#contact-us-page", utopiasoftware[utopiasoftware_app_namespace].controller.contactUsPageViewModel.pageDestroy);

// listen for the initialisation of the VIDEO MESSAGES page
$(document).on("init", "#video-messages-page", utopiasoftware[utopiasoftware_app_namespace].controller.videoMessagesPageViewModel.pageInit);

// listen for when the VIDEO MESSAGES page is shown
$(document).on("show", "#video-messages-page", utopiasoftware[utopiasoftware_app_namespace].controller.videoMessagesPageViewModel.pageShow);

// listen for when the CONTACT US page is hidden
$(document).on("hide", "#video-messages-page", utopiasoftware[utopiasoftware_app_namespace].controller.videoMessagesPageViewModel.pageHide);

// listen for when the CONTACT US page is destroyed
$(document).on("destroy", "#video-messages-page", utopiasoftware[utopiasoftware_app_namespace].controller.videoMessagesPageViewModel.pageDestroy);
