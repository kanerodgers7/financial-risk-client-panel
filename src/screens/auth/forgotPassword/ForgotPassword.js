import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import AuthScreenContainer from '../common/CommonAuthScreen/AuthScreenContainer';
import Button from '../../../common/Button/Button';
import BigInput from '../../../common/BigInput/BigInput';
import { errorNotification } from '../../../common/Toast';
import { checkForEmail, replaceHiddenCharacters } from '../../../helpers/ValidationHelper';
import { forgotPassword } from './redux/ForgotPasswordAction';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const { forgotPasswordButtonLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? {}
  );
  const history = useHistory();

  const onChangeEmail = e => {
    const emailText = e.target.value;
    setEmail(emailText);
  };

  const onClickForgotPassword = async () => {
    if (email?.toString()?.trim()?.length === 0) errorNotification('Please enter email');
    else if (!checkForEmail(replaceHiddenCharacters(email)))
      errorNotification('Please enter a valid email');
    else {
      try {
        await forgotPassword(email?.trim());
        history.push(`/verify-otp?email=${email}`);
      } catch (e) {
        /**/
      }
    }
  };

  const onEnterKeyPress = async e => {
    if (e.keyCode === 13) {
      await onClickForgotPassword();
    }
  };

  return (
    <AuthScreenContainer>
      <div className="login-field-name">Email</div>
      <BigInput
        prefix="drafts"
        prefixClass="login-input-icon"
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={onChangeEmail}
        onKeyDown={onEnterKeyPress}
      />
      <div className="login-action-row">
        <div />
        <Link to="/login" className="login-module-link">
          Back To Login
        </Link>
      </div>
      <Button
        title="Send OTP"
        buttonType="secondary"
        onClick={onClickForgotPassword}
        isLoading={forgotPasswordButtonLoaderAction}
      />
    </AuthScreenContainer>
  );
}

export default ForgotPassword;
