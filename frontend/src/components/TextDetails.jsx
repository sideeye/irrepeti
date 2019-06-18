import React, { Component } from "react";
import key from "weak-key";
import Cookies from "js-cookie";
import {cloneDeep} from "lodash";

const TranslationList = ({translations}) => {
  var content;
  if (translations && translations.length) {
    const transList = translations.map(t => (
      <li key={key({t})}>
        {t.translation}
      </li>
    ))

    content = (
      <div>          
        <div className="content">
          <ol type="1">
            {transList}
          </ol>
        </div>
      </div>
    );
  } else {
    content = 'Not found';
  }


  return (
    <div className="content">
      {content}
    </div>
  );
}


const UpdateList = (props) => {
  const suggestedTranslations = props.translations.map((st, index)=>{
    return (
      <li key={key({st})} >
        <label className='checkbox' >
          <input 
            type="checkbox"
            checked={st.checked}
            onChange={(e) => props.onCheck(e, index)}
            value={st.translation}
          />
          {st.translation}  
        </label>      
      </li>
    )}
  );

  const customInput = (
    <div>
      <div className='field has-addons'>
        <div className="control">
          <input
            id='customTranlsationInput'
            className='input'
            type="text"
            name="customTranlsationInput"
            onChange={props.handleChange}
            value={props.customTranlsationInput}
          />
        </div>
        <div className="control">
          <a className='button is-primary' onClick={props.saveCustomTranslation}>
            Save
          </a>
        </div>
      </div>
      <button type="submit" className='button is-primary'>
        Update Translations
      </button>
    </div>
  );

  return (
    <div className="content">
      <form onSubmit={props.handleSubmit}>        
          <ol>
            {suggestedTranslations}
          </ol>
          {customInput}
      </form>
    </div>
  )
}
  

