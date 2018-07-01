const crypto = require('crypto');
const lunr = require('lunr');

const builder = new lunr.Builder();

module.exports.onPreBootstrap = (actions, { ref = 'id', fields }) => {
  builder.ref(ref);
  fields.forEach(field => builder.field(field));
};

module.exports.onCreateNode = ({ node }, { nodes: resolvers }) => {
  const resolver = resolvers[node.internal.type];
  if (!resolver) {
    return;
  }

  const parsedNode = Object.keys(resolver).reduce((target, current) => {
    target[current] = resolver[current](node);
    return target;
  }, {});

  builder.add(parsedNode);
};

module.exports.onPreExtractQueries = ({ actions, createNodeId }) => {
  const json = JSON.stringify(builder.build().toJSON());

  const node = {
    index: json,
    id: createNodeId('search-index'),
    parent: null,
    children: [],
    internal: {
      type: 'SearchIndex',
      content: json,
      contentDigest: crypto
        .createHash('md5')
        .update(json)
        .digest('hex')
    }
  };

  actions.createNode(node);
};
