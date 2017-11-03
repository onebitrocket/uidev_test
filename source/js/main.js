/**
 * iconsFallback - Transform SVGs to PNGs when not supported
 * adapted from https://lukewhitehouse.co.uk/blog/svg-icon-workflow/
 * added in:
 * - external feature detection
 * - additional svg attributes (css classes and id)
 * - add if for when use is not detected and an svg id attribute exists
 * -- subsquent loop replaces any inline svgs
 * - add if for when use is detected
 * -- subsquent loop as original replaces use svgs and adds additional declare title/alt and class attributes
 */

 function iconsFallback() {

   // call external feature detection
   var supportsSvg = featureDetect.svg;

   // If browser doesn't support Inline SVG
   if ( supportsSvg !== 'has-svg' ) {

     // Get all SVGs on the page and how many there are
     var svgs = document.getElementsByTagName("svg"),
     svgL = svgs.length;

     // Loop through all SVGs on the page
     while( svgL-- ) {

       // If SVG isn't the first one, continue ...
       if(svgL >= 0) {

         // Get attributes of SVG
         var svgTitle = svgs[svgL].getAttribute("title"),
          svgClass = svgs[svgL].classList,
          svgId= svgs[svgL].id;

         // Get all  elements from each SVG
         var uses = svgs[svgL].getElementsByTagName("use"),
         usesL = uses.length;

         if(svgId.length > 0 && uses.length === 0 ) {

             // Create New Image
             var newImg = document.createElement("img");

             // Assign src attribute
             newImg.src = "/images/ui/" + svgId + ".png";

             // Assign alt attribute
             newImg.alt = svgTitle ? svgTitle : '';

             // Assign class attribute
             newImg.classList = svgClass ? svgClass : '';

             // Insert new element straight after the SVG in question
             svgs[svgL].parentNode.insertBefore(newImg, svgs[svgL].nextSibling);

         }

         if(uses.length > 0) {

           // Loop through all  elements within an SVG
           while( usesL-- ) {

             // Get the 'xlink:href' attributes
             var svgUseId = uses[usesL].getAttribute("xlink:href");

             // Remove first character from variable (This removes the #)
             svgUseId = svgUseId.substring(1, svgId.length);

             // Create New Image
             var newUseImg = document.createElement("img");

             // Assign src attribute
             newUseImg.src = "/images/ui/" + svgUseId + ".png";

             // Assign alt attribute
             newUseImg.alt = svgTitle ? svgTitle : '';

             // Assign class attribute
             newUseImg.classList = svgClass ? svgClass : '';

             // Insert new element straight after the SVG in question
             svgs[svgL].parentNode.insertBefore(newUseImg, svgs[svgL].nextSibling);
           }
         }

         // Remove all SVG nodes
         svgs[svgL].parentNode.removeChild(svgs[svgL]);

       }
     }
   }
 }
iconsFallback();

// JQUERY
(function($) {
  "use strict";

  var body = $('body'),
    root = $("html, body");


  // Modal
  $.fn.jqShowModal = function(options) {
    var settings = $.extend({
      modal: '#modal',
      modalName: false,
      modalBg:  true,
      modalInner: '#modalInner',
      modalClose: '#modalClose',
      modalActiveClass: 'js-modal-active',
      modalData: false, // url fram /data/ folder can except url entity
      modalEvent: false, // click, timed, leave
      modalDelay: false, // how long before modal should show, applies to timed and leave
      modalLimit: false // allow to trigger once or
    }, options);

    var timerDelay = (settings.modalDelay === false) ? 0 : settings.modalDelay,
      modalTrigger = $(this),
      modalLimit = settings.modalDelay,
      modalLimitCount = 1;

      // Toggle the visibiliy of the background  - if declared
      function toggleModalBg(action) {
        if(settings.modalBg !== undefined) {
          var modalBgId = 'modalBg',
          modalBackground = '<div class="modal-bg" id="' + modalBgId + '"></div>';
          if(action === 'show') {
            $(settings.modal).after(modalBackground);
          }
          if(action === 'remove') {
            $('#' + modalBgId).remove();
          }
        }
      }

      // load the modal, add active class
      function showModal() {


          $(settings.modalInner).load(settings.modalData, function(){
            $(body).addClass(settings.modalActiveClass);

            if(settings.modalTracking) {
              var modalClickAction = (settings.modalEvent === false) ? false : settings.modalEvent;

            }
          });


      }

      // limit the modal if required
      function limitModal() {
        if( settings.modalLimit >= modalLimitCount || settings.modalLimit === false ) {
          toggleModalBg('show');
          showModal();
          modalLimitCount ++;
        }
      }

      function leaveFromTop(e){
        if( e.clientY < 0 ) {
          limitModal();
        }
      }

      // close the modal removing active class
      $(settings.modalClose).on('click', function() {
        $(body).removeClass(settings.modalActiveClass);
        toggleModalBg('remove');

        // empty the modal
        $(settings.modalInner).empty();

      });

      // --  TRIGGER EVENTS -- //
      // on delay run timer
      if(settings.modalEvent === 'timed') {
        setTimeout(limitModal, timerDelay);
      }

      // on leave run timer
      if(settings.modalEvent === 'leave') {
        setTimeout(function() {
          $(modalTrigger).on('mouseleave', leaveFromTop);
        }, timerDelay);
      }

      // on click
      if(modalTrigger !== false && settings.modalEvent === 'click' || modalTrigger !== false && settings.modalEvent === false) {
        $(modalTrigger).on('click', function() {
          limitModal();
          return false;
        });
      }

  };

})(jQuery);
