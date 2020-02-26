import React from 'react';
import PropTypes from 'prop-types';
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

    if (inputOption.allowMulti && value[value.length - 1] === '' && (prevProps.value.length < value.length)) {
      this.triggerInputStart();
    }
  }

  isValueEmpty (value) {
    return !value || value[0] === '';
  }

  onChange (event, index) {
    this.props.onInputChange(event.target.value, this.props.inputOption, index);
  }

  triggerDelete (e) {
    const { inputOption } = this.props;
    this.props.deleteChip(inputOption.name);
  }

  onKeyPress (event, index) {
    if (event.key === 'Enter') {
      event.preventDefault();
      // finaliza el ingreso del input
      this.props.triggerInputEnd();
      // realiza la busqueda
      // - opcional: podría solamente finalizar el input y dejar la responsabilidad del search para el botón
      this.props.triggerSearch();
    } else if (event.key === 'Backspace') {
      // elimina la ultima seleccion en caso de ser multi
      // si no es multi, elimina el option
      this.handleBackspace(index);
    }
  }

  handleBackspace (index) {
    const { inputOption } = this.props;
    const allowMulti = inputOption.allowMulti;

    if (!allowMulti && this.props.value.length === 0) {
      this.props.triggerInputEnd();
    }

    if (allowMulti && this.props.value[index].length === 0) {
      this.props.deleteOptionValueAt(inputOption.name, index);
    }
  }

  setTextInputRef (element) {
    this.textInputRef = element;
  }

  getSelects () {
    const { value, inputOption, separatorComponent } = this.props;
    const values = inputOption.allowMulti ? value : [value];

    const options = this.props.inputOption.options;
    const suboptions = options.map(opt => (
      <option value={opt.name} key={opt.name}>
        {opt.label}
      </option>
    ));

    return values.map((value, index) => {
      const isLast = index === values.length - 1;
      const shouldRenderSeparator = index > 0;
      const filteredSubOptions = suboptions.filter(option =>
        option.props.value === value || values.indexOf(option.props.value) < 0
      );

      return (
        <React.Fragment key={`input-${index}`}>
          { shouldRenderSeparator && separatorComponent }
          <select
            value={value}
            onChange={(e) => this.onChange(e, index)}
            onKeyDown={this.onKeyPress}
            ref={isLast ? this.setTextInputRef.bind(this) : null}
          >
            {!value && <option value='' />}
            {filteredSubOptions}
          </select>
        </React.Fragment>
      );
    });
  }

  getValueWidth (value) {
    const upperWidth = 0.90;
    const lowerWith = 0.60;
    if (value === value.toUpperCase()) {
      return value.length * upperWidth;
    } else {
      return value.length * lowerWith;
    }
  }

  getInputs () {
    const { value, inputOption, separatorComponent } = this.props;
    const values = inputOption.allowMulti ? value : [value];

    return values.map((value, index) => {
      const width = value ? this.getValueWidth(value) : 0.5;
      const shouldRenderSeparator = index > 0;
      const isLast = index === values.length - 1;

      return (
        <React.Fragment key={`input-${index}`}>
          { shouldRenderSeparator && separatorComponent }
          <input
            style={{ width: `${width}em` }}
            type='text'
            value={value}
            onChange={(e) => this.onChange(e, index)}
            onKeyDown={(e) => this.onKeyPress(e, index)}
            ref={isLast ? this.setTextInputRef.bind(this) : null}
            key={`${inputOption.name}-${index}`}
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
    const isSelect = this.props.inputOption.options && this.props.inputOption.options.length >= 1;

    return (
      <div className='search-bar__input-tag'>
        <span className='input-tag__start'>
          { this.props.inputOption.label }
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
