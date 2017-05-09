import React from 'react'
import { Row, Col } from 'antd'
import './style.css'

export class SimpleFooter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <footer>
                <p>{ this.props.content }</p>
            </footer>
        )
    }
}