//Array Content from API calls 
var searchOptionsArray = []; 
var podcasterContentListenAPI = []; 
var podcasterContentWikipedia = []; 

//MAKE API CALLS TO GATHER CONTENT AND STORE IN ARRAY 



//DISPLAY CONTENT (CALL from SETITEMS command first for old content stored on local storage) and call when the search button is submitted 
var SetItems = function (){
    for (var j = 0; j < searchOptionsArray.length; j++) //example for adding divs and content, this where we can display the search options and wikipedia content via API calls 
    {
    var eventText = $("<div>")
    .addClass("search-result")
    .text("option" + j);
    eventText.appendTo(".container"); 

    //add input box for event content
    var content = $('<textarea>', {
        id: "input-" + arraycontent[j],
        class: 'description',
    }).appendTo(".container");
    }

    //add picture of podcaster
    //add podcaster info 
    //display content 
}

//GET STORED PREVIOUS USER CONTENT IN LOCAL STORAGE, AND DISPLAY IT 
var GetnSetContent = function (){

    //
    //for (var q = 0; q < businessHours.length; q++)
    //{
       // var item = localStorage.getItem("event-container-" + businessHours[q]); 
        //if (item)
        //{
          //  $("#input-" + businessHours[q]).val(item); 
        //}
    //}

        
}
//SEARCH BUTTON EXAMPLE
$('#search-btn').on('click', function () {

    //if (value)
        //localStorage.setItem(id,value); 
        //CALL FUNCTIONS WHICH DISPLAY PODCASTER CONTENT , MAKE API CALLS TO GATHER INFO INTO GLOBAL ARRAYS 
    }); 

