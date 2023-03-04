
function run() {
    var outofstockel = $("div:contains('Нет в продаже')").eq(0);

    console.log(outofstockel);

    var primarypriceel = $("span[data-auto='mainPrice'] span:first-child").eq(0);
    var secondarypriceels = $("a[data-zone-name='offerLink'] span[data-auto='mainPrice'] span:first-child");

    var sellerel = $("a[data-zone-name='offerLink'] span").eq(0);
    var seller = "unknown";
    var secondarysellerels =
        $("div[data-zone-name='shopName'] a");

    var nameel = $("h1[data-baobab-name='$name']").eq(0);
    var goodname = "unknown";

    var ratingel = $("[data-auto='rating-badge-value']").eq(0);
    var rating = 0;

    var reviewsel = $("div[data-zone-name='reviews-toolbar'] a");
    var reviewsel2 = $("div[data-auto='rating-badge'] a:contains('отзыв')");

    var reviews = 0;
    var price = undefined;

    if (primarypriceel.length || outofstockel.length) {
        var url = window.location + "";
        var urlsplit = url.split("?");

        var mainurl = urlsplit[0];

        if (mainurl.includes("product--")) {
            if (primarypriceel.length) {
                price = primarypriceel.text().replace(" ", "");
            }

            var urlparts = mainurl.split("/");

            var model = urlparts[urlparts.length - 1];

            if (sellerel.length) {
                seller = sellerel.text();
            }

            if (nameel.length) {
                goodname = nameel.text();
            }

            if (reviewsel.length) {
                try {
                    reviews = Number.parseInt(reviewsel.text() || reviewsel.textContent);
                }
                catch (e) {
                    console.error(e);
                    reviews = 0;
                }
            }
            if (!reviews && reviewsel2.length) {
                try {
                    reviews = Number.parseInt(reviewsel2.text() || reviewsel2.textContent);
                }
                catch (e) {
                    console.error(e);
                    reviews = 0;
                }
            }

            if (ratingel.length) {
                try {
                    rating = Number.parseFloat(ratingel.text());
                }
                catch (e) {
                    console.error(e);
                    rating = 0;
                }
            }

            var inStock = 1;

            if (outofstockel.length) {
                inStock = 0;
            }

            var data = {
                url: mainurl,
                model,
                seller,
                name: goodname,
                rating,
                reviews,
                topOffer: 1,
                inStock,
                source: 'market.yandex'
            };

            if (price) { data.price = price; }

            if (secondarypriceels.length && secondarysellerels.length) {
                for (var i = 0; i < secondarysellerels.length; i++) {
                    var price2 = secondarypriceels.eq(i).text().replace(" ", "");
                    var seller2 = secondarysellerels.eq(i).text();

                    var data2 = Object.assign({}, data);
                    data2.price = price2;
                    data2.seller = seller2;
                    data2.topOffer = 0;

                    console.log(data2);

                    $.ajax("http://localhost:3000/api/prices", {
                        data: JSON.stringify(data2),
                        contentType: 'application/json',
                        type: 'POST',
                    })
                }
            }

            console.log(data);

            $.ajax("http://localhost:3000/api/prices", {
                data: JSON.stringify(data),
                contentType: 'application/json',
                type: 'POST',
            })
                .done(function () {
                    // alert("Price posted " + price);
                    $("body").css("background-color", "green");

                    loadNext();
                })
                .fail(function () {
                    // alert("Something went wrong");
                    $("body").css("background-color", "red");

                });
        }
    }

}

$(function () {
    setTimeout(run, 1000);
})