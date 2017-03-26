/**
 * Created by Brandon Young on 3/22/2017.
 * This script is used to generate the review content on any Americommerce/Spark Pay page. In order to use it you must
 * place a customHTML widget that has a div tag with an id of "reviews" on the page where you want the reviews to show.
 * In order to pass options to it you must pass them as attributes such as:
 * <div id="reviews" catid="23" qty="5" trim="350">
 * </div>
 * catid is the category id that you would like to see reviews for. If this is left out all categorys are used.
 * qty is the quantity of reviews that you want to see. If this is left out than all reviews are shown.
 * trim is the amount of characters to trim the review body to.
 */
$(function(){
	// This is where your domain goes
	var domain = "";
	// This is where your api key goes
	var apiKey = "";
	
    /**
     * The getURL function is used to get the URL to call the API. It ultimately calls the getReviews function.
     * @param numReviews: This is the number of reviews that you want displayed on the page. If this argument is left
     * out all of the reviews will be supplied.
     * *NOTE - This method is asynchronous
     * @param catID: The catID argument is the category ID of the products you want to show. If you use a parent category
     * it will show all items in sub-categories as well. If this is left out it will get the category ID from the
     * current category page. If the current page is not a category page it will get reviews from all product reviews.
     * @param trim: The amount of characters to trim the review body to
     */
    function getURL(numReviews, catID, trim) {
        //console.log("The number of reviews to show is " + numReviews);
        //console.log("The category ID is " + catID);
        var url = domain + "/api/v1/product_reviews";
        // If the catID is not given try to set it equal to the pages catID if possible
        if (catID === null) {
            catID = getCategoryID()
        } // end if
        // if category ID is given get specific reviews for that category if not get all reviews
        if (catID !== null) {
            $.ajax({
                url: domain + "/api/v1/categories/" + catID + "/products",
                headers: {
                    "X-AC-Auth-Token": apiKey,
                    "Content-Type": "application/json"
                },
                success: function (data) {
                    //console.log(data);
                    var productCount = data.total_count;
                    //console.log("The number of products in category " + catID + " is " + productCount);
                    // add product_id filter to URL
                    url += "?product_id=";
                    // Add the product ids that belong to the given category
                    for (var i = 0; i < productCount; i++) {
                        if (i < productCount - 1) {
                            url += data.products[i].id + "&";
                        } else {
                            url += data.products[i].id;
                        } // end if else
                    } // end for loop
                    //console.log("The url being called is " + url);
                    getReviews(url, numReviews, trim);
                }// end success
            });
        } else {
            getReviews(url, numReviews, trim)
        } // end if else
    }

    /**
     * The getReviews function calls the Spark Pay API with the given url in order to retrieve the reviews. This method
     * is called by the getURL function.
     * *NOTE - This method is asynchronous
     * @param url: The url to be called
     * @param num: The number of reviews to show on page
     * @param trim: The amount of characters to trim the review body to
     */
    function getReviews(url, num, trim) {
        $.ajax({
            url: url,
            headers: { "X-AC-Auth-Token": apiKey,
                "Content-Type": "application/json"  },
            success: function (object) {
                // get the number of reviews if num is not given
                if(num === null) {
                    num = object.product_reviews.length;
                } // end else
                // Start by setting the schema.org type to Review for SEO
                var html = '<div itemscope itemtype="http://schema.org/Review">';
                //console.log("Number of reviews to call: " + num);
                // loop through the reviews and output the specified amount of reviews
                for (var i = 0; i < num; i++) {
                    //console.log("the loop index is " + i);
                    // The Review Title
                    var title = object.product_reviews[i].title;
                    //console.log("The review title is " + title);
                    // The review body
                    var body = object["product_reviews"][i].body;
                    //trim the review body if trim amount given
                    if(trim !== null) {
                        body = trimText(body, trim);
                    } // end if
                    // The review author
                    var author = object["product_reviews"][i].author_display_name;
                    // The day it was created
                    var date = object["product_reviews"][i].created_at;
                    date = date.slice(0, 10);
                    // The number of stars
                    var rating = object["product_reviews"][i].overall_rating;
                    var starTag = '<img id="rpReviews_ctl24_rpRatings_ctl01_ctlRating_imgOne" src="/Shared/Themes/Spring/images/rated.png" style="border-width:0;" >';
                    var stars;
                    switch(rating) {
                        case 1:
                            stars = repeatTag(starTag, 1);
                            break;
                        case 2:
                            stars = repeatTag(starTag, 2);
                            break;
                        case 3:
                            stars = repeatTag(starTag, 3);
                            break;
                        case 4:
                            stars = repeatTag(starTag, 4);
                            break;
                        case 5:
                            stars = repeatTag(starTag, 5);
                            break;
                    } // end switch
                    // add title and schema.org markup
                    html = '<h3 class="reviewTitle">';
                    html += '<span itemprop="name">';
                    html +=  title;
                    html += '</span>';
                    html += '</h3>';
                    // add outer row to hold it all
                    html += '<div class="row">';
                    // add author
                    html += '<div class="col-xs-3"><p class="reviewAuthor">Author: <span itemprop="author">';
                    html += author;
                    html += '</span></p>';
                    // Add review rating for schema. This is hidden
                    html += '<div itemprop="reviewRating" itemscope itemtype="http://schema.org/Rating" class="hidden">';
                    html += '<meta itemprop="worstRating" content = "1">';
                    html += '<span itemprop="ratingValue">' + rating + '</span>';
                    html += '<meta itemprop="bestRating" content="5">';
                    html += '</div>';
                    // Add actual review stars for page
                    html += '<p class="reviewStars">Rating: ' + stars + '</p>';
                    // Add Review Date
                    html += '<p class="reviewDate">Date: ' + date + '</p><meta itemprop="datePublished" content=' + date + '>';
                    html += '</div><!-- .col-xs-3-->';
                    // add body
                    html += '<div class="col-xs-9"><span itemprop="reviewBody"><p class="reviewBody">';
                    html += body;
                    html += '</span></p></div><!--.col-xs-9 -->';
                    // Close row
                    html += '</div><!-- .row -->';
                    //console.log(data["product_reviews"][i].title);
                    // Append this review to #reviews
                    $('#reviews').append(html);
                } // end for loop
                // close the div that adds the schema for review
                html += '</div>';
            } // end success
        });
    }

    /**
     * The getCategoryID method obtains the category ID from the current category page. If the page is not a category
     * page then undefined is returned.
     * @returns {*}: The category ID for the current page or undefined.
     */
    function getCategoryID() {
        var category = $("body").attr('class');
        category = category.split(" ");
        category = category[2];
        // If the page is a category page
        if (category !== undefined) {
            // The category ID
            var categoryID = category.substr(9);
            //console.log("The category ID of the page is " + categoryID);
            return categoryID;
        }
        return null;
    } // end getCategoryID

    /**
     * The trimText function trims the given text to a given amount of characters and adds ... to the end.
     * This works like the Spark Pay ##TRIM[]## merge code.
     * @param text (String): The String of text that you want to be trimmed
     * @param amount (integer): The amount of characters to trim the text too.
     */
    function trimText(text, amount) {
        return text.slice(0, amount) + "...";
    } // end trimText()

    /**
     * The repeatTag is used to repeat a tag multiple time. This is to fix a problem caused by repeat not working in
     * Internet Explorer
     * @param tag: The tag to be repeated.
     * @param num: The number of times to be repeated.
     */
    function repeatTag(tag, num) {
        for(var index = 0; index < num; index++) {
            tag += tag;
        } // end for loop
    } // end repeatTag

    // Check if reviews are being called on the page
    if (document.getElementById("reviews") !== null) {
        // Get the attributes to use as the arguments
        var wrapper = document.getElementById("reviews");
        var categoryID = wrapper.getAttribute("catID");
        var quantity = wrapper.getAttribute("qty");
        var trimAmount = wrapper.getAttribute("trim");
        getURL(quantity, categoryID, trimAmount);
    } // end if
});