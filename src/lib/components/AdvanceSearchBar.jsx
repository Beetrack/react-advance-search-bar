import React from 'react';
import PropTypes from 'prop-types';
import InputOptionList from './InputOptionList.jsx';
import InputOptionListTextField from './InputOptionListTextField.jsx';
import InputOptionListHelper from './InputOptionListHelper.jsx';
import Input from './Input.jsx';
import DeleteIcon from './DeleteIcon.jsx';
import './AdvanceSearchBar.css';

export default class AdvanceSearchBar extends React.Component {
  constructor (props) {
    super(props);
    this.getCurrentTags = this.getCurrentTags.bind(this);
    this.handleOptionSelect = this.handleOptionSelect.bind(this);
    this.setOnlyOption = this.setOnlyOption.bind(this);
    this.handleInputEnd = this.handleInputEnd.bind(this);
    this.isSearchValid = this.isSearchValid.bind(this);
    this.handleOptionTextChange = this.handleOptionTextChange.bind(this);
    this.triggerInputEnd = this.triggerInputEnd.bind(this);
    this.changeFocus = this.changeFocus.bind(this);
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    this.changeSearchIndexSelected = this.changeSearchIndexSelected.bind(this);
    this.deleteLastChip = this.deleteLastChip.bind(this);
    this.toggleHelper = this.toggleHelper.bind(this);
    this.triggerSearch = this.triggerSearch.bind(this);
    this.handleClean = this.handleClean.bind(this);
    this.setTextInputRef = this.setTextInputRef.bind(this);
    this.showHelper = this.showHelper.bind(this);
    this.handleSearchButton = this.handleSearchButton.bind(this);
    this.deleteChip = this.deleteChip.bind(this);
    this.deleteOptionValueAt = this.deleteOptionValueAt.bind(this);
    this.renderLabel = this.renderLabel.bind(this);

    this.textInputRef = null;

    this.state = {
      focus: false,
      // Searching
      searchingInput: false,
      searchInputValue: '',
      searchIndexSelected: 0,
      // Healper
      showHelper: false,
      // Options
      selectedOptions: {}
    };
  }

  componentDidMount () {
    this.setOnlyOption();
  }

  // function checking children and setup the only child here
  setOnlyOption () {
    const { options } = this.props;
    if (options !== 1) return;
    const { name, allowMulti } = options;

    this.setState({
      focus: true,
      selectedOptions: {
        [name]: allowMulti ? [''] : ''
      }
    });
  }

  changeFocus (value) {
    let hasValue = !!this.state.searchInputValue;
    let hasOptions = Object.keys(this.state.selectedOptions).length > 0;

    this.setState({
      focus: (hasValue || hasOptions || value),
      isSearching: (hasValue || value)
    });

    if (value && hasOptions) {
      this.handleInputEnd();
    }
  }

  handleSearchTextChange (event) {
    this.setState({
      searchInputValue: event.target.value,
      searchIndexSelected: 0
    });
  }

  handleOptionTextChange (value, inputOption, index) {
    const { allowMulti, name } = inputOption;
    const selectedOptionsCopy = { ...this.state.selectedOptions };

    if (allowMulti) {
      selectedOptionsCopy[name][index] = value;
    } else {
      selectedOptionsCopy[name] = value;
    }

    this.setState({
      selectedOptions: selectedOptionsCopy
    });
  }

  changeSearchIndexSelected (index) {
    this.setState({
      searchIndexSelected: index
    });
  }

  toggleHelper (value) {
    let optionList = this.getOptionList();
    if (optionList.length === 0) return;
    // Display only if there are options here!
    this.setState({
      showHelper: value,
      searchIndexSelected: 0
    });

    if (!value) {
      setTimeout(() => { this.triggerInputEnd(); }, 200);
    }
  }

  handleOptionSelect (selectedOption, value = '') {
    if (!selectedOption) return;

    const { name, allowMulti } = selectedOption;
    const selectedOptionsCopy = { ...this.state.selectedOptions };

    if (selectedOptionsCopy[name]) {
      const option = selectedOptionsCopy[name];
      if (option[option.length - 1] === '') return;
      selectedOptionsCopy[name] = selectedOptionsCopy[name].concat([value]);
    } else {
      selectedOptionsCopy[name] = allowMulti ? [value] : value;
    }

    this.setState({
      searchInputValue: '',
      searchIndexSelected: 0,
      selectedOptions: selectedOptionsCopy
    });
  }

