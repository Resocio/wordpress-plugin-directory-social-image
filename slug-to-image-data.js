const https = require('https');

const wordPressApiRequest = async (path) => {
  const options = {
    host: 'api.wordpress.org',
    port: 443,
    path,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return new Promise((accept, reject) => {
    let output = '';

    const req = https.request(options, (res) => {
      res.setEncoding('utf8');

      res.on('data', (chunk) => {
        output += chunk;
      });

      res.on('end', () => accept(JSON.parse(output)));
    });

    req.on('error', (err) => {
      reject('error: ' + err.message);
    });

    req.end();
  });
};

const getPluginData = async (slug) => {
  const plugin = await wordPressApiRequest(`/plugins/info/1.0/${slug}.json`);

  const translations = await wordPressApiRequest(
    `/translations/plugins/1.0/?slug=${slug}&version=${plugin.version}`
  );

  const author = plugin.author_profile.split('/').pop();
  const search = await wordPressApiRequest(
    `/plugins/info/1.2/?action=query_plugins&request[author]=${author}`
  );
  let shortDescription = null;
  let logoUrl = null;
  let installs = null;
  search.plugins.forEach(p => {
    if (p.slug === slug) {
      shortDescription = p.short_description;
      logoUrl = p.icons['1x'];
      installs = p.active_installs;
    }
  })

  return {
    template: 'plugin',
    values: {
      title: plugin.name,
      description: shortDescription,
      logoUrl,
      contributors: plugin.contributors.length,
      locales: translations.translations.length,
      rating: plugin.rating / 20,
      installs: installs
    }
  }
}

exports.slugToImageData = async (slug) => (
  await getPluginData(slug)
);
