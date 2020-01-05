import React from 'react';
import firebase from '../../firebase';
import {Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Register extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false,
  }

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      error = { message: 'Fill in all fields'};
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: 'Password is invalid' };
      this.setState({ errors: errors.concat(error) })
      return false;
    } else {
      //valid
      return true;
    }
  }

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return !username.length || !email.length || !password.length || !passwordConfirmation.length;

  }

  isPasswordValid = ({ password, passwordConfirmation}) => {
    if(password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true
    }
  }

  displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()
    if(this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          console.log(createdUser);
          this.setState({ loading: false })
        })
        .catch(err => {
          console.error(err)
          this.setState({ errors: this.state.errors.concat(err), loading: false });
        })
    }
  }

  handleInputError = (errors, input) => {
    return errors.some(error => 
      error.message.toLowerCase().includes(input)
    )
      ? "error"
      : "";
  }

  render(){
    const { 
      username, 
      email, 
      password, 
      passwordConfirmation,
      errors,
      loading
    } = this.state

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                className={this.handleInputError(errors, "username")}
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                value={username}
                type="text"
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                className={this.handleInputError(errors, "email")}
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                value={email}
                type="email"
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                className={this.handleInputError(errors, "password")}
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                value={password}
                type="password"
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                className={this.handleInputError(errors, "password")}
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                value={passwordConfirmation}
                type="password"
                onChange={this.handleChange}
              />

              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="orange"
                fluid
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Already a user? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;