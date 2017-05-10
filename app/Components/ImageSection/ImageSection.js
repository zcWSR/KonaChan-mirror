import * as Rx from 'rxjs/Rx'
import React from 'react'
import { JSONP, Http, host } from '../../Utils/Http'
import { Row, Col, Spin, Button } from 'antd'
import { SimpleImgCard } from './ImageCard/ImageCard'

import './style.css'

export class Loading extends React.Component {
    constructor() {
        super();
    }

    onReload() {
        this.props.onReload();
    }
    render() {
        return (
            <Row>
            {
                this.props.state != 0 ?
                    this.props.state == 1 ?
                        (<div className="loading">
                            <Spin spinning={true} />
                            <div><span className="loading-content">loading...</span></div>
                        </div>) :
                        this.props.state == -1 ?
                            (<div className="loading">
                                <div><span className="loading-content">没有更多了</span></div>
                            </div>) :
                            (<div className="loading">
                                <Button type="primary" onClick={() => this.onReload()}>出现错误，滚动或点击重试</Button>
                            </div>):
                null
                
            }
            </Row>
        )
    }
}

export class ImageSection extends React.Component {
    constructor() {
        super();
        this.state = {
            tag: '',
            safe: false,
            page: 1,
            loading: false,
            col_0_imgs: [],
            col_1_imgs: [],
            col_2_imgs: [],
            col_3_imgs: [],
            colHeight: [0, 0, 0, 0]
        }
        this.imgListObservable = null;
        this.imgListSubscriber = null

        window.addEventListener('scroll', () => this.checkScroll());

    }

    checkScroll() {
        let bodyHeight = document.body.scrollHeight;
        let currentHeight = document.body.scrollTop + document.body.offsetHeight;
        if (bodyHeight - currentHeight <= 50)
            this.loadMore();
    }

    loadMore() {
        if (this.state.loading != -1) {
            this.setState(prevState => ({
                page: ++prevState.page,
            }))
            this.imgListObservable.next({tag: this.state.tag, page: this.state.page})
        }
    }

    onReload() {
        this.imgListObservable.next({tag: this.state.tag, page: this.state.page});
    }

    componentDidMount() {
        /**
         * 传入的数据结构为：
         * {
         *     tag: xx
         *     page: xx,
         * }
         */
        this.imgListObservable
            = new Rx.Subject()
                .switchMap(value => {
                    this.setState({
                        loading: 1
                    });
                    return JSONP.observable(`${host}/post`, 
                        {tags: `${this.state.safe ? 'rating:safe+' : ''}${value.tag}`,
                         page: value.page, 
                         callback: 'callback'}
                    );
                })
                .retry();

        this.imgListSubscriber = this.imgListObservable.subscribe({
            next: imgList => {
                this.setImgs(imgList);
                this.setState({
                    loading: imgList.length == 0 ? -1 : 0,
                })
            },
            error: error => {
                this.setState({
                    loading: -2,
                })
            }
        })

        this.imgListObservable.next({tag: '', page: 1});
    }

    componentWillReceiveProps(nextProps) {
        let {tag, safe} = nextProps;

        if (tag != this.props.tag) {
            console.log(`nextTag: ${tag}`);
            if (tag != this.state.tag) {
                this.setState({
                    tag: tag,
                    page: 1,
                    safe: safe,
                    col_0_imgs: [],
                    col_1_imgs: [],
                    col_2_imgs: [],
                    col_3_imgs: [],
                    colHeight: [0, 0, 0, 0]
                },
                () => {
                    this.imgListObservable.next({tag: this.state.tag, page: this.state.page});
                });
            }
        }
        if (safe != this.props.safe) {
            console.log(`save mode: ${safe ? 'on' : 'off'}`);
            this.setState({
                    tag: tag,
                    page: 1,
                    safe: safe,
                    col_0_imgs: [],
                    col_1_imgs: [],
                    col_2_imgs: [],
                    col_3_imgs: [],
                    colHeight: [0, 0, 0, 0]
                },
                () => {
                    this.imgListObservable.next({tag: this.state.tag, page: this.state.page});
                });
        }
    }

    setImgs(imgList) {
        for(let imgInfo of imgList) {
            let index = this.indexOfSmallest(this.state.colHeight);

            let colHeight = this.state.colHeight;
            colHeight[index] = colHeight[index] + imgInfo.preview_height / imgInfo.preview_width
            
            this.setState(prevState => ({
                [`col_${index}_imgs`]: prevState[`col_${index}_imgs`]
                    .concat(<SimpleImgCard key={imgInfo.id} info={imgInfo} group={index} />),
                colHeight: colHeight
            }));
        }
    }

    indexOfSmallest(list) {
        let lowest = 0;
        for (var i = 1; i < list.length; i++) {
            if (list[i] < list[lowest]) lowest = i;
        }
        return lowest;
    }

    render() {
        const loadingBtn = this.state.loadMore ? <Loading /> : null;
        return (
            <div ref="content">
                <Row gutter={15} className="images-wrapper">
                    <Col span={6}>{ this.state.col_0_imgs }</Col>
                    <Col span={6}>{ this.state.col_1_imgs }</Col>
                    <Col span={6}>{ this.state.col_2_imgs }</Col>
                    <Col span={6}>{ this.state.col_3_imgs }</Col>
                </Row>
                <Loading state={this.state.loading} onReload={() => this.onReload()} />
            </div>
        )
    }
}