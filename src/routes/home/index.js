import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Breadcrumb, Icon, Row, Col, Tag, Table, BackTop, Input } from 'antd';
import { Line } from '@components'

import '@routes/home/index.less'

import { connect } from 'dva';
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider, } = Layout;


class HomePage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      item: null
    }
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'document/loadData' });
  }


  extractReponseProperties = (item) => {
    const { data } = this.props;
    const responses = item.detail.responses;
    let properties = [];
    let index = 1;
    if (responses['200'] && responses['200'].schema) {
      if (responses['200'].schema.additionalProperties) {
        properties.push({
          key: index++,
          name: '无',
          type: responses['200'].schema.additionalProperties.type,
          description: responses['200'].description
        });

        return properties;
      }
      if (responses['200'].schema.type) {
        properties.push({
          key: index++,
          name: '无',
          type: responses['200'].schema.type,
          description: responses['200'].description
        });
        return properties;
      }
      const className = this.parseRefClassNamme(responses['200'].schema);
      properties = this.getDefinitionsProperties(className);
    }
    return properties;
  }

  getDefinitionsProperties = (className) => {
    const { data } = this.props;
    const { definitions } = data;
    if (!className) {
      return [];
    }
    let index = 1;
    let properties = [];
    for (let key in definitions[className].properties) {
      const property = definitions[className]['properties'];
      const type = property[key] ? property[key].type : ''
      if (property[key].$ref) {
        type = '$ref:' + property[key].$ref.substring(property[key].$ref.lastIndexOf('/') + 1);
      }
      properties.push({
        key: index++,
        name: key,
        in: 'body',
        type: type,
        description: property[key] ? property[key].description : ''
      })
    }

    return properties;
  }

  extractReponseCode = (item) => {
    const responses = item.detail.responses;
    let codes = [];
    let index = 1;

    for (let c in responses) {
      // if (c !== '200') {
      codes.push({
        key: index++,
        status: c,
        code: '',
        message: responses[c].description
      });
      // }
    }
    return codes;
  }

  parseRefClassNamme = (schema) => {

    if (schema.$ref) {
      return schema.$ref.substring(schema.$ref.lastIndexOf('/') + 1);
    }
    if (schema.items && schema.items.$ref) {
      return schema.items.$ref.substring(schema.items.$ref.lastIndexOf('/') + 1);
    }
  }

  handleDetailChange = (item) => {
    this.setState({ item });
  }

  renderExtensionLinks = () => {
    const { links } = this.props;
    return links.map(link => {
      return (
        <Menu.Item key={link.name}>
          <Icon type={link.icon} />
          <span>
            <a onClick={this.renderLinkPage}>{link.name}</a>
          </span>
        </Menu.Item>
      )
    })
  }

  renderLinkPage = () => {

  }

  buildMenus = () => {
    const { document } = this.props;
  }

  renderDocumentTitle = () => {
    const { info } = this.props;
    return (
      <Row type="flex" justify="center" align="middle" style={{ height: 148, textAlign: 'center', color: "rgba(0, 0, 0, 0.65)" }}>
        {info && info.title && info.title.toUpperCase() || 'NOYA DOCUMENTATION'}
      </Row>
    )
  }


  renderMenus = () => {
    const { tags, menus } = this.props;

    const buildChildren = (tag) => {
      const ms = menus.filter(x => x.tag == tag) || [];
      return ms.map(menu => {
        return (
          <Menu.Item key={menu.id}><a onClick={() => { this.handleDetailChange(menu) }}>{menu.name}</a></Menu.Item>
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

    const { item } = this.state;
    const that = this;

    const requestParamsColumn = [{
      title: '请求参数',
      dataIndex: 'name',
      width: 150,
    }, {
      title: 'in',
      dataIndex: 'in',
    }, {
      title: '数据类型',
      dataIndex: 'type',
      render: (text) => {
        if (text.indexOf('$ref') > -1) {
          const className = text.substring(text.lastIndexOf(':') + 1);
          return <a onClick={() => { that.renderModel(className) }}>{className}</a>;
        }
        return text;
      }
    }, {
      title: '约束',
      dataIndex: 'required',
      render: (text, record) => text ? 'required' : '',
    }, {
      title: '描述',
      dataIndex: 'description',
    }];

    let parameters = item.detail.parameters && item.detail.parameters.filter(x => x.in == "query" || x.in == "path" || x.in == "formData");
    const body = item.detail.parameters && item.detail.parameters.filter(x => x.in == "body");

    if (body && body[0] && body[0].schema) {
      const className = this.parseRefClassNamme(body[0].schema)
      parameters = this.getDefinitionsProperties(className).concat(parameters);
    }

    return (
      <Row>
        <Line type="dashed" />
        <Table bordered pagination={false} columns={requestParamsColumn} dataSource={parameters} />
      </Row>
    )
  }

  renderModel = (className) => {
    return null;
  }

  renderResponseParams = () => {
    const { item } = this.state;

    const that = this;
    const responseParamsColumn = [{
      title: '返回数据属性',
      dataIndex: 'name',
      width: 150,
    }, {
      title: '类型',
      dataIndex: 'type',
      render: (text) => {
        if (text.indexOf('$ref') > -1) {
          const className = text.substring(text.lastIndexOf(':') + 1);
          return <a onClick={() => { that.renderModel(className) }}>{className}</a>;
        }
        return text;
      }
    }, {
      title: '描述',
      dataIndex: 'description',
    }];

    const properties = this.extractReponseProperties(item);
    return (
      <Row>
        <Line type="dashed" />
        <Table
          bordered
          pagination={false}
          columns={responseParamsColumn} dataSource={properties} />
      </Row>
    )
  }
  renderRequestExample = () => {

    return null;

    return (
      <Row>
        <Line type="dashed" />
        <Row style={{ position: "relative" }}>
          <span className="pre-code-span">请求示例</span>
          <pre>

          </pre>
        </Row>
      </Row>
    )
  }

  renderResponseExample = () => {
    return null;
    return (
      <Row>
        <Line type="dashed" />
        <Row style={{ position: "relative" }}>
          <span className="pre-code-span">结果示例</span>
          <pre>
            {'{\n\t"name": "多媒体会议室",\n\t"current": 1,\n\t"page_size": 10,\n\t"sort": "Name",\n\t"descending": false\n}'}
          </pre>
        </Row>
      </Row>
    )
  }

  renderReturnCode = () => {
    const { item } = this.state;
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
    const codes = this.extractReponseCode(item);
    return (
      <Row>
        <Line type="dashed" />
        <Table
          pagination={false}
          bordered
          columns={returnCodeParamsColumn} dataSource={codes} />
      </Row>
    )
  }

  renderRequestUrl = () => {
    const { item } = this.state;
    return (
      <Row>
        <Col span={2}>
          <Tag>{item.method.toUpperCase()}</Tag>
        </Col>
        <Col span={22}>http://localhost:8080{item.path}</Col>
      </Row>
    )
  }
  renderContent = () => {
    const { item } = this.state;
    if (item == null) {
      return null;
    }
    return (
      <Row>
        {this.renderRequestUrl()}
        {this.renderRequestParams()}
        {this.renderRequestExample()}
        {this.renderResponseParams()}
        {this.renderResponseExample()}
        {this.renderReturnCode()}
      </Row>
    )
  }

  renderBreadcrumb = () => {
    const { data } = this.props;
    const { item } = this.state;
    if (item == null) {
      return null;
    }
    let tag = data.tags.find(x => x.name == item.detail.tags[0]);
    return (
      <Row>
        <Breadcrumb style={{ margin: '20px 0' }}>
          <Breadcrumb.Item>{tag.description ? tag.description : tag.name}</Breadcrumb.Item>
          <Breadcrumb.Item>{item.name}</Breadcrumb.Item>
        </Breadcrumb>
        <Line />
      </Row>
    )
  }

  render() {
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
              {this.renderBreadcrumb()}
              {this.renderContent()}
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
