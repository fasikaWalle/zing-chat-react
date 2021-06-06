import React, { useState } from "react";
import { Form, Input, Modal, Row, Col, Radio } from "antd";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import ColorPicker from "../ColorPicker";

const RoomForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState([]);
  const [color, setColor] = useState({
    primary: "#333",
    secondary: "#333",
    tertiary: "#333",
  });
  const [privateRoom, setPrivacy] = useState("public");

  function changePrivate(e) {
    if (e.privacy) {
      setPrivacy(e.privacy);
    }
  }

  return (
    <Modal
      style={{ marginTop: "-85px", backgroundColor: "#474787" }}
      width="40%"
      height="80%"
      visible={visible}
      title="Create a new room"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate({ ...values, ...color });
            setColor({ primary: "#333", secondary: "#333", tertiary: "#333" });
            setTags([]);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        onValuesChange={(e) => changePrivate(e)}
      >
        <Form.Item
          name="roomName"
          label="Room name"
          rules={[
            {
              required: true,
              message: "Please enter a room name",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="tags" label="Tags">
          <ReactTagInput
            tags={tags}
            placeholder="Add tags..."
            editable={true}
            removeOnBackspace={true}
            onChange={(newTags) => setTags(newTags)}
          />
        </Form.Item>
        <Form.Item
          name="privacy"
          className="collection-create-form_last-form-item"
          rules={[{ required: true, message: "Please input your privacy!" }]}
        >
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio.Button value="public">Public</Radio.Button>
            <Radio.Button value="private">Private</Radio.Button>
          </Radio.Group>
        </Form.Item>
        {privateRoom === "private" && (
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please enter a password!",
              },
            ]}
          >
            <Input.Password
              type="password"
              placeholder="Password"
              style={{ padding: "0.8rem" }}
            />
          </Form.Item>
        )}

        <Row>
          <Col className="color-col" span={8}>
            <Form.Item name="primary" label="Background">
              <ColorPicker color={color} setColor={setColor} type={"primary"} />
            </Form.Item>
          </Col>
          <Col className="color-col" span={8}>
            <Form.Item name="secondary" label="Your chat bubble">
              <ColorPicker
                color={color}
                setColor={setColor}
                type={"secondary"}
              />
            </Form.Item>
          </Col>
          <Col className="color-col" span={8}>
            <Form.Item name="tertiary" label="Friends chat bubble">
              <ColorPicker
                color={color}
                setColor={setColor}
                type={"tertiary"}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default RoomForm;
