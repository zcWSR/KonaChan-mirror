import * as Rx from 'rxjs/Rx'
import { Spin, Icon, Button, Input, AutoComplete } from 'antd';
import React from 'react'
import { JSONP, host } from '../../../Utils/Http'
import './style.css'

const Option = AutoComplete.Option;
export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            dataSource: [],
            loading: false,
        }
        this.searchObservable = null;
        this.searchSubscriber = null;
        this.pattern = new RegExp("[`~!@#$^&*()=|{}':;',/\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
    }

    onSearch(value) {
        // this.setState({
        //     dataSource: []
        // })
        this.setState({
            keyword: value
        }, () => {
            this.searchObservable.next(value);
        });
    }

    onGetResult(value) {
        this.props.onGetResult(value);
    }

    componentWillReceiveProps({ keyword }) {
        this.setState({ keyword });
    }

    componentDidMount() {
        this.searchObservable
            = new Rx.Subject()
                .debounceTime(500)
                .map(keyword => keyword.replace(this.pattern, ''))
                .map(keyword => keyword.replace(/(^\s+)|(\s+$)/g,''))
                .map(keyword => keyword.toLowerCase())
                .filter(value => value !== '')
                .distinctUntilChanged()
                .switchMap(keyword => {
                    this.setState({
                        loading: true
                    });
                    return JSONP.observable(`${host}/tag`,
                     {name: keyword,
                      callback: 'tag_callback'}
                    );
                })
                .map(tagList => {
                    tagList.sort((a, b) => b.count - a.count)
                    return tagList;
                });

        this.searchSubscriber = this.searchObservable.subscribe({
            next: tagList => {
                this.setState({
                    dataSource: this.mapSearchItems(tagList),
                    loading: false,
                })
            },
            error: error => {
                this.setState({
                    dataSource: this.searchError(),
                    loading: false,
                })
                //console.error(error);
            }
        })
    }

    mapSearchItems(tagList) {
        if (tagList.length == 0){
            return [<Option key='0' value=''>
                <a rel="noopener noreferrer">没有结果</a>
            </Option>];
        } else {
            return tagList.map((tag) => (
                    <Option key={tag.id} value={tag.name}>
                        <div className="line-limit-length">
                            <a rel="noopener noreferrer">
                                {tag.name}
                            </a>
                        </div>
                        <span className="search-item-count">{tag.count} 个结果</span>
                    </Option>
                ))
        }
    }

    searchError() {
        return [<Option key='0' value=''>
            <a rel="noopener noreferrer">ERROR</a>
        </Option>];
    }

    render() {
        const placeholder = this.props.placeholder || 'input';
        const defaultValue = this.props.defaultValue || null;
        let { dataSource, keyword } = this.state;
        const suffix = this.state.loading ? <Spin size="small" /> : <Icon className="search-btn" type="search" onClick={() => this.onGetResult(this.state.keyword)} />;

        return (
            <div className="search-bar">
                <AutoComplete
                    size="large"
                    style={{ width: '100%' }}
                    dataSource={dataSource}
                    onSelect={value => this.onGetResult(value)}
                    value={keyword}
                    onSearch={value => this.onSearch(value)}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    optionLabelProp="value"
                >
                    <Input suffix={suffix} />
                </AutoComplete>
            </div>
        );
    }

    
}