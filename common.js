function loadNext() {
    $.ajax("http://localhost:3000/api/prices/t/old")
        .done(function (d) {
            console.log(d);

            if (d && d.url) {
                setTimeout(
                    function() {
                        window.location = d.url;
                    }, 1000
                );
            }
            else {
                // alert("No more URLs");
                $("body").css("background-color", "grey");
            }
        })
        .fail(function () {
            alert("Something went wrong with fetching next url");
        });
}