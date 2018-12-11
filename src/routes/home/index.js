import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Breadcrumb, Icon, Row, Col, Tag, Table, BackTop, Input } from 'antd';
import { Line } from '@components'

import '@routes/home/index.less'

import { connect } from 'dva';
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider, } = Layout;


class HomePage extends Component {

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({ type: 'document/loadData' });
    }

    renderExtensionLinks = () => {
        const { links } = this.props;
        return links.map(link => {
            return (
                <Menu.Item key={link.name}>
                    <Icon type={link.icon} />
                    <span>{link.name}</span>
                </Menu.Item>
            )
        })
    }

    buildMenus = () => {
        const { document } = this.props;

    }

    renderDocumentTitle = () => {
        const { info } = this.props;
        return (
            <Row type="flex" justify="center" align="middle" style={{ height: 148, textAlign: 'center', color: "rgba(0, 0, 0, 0.65)" }}>
                {info && info.title || 'NOYA DOCUMENTATION'}
            </Row>
        )
    }

    renderMenus = () => {
        const { tags, menus } = this.props;

        const buildChildren = (tag) => {
            const ms = menus.filter(x => x.tag == tag) || [];
            return ms.map(menu => {
                return (
                    <Menu.Item key={menu.id}>{menu.name}</Menu.Item>
                )
            });
        }

        return tags.map(tag => {
            const children = buildChildren(tag.name);
            return (
                <SubMenu key={tag.name} title={<span><Icon style={{ fontSize: 12 }} type="caret-right" />{tag.description || tag.name}</span>}>
                    {children}
                </SubMenu>
            )
        })
    }

    renderRequestParams = () => {
        const requestParamsColumn = [{
            title: '请求参数',
            dataIndex: 'name',
            width: 150,
        }, {
            title: '数据类型',
            dataIndex: 'data_type',
        }, {
            title: '约束',
            dataIndex: 'required',
        }, {
            title: '描述',
            dataIndex: 'description',
        }];

        return (
            <Table bordered pagination={false} columns={requestParamsColumn} dataSource={[
                    { name: "anonymous", data_type: "Boolean", required: "Max length: 500", description: "投票选项" }
                ]} />
        )


    }

    render() {



        const responseParamsColumn = [{
            title: '返回数据属性',
            dataIndex: 'name',
            width: 150,
        }, {
            title: '类型',
            dataIndex: 'data_type',
        }, {
            title: '描述',
            dataIndex: 'description',
        }];


        const returnCodeParamsColumn = [
            {
                title: '状态码',
                width: 150,
                dataIndex: 'status',
            }, {
                title: '代码',
                dataIndex: 'code',
            }, {
                title: '说明',
                dataIndex: 'message',
            }];
        return (
            <Layout>
                <BackTop visibilityHeight={300} />
                <Content className="content" >
                    <Layout style={{ padding: '15px 0', background: '#fff' }}>
                        <Sider width={240} style={{ background: '#fff' }}>
                            <Menu mode="inline" style={{ height: '100%' }}>
                                {this.renderDocumentTitle()}
                                {this.renderExtensionLinks()}
                                <Row style={{ height: 20 }}></Row>
                                {this.renderMenus()}
                            </Menu>
                        </Sider>
                        <Content style={{ padding: '0 40px', minHeight: 1000 }}>
                            <Breadcrumb style={{ margin: '20px 0' }}>
                                <Breadcrumb.Item>用户</Breadcrumb.Item>
                                <Breadcrumb.Item>获取用户列表</Breadcrumb.Item>
                            </Breadcrumb>
                            <Line />
                            <Row>
                                <Col span={2}>
                                    <Tag>GET</Tag>
                                </Col>
                                <Col span={22}>http://139.224.234.155/api/users</Col>
                            </Row>
                            <Line type="dashed" />
                            <Line type="dashed" />
                            <Row style={{ position: "relative" }}>
                                <span className="pre-code-span">请求示例</span>
                                <pre>
                                    {'{\n\t"name": "多媒体会议室",\n\t"current": 1,\n\t"page_size": 10,\n\t"sort": "Name",\n\t"descending": false\n}'}
                                </pre>
                            </Row>
                            <Line type="dashed" />
                            <Table
                                bordered
                                pagination={false}
                                columns={responseParamsColumn} dataSource={[
                                    { name: "anonymous", data_type: "Boolean", required: "Max length: 500", description: "投票选项" }
                                ]} />

                            <Line type="dashed" />
                            <Row style={{ position: "relative" }}>
                                <span className="pre-code-span">结果示例</span>
                                <pre>
                                    {'{\n\t"name": "多媒体会议室",\n\t"current": 1,\n\t"page_size": 10,\n\t"sort": "Name",\n\t"descending": false\n}'}
                                </pre>
                            </Row>
                            <Line type="dashed" />
                            <Table
                                pagination={false}
                                bordered
                                columns={returnCodeParamsColumn} dataSource={[
                                    { status: 400, code: "VOTE_NOT_BEGIN", message: "投票尚未开始" },
                                    { status: 400, code: "VOTE_END", message: "投票已结束" },
                                    { status: 404, code: "VOTE_RECORD_ID_NOTE_INVALID", message: "未找到指定投票" }
                                ]} />
                        </Content>
                    </Layout>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    NOYA ©2018
    </Footer>
            </Layout>
        );
    }
}


export default connect(({ document, loading }) => {
    return {
        data: document.data,
        info: document.info,
        links: document.links || [],
        tags: document.tags,
        menus: document.menus,
        loading: loading.effects['document/loadData']
    }
})(HomePage);