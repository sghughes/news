

$('#scraper').on('click', function(){
  $.ajax({
    method: 'GET', 
    url: '/scrape',
  }).done(function(data){
    console.log(data);
    window.location='/'
  })
});



$.getJSON('/articles', function(data){
    for (var i=0; i < data.length; i++){
        $("#articles").append("<div class='card' data-id='" + data[i]._id + "'>" + 
                "<h5 class='card-header'>" + data[i].title + "</h5>" +
                "<div class='card-body'>" + 
                    "<div data-id='" + data[i]._id + "'>" +
                        "<h5 class='card-title'>" + data[i].summary + "</h5>" + 
                        "<p class='card-text'>" + data[i].link + "</p>" +
                        "<a href='#' class='btn btn-primary addNote' data-id='" + data[i]._id + "'> Add/Edit Note </a>" + 
                        "<a href='#' class='btn btn-primary viewNote' data-id='" + data[i]._id + "'> View Note </a>"+
                        "<a href='#' class='btn btn-primary deleteNote' data-id='" + data[i]._id + "'> Delete Note </a>"+
                        "<div id='" + data[i]._id + "'>" +
                    "</div></div></div><br>");
    }
    // for (var i = 0; i < data.length; i++) {
    //   // Display the apropos information on the page
    //   $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    // }
});


$(document).on("click", ".addNote", function() {

    $("#notes").empty();

    var thisId = $(this).attr("data-id");
  

    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })

      .then(function(data) {
        console.log(data);

        $("#"+ data._id).append("<h2>" + data.title + "</h2><br>");
        $("#"+ data._id).append("<input id='titleinput' name='title' ><br>");
        $("#"+ data._id).append("<textarea id='bodyinput' name='body'></textarea><br>");
        $("#"+ data._id).append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        if (data.note) {
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
        }
      });
  });

  $(document).on("click", ".viewNote", function() {

    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })

      .then(function(data) {
      console.log(data.note);
      alertify.alert(
      data.note.title, data.note.body, function(){
      alertify.success('Thanks for viewing this note');
      window.location.href = '/';
      }
      )

      });
  });

  

  $(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {

        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    })
      .then(function(data) {
        console.log(data);
        $("#notes").empty();
      });
  
    $("#titleinput").val("");
    $("#bodyinput").val("");
    window.location.href = '/';
  });

  $(document).on("click", ".deleteNote", function(){
    var noteId=$(this).attr('data-note-id');
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "DELETE",
      url: "/notes/delete/" + noteId + '/' + thisId
    })
    .done(function(data){
      console.log(data);
      window.location.href = '/';
    })
  })

