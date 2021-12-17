import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './App';
import appReducer from './reducers/index'

const store = createStore(appReducer)
document.addEventListener("DOMContentLoaded", function () {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.REACT_APP_RECAPTCHA_SITEKEY}`;
    script.async = true;
    document.head.appendChild(script);
    script.onload = () => {
      function getCaptcha() {
        return new Promise((res, rej) => {
          window.grecaptcha.ready(() => {
            window.grecaptcha
              .execute(process.env.REACT_APP_RECAPTCHA_SITEKEY, {
                action: "submit",
              })
              .then((token) => {
                return res(token);
              })
              .catch((err) => {
                console.log(err);
              });
          });
        });
      }
      window.getReCaptchaToken = getCaptcha;
    };
  });
ReactDOM.render(
    <Provider store={store}>
         <React.StrictMode>
            <App />
        </React.StrictMode>
    </Provider>,
    document.getElementById('root')
);
