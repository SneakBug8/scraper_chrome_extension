# Chrome Extension: Web Scraper

In some cases it is not feasible to scrape a website having a defense as sophisticated as Amazon or Yandex does even with Selenium. In this cases, I propose for you a solution: a fully automated Chrome-browser worker scrapping web pages, sending results to an external API and fetching a new URL to open from there.

As of now, several websites are supported:
- market.yandex.ru
- sbermegamarket.ru/
- tri-slona.com

With this approach, I was able to parse as much as 800 pages in an hour in a single browser window with no CAPTCHA ever asked. It's perfect for cheap small-volume regular data gathering. For example, if you check competitors on goods you sell yourself.