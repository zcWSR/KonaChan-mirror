import React from 'react'
import { Layout } from 'antd'
import { SimpleHeader } from '../../Components/Header/Header'
import { Main } from '../../Components/Main/Main'
import { SimpleFooter } from '../../Components/Footer/Footer'
import './style.css'

export class Root extends React.Component {
    render() {
        return (
            <Layout>
                <SimpleHeader title="KonaChan" subTitle="mirror" />
                <Main />
                <SimpleFooter content="自豪的使用React" />
            </Layout>
        )
    }
}