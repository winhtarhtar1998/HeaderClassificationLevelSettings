import React from "react";
import I18n from "i18n-js";
import "../../bundles/i18n/ja.js";
import {
  Input,
  Button,
  Table,
  Form,
  Card,
  Row,
  Col,
  Modal,
  message,
  Alert,
} from "antd";
import { RightOutlined } from "@ant-design/icons";
class Entry extends React.Component {
  state = {
    visible: false,
    searchkeyword: [],
    keywords: [],
    input: "",
    type: "",
    upvisible: false,
    lovisible: false,
  };
  formRef = React.createRef();
  formFer = React.createRef();

  //初期表示する
  componentDidMount() {
    this.loadTest();
    this.props.setForm(this.formRef);
  }

  // Upper_Modal表示する関数
  uppershowModal = (e) => {
    this.setState({
      upvisible: true,
      type: "upperkeyword",
      searchkeyword: this.state.keywords,
      current: 1,
    });
    if ((e = " ")) {
      this.setState({
        searchkeyword: this.state.keywords,
      });
    } else {
      this.onChangeUpper;
    }
  };

  // Lower_Modal表示する関数
  lowershowModal = (e) => {
    this.setState({
      lovisible: true,
      type: "lowerkeyword",
      searchkeyword: this.state.keywords,
      current: 1,
    });
    if ((e = " ")) {
      this.setState({
        searchkeyword: this.state.keywords,
      });
    } else {
      this.onChangeLower;
    }
  };

  //Modal 非表示する関数
  hideModal = () => {
    this.setState({
      upvisible: false,
      upvisible: false,
    });
  };

  // 一覧を設定する
  column = [
    {
      title: I18n.t("keyword.id"),
      key: "id",
      align: "center",
      dataIndex: "id",
      align: "center",
      width: "20%",
      render: (text, record, index) =>
        this.state.searchkeyword.indexOf(record) + 1,
    },
    {
      title: I18n.t("keyword.keyword"),
      key: "keyword",
      dataIndex: "keyword",
      width: "60%",
    },
  ];

  //取得したデータを一覧に表示する
  loadTest = () => {
    const url = "/api/v1/header_classification_dicts/index";
    fetch(url)
      .then((data) => {
        if (data.ok) {
          return data.json();
        }
        throw new Error("Network error.");
      })
      .then((data) => {
        let length = data.keyword;
        if (Object.keys(length).length <= 0) {
          this.props.showMessage();
        } else {
          console.log("Data", data);
          data.keyword.forEach((keyword) => {
            const newEl = {
              key: keyword.id,
              id: keyword.id,
              keyword: keyword.keyword,
              display_order: keyword.display_order,
            };
            this.setState((prevState) => ({
              keywords: [...prevState.keywords, newEl],
            })); //... means copy
          });
        }
      })
      .catch((err) => message.error("Error: " + err));
  };

  // 閉じにModal
  handleOk = (e) => {
    this.setState({
      upvisible: false,
      lovisible: false,
    });
  };

  // 閉じにModal
  handleCancel = (e) => {
    this.setState({
      upvisible: false,
      lovisible: false,
    });
  };

  // データ設定にForm
  handeldataSet = (values) => {
    console.log("Values", values);
    this.props.createoreditlevelsetting(values, this.formRef);
  };

  // 更新にUpper＿Modal
  onChangeUpper = (e) => {
    // 更新するにデータ設定
    this.formFer.current.setFieldsValue({
      keyword: e.target.value,
    });

    // 入力するキーワードが存在チェック
    let newKeywords = this.state.keywords.filter(
      (f) => f.keyword == e.target.value
    );
    let newLength = Object.keys(newKeywords).length;
    if (newLength <= 0) {
      this.setState({
        searchkeyword: newKeywords,
      });
      this.props.showErrormessage();
    } else {
      this.setState({
        searchkeyword: newKeywords,
      });
    }
  };

  // 更新にLLower＿Modal
  onChangeLower = (e) => {
    // 更新するにデータ設定
    this.formFer.current.setFieldsValue({
      keyword: e.target.value,
    });
    // 入力するキーワードが存在チェック
    let newKeywords = this.state.keywords.filter(
      (f) => f.keyword == e.target.value
    );
    console.log("LowerKeyword", newKeywords);
    let newLength = Object.keys(newKeywords).length;

    if (newLength <= 0) {
      this.setState({
        searchkeyword: newKeywords,
      });
      this.props.showErrormessage();
    } else {
      this.setState({
        searchkeyword: newKeywords,
      });
    }
  };

  // Modalテキストボックスに検索する関数
  modalOnChange = (e) => {
    let varr = this.state.keywords.filter((f) =>
      Object.keys(f).some(
        (k) =>
          String(f[k]).toLowerCase().indexOf(e.target.value.toLowerCase()) === 0
      )
    );
    this.setState({
      searchkeyword: varr,
    });
  };

