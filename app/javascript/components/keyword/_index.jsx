import React from "react";
import I18n from "i18n-js";
import "../../bundles/i18n/ja.js";
import Entry from "./_entry.jsx";
import ListGP from "./_list.jsx";
import { message } from "antd";
import { CSVLink } from "react-csv";
class Keyword extends React.Component {
  state = {
    levels: [],
    showid: 0,
    editable: false,
    upper: "",
    lower: "",
    visible: false,
    type: "",
    message: "",
    showidt: 1,
    saveable: true,
  };

  //初期表示する
  componentDidMount() {
    this.loadClassificationLevel();
  }

  // 閉じるメッセージ表示
  handleClose = () => {
    this.setState({ visible: false });
  };

  //削除する関数
  handleDelete = (record) => {
    const id = record.id;
    const url = `/api/v1/header_classification_dicts/${id}`;

    fetch(url, {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    })
      .then((data) => {
        if (data.ok) {
          return data.json();
        }
        throw new Error("Network error.");
      })
      .then((data) => {
        if (data.message != "ok") {
          this.deletekeyword(record.id);
          this.setState({
            type: "success",
            message: I18n.t("message.M007"),
            visible: true,
          });
        } else {
          this.setState({
            type: "error",
            message: I18n.t("message.M059"),
            visible: true,
          });
        }
      });
  };

  //一覧に削除データがすぐに表示する
  deletekeyword(id) {
    const newkeywords = this.state.levels.filter((level) => level.id !== id);
    this.setState({
      levels: newkeywords,
    });
  }

  // 作成Form
  setForm = (currentForm) => {
    this.formRef = currentForm;
  };

  // 更新にデータ設定する関数
  editStatus = (record) => {
    let id = record.id;
    const url = `/api/v1/header_classification_dicts/toUpdate/${id}`;
    fetch(url)
      .then((data) => {
        if (data.ok) {
          return data.json();
        }
      })
      .then((data) => {
        if (data.message != "ok") {
          this.formRef.current.setFieldsValue({
            upperlevelkeyword: data.upperlevelkeyword,
            lowerlevel_keyword: data.lowerlevel_keyword,
            editid: data.id,
          });
          this.setState({
            editable: true,
          });
        } else {
          this.setState({
            type: "error",
            message: I18n.t("message.M060"),
            visible: true,
          });
        }
      });
  };

