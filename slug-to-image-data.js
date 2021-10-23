const http = require('http');
const https = require('https');

const getJSON = async (options) => {
  return new Promise((accept, reject) => {
    const port = options.port == 443 ? https : http;

    let output = '';

    const req = port.request(options, (res) => {
      console.log(`${options.host} : ${res.statusCode}`);
      res.setEncoding('utf8');

      res.on('data', (chunk) => {
        output += chunk;
      });

      res.on('end', () => {
        let obj = JSON.parse(output);

        accept({
          status: req.statusCode,
          json: obj
        })
      });
    });

    req.on('error', (err) => {
      reject('error: ' + err.message);
    });

    req.end();
  });
};

const getPluginData = async (slug) => {
  console.log(`Plugin ${slug}`);
  const response = await getJSON({
    host: 'api.wordpress.org',
    port: 443,
    path: `/plugins/info/1.0/${slug}.json`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  console.log("Raw plugin data:", response);

  return {
    template: 'plugin',
    values: {
      title: response.json.name,
      description: 'TODO'
    }
  }
}

exports.slugToImageData = async (slug) => {
  await getPluginData(slug);
}
