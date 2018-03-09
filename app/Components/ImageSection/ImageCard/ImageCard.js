import React from 'react'
import ReactDOM from 'react-dom'
import { Popover, Card, Spin, Modal } from 'antd'
import './style.css'

export class Image extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true
        }
    }

   onLoaded() {
        this.setState({
            loading: false
        })
        console.log('loaded');
    }

    onError(ev) {
        this.setState({
            loading: false
        })
        console.log(ev);
    }

    render() {
        return (
            <Spin spinning={this.state.loading} size="large">
                <div 
                    className="custom-image"
                    style={{ paddingBottom: Math.floor(100 * this.props.HighAspectRadio) + "%" }}
                >
                    <img 
                        src={this.props.url}
                        onLoad={() => this.onLoaded()}
                        onError={(ev) => this.onError(ev)}
                    />
                </div>
            </Spin>
        )
    }
}

const TagList = ({tagString, onClickTag}) => (
    <div className="tag-section">
        <ul>
        {
            tagString.split(' ')
                .map((tag, i) => 
                    <li key={i} onClick={() => onClickTag(tag)}><div className="tag-section-item">{tag}</div></li>
                    )
        }
        </ul>
    </div>
)

export class SimpleImgCard extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true
        }
    this.imgInfo = null;
    //this.popoverPlacement = 'top';
    this.popoverTitle = '';
    this.popoverContent = '';

    }

    componentWillMount() {
        this.initPopover();
    }

    initPopover() {
        let imgInfo = this.props.info
        let onClickTag = this.props.onClickTag;
        
        // switch(this.props.group) {
        //     case '0': 
        //     case '1': this.popoverPlacement = 'right'; break;
        //     case '2':
        //     case '3': this.popoverPlacement = 'left'; break;
        // }
        this.popoverTitle = <p>ID: { imgInfo.id }</p>
        this.popoverContent = (
            <div className="popover-content">
                <div className="item" key="0">
                    <span className="label">tags: </span>
                    <span className="content"><TagList tagString={imgInfo.tags} onClickTag={tag => onClickTag(tag)} /></span>
                </div>
                <div className="item" key="1">
                    <span className="label">created at: </span>
                    <span className="content">{ new Date(imgInfo.created_at).toLocaleDateString() }</span>
                </div>
                <div className="item" key="2">
                    <span className="label">author: </span>
                    <span className="content">{ imgInfo.author}</span>
                </div>
                <div className="item" key="3">
                    <span className="label">file size: </span>
                    <span className="content">{(imgInfo.file_size/1024/1024).toFixed(2)}MB</span>
                </div>
                <div className="item" key="4">
                    <span className="label">jpeg file size: </span>
                    <span className="content">{imgInfo.jpeg_file_size != 0 ? (imgInfo.jpeg_file_size/1024/1024).toFixed(2) + 'MB' : 'unknow'}</span>
                </div>
                <div className="item" key="5">
                    <span className="label">source: </span>
                    <span className="content"><a href={imgInfo.source} target="_blank">{imgInfo.source}</a></span>
                </div>
            </div>
        )
    }

    onClickImg() {
        let imgInfo = this.props.info
        Modal.info({
            type: 'primary',
            iconType: null,
            title: <p>ID: { imgInfo.id }</p>, 
            content: <Image 
                        url={imgInfo.sample_url}
                        HighAspectRadio={imgInfo.preview_height / imgInfo.preview_width}
                        crossField = {true}
                     />,
            width: '65%'
        });
    }


    render() {
        const imgInfo = this.props.info;
        return (
            <Popover title={this.popoverTitle} content={this.popoverContent}>
                <Card className="img-card enter-stage" bodyStyle={{ padding: 0 }}>
                    <a href={`http://konachan.${imgInfo.rating == 's' ? 'net': 'com'}/post/show?md5=${imgInfo.md5}`} target="_blank">
                        <Image 
                            url={imgInfo.preview_url}
                            HighAspectRadio={imgInfo.preview_height / imgInfo.preview_width}
                        />
                    </a>
                    <div className="custom-content">
                        <h3>author: {imgInfo.author}</h3>
                        <span>
                            {imgInfo.jpeg_width || imgInfo.sample_width}x{imgInfo.jpeg_height || imgInfo.sample_height}
                        </span>
                    </div>
                </Card>
            </Popover>
        )
    }
}