import React from 'react';
import PropTypes from 'prop-types';
import { getInputDisplayName } from './InputOption.jsx';
import DeleteIcon from './DeleteIcon.jsx';
import './Input.css';

export default class Input extends React.Component {
  constructor (props) {
    super(props);
    this.textInputRef = null;
    this.triggerInputStart = this.triggerInputStart.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.triggerDelete = this.triggerDelete.bind(this);
  }

  componentDidMount () {
    if (this.isValueEmpty(this.props.value)) {
      this.triggerInputStart();
    }
  }

  componentDidUpdate (prevProps) {
    const { value } = this.props;
    const { inputOption } = this.props;

    if (inputOption.props.allowMulti && value[value.length - 1] === '' && (prevProps.value.length < value.length)) {
      this.triggerInputStart();
    }
  }

  // shouldComponentUpdate (prevProps) {
  //   // TODO: compare value (string, array)

  //   // return (prevProps.value !== this.props.value);
  //   return true;
  // }

  isValueEmpty (value) {
    return !value || value[0] === '';
  }

  onChange (event, index) {
    this.props.onInputChange(event.target.value, this.props.inputOption, index);
  }

  triggerDelete (e) {
    const { inputOption } = this.props;
    this.props.deleteChip(inputOption.props.name);
  }

  onKeyPress (event, index) {
    if (event.key === 'Enter') {
      event.preventDefault();
      console.log('onKeyPress Enter');
      this.props.triggerInputEnd();
      this.props.triggerSearch();
    } else if (event.key === 'Backspace') {
      this.handleBackspace(index);
    }
  }

  handleBackspace (index) {
    const { inputOption } = this.props;
    const allowMulti = inputOption.props.allowMulti;

    if (!allowMulti && this.props.value.length === 0) {
      console.log('Backspace noMulti works just fine! triggerInputEnd');
      this.props.triggerInputEnd();
    }

    if (allowMulti && this.props.value[index].length === 0) {
      this.props.deleteOptionValueAt(inputOption.props.name, index);
      console.log('Where to put the focus now?');
    }
  }

  setTextInputRef (element) {
    this.textInputRef = element;
  }

  getSelects () {
    const suboptions = this.props.inputOption.props.options.map(opt => (
      <option value={opt.name} key={opt.name}>
        {opt.label}
      </option>
    ));

    return (
      <select value={this.props.value}
        onChange={(e) => this.onChange(e, 0)}
        onKeyDown={this.onKeyPress}
        ref={this.setTextInputRef.bind(this)}
      >
        {!this.props.value && <option value='' />}
        {suboptions}
      </select>
    );
  }

  getInputs () {
    // What happens if theres only one option and its multi????
    const { value, inputOption, separatorComponent } = this.props;
    const values = inputOption.props.allowMulti ? value : [value];

    return values.map((value, index) => {
      const size = Math.max(value.length, 1);
      const shouldRenderSeparator = index > 0;
      const isLast = index === values.length - 1;

      return (
        <React.Fragment key={`input-${index}`}>
          { shouldRenderSeparator && separatorComponent }
          <input
            type='text'
            value={value}
            size={size}
            onChange={(e) => this.onChange(e, index)}
            onKeyDown={(e) => this.onKeyPress(e, index)}
            ref={isLast ? this.setTextInputRef.bind(this) : null}
            key={`${inputOption.props.name}-${index}`}
          />
        </React.Fragment>
      );
    });
  }

  triggerInputStart () {
    if (this.textInputRef) {
      this.textInputRef.focus();
    }
  }

  render () {
    const isSelect = this.props.inputOption.props.options && this.props.inputOption.props.options.length >= 1;

    return (
      <div className='search-bar__input-tag'>
        <span className='input-tag__start'>
          { getInputDisplayName(this.props.inputOption) }
        </span>
        <span className='input-tag__second'>
          { isSelect ? this.getSelects() : this.getInputs() }
          <DeleteIcon className='input-tag__delete' width='14' height='14' onClick={this.triggerDelete} />
        </span>
      </div>
    );
  }
}

Input.propTypes = {
  onInputChange: PropTypes.func.isRequired,
  triggerInputEnd: PropTypes.func.isRequired,
  triggerSearch: PropTypes.func.isRequired,
  deleteChip: PropTypes.func.isRequired,
  separatorComponent: PropTypes.node.isRequired,
  inputOption: PropTypes.instanceOf(Object).isRequired,
  deleteOptionValueAt: PropTypes.func.isRequired,
  options: PropTypes.array,
  value: PropTypes.array
};
