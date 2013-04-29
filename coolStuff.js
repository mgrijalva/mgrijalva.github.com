$(document).ready(function() {
   $("h1.title").animate({
      opacity: 1,
      marginLeft: '200px'
      }, 750);

   $("a.navLinks").mouseover(function() {
      //$(this).fadeTo(100, 0.5, function(){});
      $(this).animate({
         backgroundColor: "#333333",
         borderColor: "#FF3399",
         color: "#FFFFFF"
      }, 150);
   });
   $("a.navLinks").mouseout(function() {
      $(this).animate({
         backgroundColor: "#FF3399",
         borderColor: "#FF3399",
         color: "#333333"
      }, 150);
   });
});