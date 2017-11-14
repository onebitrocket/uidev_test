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

function callModalJs(triggerEl) {
   "use strict";
    var modal = triggerEl.id,
      modalActiveClass = 'js-modal-active',
      modalInner = document.getElementById('modalInner'),
      modalBg = document.getElementById('modalBg') ;

  //  create the background element
  var newModalbg = document.createElement("div");
    newModalbg.id = "modalBg";
    newModalbg.setAttribute("class", "modal-bg");


  // load the content
  function loadJSON(url, callback){

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4 && xhr.status == 200){
        callback(xhr.responseText);
      }
    };

    xhr.open('GET', url, true);
    xhr.send();
  }

  // show the modal
  document.body.classList.toggle(modalActiveClass);

  if(modal !== 'modalClose') {
    document.body.appendChild(newModalbg);
    loadJSON('/modals/' + modal + '.html', function(data){
      modalInner.innerHTML = data;
    });
  } else {
    modalInner.innerHTML = '';
    modalBg.parentNode.removeChild(modalBg);
  }

}
