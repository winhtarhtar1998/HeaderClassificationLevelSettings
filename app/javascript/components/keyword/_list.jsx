import React from "react";
import I18n from "i18n-js";
import "../../bundles/i18n/ja.js";
import { Table, Popconfirm, Space, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

class ListGP extends React.Component {
  state = {
    page: 1,
    pageSize: 10,
  };

  // 一覧を設定する
  columns = [
    {
      title: I18n.t("level.id"),
      dataIndex: "id",
      key: "id",
      align: "center",
      width: "10%",
      render: (text, record, index) =>
        this.props.datasource.indexOf(record) + 1,
    },
    {
      title: I18n.t("level.keyword"),
      dataIndex: "keyword",
      sorter: (a, b) => a.keyword.localeCompare(b.keyword),
      key: "keyword",
      width: "60%",
    },
    {
      title: I18n.t("level.action"),
      dataIndex: "action",
      key: "action",
      render: (_text, record) => (
        <Space size="middle">
          <a onClick={() => this.props.editStatus(record)}>
            <Tooltip placement="top" title={I18n.t("message.F002")}>
              <EditOutlined />
            </Tooltip>
          </a>
          <Popconfirm
            title="削除してもよろしいでしょうか？"
            onConfirm={() => this.props.handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <a href="#" type="danger">
              <Tooltip placement="top" title={I18n.t("message.F003")}>
                <DeleteOutlined />
              </Tooltip>
            </a>
          </Popconfirm>
        </Space>
      ),
      align: "center",
      width: "10%",
    },
  ];
  render() {
    return (
      <Table
        className="table-striped-rows"
        columns={this.columns}
        dataSource={this.props.datasource}
        pagination={{
          pageSize: 10,
        }}
      />
    );
  }
}

export default ListGP;
