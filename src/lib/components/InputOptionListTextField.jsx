
import React from 'react';
import PropTypes from 'prop-types';
import { getFilteredChildren } from './InputOptionList.jsx';
import './InputOptionListTextField.css'

export default class InputOptionListTextField extends React.Component {
  constructor(props) {
    super(props);
    this.onArrowUp = this.onArrowUp.bind(this);
    this.onArrowDown = this.onArrowDown.bind(this);
    this.onEnter = this.onEnter.bind(this);
    this.onBackspace = this.onBackspace.bind(this);
  }

  changeFocus(value) {
    if(!value) {
      setTimeout(() => {
        this.props.focusChangeHandler(value);
      }, 100);
    } else {
      this.props.focusChangeHandler(value);
    }
  }

  shouldComponentUpdate(prevProps) {
    return prevProps.value !== this.props.value
  }

  onKeyPress(event) {
    switch(event.key) {
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
        this.onEnter(event);
        break;
      case 'Backspace':
        this.onBackspace();
        break;
    }
  }

  onArrowUp() {
    this.props.changeSearchIndexSelected(Math.max(0, this.props.selectedOption - 1));
  }

  onArrowDown() {
    let options = getFilteredChildren(React.Children.toArray(this.props.children), this.props.value)
    this.props.changeSearchIndexSelected(Math.min(options.length - 1, this.props.selectedOption + 1));
  }

  onEnter(event) {
    event.preventDefault();
    let options = getFilteredChildren(React.Children.toArray(this.props.children), this.props.value)

    this.props.onOptionSelect(options[this.props.selectedOption]);
  }

  onBackspace() {
    if(this.props.value.length === 0) {
      this.props.handleOptionDelete();
    }
  }

  render() {
    return (
      <input type="text"
              className="search-bar__input-options-list-text-field"
              onFocus={this.changeFocus.bind(this, true)}
              onBlur={this.changeFocus.bind(this, false)}
              value={this.props.value}
              onChange={this.props.onChange.bind(this)}
              onKeyDown={this.onKeyPress.bind(this)}
              ref={this.props.refInput}/>
    )
  }
}

InputOptionListTextField.propTypes = {
  focusChangeHandler: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onOptionSelect: PropTypes.func.isRequired,
  changeSearchIndexSelected: PropTypes.func.isRequired,
  handleOptionDelete: PropTypes.func.isRequired,
  refInput: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  selectedOption: PropTypes.number
}