class Details extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    text: {},
    endpointText: '/api' + this.props.match.url,
    translations: [],
    loaded: false,
    customTranlsationInput: '',
  };

  reset = () => {
    this.setState({
      translations: [],
      loaded: false,
    })
  }

  componentDidMount() {
    this.fetchText();
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  fetchText = () => {
    fetch(this.state.endpointText)
    .then(response => response.json())
    .then(text => {
      text.translations = sortT(text.translations);
      this.setState({ text: text, loaded: true })
    });
  }

  deleteText = (e) => {
    const csrftoken = Cookies.get('csrftoken');
    const conf = {
      method: "delete",
      headers: new Headers({ "Content-Type": "application/json", "X-CSRFToken": csrftoken }),
    };
    fetch(this.state.endpointText, conf)
    .then(() => window.location.href = '/')
  }

  getTranslation = e => {
    e.preventDefault();

    const url = new URL('api/yatranslate', window.location.origin);
    const params = {
      text: this.state.text.text,
      force_update: true
    }
    url.search = new URLSearchParams(params)

    const conf = {
      method: "get",
      headers: new Headers(),
    };

    fetch(url, conf)
    .then(response => response.json())
    .then(response => JSON.parse(response.translations))
    .then(this.setTranslationsCheckBox)
  }
  
  setTranslationsCheckBox = (translations) => {
    //Set checked on translations that are already exist
    const trExisted = new Set(cloneDeep(this.state.text.translations.map(t => t.translation)));
    const trCheckList = sortT(cloneDeep(translations));

    trCheckList.map(tcl => {
      if (trExisted.has(tcl.translation)) {
        tcl.checked = true;
        trExisted.delete(tcl.translation);
      }
      return tcl;
    });

    //Now trExisted contain only custom translations inputed previously
    for (let te of trExisted) trCheckList.push({'translation': te, 'checked': true});

    this.setState({translations: trCheckList});
  }

  handleCheckboxChange = (e, index) => {
    e.preventDefault();
    const translations = cloneDeep(this.state.translations);
    if (translations[index].checked) {
      translations[index].checked = false;
    } else {
      translations[index].checked = true 
    };
    this.setState({translations: translations});
  }  

  saveCustomTranslation = (e) => {
    e.preventDefault();
    const translations = cloneDeep(this.state.translations);
    translations.push({translation: this.state.customTranlsationInput, checked: true});
    this.setState({translations: translations, customTranlsationInput: ""});
  }

  handleSubmit = e => {
    e.preventDefault();
    const { text, translations, customTranlsationInput } = this.state;
    
    const trnslToSave = cloneDeep(translations.filter(tr => tr.checked));
    const trnslExisted = cloneDeep(text.translations);
    
    const trnslToSaveSet = new Set(trnslToSave.map(tts => tts.translation));
    const trnslExistedSet = new Set(trnslExisted.map(te => te.translation));
    
    const trnslToSaveCommitSet = difference(trnslToSaveSet, trnslExistedSet);
    const trnslToDelSet = difference(trnslExistedSet, trnslToSaveSet);

    const trnslToSaveNew = trnslToSave.filter(tts => trnslToSaveCommitSet.has(tts.translation))
    const trnslToDel = trnslExisted.filter(te => trnslToDelSet.has(te.translation))    

    console.log('translations=', translations)
    console.log('trnslExisted=', trnslExisted)
    console.log('trnslExistedSet=', trnslExistedSet)
    console.log('trnslToSave=', trnslToSave)
    console.log('trnslToSaveSet=', trnslToSaveSet)
    console.log('trnslToDel=', trnslToDel)
    console.log('trnslToSaveNew=', trnslToSaveNew)

    if (trnslToSave.length == 0) {
      this.getTranslation(e);
    } else if (customTranlsationInput) {
      this.saveCustomTranslation(e);
    } else if ( document.activeElement.id == 'customTranlsationInput' && !customTranlsationInput) {
    } else {
      const csrftoken = Cookies.get('csrftoken');
      
      //Delete translations
      const confDel = {
        method: "delete",
        headers: new Headers({ "Content-Type": "application/json", "X-CSRFToken": csrftoken }),
      };

      trnslToDel.forEach(ttd => {
        fetch(ttd.url, confDel)
        .then(response => console.log('response_ondelete=', response))
      });

      //Save only new translations
      const note = {
        'text': text.text,
        translationsSelected: trnslToSaveNew
      };   
      
      const conf = {
        method: "put",
        body: JSON.stringify(note),
        headers: new Headers({ "Content-Type": "application/json", "X-CSRFToken": csrftoken }),
      };

      fetch(this.state.endpointText, conf)
      .then(response => console.log('response=', response))
      .then(this.reset).then(this.fetchText);
    }
  };

  render() {
    const loaded = this.state.loaded;
    const updating = this.state.translations.length;

    return (      
      <div className='container'>
        <h1 className="title">
          {this.state.text.text}
        </h1>
        {loaded && !updating ? 
          <TranslationList translations={this.state.text.translations} /> : 
          null}
        {loaded && updating ? 
          <UpdateList 
            text={this.state.text} 
            translations={this.state.translations} 
            onCheck={this.handleCheckboxChange}
            handleChange={this.handleInputChange}
            customTranlsationInput={this.state.customTranlsationInput}
            saveCustomTranslation={this.saveCustomTranslation}
            handleSubmit={this.handleSubmit} /> :
          null}
        <div className={loaded && !updating && this.state.text.text ? "" : "none"}>
          <a 
            className="button is-primary"
            onClick={this.getTranslation}>
            Update Translations
          </a>
          <a 
            className="button is-danger" 
            onClick={(e) => {if (window.confirm('Are you sure you wish to delete this item?')) this.deleteText(e)}}>
            Delete Word
          </a>
        </div>
      </div>
    );
  }
}


function difference(setA, setB) {
  // Difference between two sets
  var _difference = new Set(setA);
  for (var elem of setB) {
      _difference.delete(elem);
  }
  return _difference;
}


function sortT(trnsl) {
  //Sort translations object
  if (!trnsl){
    return trnsl;
  }
  return trnsl.sort((a, b) => a.translation <= b.translation ? -1: 1);
}


export default Details;
