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

const TagList = ({tagString}) => (
    <div className="tag-section">
        <ul>
        {
            tagString.split(' ')
                .map((tag, i) => 
                    <li key={i}><div className="tag-section-item">{tag}</div></li>
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
        
        // switch(this.props.group) {
        //     case '0': 
        //     case '1': this.popoverPlacement = 'right'; break;
        //     case '2':
        //     case '3': this.popoverPlacement = 'left'; break;
        // }
        this.popoverTitle = <p>ID: { imgInfo.id }</p>
        this.popoverContent = (
            <ul className="popover-content">
                <li key="0">tags: <TagList tagString={imgInfo.tags} /></li>
                <li key="1">created at: { new Date(imgInfo.created_at).toLocaleDateString() }</li>
                <li key="2">author: { imgInfo.author}</li>
                <li key="3">file size: {(imgInfo.file_size/1024/1024).toFixed(2)}MB</li>
                <li key="4">jpeg file size: {imgInfo.jpeg_file_size != 0 ? (imgInfo.jpeg_file_size/1024/1024).toFixed(2) + 'MB' : 'unknow'}</li>
                <li key="5">source: <a href={imgInfo.source} target="_blank">{imgInfo.source}</a></li>
            </ul>
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
                    <a href={`http://konachan.net/post/show?md5=${imgInfo.md5}`} target="_blank">
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