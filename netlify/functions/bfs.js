const fetch = require('node-fetch');
const cheerio = require('cheerio');

// The main handler function for the Netlify Function
exports.handler = async (event, context) => {
  try {
    const url = "https://fruityblox.com/stock";

    // 1. Fetch the HTML content, similar to cURL in PHP
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      // Set a 10-second timeout
      timeout: 10000, 
    });

    // Check if the request was successful
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: `Failed to fetch from source website. Status: ${response.statusText}`
        }),
      };
    }

    const html = await response.text();

    // 2. Parse the HTML using Cheerio, similar to DOMDocument in PHP
    const $ = cheerio.load(html);

    const normalStock = [];
    const mirageStock = [];

    // Find each fruit card div
    $('div.p-4.border').each((index, element) => {
      const card = $(element);

      // Extract data using Cheerio's jQuery-like selectors
      const fruit = card.find('h3').text().trim();
      const stockType = card.find('span.text-xs').text().trim();
      const prices = card.find('span.text-sm');

      // Safely get prices
      const cashPrice = $(prices[0]).text().trim() || null;
      const robuxPrice = $(prices[1]).text().trim() || null;

      const itemData = {
        fruit,
        cash: cashPrice,
        robux: robuxPrice,
      };

      // 3. Categorize the data
      if (stockType.includes('Normal')) {
        normalStock.push(itemData);
      } else if (stockType.includes('Mirage')) {
        mirageStock.push(itemData);
      }
    });

    // 4. Return the successful JSON response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allows cross-origin requests
      },
      body: JSON.stringify({
        normal: normalStock,
        mirage: mirageStock,
      }, null, 2), // Pretty-print the JSON
    };

  } catch (error) {
    // Catch any unexpected errors (e.g., network timeout)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'An internal error occurred.',
        details: error.message
      }),
    };
  }
};
