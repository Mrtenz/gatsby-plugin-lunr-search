# gatsby-plugin-lunr-search

A plugin for Gatsby to generate a search index that you can use with [Lunr](https://github.com/olivernn/lunr.js).

Inspired by [`gatsby-plugin-elasticlunr-search`](https://github.com/andrew-codes/gatsby-plugin-elasticlunr-search).

## Getting started

```bash
yarn add --dev lunr gatsby-plugin-lunr-search
```

### Usage

```js
// gatsby-config.js
plugins: [
  {
    resolve: 'gatsby-plugin-lunr-search',
    options: {
      // Lunr reference
      ref: 'id',
      
      // Fields to be indexed
      fields: ['title', 'description'],
      
      // Nodes to be indexed
      resolvers: {
        
        // Index all `MarkdownRemark` nodes
        MarkdownRemark: {
          id: node => node.id,
          title: node => node.frontmatter.title,
          description: node => node.frontmatter.description
        }
      }
    }
  }
]
```

Then you can query for the search index in your pages and components. The search index is a JSON string, so you have to parse the JSON.
```js
import React, { Component } from 'react';
import { Index } from 'lunr';
import { graphql } from 'gatsby';

export default class SomePage extends Component {
  state = {
    results: []
  };
  
  componentDidMount () {
    const { data } = this.props;
    const index = Index.load(JSON.parse(data.searchIndex.index));
    
    this.setState({
      results: index.search('query')
    });
  }
  
  render () {
    const { results } = this.state;
    if (results.length > 0) {
      return results.map(result => 
        <div key={result.ref}>Found {result.ref}</div>
      );
    }
    return <div>Could not find any results.</div>;
  }
}

const query = graphql`
  query SearchIndex {
    searchIndex {
      index
    }
  }
`;
```
