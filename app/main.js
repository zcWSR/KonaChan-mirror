import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from './Components/Root/Root'
import './style.css'
ReactDOM.render(
    <Root />,
    document.getElementById('react-content')
);
window.onerror = () => false;

