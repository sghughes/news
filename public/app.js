

$.getJSON('/articles', function(data){
    for (var i=0; i < data.length; i++){
        $("#articles").append("<div class='card' data-id='" + data[i]._id + "'>" + 
                "<h5 class='card-header'>" + data[i].title + "</h5>" +
                "<div class='card-body'>" + 
                    "<div data-id='" + data[i]._id + "'>" +
                        "<h5 class='card-title'>Summary text here</h5>" + 
                        "<p class='card-text'>" + data[i].link + "</p>" +
                        "<a href='#' class='btn btn-primary addNote' data-id='" + data[i]._id + "'> Add Note </a>" + 
                        "<a href='#' class='btn btn-primary viewNote' data-id='" + data[i]._id + "'> View Note </a>"+
                    "</div></div></div><br>");
    }

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
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
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
  });