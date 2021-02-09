import React, { useEffect, useContext } from 'react';
import { Modal, Form, Input } from 'antd';
import DataContext from '../contexts/data-context';
import http from '../http';
import _ from 'lodash';

const pinyin = require('pinyin');

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

function NameInfo({
  isModalVisible,
  setIsModalVisible,
  nameInfo,
  type,
}: NameInfoProps) {
  const [form] = Form.useForm();
  const { setData } = useContext(DataContext);

  useEffect(() => {
    if (isModalVisible) {
      form.resetFields();
    }
  }, [form, isModalVisible]);

  const handleOk = async () => {
    await form.validateFields();
    form.submit();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values: NameType) => {
    const pinyinKeys = Object.keys(values).filter((key) =>
      key.startsWith('pinyin'),
    );
    if (type === 'edit') {
      const newName = {
        ...nameInfo,
        name: values.name,
        pinyin: pinyinKeys.map((key: string) => (values as any)[key]),
      };
      await http.put(`/name`, newName);
    } else {
      const newName = {
        name: values.name,
        pinyin: _.flatten(pinyin(values.name, { style: pinyin.STYLE_NORMAL })),
      };
      await http.post(`/name`, newName);
    }
    const response: any = await http.get(`/name`);
    setData(response);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.info('Failed:', errorInfo);
  };

  return (
    <Modal
      title={`${type === 'edit' ? '编辑' : '添加'}`}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose={false}
      okText="确认"
      cancelText="取消"
    >
      <Form
        form={form}
        preserve={false}
        {...layout}
        name="basic"
        onFinish={onFinish}
        initialValues={{ name: nameInfo.name, pinyin: nameInfo.pinyin }}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="姓名"
          name="name"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input />
        </Form.Item>
        {nameInfo.pinyin?.map((item, index) => (
          <Form.Item
            label={`拼音${index + 1}`}
            name={`pinyin${index}`}
            key={index}
            initialValue={item}
            rules={[{ required: true, message: '请输入拼音' }]}
          >
            <Input />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
}

export default NameInfo;
