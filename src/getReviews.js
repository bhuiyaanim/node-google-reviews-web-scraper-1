const puppeteer  = require('puppeteer');

// const getReviews = async (url, output = "json") => {
//     output = output.toLowerCase();
//     if (output != "json" && output != "object") {
//         console.error('INVALID OUTPUT OPTION');
//         return;
//     }
//     console.log('Launching headless chrome...');
//     url = url.toString();
//     const browser = await puppeteer.launch({args: ['--disabled-setuid-sandbox', '--no-sandbox']});
//     const page = await browser.newPage();
//     console.log('going to url');
//     await page.goto(url);
//     console.log(page.url);
//     console.log('waiting for selector');
//     await page.goto('YOUR_GOOGLE_MAPS_URL');
//     await page.waitForNavigation({ waitUntil: 'networkidle2' }); // Waits for the network to be idle
//     console.log('waiting for selector 2');
//     await page.waitForSelector('.section-review-text', { timeout: 60000 });

//     // await page.waitForSelector('.section-review-text');
//     console.log('it\'s here ! now loop through data...')
//     const data = await page.evaluate(() => {
//         let reviewAuthorNamesClasses = document.getElementsByClassName('section-review-title');
//         let reviewAuthorNames = [];
//         for (let elements of reviewAuthorNamesClasses) {
//             reviewAuthorNames.push(elements.innerText);
//         }
//         let datesClasses = document.getElementsByClassName('section-review-publish-date');
//         let dates = [];
//         for(let elements of datesClasses) {
//             dates.push(elements.innerText);
//         }

//         let ratingsClasses = document.getElementsByClassName('section-review-stars');
//         let ratings = [];
//         for (let elements of ratingsClasses) {
//             ratings.push(elements.children.length);
//         }

//         let reviewsContentClasses = document.getElementsByClassName('section-review-text');
//         let reviewsContent = []
//         for(let elements of reviewsContentClasses) {
//             reviewsContent.push(elements.innerText);
//         }
//         return {
//             reviewAuthorNames,
//             dates,
//             ratings,
//             reviewsContent
//         }
//     })
//     console.log('done ! closing browser...')
//     browser.close();
//     console.log(data);
//     return new Promise((resolve, reject) => {
//         if(output === "json") {
//             resolve(JSON.stringify(data));
//         } else if(output === "object") {
//             resolve(data);
//         }
//         if(reject) {
//             reject({error: "error while scraping data."})
//         }
//     })
    
// };

const getReviews = async (url, output = "json") => {
    output = output.toLowerCase();
    if (output !== "json" && output !== "object") {
        console.error('INVALID OUTPUT OPTION');
        return;
    }

    console.log('Launching headless chrome...');
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    try {
        console.log('Navigating to:', url);
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url; // Adjust protocol as necessary
        }
        await page.goto(url);

        await page.waitForSelector('.section-listbox', { timeout: 120000 });
        console.log('it\'s here ! now loop through data...')

        // const data = await page.evaluate(() => {
        //     let reviewAuthorNames = Array.from(document.querySelectorAll('.section-review-title')).map(el => el.innerText.trim());
        //     let dates = Array.from(document.querySelectorAll('.section-review-publish-date')).map(el => el.innerText.trim());
        //     let ratings = Array.from(document.querySelectorAll('.section-review-stars')).map(el => el.querySelector('.section-review-star-active').getAttribute('aria-label').replace(' stars', ''));
        //     let reviewsContent = Array.from(document.querySelectorAll('.section-review-text')).map(el => el.innerText.trim());

        //     return {
        //         reviewAuthorNames,
        //         dates,
        //         ratings,
        //         reviewsContent
        //     };
        // });

        // console.log('Reviews data:', data);
        // return output === "json" ? JSON.stringify(data) : data;


        const data = await page.evaluate(() => {
            let reviewAuthorNamesClasses = document.getElementsByClassName('section-review-title');
            let reviewAuthorNames = [];
            for (let elements of reviewAuthorNamesClasses) {
                reviewAuthorNames.push(elements.innerText);
            }
            let datesClasses = document.getElementsByClassName('section-review-publish-date');
            let dates = [];
            for(let elements of datesClasses) {
                dates.push(elements.innerText);
            }
    
            let ratingsClasses = document.getElementsByClassName('section-review-stars');
            let ratings = [];
            for (let elements of ratingsClasses) {
                ratings.push(elements.children.length);
            }
    
            let reviewsContentClasses = document.getElementsByClassName('section-review-text');
            let reviewsContent = []
            for(let elements of reviewsContentClasses) {
                reviewsContent.push(elements.innerText);
            }
            return {
                reviewAuthorNames,
                dates,
                ratings,
                reviewsContent
            }
        })
        console.log('done ! closing browser...')
        browser.close();
        console.log(data);
        return new Promise((resolve, reject) => {
            if(output === "json") {
                resolve(JSON.stringify(data));
            } else if(output === "object") {
                resolve(data);
            }
            if(reject) {
                reject({error: "error while scraping data."})
            }
        })

    } catch (error) {
        console.error('Error occurred while scraping:', error.message);
    } finally {
        await browser.close();
    }
};

module.exports = getReviews;