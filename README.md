# SparkPayReviews
This program is used to call product reviews on any Spark Pay webpage using the Spark Pay API. Currently you can only call the reviews on the product pages. This makes it a lot easier to call reviews on other pages now!

## Setup
In order to use this program it is assumed you already have a Spark Pay Online Store account and access to the admin console. From the admin console you can set up a custom application, which is necessary for using the API. 
1. Setup a new application in the Admin console by going to **Tools > Apps & Addons > API Apps & Integrations** in the admin console. Give your app a name and description, choose **Single Token Flow**, and select **View catalog data** as your permission. This step will generate an access token which is necessary to continue.
1. Open reviews.js in a text editor and set the variable apiKey equal to your newly generated access token. Set the variable domain equal to your stores domain name. This must be the https version of your domain. If your ssh certificate is provided by Spark Pay use that URL.
1. Save reviews.js with your new variables and place it in your website directory.
1. Link to reviews.js in the footer of your website

## Putting it to use
In order to use the custom reviews script you must place a div tag in the page where you would like them to show up like this: 


```<div id="reviews" catID="23" qty="6" trim="350">```

```</div>```

The **catID** attribute is used to select the category ID of the products that you want to see reviews for. This is an optional argument. If it is left out the script will find the category ID of the current page and use that instead. If the page is not a category page then the script will call all reviews.

The **qty** attribute is used to select the amount of reviews to be shown. This is also an optional argument. If this is left out then all reviews for the given category will be shown. 

The **trim** attribute will trim the review body to the specified amount of characters and then add ... to the end. This option is also optional and if it is left out the full review body will be shown.

## Important Notes:
- The `id="reviews"` is not optional and must be there to call the script.
- The **catID**, **qty**, and **trim** attributes can be used in any combination you would like and put in any order. It is important that they are spelled correctly.
- The elements can be styled differently by changing the css of their classes. The classes are reviewBody for the body text, reviewAuthor for the author, reviewTitle for the title, reviewDate for the date, and reviewStars for the stars.
