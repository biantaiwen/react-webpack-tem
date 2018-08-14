import './base/index.scss';
import 'normalize.css';
import FastClick from 'fastclick';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

document.addEventListener('DOMContentLoaded', () => {
    FastClick.attach(document.body);
}, false);

ReactDOM.render( <App /> , document.getElementById('root'));
