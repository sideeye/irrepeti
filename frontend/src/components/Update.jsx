import React, { Component } from "react";


class Update extends Component {
  constructor(props) {
    super(props);
    this.state = this.getText();
  }

  getText = () => {
    console.log('init', this.props);
  }

  render() {
    return (
      <h3>Requested Param: {this.props.match.params.id}</h3>
    );
  }
}

export default Update;
