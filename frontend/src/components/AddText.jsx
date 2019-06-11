import React, { Component } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import {Link} from 'react-router-dom';
import key from "weak-key";


class Form extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    endpoint: PropTypes.string.isRequired
  };

  state = {
    text: "fix",
    textObject: {url: ''},
    translations: [],
    translationsExisted: [],
    translationsSelected: [],
    isCustomAdd: false,
    customTranlsationInput: "",
    textExists: false,
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleCheckboxChange = (e, index) => {
    let translations = this.state.translations
    if (translations[index].checked) {
      translations[index].checked = false;
    } else {
      translations[index].checked = true 
    };
    this.setState(translations);
    }  

  resetForms = () => {
    this.setState({
      text: "fix",
      textObject: {url: '/'},
      translations: [],
      translationsSelected: [],
      isCustomAdd: false,
      customTranlsationInput: "",
      textExists: false,
    });
  }

  handleResponse = response => {
    if (response.textExists) {
      let text = JSON.parse(response['text']);
      text.url = new URL(text.url).pathname.replace("/api", "");

      this.setState({
        textExists: true,
        textObject: text
      });
    } else {
      this.setState({
        textExists: false,
        translations: JSON.parse(response['translations']),
      });
    }
  }
  
  getTranslation = e => {
    e.preventDefault();
    let u = window.location.protocol +"//" + window.location.host
    let url = new URL('api/yatranslate', u);
    let params = {text: this.state.text}

    url.search = new URLSearchParams(params)
    const conf = {
      method: "get",
      headers: new Headers(),
    };
    fetch(url, conf)
    .then(response => response.json())
    .then(this.handleResponse);
  }

  addCustomTranslation = (e) => {
    e.preventDefault();
    this.setState({isCustomAdd: true});
  }

  saveCustomTranslation = (e) => {
    e.preventDefault();
    let translations = this.state.translations;
    translations.push({translation: this.state.customTranlsationInput, checked: true});
    this.setState(translations);
    this.setState({customTranlsationInput: ""})
  }

  handleSubmit = e => {
    e.preventDefault();
    const { text, translations, customTranlsationInput, isCustomAdd } = this.state;
    const translationsSelected = translations.filter(tr => tr.checked);

    if (translationsSelected.length == 0 && !isCustomAdd) {
      this.getTranslation(e);
    } else if (customTranlsationInput) {
      this.saveCustomTranslation(e);
    } else if ( document.activeElement.id == 'customTranlsationInput' && !customTranlsationInput) {
    } else {
      const note = {
        text, 
        translationsSelected
      };
      
      const csrftoken = Cookies.get('csrftoken');
      const conf = {
        method: "post",
        body: JSON.stringify(note),
        headers: new Headers({ "Content-Type": "application/json", "X-CSRFToken": csrftoken }),
      };
      fetch(this.props.endpoint, conf)
      .then(response => console.log('response=', response))
      .then(this.resetForms).then(this.props.onSave);
    }
  };


  render() {
    const { text, translations, customTranlsationInput, textObject, textExists, isCustomAdd } = this.state;
    const suggestedTranslations = translations.map((st, index)=>{
      return (
        <div className="field" key={key({st})}>
          <label className="checkbox">
            <input 
              type="checkbox"
              checked={st.checked}
              onChange={(e) => this.handleCheckboxChange(e, index)} 
              value={st.translation}
            />
            {st.translation}
          </label>          
        </div>
      )}
    );

    return (
      <div className="column">
        <form onSubmit={this.handleSubmit}>
          <label className="label">Text</label>
          <div className="field has-addons">
            <div className="control">
                <input
                  className="input"
                  type="text"
                  name="text"
                  onChange={this.handleChange}
                  value={text}
                  required
                />
            </div>          
            <div className="control">
              <a className='button is-info' onClick={this.getTranslation}>
                Translate
              </a>            
            </div>        
          </div>
          <div className = {textExists ? '':'none'}>
            Word is already exists, <Link to={textObject.url}>click here to update</Link>
          </div>
          <div>
            { suggestedTranslations }
          </div>
          <div className='field'>
            <a href = "#" 
              className={!isCustomAdd && translations.length > 0 ? '':'none'} 
              onClick={this.addCustomTranslation}>
              Add your translation
            </a>
          </div>          
          <div className={isCustomAdd ? 'field has-addons':'none'}>
            <div className="control">
              <input
                id='customTranlsationInput'
                className='input'
                type="text"
                name="customTranlsationInput"
                onChange={this.handleChange}
                value={customTranlsationInput}
              />
            </div>
            <div className="control">
              <a className='button is-info' onClick={this.saveCustomTranslation}>
                Save
              </a>            
            </div> 
          </div>
          <div className="control">          
            <button type="submit" className={translations.length > 0 ? 'button is-info':'none'}>
              Save words
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Form;
