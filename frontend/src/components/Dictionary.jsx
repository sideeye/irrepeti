import React from "react";
import PropTypes from 'prop-types';
import key from "weak-key";
import { Link } from 'react-router-dom';


const DictionaryTable = ({ dictionary }) => {
  const thead = () => (
    <thead key={key({ thead: '' })}>
      <tr>
        <th>Text</th>
        <th>Translation</th>
      </tr>
    </thead> 
  )

  const tbody = () => (
    dictionary.map(text => {
    const frontUrl= new URL(text.url).pathname.replace("/api", "");
    return (
      <tbody key={key(text)}>
        <tr>
          <td>
            <Link to = {frontUrl}>{text.text}</Link>
          </td>
          <td>
            {text.translations.map(t => t.translation).join(', ')}
          </td>
        </tr>
      </tbody>
      )
    })
  );

  return (
    <div>
      <table className="table is-fullwidth is-striped is-hoverable ">
        {thead()}      
        {tbody()}
      </table>
    </div>
  );
};


DictionaryTable.propTypes = {
  dictionary: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DictionaryTable;
