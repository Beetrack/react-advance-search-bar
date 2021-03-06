import React from 'react';
import { AdvanceSearchBar, InputOption } from '../lib';

const FIRST_OPTIONS = [
  { name: 'first_suboption0', label: 'Suboption 0' },
  { name: 'first_suboption1', label: 'Suboption 1' }
];

const SECOND_OPTIONS = [
  { name: 'fifth_suboption0', label: 'Suboption 0' },
  { name: 'fifth_suboption1', label: 'Suboption 1' },
  { name: 'fifth_suboption2', label: 'Suboption 2' },
  { name: 'fifth_suboption3', label: 'Suboption 3' }
];

// You should pass allowMulti prop in order to make multiple values search!
const App = () => (
  <div>
    <AdvanceSearchBar
      callback={(params) => { window.alert(`Searching parameters\n${Object.keys(params).reduce((memo, key) => { return memo + `${key}: ${params[key]}\n`; }, '')}`); }}
      emptyCallback={() => { console.log('Empty'); }}
      initialSearch={{ third_option: 'hello' }}
    >
      <InputOption name='first_option' label='First Option' options={FIRST_OPTIONS} allowMulti />
      <InputOption name='second_option' label='Second Option' allowMulti />
      <InputOption name='third_option' label='Third Option' />
      <InputOption name='fourth_option' label='Fouth Option' />
      <InputOption name='fifth_option' label='Fifth Option' options={SECOND_OPTIONS} />
    </AdvanceSearchBar>
  </div>
);

export default App;
