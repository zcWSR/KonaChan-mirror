import * as Rx from 'rxjs/Rx';
import React from 'react';
import { List } from 'immutable';
import { JSONP, Http, host } from '../../Utils/Http';
import { Row, Col, Spin, Button } from 'antd';
import { SimpleImgCard } from './ImageCard/ImageCard';

import './style.css'

export class Loading extends React.Component {
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
                                <Button type="primary" onClick={() => this.props.onReload()}>出现错误，滚动或点击重试</Button>
                            </div>):
                <div className="loading">
                    <Button type="primary" onClick={() => this.props.loadMore()}>加载</Button>
                </div>
            }
            </Row>
        );
    }
}

export class ImageSection extends React.Component {
    constructor() {
        super();
        this.state = {
            tag: '',
            safe: true,
            page: 1,
            loading: 0, // 1: loading, 0: loaded, -1: no more, -2: load failed
            col0: List([]),
            col1: List([]),
            col2: List([]),
            col3: List([])
        };
        this.colsHeight = [0, 0, 0, 0];
        this.imgListObservable = null;
        this.imgListSubscriber = null;
        this.scrollObserver = new IntersectionObserver(() => {
            if (this.state.loading === -2) {
                this.onReload();
            }
            if (this.state.loading === 0) {
                this.loadMore()
            }
            
        });
    }

    loadMore() {
        if (this.state.loading !== -1) {
            const { tag, page } = this.state;
            this.setState({
                page: page + 1,
            }, () => {
                this.imgListObservable.next({ tag, page: page + 1 });
            });
        }
    }

    onReload() {
        this.imgListObservable.next({ tag: this.state.tag, page: this.state.page });
    }

    componentDidMount() {
        this.imgListObservable
            = new Rx.Subject()
                .switchMap(data => {
                    const { tag, page } = data;
                    this.setState({
                        loading: 1
                    });
                    return JSONP.observable(`${host}/post`, 
                        {tags: `${this.state.safe ? 'rating:safe+' : ''}${tag}`,
                         page, 
                         callback: 'callback'}
                    );
                })
                .retry();

        this.imgListSubscriber = this.imgListObservable.subscribe({
            next: imgList => {
                this.setImgs(imgList);
                this.setState({
                    loading: imgList.length === 0 ? -1 : 0,
                })
            },
            error: error => {
                this.setState({
                    loading: -2,
                })
            }
        });

        const { tag, page } = this.state;
        this.imgListObservable.next({ tag, page });
        this.scrollObserver.observe(this.refs.sentinels);
    }

    componentWillReceiveProps(nextProps) {
        let { tag, safe } = nextProps;
        if (tag !== this.state.tag || safe !== this.state.safe) {
            console.log(`nextTag: ${tag}`);
            console.log(`save mode: ${safe ? 'on' : 'off'}`);
            this.colsHeight = [0, 0, 0, 0];
            this.setState({
                tag,
                page: 1,
                safe,
                col0: List([]),
                col1: List([]),
                col2: List([]),
                col3: List([])
            },
            () => {
                this.imgListObservable.next({ tag, safe });
            });
        }
    }

    setImgs(imgList) {
        const { col0, col1, col2, col3 } = this.state;
        const cols = { col0, col1, col2, col3 };
        for(let imgInfo of imgList) {
            const index = this.indexOfSmallest(this.colsHeight);
            this.colsHeight[index] += imgInfo.preview_height / imgInfo.preview_width;
            cols[`col${index}`] = cols[`col${index}`].push(imgInfo);
        }
        this.setState(prev => Object.assign(prev, cols));
    }

    indexOfSmallest(list) {
        let lowest = 0;
        for (var i = 1; i < list.length; i++) {
            if (list[i] <= list[lowest]) lowest = i;
        }
        return lowest;
    }

    renderCol(list) {
        return list.toJS().map((item, index) => (
            <SimpleImgCard key={`${item.id}`} info={item} group={index} onClickTag={tag => this.props.onClickTag(tag)} />
        ));
    }

    render() {
        // const loadingBtn = this.state.loadMore ? <Loading /> : null;
        const { col0, col1, col2, col3, loading } = this.state;
        return (
            <div ref="content">
                <Row gutter={15} className="images-wrapper" ref="img_wrapper">
                    <Col span={6}>{this.renderCol(col0)}</Col>
                    <Col span={6}>{this.renderCol(col1)}</Col>
                    <Col span={6}>{this.renderCol(col2)}</Col>
                    <Col span={6}>{this.renderCol(col3)}</Col>
                </Row>
                <div className="sentinels" ref="sentinels" />
                <Loading state={loading} onReload={() => this.onReload()} loadMore={() => this.loadMore()} />
            </div>
        )
    }
}