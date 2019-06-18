// Grab articles - JSON
$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + "<a href='" + data[i].link + "'target='_blank'>" + data[i].title + "</a>" + "🎵" + "<hr>");
    }
});

$(document).on("click", "p", function () {
    $("#notes").empty();
    let thisId = $(this).attr("data-id");

    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        .then(function (data) {
            console.log(data);
            // title
            $("#notes").append("<h2>" + data.title + "</h2>");
            // input field for new title
            // $("#notes").append("<input id='titleinput' name='title' />");
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>save setlist</button>");

            if (data.note) {

                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            }
        });
});

$(document).on("click", "#savenote", function () {
    let thisId = $(this).attr("data-id");

    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                title: $("#titleinput").val(),
                body: $("#bodyinput").val()
            }
        })
        .then(function (data) {
            console.log(data)
            $("#notes").empty();
        });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});