import React, { Component } from "react";
import key from "weak-key";

class Details extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    text: {},
    loaded: false,
  };

  componentDidMount() {
    this.fetchText();
  }

  fetchText = () => {
    const url = '/api' + this.props.match.url;
    fetch(url)
    .then(response => response.json())
    .then(text => this.setState({ text: text, loaded: true }));
  }

  contentDetails = () => {
    const translations = this.state.text.translations.map(t => (
        <li key={key({t})}>
          {t.translation}
        </li>
    ))
    console.log(translations);

    return  (
      <div className="content">
        <h1 className="title">
          {this.state.text.text}
        </h1>
        <div className="content">
          <ol type="1">
            {translations}
          </ol>
        </div>
      </div>
      );
    }

  render() {
    console.log(this.state.text)
    return (
      <div className='container'>
        {this.state.loaded ? this.contentDetails() : null}
      </div>
    );
  }
}

export default Details;
