import React, { Component } from "react";
import key from "weak-key";
import Cookies from "js-cookie";
import {cloneDeep} from "lodash";


class RepetitionResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
  }

  content = () => {
    if (this.props.repResults.length) {
      const repResultsRows = this.props.repResults.map(rr => {
        const delta = new Date(rr.repeat_next) - new Date(rr.repeat_last)
        return (
          <tr key={key(rr)}>
            <td>
              <a href={rr.url.replace("/api", "")}>{rr.text}</a>
            </td>
            <td>
              {rr.repeat_level == 0 ? "1 day" : delta/(1000*60*60*24) +" days"}
            </td>
            <td className="has-text-right">
              {new Date(rr.repeat_next).toDateString()}
            </td>
          </tr>
        );
      });
      return (
        <table className="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>Words</th>
              <th>Repeat after</th>
              <th className="has-text-right">Repeat Date</th>
            </tr>
          </thead>
          <tbody>
            {repResultsRows}
          </tbody>
        </table>
      );    
    } else {
      return null;
    }
  }

  render () {
    return (
      <React.Fragment>
        {this.content()}
      </React.Fragment>
    )
  }
}


class Repeater extends Component {

  state = {
    rDict: [],
    recalls: [],
    trnslVisible: false,
    loaded: false,
    textRecallStatus: true,
    repResults: [],
    repComplete: false
  }

  cardIndex = 0;

  componentDidMount() {
    this.fetchDict();
  }

  componentDidUpdate () {
    if (this.state.recalls.length == this.state.rDict.length && this.state.repComplete) this.sendRecalls();
  }
  
  fetchDict = () => {
    fetch('/api/repetition/')
    .then(response => response.json())
    .then(dict => {
      this.setState({rDict: dict, loaded: true})
    })
    .catch(err => console.log(err));
  }

  performRecall = (e, isRec) => {
    this.setState({trnslVisible: true, textRecallStatus: isRec});
   }

   onNext = (e) => {
    const trs = this.state.textRecallStatus;
    const currentCard = this.state.rDict[this.cardIndex];
    const repeat_level = trs ? currentCard.repeat_level + 1 : currentCard.repeat_level - 1;
    const r = {url: currentCard.url, text: currentCard.text, repeat_level: repeat_level};
    const recalls = [r, ...this.state.recalls];
    var repComplete = this.state.repComplete;
    if (recalls.length == this.state.rDict.length ) {
      repComplete = true;
    }
    this.setState({recalls:recalls, trnslVisible: false, repComplete: repComplete});
    if (this.cardIndex < this.state.rDict.length - 1) this.cardIndex += 1;
   }

   sendRecalls = () => {
    const csrftoken = Cookies.get('csrftoken');
    const conf = {
      method: "put",
      body: '',
      headers: new Headers({ "Content-Type": "application/json", "X-CSRFToken": csrftoken }),
    };

    const recalls = cloneDeep(this.state.recalls);
    Promise.all(recalls.map(r => {
      conf.body = JSON.stringify({text: r.text, repeat_level: r.repeat_level});
      const resp = fetch(r.url, conf)
      .then(response => response.json())
      .catch(err => console.log(err)); 
      return resp;     
      }))
    .then(response => {
      this.setState({repResults: response, recalls: []})
    });    
  }

  cardContent = () => {
    const card = this.state.rDict[this.cardIndex];
    const translations = card.translations.map((t, i) => {
      return (
        <li key={key({t})}>
          {i+1}. {t.translation}
        </li>
      )
    });
    
    var trnsList;
    if (this.state.trnslVisible) {
      trnsList = (
        <div>
          <ul>
            {translations}
          </ul>
        </div>
      );
    } else {
      trnsList = null;
    }
    
    return (
      <div>
        <h1 className="title">
          {this.state.rDict.length ? card.text : null}
        </h1>      
          {this.state.rDict.length ? trnsList : null}
      </div>
    );
  }

  card = () => {
    const style = {'marginRight': '.5rem', 'marginBottom': '.5rem', 'marginTop':'1rem'};
    const remButtonCN = this.state.textRecallStatus && this.state.trnslVisible ? 'button is-success': 'button'
    const dontRemButtonCN = !this.state.textRecallStatus && this.state.trnslVisible ? 'button is-success' : 'button'
    if (this.state.rDict.length) {
      return (
        <React.Fragment>
          {this.state.rDict.length ? this.cardContent() : null}
          <a className={remButtonCN} style={style} onClick={(e) => this.performRecall(e, true)}>Remember</a>
          <a className={dontRemButtonCN} style={style} onClick={(e) => this.performRecall(e, false)}>Don't Remember</a>
          {this.state.trnslVisible ? 
          <a className="button" style={style} onClick={(e) => this.onNext(e)}>Next</a> : null}
        </React.Fragment>
      )
    } else if (this.state.loaded) {
      return (
        <React.Fragment>
          No words to repeat.
        </React.Fragment>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className="columns is-centered has-text-centered">
        <div className="column is-half">
          <div className="box">
            {this.state.repComplete ? <RepetitionResults repResults={this.state.repResults} /> : this.card() }
          </div>
        </div>
      </div>
    )
  }
}


export default Repeater;
