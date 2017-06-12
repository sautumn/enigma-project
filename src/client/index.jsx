/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import DeEncryptDialog from './DeEncryptDialog';
import { genPassPhrase } from './../engima-helper';
// react-toolbox
import {
  Avatar,
  Button,
  Card,
  CardTitle,
  DatePicker,
  Input,
} from 'react-toolbox/lib';

const minDate = new Date();

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      message: '',
      avatarString: 'A',
      date: '',
      passphrase: '',
      openDialog: false,
      encrypted: '',
    };
    this.generateNewPassPhrase = this.generateNewPassPhrase.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleEncrypt = this.handleEncrypt.bind(this);
    this.handleDecrypt = this.handleDecrypt.bind(this);
    this.displayDecryptedMessage = this.displayDecryptedMessage.bind(this);
  }

  componentWillMount() {
    if (location.hash !== '') {
      this.setState({ passphrase: location.hash.substring(1) });
    } else {
      const newPass = genPassPhrase();
      this.setState({ passphrase: newPass });
      location.hash = newPass;
    }
  }

  componentWillUnmount() {
    this.setState({ encrypted: '' });
  }

  avatarStringIcon() {
    // TO DO: ONCHANGE ONE BEHIND
    // set to the first char of the string of the name
    let letter = this.state.name[0];
    if (!letter) {
      letter = 'A';
    }
    this.setState({
      avatarString: letter.toUpperCase(),
    });
  }

  generateNewPassPhrase() {
    const newPhrase = genPassPhrase();
    location.hash = newPhrase;
    this.setState({ passphrase: newPhrase });
  }

  handleChange(label, value) {
    this.setState({ ...this.state, [label]: value });
    this.avatarStringIcon();
  }

  handleToggle() {
    this.setState({ openDialog: !this.state.openDialog });
  }

  handleEncrypt() {
    axios.post('/encrypt', {
      urlHash: this.state.passphrase,
      messageText: this.state.message,
      date: this.state.date,
    })
      .then((response) => {
        this.setState({
          encrypted: response.data,
        });
        this.handleToggle();
      })
      .catch(err => console.log(err));
  }

  displayDecryptedMessage(message) {
    if (typeof message !== 'String') {
      message = 'Invalid/Expired message';
    }
    this.setState({
      message,
    });
  }

  handleDecrypt(encryptedMessage) {
    console.log('fn called');
    axios.post('/decrypt', {
      urlHash: this.state.passphrase,
      encryptedMessage,
    })
      .then((response) => {
        console.log('response from server', JSON.stringify(response.data));
        this.displayDecryptedMessage(response.data);
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <center>
        <Card style={{ width: '400px' }}>
          <CardTitle
            title="Tovia's Engima"
          />
          <section>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Avatar icon={this.state.avatarString} />
              <Input
                type="text"
                label="Name"
                name="name"
                value={this.state.name}
                onChange={this.handleChange.bind(this, 'name')}
                required
              />
            </div>
            <Input
              type="text"
              multiline
              label="Message"
              maxLength={120}
              value={this.state.message}
              onChange={this.handleChange.bind(this, 'message')}
              required
            />
            <DatePicker
              label="Expiration date"
              sundayFirstDayOfWeek
              minDate={minDate}
              onChange={this.handleChange.bind(this, 'date')}
              value={this.state.date}
              required
            />
            <Button label="Encrypt" onClick={this.handleEncrypt} />
            <Button label="Decrypt" onClick={this.handleToggle} />
          </section>
        </Card>
        <div>
          <div>
            Your passphrase - {this.state.passphrase}
          </div>
          <a role="button" tabIndex="0" onClick={this.generateNewPassPhrase}>
            Generate new passphrase
          </a>
        </div>

        { this.state.openDialog &&
          <DeEncryptDialog
            toggle={this.handleToggle}
            open={this.state.openDialog}
            message={this.state.encrypted}
            decrypt={this.handleDecrypt}
          />
        }
        </center>
      </div>
    );
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('app'),
);
