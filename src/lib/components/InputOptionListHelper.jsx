import React from 'react';

import PropTypes from 'prop-types';
import InputOptionList from './InputOptionList.jsx';
import './InputOptionListHelper.css';

export default class InputOptionListHelper extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      showInfoFor: null
    };

    this.handleOptionSelect = this.handleOptionSelect.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onArrowUp = this.onArrowUp.bind(this);
    this.onArrowDown = this.onArrowDown.bind(this);
    this.onEnter = this.onEnter.bind(this);
    this.onBackspace = this.onBackspace.bind(this);
    this.redraw = this.redraw.bind(this);
  }

  handleOptionSelect (optionSelect) {
    const suboption = optionSelect.options && optionSelect.options.find(option => option.label === this.props.value);

    if (!optionSelect.options || suboption) {
      this.props.handleOptionSelect(optionSelect, (suboption && suboption.name) || this.props.value);
      this.props.toggleHelper(false);
    } else {
      this.setState({
        showInfoFor: optionSelect.options ? optionSelect.name : null
      });
    }
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
        this.onEnter(event);
        break;
      case 'Backspace':
        this.onBackspace();
        break;
      case 'Escape':
        this.props.toggleHelper(false);
        break;
    }
  }

  redraw (value) {
    const modal = document.getElementsByClassName('search-bar__input-options-list-helper-modal')[0];
    const list = document.getElementsByClassName('search-bar__input-options-list ')[0];
    const selected = list.children[0].children[value];

    if (!modal || !list || !selected) return;

    if (selected.offsetTop >= modal.offsetTop + modal.offsetHeight) {
      modal.scroll({ top: selected.offsetTop - 10, behavior: 'smooth' });
    } else if (selected.getBoundingClientRect().y <= modal.getBoundingClientRect().y) {
      modal.scroll({ top: selected.getBoundingClientRect().y - 10, behavior: 'smooth' });
    }
  }

  onArrowUp () {
    const value = Math.max(0, this.props.selectedOption - 1);
    this.redraw(value);
    this.props.changeSearchIndexSelected(value);
  }

  onArrowDown () {
    const children = this.props.optionList;
    const value = Math.min(children.length - 1, this.props.selectedOption + 1);
    this.redraw(value);
    this.props.changeSearchIndexSelected(value);
  }

  onEnter (event) {
    event.preventDefault();
    let options = this.props.optionList;
    if (this.props.selectedOption == null) return;
    if (options.length === 0) {
      this.props.toggleHelper(true);
    } else {
      this.handleOptionSelect(options[this.props.selectedOption]);
    }
  }

  onBackspace () {
    this.props.toggleHelper();
  }

  componentDidMount () {
    this.ref.focus();
  }

  render () {
    const helperTitle = this.props.helperTitleFunction(this.props.value);

    return (
      <div className='search-bar__input-options-list-helper'>
        <div className='search-bar__input-options-list-helper-backdrop'
          onClick={() => this.props.toggleHelper(false)} />
        <div className='search-bar__input-options-list-helper-modal' tabIndex='0' ref={ref => { this.ref = ref; }} onKeyDown={this.onKeyPress}>
          <h3>{helperTitle}</h3>
          <InputOptionList onOptionSelect={this.handleOptionSelect}
            currentSearchingKey=''
            changeSearchIndexSelected={this.props.changeSearchIndexSelected}
            selectedOption={this.props.selectedOption}
            positionAbsolute={false}
            showInfoFor={this.state.showInfoFor}
            optionList={this.props.optionList}
          />
          <button onClick={() => this.props.toggleHelper(false)}>{this.props.helperTextButton}</button>
        </div>
      </div>
    );
  }
}

InputOptionListHelper.propTypes = {
  handleOptionSelect: PropTypes.func.isRequired,
  toggleHelper: PropTypes.func.isRequired,
  helperTitleFunction: PropTypes.func.isRequired,
  changeSearchIndexSelected: PropTypes.func,
  selectedOption: PropTypes.number,
  helperTextButton: PropTypes.string,
  value: PropTypes.string,
  optionList: PropTypes.array
};
