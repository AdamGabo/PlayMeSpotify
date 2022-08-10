for (var j = 0; j < 9; j++)
{
var eventText = $("<div>")
 .addClass("hour")
 .text(businessHours[j]);
 eventText.appendTo("#event-container-" + businessHours[j]); 

 //add input box for event content
 var content = $('<textarea>', {
    id: "input-" + businessHours[j],
    class: 'col-md-10 description',
}).appendTo("#event-container-" + businessHours[j]);
}