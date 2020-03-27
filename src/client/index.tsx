import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './app';

import './styles/global.pcss';

import('../../pkg/calculator.js');

ReactDOM.render(<App />, document.getElementById('root'));
