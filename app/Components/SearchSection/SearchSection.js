import React from 'react'
import { SearchBar } from './SearchBar/SearchBar'
import './style.css'

export class SearchSection extends React.Component {
    constructor(props) {
        super(props);
    }
    onGetResult(value) {
        this.props.onGetSearchTag(value);
    }
    render() {
        return (
            <div className="search-section">
                <SearchBar placeholder="input tag" onGetResult={value => this.onGetResult(value)}/>
                <ul className="search-option">
                    <li></li>
                    <li></li>
                </ul>
            </div>
        )
    }
}