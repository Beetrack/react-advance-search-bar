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
    options: SECOND_OPTIONS
  }
];

// You should pass allowMulti prop in order to make multiple values search!
const App = () => (
  <AdvanceSearchBar
    callback={(params) => { window.alert(`Searching parameters\n${Object.keys(params).reduce((memo, key) => { return memo + `${key}: ${params[key]}\n`; }, '')}`); }}
    emptyCallback={() => { console.log('Empty'); }}
    options={options}
  />
);

export default App;
