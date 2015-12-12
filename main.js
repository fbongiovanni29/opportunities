$.getJSON( "https://raw.githubusercontent.com/mcelaney/opportunities/master/philadelphia.json", function( data ) {
  var items = []
  $.each( data, function( key, val ) {
    function jobs(){
      var position = "  ";
      for (i = 0; i < val.positions.length; i++ ){
	  position = position + val.positions[i].title + "<br/>";
       }
       console.log(position)
       return position;
    }
       items.push( "<a href=\"" + val.url + "\">" + "<h1>" + val.company + "</h1>" + "</a>" + 
	  "<p>" + val.address + "</p>" +
	  "<p>" + jobs() + "</p>" +
	  "<br/>" );
  });
 
  $( "<ul/>", {
    "class": "job-list",
    html: items.join( "" )
  }).appendTo( "body" );
});