  deleteLastChip () {
    const keys = Object.keys(this.state.selectedOptions);
    const lastKey = keys[keys.length - 1];

    if (keys.length === 0) return;

    this.deleteChip(lastKey);
  }

  deleteChip (option) {
    const selectedOptions = { ...this.state.selectedOptions };
    delete selectedOptions[option];

    this.setState({
      selectedOptions
    }, () => {
      const selectedOptions = Object.keys(this.state.selectedOptions);
      if (!selectedOptions.length) {
        this.triggerEmptyState();
        this.triggerInputEnd();
      }
    });
  }

  getValidValue (value) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }

    if (Array.isArray(value)) {
      const filteredValues = value.filter(val => val.trim().length > 0);
      return filteredValues.length > 0 ? filteredValues : null;
    }

    return null;
  }

  cleanSelectedOptions (callback) {
    const { selectedOptions } = this.state;
    const filteredOptions = {};

    Object.keys(selectedOptions).forEach(key => {
      let value = this.getValidValue(selectedOptions[key]);

      if (value) {
        filteredOptions[key] = value;
      }
    });

    this.setState({
      selectedOptions: filteredOptions
    }, () => {
      if (callback) callback();
    });
  }

  handleInputEnd () {
    this.cleanSelectedOptions(() => {
      const selectedOptions = Object.keys(this.state.selectedOptions);
      if (!selectedOptions.length) {
        this.triggerEmptyState();
      }
    });
  }

  handleClean () {
    this.setState({
      focus: false,
      selectedOptions: {},
      searchInputValue: ''
    }, () => {
      this.triggerEmptyState();
      this.triggerInputEnd();
    });
  }

  setTextInputRef (element) {
    this.textInputRef = element;
  }

  triggerInputEnd () {
    if (this.textInputRef) {
      this.textInputRef.focus();
    }
  }

  triggerSearch () {
    this.cleanSelectedOptions(() => {
      const options = Object.values(this.state.selectedOptions);
      if (options.length === 0) {
        return;
      }

      this.props.callback(this.state.selectedOptions);
      this.textInputRef.blur();
    });
  }

  deleteOptionValueAt (key, index) {
    const optionValues = [...this.state.selectedOptions[key]];

    optionValues.splice(index, 1);
    this.triggerInputEnd();

    if (optionValues.length === 0) {
      this.deleteChip(key);
      return;
    }

    this.setState({
      selectedOptions: {
        ...this.state.selectedOptions,
        [key]: optionValues
      }
    });
  }

  triggerEmptyState () {
    this.props.emptyCallback();
  }

  getCurrentTags (optionList) {
    let inputs = [];

    for (let [key, value] of Object.entries(this.state.selectedOptions)) {
      let inputOption = this.props.options.find(({ name }) => name === key);
      inputs.push(
        <Input onInputChange={this.handleOptionTextChange}
          triggerInputEnd={this.triggerInputEnd}
          triggerSearch={this.triggerSearch}
          deleteChip={this.deleteChip}
          separatorComponent={this.props.separatorComponent}
          deleteOptionValueAt={this.deleteOptionValueAt}
          inputOption={inputOption}
          value={value}
          key={key} />
      );
    }
    inputs.push(
      <InputOptionListTextField
        optionList={optionList}
        key='search-bar-input-text'
        refInput={this.setTextInputRef}
        disabled={this.state.showHelper}
        toggleHelper={this.toggleHelper}
        triggerSearch={this.triggerSearch}
        value={this.state.searchInputValue}
        deleteLastChip={this.deleteLastChip}
        focusChangeHandler={this.changeFocus}
        onChange={this.handleSearchTextChange}
        onOptionSelect={this.handleOptionSelect}
        selectedOption={this.state.searchIndexSelected}
        changeSearchIndexSelected={this.changeSearchIndexSelected}
      />
    );

    if (inputs.length > 1 || this.state.searchInputValue.length >= 1) {
      inputs.push(
        <DeleteIcon className='search-bar__clean' width='32' height='32' key='search-bar-clean' onClick={this.handleClean} />
      );
    }

    return inputs;
  }

  isAllSubOptionsSelected (option) {
    const { selectedOptions } = this.state;
    const { options, name } = option;

    if (!options || !selectedOptions[name]) return false;

    return selectedOptions[name].length === options.length;
  }

  getOptionList = () => {
    const { options } = this.props;
    const { selectedOptions } = this.state;

    return options.filter(option => {
      const { allowMulti, name } = option;

      return (allowMulti && !this.isAllSubOptionsSelected(option)) || !selectedOptions[name];
    });
  }

  isSearchValid () {
    return Object.values(this.state.selectedOptions).some((value) => { return value.length > 0; });
  }

  showHelper () {
    return this.state.searchInputValue.length > 3;
  }

  handleSearchButton (showHeper) {
    if (showHeper) {
      this.toggleHelper(true);
    } else {
      this.triggerSearch();
    }
  }

  renderLabel () {
    const { labelText } = this.props;

    return labelText &&
    <label className={`search-bar__label ${this.state.focus ? 'search-bar__label--float' : ''}`}>
      {this.props.labelText}
    </label>;
  }

  render () {
    const { dark } = this.props;
    const searchValid = this.isSearchValid();
    const showHelper = this.showHelper();
    let optionList = this.getOptionList();
    const currentTags = this.getCurrentTags(optionList);
    let list;

    if (this.state.showHelper) {
      list = <InputOptionListHelper
        handleOptionSelect={this.handleOptionSelect}
        changeSearchIndexSelected={this.changeSearchIndexSelected}
        toggleHelper={this.toggleHelper}
        value={this.state.searchInputValue}
        selectedOption={this.state.searchIndexSelected}
        helperTitleFunction={this.props.helperTitleFunction}
        helperTextButton={this.props.helperTextButton}
        optionList={optionList}
      />;
    } else if (this.state.isSearching) {
      list = <InputOptionList onOptionSelect={this.handleOptionSelect}
        currentSearchingKey={this.state.searchInputValue}
        changeSearchIndexSelected={this.changeSearchIndexSelected}
        selectedOption={this.state.searchIndexSelected}
        notTagFound={this.props.notTagFound}
        optionList={optionList}
      />;
    }
    return (
      <div className={`search-bar${dark ? ' search-bar--dark' : ''}`}>
        <div className={`search-bar__container ${this.state.focus ? 'search-bar__container--focus' : ''}`}>
          { currentTags }
          <button
            className={`search-bar__button ${searchValid || showHelper ? 'search-bar__button--active' : ''} ${this.state.focus ? 'search-bar__button--active-border' : ''}`}
            disabled={!searchValid && !showHelper}
            onClick={() => this.handleSearchButton(showHelper)}
          >
            {this.props.buttonText}
          </button>
          { currentTags.length <= 1 && this.renderLabel() }
        </div>
        { list }
      </div>
    );
  }
}

AdvanceSearchBar.propTypes = {
  dark: PropTypes.bool,
  options: PropTypes.array,
  buttonText: PropTypes.node,
  labelText: PropTypes.string,
  emptyCallback: PropTypes.func,
  notTagFound: PropTypes.string,
  helperTextButton: PropTypes.string,
  separatorComponent: PropTypes.node,
  callback: PropTypes.func.isRequired,
  helperTitleFunction: PropTypes.func
};

AdvanceSearchBar.defaultProps = {
  dar: false,
  buttonText: (
    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
      <path d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' />
      <path d='M0 0h24v24H0z' fill='none' />
    </svg>
  ),
  labelText: 'Advance search',
  notTagFound: 'No tags matched',
  helperTextButton: 'Cancel',
  helperTitleFunction: (word) => (
    <div className='search-bar__modal-header'>
      <p className='search-bar__modal-title'>What do you want to search?</p>
      <p className='search-bar__modal-subtitle'>You have written: <b>{word}</b>. Please enter the field in which you are looking for.</p>
    </div>
  ),
  allowMulti: false,
  separatorComponent: (<span className='input-tag__separator'>|</span>)
};
