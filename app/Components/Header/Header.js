import { Row, Col } from 'antd'
import React from 'react'
import './style.css'

export const SimpleHeader = ({title, subTitle, hostUrl}) => (
    <header>
    <Row gutter={8}>
        <Col span={6}>
            <a className="title" href={ hostUrl || '#' }>
                <span>{ title }</span>
                <span className="subTitle">{ subTitle }</span>
            </a>
        </Col>
        <Col span={18}>
        </Col>
    </Row>
    </header>
)