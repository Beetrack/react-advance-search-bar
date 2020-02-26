
import React from 'react';
import PropTypes from 'prop-types';
import { getFilteredChildren } from './InputOptionList.jsx';
import './InputOptionListTextField.css';

export default class InputOptionListTextField extends React.Component {
  constructor (props) {
    super(props);
    this.changeFocus = this.changeFocus.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onArrowUp = this.onArrowUp.bind(this);
    this.onArrowDown = this.onArrowDown.bind(this);
    this.onTab = this.onTab.bind(this);
    this.onEnter = this.onEnter.bind(this);
    this.onBackspace = this.onBackspace.bind(this);
  }

  changeFocus (value) {
    this.props.focusChangeHandler(value);
  }

  shouldComponentUpdate (prevProps) {
    return (
      prevProps.value !== this.props.value ||
      prevProps.disabled !== this.props.disabled
    );
  }

  onKeyPress (event) {
    switch (event.key) {
      case 'ArrowUp':
        this.onArrowUp();
        break;
      case 'ArrowDown':
        this.onArrowDown();
        break;
      case 'Enter':
        this.onEnter(event);
        break;
      case 'Tab':
        this.onTab(event);
        break;
      case 'Backspace':
        this.onBackspace();
        break;
    }
  }

  onArrowUp () {
    this.props.changeSearchIndexSelected(Math.max(0, this.props.selectedOption - 1));
  }

  onArrowDown () {
    let options = getFilteredChildren(this.props.optionList, this.props.value);
    this.props.changeSearchIndexSelected(Math.min(options.length - 1, this.props.selectedOption + 1));
  }

  onTab (event) {
    event.preventDefault();
    event.stopPropagation();
    let options = getFilteredChildren(this.props.optionList, this.props.value);
    if (options.length === 0) {
      this.props.toggleHelper(true);
    } else {
      this.props.onOptionSelect(options[this.props.selectedOption]);
    }
  }

  onEnter (event) {
    event.preventDefault();
    event.stopPropagation();

    let options = getFilteredChildren(this.props.optionList, this.props.value);
    if (options.length === 0 && this.props.value.trim().length > 0) {
      this.props.toggleHelper(true);
    } else {
      this.props.triggerSearch();
    }
  }

  onBackspace () {
    if (this.props.value.length === 0) {
      this.props.deleteLastChip();
    }
  }

  render () {
    return (
      <input type='text'
        className='search-bar__input-options-list-text-field'
        onFocus={() => this.changeFocus(true)}
        onBlur={() => this.changeFocus(false)}
        value={this.props.value}
        disabled={this.props.disabled}
        onChange={this.props.onChange}
        onKeyDown={this.onKeyPress}
        ref={this.props.refInput} />
    );
  }
}

InputOptionListTextField.propTypes = {
  focusChangeHandler: PropTypes.func.isRequired,
  triggerSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onOptionSelect: PropTypes.func.isRequired,
  changeSearchIndexSelected: PropTypes.func.isRequired,
  deleteLastChip: PropTypes.func.isRequired,
  toggleHelper: PropTypes.func.isRequired,
  refInput: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  selectedOption: PropTypes.number,
  disabled: PropTypes.bool,
  optionList: PropTypes.array
};
