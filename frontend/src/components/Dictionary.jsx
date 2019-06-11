import React from "react";
import PropTypes from 'prop-types';
import key from "weak-key";


const DictionaryTable = ({ dictionary }) => {
  return (
    <div>
      <table className="table is-fullwidth is-striped is-hoverable ">
        <thead>
          <tr>
            <th key={key({ Text: '' })}>Text</th>
            <th key={key({ Translations: '' })}>Translation</th>
          </tr>
        </thead>
        <tbody>
          {dictionary.map(text => (
            <tr key={key(text)}>
              <td>{text.text}</td>
              <td>
                {text.translations.map(t => t.translation).join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


DictionaryTable.propTypes = {
  dictionary: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DictionaryTable;
