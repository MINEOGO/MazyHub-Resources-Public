const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.handler = async (event, context) => {
  try {
    const url = "https://fruityblox.com/stock";

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000,
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          status: "error",
          message: `Failed to fetch from source website. Status: ${response.statusText}`
        }),
      };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const normalStock = [];
    const mirageStock = [];

    $('div.p-4.border').each((index, element) => {
      const card = $(element);

      const fruit = card.find('h3').text().trim();
      const stockType = card.find('span.text-xs').text().trim();
      const prices = card.find('span.text-sm');

      const cashPrice = $(prices[0]).text().trim() || null;
      const robuxPrice = $(prices[1]).text().trim() || null;

      const itemData = {
        fruit,
        cash: cashPrice,
        robux: robuxPrice,
      };

      if (stockType.includes('Normal')) {
        normalStock.push(itemData);
      } else if (stockType.includes('Mirage')) {
        mirageStock.push(itemData);
      }
    });

    // ✅ Success / error handling
    if (normalStock.length === 0 && mirageStock.length === 0) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          status: "error",
          message: "No valid stock data was found."
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        status: "success",
        normal: normalStock,
        mirage: mirageStock,
      }, null, 2),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: "error",
        message: "An internal error occurred.",
        details: error.message
      }),
    };
  }
};
