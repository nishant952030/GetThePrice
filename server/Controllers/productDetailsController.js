
const puppeteer = require('puppeteer');
const { getAmazonProducts } = require('../helperFunctions/amazon');
const { getFlipkartProducts } = require('../helperFunctions/flipkart');

const getProduct = async (req, res) => {
    console.log(req.body);
    try {
        const { url } = req.body;
        let data;
        let browser;
        let finalAmazonData;
        let finalFlipkartData;

        if (!url.includes('flipkart') && !url.includes('amazon')) {
            data = {
                title: url,
                discountedPrice: null,
                price: null,
                isAmazon: true,
                isFlipkart: true
            }
        }
        else {
            browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2' });
            data = await page.evaluate(() => {
                if (location.hostname.includes('flipkart')) {
                    const titleElement = document.querySelector("#container>div>div:nth-child(3)>div>div:nth-child(2)>div:nth-child(2)>div");
                    const titlename = titleElement?.querySelector("div");
                    const discountedPrice = titleElement?.querySelector("div:nth-child(4)>div>div>div:nth-child(1)");
                    const price = titleElement?.querySelector("div:nth-child(4)>div>div>div:nth-child(2)");
                    return {
                        title: titlename ? titlename.innerText.trim() : null,
                        discountedPrice: discountedPrice ? discountedPrice.innerText.trim() : null,
                        originalPrice: price ? price.innerText.trim() : null,
                        isAmazon: true,
                        isFlipkart: false
                    };
                }

                else if (location.hostname.includes('amazon')) {
                    const title = document.getElementById('productTitle')?.innerText.trim() || null;
                    const price = document.querySelector('.basisPrice>span>span')?.innerText.trim() || null;
                    const discountedPrice = document.querySelector('.priceToPay')?.innerText.trim() || null;

                    return { title, discountedPrice, price, isAmazon: false, isFlipkart: true };
                }
                else { return { title: url, discountedPrice: null, price: null, isAmazon: true, isFlipkart: true } }
            });
            await browser.close();
        }

        if (data.isAmazon) {
            finalAmazonData = await getAmazonProducts({ title: data.title });
            // console.log("from main controller - Amazon", finalAmazonData);
        }

        if (data.isFlipkart) {
            finalFlipkartData = await getFlipkartProducts({ title: data.title });
            // console.log("from main controller - Flipkart", finalFlipkartData);
        }

        return res.json({
            originalProduct: data,
            amazonMatches: finalAmazonData || [],
            flipkartMatches: finalFlipkartData || []
        });

    } catch (error) {
        console.error('Error fetching the page:', error);
        res.status(500).json({ error: 'Error fetching the page' });
    }
};module.exports = {
    getProduct,
};