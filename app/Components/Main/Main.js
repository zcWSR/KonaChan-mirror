import React from 'react'
import { Row, Col } from 'antd'
import { SearchSection } from '../SearchSection/SearchSection'
import { ImageSection } from '../ImageSection/ImageSection'
import './style.css'

export class Main extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            tag: ''
        }
    }

    onGetSearchTag(tag) {
        this.setState({
            tag: tag
        })
    }


    render() {
        return (
            <div className="main-wrapper">
                <Row gutter={8}>
                    <Col span={5}>
                        <SearchSection onGetSearchTag={tag => this.onGetSearchTag(tag)} />
                    </Col>
                    <Col span={19}>
                        <ImageSection tag={this.state.tag} />
                    </Col>
                </Row>
            </div>
            
        )
    }

}