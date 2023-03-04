function run() {
    var outofstockel = $(".out-of-stock").eq(0);

    var primarypriceel = $("meta[itemprop='price']").eq(0);

    var sellerel = $("a.pdp-offer-block__merchant-link").eq(0);
    var seller = "";

    var nameel = $(".pdp-header__subtitle").eq(0);
    var nameel2 = $("pdp-header__title").eq(0);

    var goodname = "";

    var categoryel = $("span.categories__category-item_title").eq(0);
    var category = "";

    var ratingel = $(".reviews-scores__average-title").eq(0);
    var rating = 0;

    var reviewsel = $(".reviews-rating__reviews-count").eq(0);
    var reviews = 0;

    if (primarypriceel.length || outofstockel.length) {
        var url = window.location + "";
        var urlsplit = url.split("?");

        var mainurl = urlsplit[0];

        if (mainurl.endsWith("#")) {
            mainurl = mainurl.slice(0, mainurl.length - 1);
        }

        if (mainurl.endsWith("/")) {
            mainurl = mainurl.slice(0, mainurl.length - 1);
        }

        if (mainurl.includes("catalog/details/")) {
            var data = {
                topOffer: 1,
                source: 'sbermegamarket',
                url: mainurl,
            };

            if (primarypriceel.length) {
                data.price = primarypriceel.attr("content").replace(" ", "");
            }

            var urlparts = mainurl.split("-");

            var model = urlparts[urlparts.length - 1].replace("/", "");
            if (model) {
                data.model = model;
            }

            if (sellerel.length) {
                data.seller = sellerel.text();
            }

            if (nameel.length) {
                data.name = nameel.text();
            }
            else if (nameel2.length) {
                data.name = nameel2.text();
            }

            if (categoryel.length) {
                data.category = categoryel.text();
            }

            if (reviewsel.length) {
                try {
                    data.reviews = Number.parseInt(reviewsel.text().split(" ")[0]);
                }
                catch (e) {
                    console.error(e);
                    data.reviews = 0;
                }
            }

            if (ratingel.length) {
                try {
                    data.rating = Number.parseFloat(ratingel.text().split(" ")[1]);
                }
                catch (e) {
                    console.error(e);
                    data.rating = 0;
                }
            }

            data.inStock = 1;

            if (outofstockel.length) {
                data.inStock = 0;
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
    else {
        // alert("No price tag found");
    }
}

setTimeout(run, 1000);
