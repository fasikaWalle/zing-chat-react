import React, { useState } from "react";
import { Form, Input, Modal, Row, Col, Radio } from "antd";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import ColorPicker from "../../ColorPicker";
import { InfoCircleOutlined } from "@ant-design/icons";

const EditForm = ({ visible, onCancel, onCreate, room }) => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState(room.tags);

  const [color, setColor] = useState({
    primary: room.colors[0],
    secondary: room.colors[1],
    tertiary: room.colors[2],
  });

  return (
    <Modal
      style={{ marginTop: "-50px" }}
      centered
      width="40%"
      height="90%"
      visible={visible}
      title="Create a new room"
      okText="Update"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate({ ...values, ...color, room });
            setColor({
              primary: room.colors[0],
              secondary: room.colors[1],
              tertiary: room.colors[2],
            });
            setTags([]);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          requiredmark={"optional"}
          name="roomName"
          label="Room name"
          initialValue={room.roomName}
          rules={[
            {
              required: true,
              message: "Please enter a room name",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          tooltip={{
            title: "This will help people find your room",
            icon: <InfoCircleOutlined />,
          }}
        >
          {/* name="tags" label="Tags" initialValue={room.tags}> */}
          <ReactTagInput
            tags={tags}
            initialValue={room.tags}
            placeholder="Add tags..."
            editable={true}
            removeOnBackspace={true}
            onChange={(newTags) => setTags(newTags)}
          />
        </Form.Item>
        <Form.Item
          name="privacy"
          initialValue={room.privacy}
          className="collection-create-form_last-form-item"
          rules={[{ required: true, message: "Please input your privacy!" }]}
        >
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            initialValue="public"
          >
            <Radio.Button value="public">Public</Radio.Button>
            <Radio.Button value="private">Private</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Row>
          <Col className="color-col" span={8}>
            <Form.Item name="primary" label="Background">
              <ColorPicker color={color} setColor={setColor} type={"primary"} />
            </Form.Item>
          </Col>
          <Col className="color-col" span={8}>
            <Form.Item name="secondary" label="Your Bubble">
              <ColorPicker
                color={color}
                setColor={setColor}
                type={"secondary"}
              />
            </Form.Item>
          </Col>
          <Col className="color-col" span={8}>
            <Form.Item
              name="tertiary"
              label="Friend's bubble"
              initialValue={color}
            >
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

export default EditForm;
