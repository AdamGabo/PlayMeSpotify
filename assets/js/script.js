for (var j = 0; j < 9; j++) //example for adding divs and content 
{
var eventText = $("<div>")
 .addClass("hour")
 .text(businessHours[j]);
 eventText.appendTo("#event-container-" + businessHours[j]); 

 //add input box for event content
 var content = $('<textarea>', {
    id: "input-" + businessHours[j],
    class: 'description',
}).appendTo("#event-container-" + businessHours[j]);
}