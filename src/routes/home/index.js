import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Breadcrumb, Icon, Row, Col, Tag, Table, BackTop, Input } from 'antd';
import { Line } from '../../components'

import './index.less'
import { connect } from 'dva';
const { SubMenu } = Menu;
const {
    Header, Content, Footer, Sider,
} = Layout;



class HomePage extends Component {


    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({ type: 'document/loadData' });
    }

    render() {
        return (
            <Layout>
                <BackTop visibilityHeight={300} />
                <Content className="content" >
                    <Layout style={{ padding: '15px 0', background: '#fff' }}>
                        <Sider width={240} style={{ background: '#fff' }}>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['1']}
                                defaultOpenKeys={['sub1']}
                                style={{ height: '100%' }}
                            >

                                <Row type="flex" justify="center" align="middle" style={{ height: 148, textAlign: 'center', color: "rgba(0, 0, 0, 0.65)" }}>
                                    NOYA DOCUMENTION
                                </Row>


                                <Menu.Item key="introduction">
                                    <Icon type="read" />
                                    <span>文档说明</span>
                                </Menu.Item>

                                <Menu.Item key="authorization">
                                    <Icon type="link" />
                                    <span>授权访问</span>
                                </Menu.Item>

                                <Menu.Item key="9">
                                    <Icon type="schedule" />
                                    <span>附录：错误码</span>
                                </Menu.Item>


                                <Row style={{ height: 20 }}></Row>
                                <SubMenu key="sub1" title={<span><Icon style={{ fontSize: 12 }} type="caret-right" />用户授权</span>}>
                                    <Menu.Item key="1">option1</Menu.Item>
                                    <Menu.Item key="2">option2</Menu.Item>
                                    <Menu.Item key="3">option3</Menu.Item>
                                    <Menu.Item key="4">option4</Menu.Item>
                                </SubMenu>
                                <SubMenu key="sub2" title={<span><Icon style={{ fontSize: 12 }} type="caret-right" />任务</span>}>
                                    <Menu.Item key="5">option5</Menu.Item>
                                    <Menu.Item key="6">option6</Menu.Item>
                                    <Menu.Item key="7">option7</Menu.Item>
                                    <Menu.Item key="8">option8</Menu.Item>
                                </SubMenu>
                                <SubMenu key="sub3" title={<span><Icon style={{ fontSize: 12 }} type="caret-right" />Flowplus</span>}>
                                    <Menu.Item key="9">option9</Menu.Item>
                                    <Menu.Item key="10">option10</Menu.Item>
                                    <Menu.Item key="11">option11</Menu.Item>
                                    <Menu.Item key="12">option12</Menu.Item>
                                </SubMenu>
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
                            <Table
                                bordered
                                pagination={false}
                                columns={[{
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
                                }]} dataSource={[
                                    { name: "anonymous", data_type: "Boolean", required: "Max length: 500", description: "投票选项" }
                                ]} />

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
                                columns={[{
                                    title: '返回数据属性',
                                    dataIndex: 'name',
                                    width: 150,
                                }, {
                                    title: '类型',
                                    dataIndex: 'data_type',
                                }, {
                                    title: '描述',
                                    dataIndex: 'description',
                                }]} dataSource={[
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
                                columns={[
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
                                    },]} dataSource={[
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


export default connect(({ document }) => { document })(HomePage);