  // 更新する関数
  EditLevelsetting = (values, currentForm) => {
    let id = values.editid;
    const url = `/api/v1/header_classification_dicts/update/${id}`;
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lowerlevel_keyword: values.lowerlevel_keyword,
        upperlevelkeyword: values.upperlevelkeyword,
        uplevel_header_classification_id:
          values.uplevel_header_classification_id,
        lolevel_header_classification_id:
          values.lolevel_header_classification_id,
        upperdisplayorder: values.upper_display,
        lowerdisplayorder: values.lower_display,
      }),
    })
      .then((data) => {
        if (data.ok) {
          return data.json();
        }
        throw new Error("Network error.");
      })
      .then((data) => {
        if (data.message != "ok") {
          let ItemsCopy = [];
          let x = this.state.levels.map((entry) => {
            if (entry.id == data.id) {
              entry.keyword =
                data.upperlevelkeyword + ">" + data.lowerlevel_keyword;
            }
            ItemsCopy.push(entry);
          });
          this.setState({ levels: ItemsCopy });
          this.updateItem(data.id, data);
          this.setState({
            type: "success",
            message: I18n.t("message.M005"),
            visible: true,
            editable: false,
          });
        } else {
          this.setState({
            type: "error",
            message: I18n.t("message.M058"),
            visible: true,
            editable: false,
          });
        }
      });
    currentForm.current.resetFields();
  };

  // 一覧に更新データがすぐに表示する
  updateItem(id, itemAttributes) {
    var index = this.state.levels.findIndex((x) => x.id === id);
    this.setState({
      levels: [
        ...this.state.levels.slice(0, index),
        Object.assign({}, this.state.levels[index], itemAttributes),
        ...this.state.levels.slice(index + 1),
      ],
    });
  }

  // エラーメッセージ表示する
  showMessage = () => {
    this.setState({
      type: "error",
      message: I18n.t("message.M060"),
      visible: true,
    });
  };

  // エラーメッセージ表示する
  showErrormessage = () => {
    this.setState({
      type: "error",
      message: I18n.t("message.M078"),
      visible: true,
    });
  };

  // 取得したデータを一覧に表示する
  loadClassificationLevel = () => {
    const url = "/api/v1/header_classification_dicts/getlevelsetting";
    fetch(url)
      .then((data) => {
        if (data.ok) {
          return data.json();
        }
        throw new Error("Network error.");
      })
      .then((data) => {
        if (data.message != "ok") {
          data.settings.forEach((level) => {
            const newEl = {
              key: level.id,
              id: level.id,
              keyword: level.upperlevelkeyword + ">" + level.lowerlevel_keyword,
            };
            this.state.showidt = this.state.showidt + 1;

            this.setState((prevState) => ({
              levels: [...prevState.levels, newEl],
            }));
          });
        } else {
          this.setState({
            type: "error",
            message: I18n.t("message.M060"),
            visible: true,
          });
        }
      });
  };

  // テーブルにデータ保存する関数
  createLevelsetting = (values, currentForm) => {
    const url = "/api/v1/header_classification_dicts/create";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lowerlevel_keyword: values.lowerlevel_keyword,
        upperlevelkeyword: values.upperlevelkeyword,
        uplevel_header_classification_id:
          values.uplevel_header_classification_id,
        lolevel_header_classification_id:
          values.lolevel_header_classification_id,
        upperdisplayorder: values.upper_display,
        lowerdisplayorder: values.lower_display,
      }),
    })
      .then((data) => {
        if (data.ok) {
          return data.json();
        }
      })
      .then((data) => {
        if (data.message != "ok" && data.message != "nok") {
          const newEl = {
            key: data.id,
            id: data.id,
            keyword: data.upperlevelkeyword + ">" + data.lowerlevel_keyword,
          };
          this.setState((prevState) => ({
            levels: [...prevState.levels, newEl],
          }));
          this.setState({
            type: "success",
            message: I18n.t("message.M004"),
            visible: true,
          });
        } else {
          if (data.message == "nok") {
            this.setState({
              type: "error",
              message: I18n.t("message.M056"),
              visible: true,
            });
          } else {
            this.setState({
              type: "error",
              message: I18n.t("message.M078"),
              visible: true,
            });
          }
        }
      });
    currentForm.current.resetFields();
  };

  // 保存するとか更新するとかチェック関数
  createoreditlevelsetting = (values, formRef) => {
    if (this.state.editable == true) {
      this.EditLevelsetting(values, formRef);
    } else {
      this.createLevelsetting(values, formRef);
    }
  };

  render() {
    return (
      <>
        <div
          className="site-layout-background"
          // style={{ padding: 24, minHeight: 360 }}
        >
          <Entry
            createoreditlevelsetting={this.createoreditlevelsetting}
            editable={this.state.editable}
            upper={this.state.upper}
            lower={this.state.lower}
            setForm={this.setForm}
            visible={this.state.visible}
            type={this.state.type}
            message={this.state.message}
            handleClose={this.handleClose}
            showMessage={this.showMessage}
            showErrormessage={this.showErrormessage}
          />
          <CSVLink
            filename={"HeaderClassificationLevelSettings.csv"}
            data={this.state.levels}
            className="btn btn-primary"
            onClick={() => {
              message.success("The file is downloading");
            }}
          >
            Export to CSV
          </CSVLink>
          <ListGP
            datasource={this.state.levels}
            handleDelete={this.handleDelete}
            editStatus={this.editStatus}
          />
        </div>
      </>
    );
  }
}

export default Keyword;
