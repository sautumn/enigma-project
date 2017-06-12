/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Dialog, Input, Button } from 'react-toolbox/lib';

class DeEncryptDialog extends React.Component {
  static get propTypes() {
    return {
      toggle: React.PropTypes.func.isRequired,
      open: React.PropTypes.bool.isRequired,
      message: React.PropTypes.string.isRequired,
      decrypt: React.PropTypes.func.isRequired,
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      input: this.props.message,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ input: event });
  }

  // handleDecryptDialog(){
  //   this.props.toggle;
  //   this.props.decrypt(this.state.input)
  // }

  handleDialog() {
    const actions = [
      { label: 'Close', onClick: this.props.toggle },
      { label: 'Decrypt', onClick: this.props.toggle && this.props.decrypt(this.state.input) },
    ];
    return (
      <div>
        <Dialog
          actions={actions}
          active={this.props.open}
          onEscKeyDown={this.props.toggle}
          onOverlayClick={this.props.toggle}
          title="De/Encrypt Message"
        >
          <Input
            type="text"
            multiline
            label="Message"
            value={this.state.input}
            onChange={this.handleChange}
            required
          />
        </Dialog>
      </div>
    );
  }

  render() {
    return (
      <div>
        { this.handleDialog() }
      </div>
    );
  }
}

export default DeEncryptDialog;
