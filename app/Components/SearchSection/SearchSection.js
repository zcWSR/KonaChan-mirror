import React from 'react'
import { SearchBar } from './SearchBar/SearchBar'
import { Switch, Affix } from 'antd'
import './style.css'

export class SearchSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            safe: true
        }
    }

    onGetResult(value) {
        this.props.onGetSearchTag(value);
    }

    onSafeSwitchChange() {
        this.setState(prevState => ({
            safe: !prevState.safe
        }),
        () => {
            this.props.onSafeSwitchChange(this.state.safe);
        });
    }
    render() {
        return (
            <Affix offsetTop={45}>
                <div className="search-section">
                    <SearchBar placeholder="input tag" keyword={this.props.tag} onGetResult={value => this.onGetResult(value)}/>
                    <div className="search-option-item">
                        safe mode: <Switch defaultChecked={true} checked={this.state.safe} onChange={() => this.onSafeSwitchChange()} />
                    </div>
                </div>
            </Affix>
        )
    }
}