  render() {
    // 一覧に取得したデータトラジオボタン表示する関数;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log("SelectedRow", selectedRows);
        selectedRows.forEach((value) => {
          const fieldvalue = value.keyword;
          const fieldid = value.id;
          const filedname = this.state.type;
          const displayOrder = value.display_order;

          if (filedname == "upperkeyword") {
            this.formRef.current.setFieldsValue({
              upperlevelkeyword: fieldvalue,
              uplevel_header_classification_id: fieldid,
              upper_display: displayOrder,
            });
            this.formFer.current.setFieldsValue({
              keyword: fieldvalue,
            });
          } else {
            this.formRef.current.setFieldsValue({
              lowerlevel_keyword: fieldvalue,
              lolevel_header_classification_id: fieldid,
              lower_display: displayOrder,
            });
            this.formFer.current.setFieldsValue({
              keyword: fieldvalue,
            });
          }
          this.setState({
            lovisible: false,
            upvisible: false,
          });
        });
      },
    };
    return (
      <>
        <Form
          layout="vertical"
          ref={this.formRef}
          name="control-ref"
          onFinish={this.handeldataSet}
          style={{
            backgroundColor: "white",
            marginTop: 5,
            marginBottom: 10,
            height: 250,
          }}
        >
          <Row>
            <Col span={5}></Col>
            <Col span={14}>
              {this.props.visible ? (
                <Alert
                  message={this.props.message}
                  type={this.props.type}
                  closable
                  afterClose={this.props.handleClose}
                  style={{ textAlign: "center", marginTop: 10 }}
                />
              ) : null}
            </Col>
            <Col span={5}></Col>
          </Row>
          <Row style={{ marginTop: 15 }}>
            <Col span={5}></Col>
            <Col span={6}>
              <Form.Item
                name="upperlevelkeyword"
                label={I18n.t("message.F004")}
                rules={[
                  {
                    required: true,
                    message: I18n.t("message.M079"),
                    whitespace: true,
                  },
                ]}
              >
                <Input.Search
                  style={{
                    width: "100%",
                  }}
                  onBlur={this.onChangeUpper}
                  onSearch={this.uppershowModal}
                  enterButton
                />
              </Form.Item>
              <Form.Item name="uplevel_header_classification_id" hidden={true}>
                <Input type="text" />
              </Form.Item>
            </Col>
            <Col span={2}>
              <RightOutlined style={{ margin: 40 }} />
            </Col>
            <Col span={6}>
              <Form.Item
                name="lowerlevel_keyword"
                label={I18n.t("message.F005")}
                rules={[
                  {
                    required: true,
                    message: I18n.t("message.M080"),
                    whitespace: true,
                  },
                ]}
              >
                <Input.Search
                  style={{
                    width: "100%",
                  }}
                  onBlur={this.onChangeLower}
                  onSearch={this.lowershowModal}
                  enterButton
                />
              </Form.Item>
              <Form.Item name="lolevel_header_classification_id" hidden={true}>
                <Input type="text" />
              </Form.Item>
              <Form.Item name="upper_display" hidden={true}>
                <Input type="text" />
              </Form.Item>
              <Form.Item name="lower_display" hidden={true}>
                <Input type="text" />
              </Form.Item>
              <Form.Item name="editid" hidden={true}>
                <Input type="text" />
              </Form.Item>
            </Col>
            <Col span={5}></Col>　
          </Row>
          <Row>
            <Col span={5}></Col>
            <Col span={6}></Col>
            <Col span={2}>
              <Button type="primary" htmlType="submit">
                {I18n.t("message.F001")}
              </Button>
            </Col>
            <Col span={6}></Col>
            <Col span={5}></Col>
          </Row>
        </Form>
        <Modal
          title="キーワード検索"
          visible={this.state.upvisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Form ref={this.formFer}>
            <Form.Item name="keyword" label={I18n.t("message.F006")}>
              <Input
                style={{
                  width: "60%",
                }}
                placeholder="キーワード入力"
                onChange={this.modalOnChange}
              />
            </Form.Item>
          </Form>
          <Table
            className="table-striped-rows"
            rowSelection={{ type: "radio", ...rowSelection }}
            dataSource={this.state.searchkeyword}
            columns={this.column}
            pagination={{
              pageSize: 10,
              defaultCurrent: this.state.current,
            }}
          />
        </Modal>
        <Modal
          title="キーワード検索"
          visible={this.state.lovisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Form ref={this.formFer}>
            <Form.Item name="keyword" label={I18n.t("message.F006")}>
              <Input
                style={{
                  width: "60%",
                }}
                placeholder="キーワード入力"
                onChange={this.modalOnChange}
              />
            </Form.Item>
          </Form>
          <Table
            className="table-striped-rows"
            rowSelection={{ type: "radio", ...rowSelection }}
            dataSource={this.state.searchkeyword}
            columns={this.column}
            pagination={{
              pageSize: 10,
              defaultCurrent: this.state.current,
            }}
          />
        </Modal>
      </>
    );
  }
}
export default Entry;
