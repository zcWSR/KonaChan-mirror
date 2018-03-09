import React from 'react'
import { Row, Col } from 'antd'
import { SearchSection } from '../SearchSection/SearchSection'
import { ImageSection } from '../ImageSection/ImageSection'
import './style.css'

export class Main extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            tag: '',
            safe: false
        }
    }

    onGetSearchTag(tag) {
        this.setState({
            tag: tag
        })
    }

    onSafeSwitchChange(isSafe) {
        this.setState({
            safe: isSafe
        })
    }

    onClickTag(tag) {
        this.setState({ tag });
    }

    render() {
        return (
            <div className="main-wrapper">
                <Row gutter={8}>
                    <Col span={5} style={{ marginTop: '25px' }}>
                        <SearchSection
                            tag={this.state.tag}
                            onGetSearchTag={tag => this.onGetSearchTag(tag)} 
                            onSafeSwitchChange={isSafe => this.onSafeSwitchChange(isSafe)} 
                        />
                    </Col>
                    <Col span={19}>
                        <ImageSection tag={this.state.tag} safe={this.state.safe} onClickTag={tag => this.onClickTag(tag)}  />
                    </Col>
                </Row>
            </div>
        )
    }

}