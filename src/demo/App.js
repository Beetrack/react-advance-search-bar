import React from 'react';
import { AdvanceSearchBar } from '../lib';

const FIRST_OPTIONS = [
  { name: 'first_suboption0', label: 'Suboption 0' },
  { name: 'first_suboption1', label: 'Suboption 1' }
];

const SECOND_OPTIONS = [
  { name: 'second_suboption0', label: 'Suboption 0' },
  { name: 'second_suboption1', label: 'Suboption 1' },
  { name: 'second_suboption2', label: 'Suboption 2' },
  { name: 'second_suboption3', label: 'Suboption 3' }
];

const options = [
  {
    name: 'first_option',
    label: 'First option',
    allowMulti: false
  },
  {
    name: 'second_option',
    label: 'Second option',
    allowMulti: true,
    options: FIRST_OPTIONS
  },
  {
    name: 'third_option',
    label: 'Third option',
    allowMulti: false,
    options: SECOND_OPTIONS
  }
];

// You should pass allowMulti prop in order to make multiple values search!
const App = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'baseline', flexDirection: 'column' }}>
    <div style={{ marginBottom: '50px', width: '100%' }}>
      <AdvanceSearchBar
        key='search-bar'
        callback={(params) => { window.alert(`Searching parameters\n${Object.keys(params).reduce((memo, key) => { return memo + `${key}: ${params[key]}\n`; }, '')}`); }}
        emptyCallback={() => { console.log('Empty'); }}
        options={options}
      />
    </div>
    <div style={{ width: '100%' }}>
      <AdvanceSearchBar
        key='search-bar-dark'
        callback={(params) => { window.alert(`Searching parameters\n${Object.keys(params).reduce((memo, key) => { return memo + `${key}: ${params[key]}\n`; }, '')}`); }}
        emptyCallback={() => { console.log('Empty'); }}
        options={options}
        labelText='Advance Search Dark'
        dark
      />
    </div>
  </div>
);

export default App;
