var instock = $(".product__main button[name='ms2_action']").eq(0);

var nameel = $(".product__main h1").eq(0);
var goodname = "unknown";

if (instock.length) {
    var url = window.location + "";
    var urlsplit = url.split("?");
    var mainurl = urlsplit[0];
    
    if (mainurl.endsWith("/")) {
        mainurl = mainurl.slice(0, mainurl.length - 1);
    }

    if (mainurl.includes("catalog")) {
        var urlparts = mainurl.split("/");
        var model = urlparts[urlparts.length - 1];

        if (nameel.length) {
            goodname = nameel.text();
        }

        var inStock = 1;

        if (instock.text().includes("в наличии")) {
            inStock = 0;
        }

        var data = JSON.stringify({
            model,
            url,
            seller: "Три Слона",
            model,
            name: goodname,
            topOffer: 1,
            inStock,
            source: 'trislona'
        });

        console.log(data);

        $.ajax("http://localhost:3000/api/prices", {
            data,
            contentType: 'application/json',
            type: 'POST',
        })
            .done(function () {
                $("body").css("background", "none");
                // alert("Price posted " + price);
                $("body").css("background-color", "green");

                loadNext();
            })
            .fail(function () {
                // alert("Something went wrong");
                $("body").css("background", "none");

                $("body").css("background-color", "red");

            });
    }
}

var links = $("a");

var i = 0;
var requestspending = 0;

var getAbsoluteUrl = (function () {
    var a;

    return function (url) {
        if (!a) a = document.createElement('a');
        a.href = url;

        return a.href;
    };
})();

links.each(function () {
    i += 100;

    var link = $(this).attr("href");

    if (!link || link.includes("tel:") || link.includes("whatsapp:")
    || link.endsWith(".jpg") || link.endsWith(".png")) {
        return;
    }

    link = getAbsoluteUrl(link);

    var linkparts = link.split("#");
    link = linkparts[0];

    if (!link.includes("https://tri-slona.com/")) {
        return;
    }

    console.log(link);
    requestspending++;
    setTimeout(function () {
        $.ajax("http://localhost:3000/api/urls/safe", {
            data: JSON.stringify({
                url: link
            }),
            contentType: 'application/json',
            type: 'POST',
        });

        requestspending--;
    }, i);
});

function checkStatus() {
    if (!requestspending) {
        loadNextParsing();
    }
    else {
        setTimeout(checkStatus, 1000);
    }
}

function loadNextParsing() {
    $.ajax("http://localhost:3000/api/urls")
        .done(function (d) {
            console.log(d);

            var eligible = d.filter((x) => x.url.includes("https://tri-slona.com/") && !x.SCANNED_DT)

            var nexturl = eligible[0];

            console.log(nexturl);

            nexturl.SCANNED_DT = Date.now();

            $.ajax(`http://localhost:3000/api/urls/${nexturl.id}`, {
                data: JSON.stringify(nexturl),
                contentType: 'application/json',
                type: 'PUT',
            })
                .done(function () {
                    window.location = nexturl.url;
                })
                .fail(function (d) {
                    console.error(d);
                });
        })
        .fail(function () {
            // alert("Something went wrong");
            $("body").css("background", "none");

            $("body").css("background-color", "red");
        });
}

setTimeout(checkStatus, 3000);


setTimeout(function () {
    window.location = window.location;
}, 60 * 1000);