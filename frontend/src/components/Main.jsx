import React, { Component } from 'react';
import Form from './AddText';
import DictionaryTable from './Dictionary';


export default class Main extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    dictionary: [{text:'', translations: []}],
    endpoint: "api/texts/",
    loaded: false,
  };
  
  componentDidMount() {
    this.fetchDictionary();
  }

  fetchDictionary = () => {
    fetch(this.state.endpoint)
    .then(response => response.json())
    .then(dictionary => this.setState({ dictionary: dictionary, loaded: true }));
  }

  render() {
    return (
      <div>
        <div>
          <Form onSave={this.fetchDictionary} endpoint={this.state.endpoint} />
          {this.state.loaded ? <DictionaryTable dictionary={this.state.dictionary}/> : null}
        </div>
      </div>
    )
  }
}
