import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, NavLink} from 'reactstrap';
import {connect} from 'react-redux';
import {login} from '../../actions/loginUser';
import {clearErrors} from '../../actions/error';
import {Login} from "../../interfaces/Login";
import {Target} from "../../interfaces/Target";
import {AuthProps} from "../../interfaces/AuthProps";

const LoginModal = ({
                      isAuthenticated,
                      error,
                      login,
                      clearErrors
                    }: Login) => {
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);

  const handleToggle = useCallback(() => {
    clearErrors();
    setModal(!modal);
  }, [clearErrors, modal]);

  const handleChangeEmail = (e: Target) => setEmail(e.target.value);
  const handleChangePassword = (e: Target) => setPassword(e.target.value);

  const handleOnSubmit = (e: any) => {
    e.preventDefault();

    const user = {email, password};

    login(user);
  };

  useEffect(() => {
    if (error.id === 'LOGIN_FAIL') {
      setMsg(error.msg.msg);
    } else {
      setMsg(null);
    }

    if (modal) {
      if (isAuthenticated) {
        handleToggle();
      }
    }
  }, [error, handleToggle, isAuthenticated, modal]);

  return (
    <div>
      <NavLink onClick={handleToggle} href="#">
        Login
      </NavLink>

      <Modal isOpen={modal} toggle={handleToggle}>
        <ModalHeader toggle={handleToggle}>Login</ModalHeader>
        <ModalBody>
          {msg ? <Alert color="danger">{msg}</Alert> : null}
          <Form>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className="mb-3"
                onChange={handleChangeEmail}
              />

              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                className="mb-3"
                onChange={handleChangePassword}
              />
              <Button
                color="dark"
                style={{marginTop: '2rem'}}
                block
                onClick={handleOnSubmit}
              >
                Login
              </Button>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: AuthProps) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
});

export default connect(mapStateToProps, {login, clearErrors})(LoginModal);
