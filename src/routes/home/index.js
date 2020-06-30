import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Breadcrumb, Icon, Row, Col, Tag, Table, BackTop, Input, Tabs } from 'antd';
import { Line } from '@components'

import '@routes/home/index.less'

import { connect } from 'dva';
const { SubMenu, ItemGroup } = Menu;
const { Header, Content, Footer, Sider, } = Layout;


const DocumentTitle = ({ title }) => (
  <Row type="flex" justify="center" align="middle" style={{
    height: 148, textAlign: 'center',
    // color: "rgba(0, 0, 0, 0.65)"
  }}>
    {title}
  </Row>
)



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
      <Row type="flex" justify="center" align="middle" style={{ height: 148, textAlign: 'center' }}>
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
        <SubMenu key={tag.name} title={<span>{tag.description || tag.name}</span>}>
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
        <Table
          bordered
          pagination={false}
          columns={responseParamsColumn} dataSource={properties} />
      </Row>
    )
  }
  renderRequestExample = () => {
    return (
      <Row>
        <Row style={{ position: "relative" }}>
          <span className="pre-code-span">请求示例</span>
          <pre>

          </pre>
        </Row>
      </Row>
    )
  }

  renderResponseExample = () => {
    return (
      <Row>
        <Row style={{ position: "relative" }}>
          <span className="pre-code-span">结果示例</span>
          <pre>

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
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '0 0 80px' }}>
          <Tag>{item.method.toUpperCase()}</Tag>
        </div>
        <div>
          <span>{item.path}</span>
          <span style={{ marginLeft: 12, cursor: 'pointer' }}><Icon type="copy" /></span>
        </div>
      </div>
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
        <Line type="dashed" />
        <Tabs animated={false}>
          <Tabs.TabPane key="params" tab="Params">
            {this.renderRequestParams()}
          </Tabs.TabPane>
          <Tabs.TabPane key="authorization" tab="Authorization">
          </Tabs.TabPane>
          <Tabs.TabPane key="headers" tab="Headers">
          </Tabs.TabPane>
          <Tabs.TabPane key="body" tab="Body">
          </Tabs.TabPane>
          <Tabs.TabPane key="example" tab="Example">
            {this.renderRequestExample()}
          </Tabs.TabPane>
        </Tabs>
        <Line type="dashed" />
        <Tabs animated={false}>
          <Tabs.TabPane key="response" tab="Response">
            {this.renderResponseParams()}
          </Tabs.TabPane>
          <Tabs.TabPane key="example" tab="Example">
            {this.renderResponseExample()}
          </Tabs.TabPane>
        </Tabs>
        <Line type="dashed" />
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
    const { info } = this.props;
    return (
      <Layout style={{ background: 'transparent' }}>
        <BackTop visibilityHeight={300} />
        <Content className="content" style={{ padding: 0 }} >
          <Layout style={{}}>
            <Sider width={280} style={{ background: 'rgba(245, 245, 245, 0.65)', backdropFilter: 'blur(10px)' }} >
              <Menu mode="inline" style={{ height: '100%', borderRight: 'none', background: 'transparent' }} >
                {/* {this.renderDocumentTitle()} */}
                <DocumentTitle title={info && info.title && info.title.toUpperCase() || 'SWAGGER DOCUMENTATION'} />
                {this.renderExtensionLinks()}
                <Row style={{ height: 20 }}></Row>
                {this.renderMenus()}
              </Menu>
            </Sider>
            <Content>
              <Header style={{ background: 'rgba(245, 245, 245, 0.8)', backdropFilter: 'blur(10px)' }}></Header>
              <Content style={{ minHeight: 1000, padding: 24, backgroundColor: 'white' }}>
                {this.renderBreadcrumb()}
                {this.renderContent()}
              </Content>
            </Content>
          </Layout>
        </Content>
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
