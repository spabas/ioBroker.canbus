import React from 'react';

import Grid, { GridSize } from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

import { uuidv4 } from '../lib/helpers';

interface InputTextProps {
  onChange: (newValue: string) => void;

  /**
   * Unique ID for this element.
   * If not set a UUID will be generated.
   */
  id?: string;

  /**
   * Label for this input.
   * Will be translatable.
   */
  label: string;

  /**
   * The value of the input.
   */
  value: string;

  /**
   * If `true`, the label is displayed as required and the `input` element` will be required.
   */
  required?: boolean;

  /**
   * Type of the `input` element. It should be [a valid HTML5 input type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types).
   */
  type?: React.InputHTMLAttributes<unknown>['type'];

  /**
   * If the input element should be completeley disabled.
   */
  disabled?: boolean;

  /**
   * If the input should be a multiline.
   */
  multiline?: boolean;

  /**
   * Maximum length for the text.
   */
  maxLength?: number;

  /**
   * Placeholder to show if no value exists.
   */
  placeholder?: string;

  /**
   * Error message to display in case of e.g. validation errors.
   */
  errorMsg?: string | null;

  /**
   * Optional transforming of input.
   */
  transform?: 'lowerCase' | 'upperCase' | ((newValue: string, oldValue: string) => string);
}

interface InputTextState {
  id: string;
  value: string;
}

/**
 * A text input.
 */
export class InputText extends React.PureComponent<Partial<Record<Breakpoint, boolean | GridSize>> & InputTextProps, InputTextState> {
  private textArea: HTMLTextAreaElement | null | undefined;

  constructor(props: InputTextProps) {
    super(props);

    this.state = {
      id: this.props.id || uuidv4(),
      value: this.props.value
    };
  }

  public componentDidUpdate (prevProps: InputTextProps): void {
    if (prevProps.value !== this.props.value) {
      this.setState({
        value: this.props.value
      });
    }
  }

  public render(): JSX.Element {
    return (
      <Grid item xs={this.props.xs} sm={this.props.sm} md={this.props.md} lg={this.props.lg} xl={this.props.xl}>
        <FormControl fullWidth>
          <TextField
            id={this.state.id}
            label={this.props.label}
            value={this.state.value}
            required={this.props.required}
            type={this.props.type || 'string'}
            disabled={this.props.disabled}
            error={!!this.props.errorMsg}
            helperText={this.props.errorMsg}
            placeholder={this.props.placeholder}
            InputLabelProps={this.props.placeholder ? { shrink: true } : undefined}
            multiline={this.props.multiline}
            fullWidth
            onChange={(e) => this.handleChange(e.target.value)}
          />

          {this.props.children && <FormHelperText>{this.props.children}</FormHelperText>}
        </FormControl>
      </Grid>
    );
  }

  private handleChange (value: string): void {
    if (typeof this.props.transform === 'function') {
      value = this.props.transform(value, this.state.value);
    } else {
      switch (this.props.transform) {
        case 'lowerCase':
          value = value.toLowerCase();
          break;
        case 'upperCase':
          value = value.toUpperCase();
          break;
      }
    }

    if (this.props.maxLength && value.length > this.props.maxLength) {
      value = value.slice(0, this.props.maxLength);
    }

    this.setState({
      value
    }, () => {
      this.props.onChange(this.state.value);
    });
  }
}