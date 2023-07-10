let moves = 0;

function createBoard() {
    moves = 0;
    $("span#moves").text(moves);

    let boardSize = $("select").val();
    let $tr = ["<tr>"];
    for(let i=1; i<=boardSize; i++) {
        $tr.push("<td></td>");
    }
    $tr.push("</tr>");

    $("tbody").append($tr.join(""));

    for(let row=1; row<boardSize; row++) {
        $($("tr")[0]).clone().appendTo("tbody");
    }

    // randomly turning on tiles (initial state)
    $("td").each((index, element) => {
        if(Math.floor(Math.random() * 10 + 1) < 5) {
            $(element).addClass("on");
        }
    });

    // click event on tiles
    $("td").click((event) => {
        moves += 1;
        $("span#moves").text(moves);
        $(event.target).toggleClass("on");
        $(event.target).prev().toggleClass("on");
        $(event.target).next().toggleClass("on");
        $($(event.target).parent().prev().children()[$(event.target).index()]).toggleClass("on");
        $($(event.target).parent().next().children()[$(event.target).index()]).toggleClass("on");

        if($("td.on").length == boardSize * boardSize) {
            $("#prompt").css("display", "flex");
            $("#dimlight").toggle();
            $("#prompt span").text(moves);
            $("td").unbind();
            $("td").click((event) => {
                $("#prompt").css("display", "flex");
                $("#dimlight").toggle();
            });
        }
    });
}

$("select").change(() => {
    $("tbody").empty();
    createBoard();
});

$("button#reset").click(() => {
    $("tbody").empty();
    createBoard();
});

$("#prompt div").click(() => {
    $("#prompt").toggle();
    $("#dimlight").toggle();
});

createBoard();
