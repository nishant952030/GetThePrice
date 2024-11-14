const puppeteer = require("puppeteer");

const getFlipkartProducts = async ({ title }) => {
    const searchUrl = "https://www.flipkart.com/search?q=" + title.replace(/\s+/g, "+");
    console.log("Search URL:", searchUrl);

    const browser = await puppeteer.launch({
        headless: false,  // Set to false for debugging
        defaultViewport: null
    });

    try {
        const page = await browser.newPage();
        await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });

        const data = await page.evaluate(() => {
            const products = [];

            // Get all main containers
            const elements = document.querySelectorAll('#container>div>div:nth-child(3)>div>div:nth-child(2)>div:not(:first-child)');
            console.log("Found main containers:", elements.length);

            elements.forEach((element, idx) => {
                // Get all product rows using the correct class
                const productRows = element.querySelectorAll('div.cPHDOP.col-12-12');
                console.log(`Found ${productRows.length} products in container ${idx}`);

                productRows.forEach(row => {
                    try {
                        // Using the updated class names
                        const titleElement = row.querySelector('div.KzDlHZ');
                        const priceElement = row.querySelector('div.Nx9bqj');
                        const originalPriceElement = row.querySelector('div.yRaY8j');

                        if (titleElement) {
                            const product = {
                                title: titleElement.textContent.trim(),
                                currentPrice: priceElement ? priceElement.textContent.trim() : null,
                                originalPrice: originalPriceElement ? originalPriceElement.textContent.trim() : null,
                                rawHtml: row.innerHTML  // Adding this for debugging
                            };
                            console.log("Found product:", product);
                            products.push(product);
                        }
                    } catch (error) {
                        console.error("Error processing row:", error);
                    }
                });
            });

            return products;
        });

        console.log("Total products found:", data.length);
        console.log("Products:", data);

        return data;

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await browser.close();
    }
};

module.exports = { getFlipkartProducts };