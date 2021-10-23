const fetch = require('node-fetch');

exports.slugToImageData = async (slug) => {
  const response = await fetch(`https://api.wordpress.org/plugins/info/1.0/${slug}.json`);
  const data = await response.json();

  return {
    template: 'plugin',
    values: {
      title: data.name,
      description: 'TODO'
    }
  }
}
