import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import grayLogo from '../../../assets/images/logo-light.svg';
import Button from '../../../common/Button/Button';
import AuthScreenContainer from '../common/CommonAuthScreen/AuthScreenContainer';
import BigInput from '../../../common/BigInput/BigInput';
import { loginUser } from './redux/LoginAction';
import { errorNotification } from '../../../common/Toast';
import { checkForEmail, replaceHiddenCharacters } from '../../../helpers/ValidationHelper';
import { clearAuthToken } from '../../../helpers/LocalStorageHelper';
import { LOGIN_REDUX_CONSTANTS } from './redux/LoginReduxConstants';
import { saveAppliedFilters } from '../../../common/ListFilters/redux/ListFiltersAction';

function LoginScreen() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [rememberUser, setRememberUser] = useState(false);
  const { logInButtonLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  const onClickLogin = async () => {
    if (email.toString().trim().length === 0) errorNotification('You forgot to enter email!');
    else if (!checkForEmail(replaceHiddenCharacters(email)))
      errorNotification('Please enter a valid email');
    else if (replaceHiddenCharacters(password.toString()).trim().length === 0)
      errorNotification('Please enter password');
    else {
      try {
        await dispatch(loginUser({ email, password }));
        dispatch(
          saveAppliedFilters('applicationListFilters', {
            status:
              'SENT_TO_INSURER,REVIEW_APPLICATION,UNDER_REVIEW,PENDING_INSURER_REVIEW,AWAITING_INFORMATION,DRAFT,REVIEW_SURRENDERED',
          })
        );
        history.replace('/dashboard');
      } catch (e) {
        /**/
      }
    }
  };

  const onChangeEmail = e => {
    const emailText = e.target.value;

    setEmail(emailText);
  };

  const onChangePassword = e => {
    const passwordText = e.target.value;

    setPassword(passwordText);
  };

  // const onChangeRememberUser = e => {
  //   setRememberUser(e.target.checked);
  // };

  const onEnterKeyPress = async e => {
    if (e.keyCode === 13) {
      await onClickLogin();
    }
  };

  useEffect(() => {
    dispatch({
      type: LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION,
    });
    clearAuthToken();
  }, []);

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

      <div className="login-field-name">Password</div>
      <BigInput
        prefix="lock_open"
        prefixClass="login-input-icon"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={onChangePassword}
        onKeyDown={onEnterKeyPress}
      />
      <div className="login-action-row">
        {/* <Checkbox title="Remember me" checked={rememberUser} onChange={onChangeRememberUser} /> */}
        <Link to="/forgot-password" className="login-module-link">
          Forgot Password?
        </Link>
      </div>
      <Button
        title="Login"
        buttonType="secondary"
        onClick={onClickLogin}
        isLoading={logInButtonLoaderAction}
      />
      <img alt="TCR" className="gray-logo" src={grayLogo} />
    </AuthScreenContainer>
  );
}

export default LoginScreen;
