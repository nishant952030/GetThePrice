const puppeteer = require("puppeteer");

function calculateCosineSimilarity(str1, str2) {
    const words1 = str1.toLowerCase().split(/\W+/);
    const words2 = str2.toLowerCase().split(/\W+/);

    const wordSet = new Set([...words1, ...words2]);
    const vector1 = Array.from(wordSet).map(word => words1.filter(w => w === word).length);
    const vector2 = Array.from(wordSet).map(word => words2.filter(w => w === word).length);

    const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
    const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));

    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    return dotProduct / (magnitude1 * magnitude2);
}

const matchTheTitle = async (datas, title) => {
    const targetTitle = title;
    const scores = datas.map(data => ({
        ...data,
        score: calculateCosineSimilarity(targetTitle, data.title)
    }));

    const bestMatch = scores.reduce((max, item) => (item.score > max.score ? item : max),
        { score: -1, title: '', discountedPrice: '', originalPrice: '' });

    // console.log("Best match:", bestMatch);
    return {
        title: bestMatch.title,
        score: bestMatch.score,
        discountedPrice: bestMatch.discountedPrice,
        originalPrice: bestMatch.originalPrice,
        priceDetails: {
            current: parseFloat(bestMatch.discountedPrice) || 0,
            original: parseFloat(bestMatch.originalPrice) || 0,
            discount: calculateDiscount(bestMatch.originalPrice, bestMatch.discountedPrice)
        }
    };
};
function calculateDiscount(originalPrice, discountedPrice) {
    const original = parseFloat(originalPrice);
    const discounted = parseFloat(discountedPrice);

    if (!original || !discounted || original <= discounted) return 0;

    const discount = ((original - discounted) / original) * 100;
    return Math.round(discount * 100) / 100; // Round to 2 decimal places
}

const getAmazonProducts = async ({ title }) => {
    const wordsArray = title
        .replace(/[|&-]/g, "")
        .split(" ")
        .filter(word => word !== "");
    let searchUrl = "https://www.amazon.in/s?k=" + wordsArray.join("+");
    console.log("Search URL:", searchUrl);

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
    });

    try {
        const page = await browser.newPage();
        await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });

        const data = await page.evaluate(() => {
            const products = [];
            const mainContainers = document.querySelectorAll('[data-component-type="s-search-result"]');

            mainContainers.forEach(container => {
                const titleElement = container.querySelector('h2 span.a-text-normal');
                const discountedPriceElement = container.querySelector('.a-price-whole');
                const originalPriceElement = container.querySelector('.a-text-price span.a-offscreen');

                if (titleElement && discountedPriceElement) {
                    products.push({
                        title: titleElement.textContent.trim(),
                        discountedPrice: discountedPriceElement.textContent.replace(/[₹,]/g, "").trim(),
                        originalPrice: originalPriceElement
                            ? originalPriceElement.textContent.replace(/[₹,]/g, "").trim()
                            : discountedPriceElement.textContent.replace(/[₹,]/g, "").trim()
                    });
                }
            });

            return products;
        });

        const matchResult = await matchTheTitle(data, title);
        console.log("Best match:", matchResult);
        return {
            products: data,
            bestMatch: matchResult,
            summary: {
                totalProducts: data.length,
                searchQuery: title,
                matchScore: matchResult.score,
                bestPrice: matchResult.priceDetails.current,
                savings: matchResult.priceDetails.discount > 0
                    ? `${matchResult.priceDetails.discount}% off`
                    : 'No discount'
            }
        };
    } catch (error) {
        console.error("Error during scraping:", error);
        throw error;
    } finally {
        await browser.close();
    }
};

module.exports = { getAmazonProducts };