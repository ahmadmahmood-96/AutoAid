import React, { useState } from "react";
import { Form, Input, InputNumber, Button, message, Typography } from "antd";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;

const AddInsurance = () => {
  const [form] = Form.useForm();
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState();
  const [description, setDescription] = useState("");
  const [coverage, setCoverage] = useState([]);
  const [duration, setDuration] = useState(""); // Added duration state

  const onFinish = async (values) => {
    try {
      const requestData = {
        name: values.productName,
        description: values.description,
        coverage: coverage,
        duration: duration, // Passing duration value
        price: values.price,
      };

      const response = await axios.post(
        `${baseUrl}insurance/save-insurance`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        clearForm();
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log("Error uploading insurance:", error);
      message.error("Failed to add insurance. Please try again.");
    }
  };

  const clearForm = () => {
    form.resetFields(); // Reset form fields
    setCoverage([]); // Clear the coverage state
    setDuration(""); // Clear the duration state
  };

  return (
    <>
      <Typography.Title level={2}>Add Insurance Information</Typography.Title>
      <Form
        form={form}
        name="addInsuranceForm"
        onFinish={onFinish}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 10 }}
      >
        <Form.Item
          label="Insurance Name"
          name="productName"
          rules={[
            { required: true, message: "Please enter the insurance name!" },
          ]}
        >
          <Input
            placeholder="Enter Insurance Name"
            value={productName}
            allowClear
            onChange={(e) => setProductName(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[
            { type: "number", message: "Price must be a number" },
            { required: true, message: "Please enter the insurance price!" },
            {
              validator: (rule, value) => {
                if (value < 0) {
                  return Promise.reject("Price cannot be negative!");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            placeholder="Enter Insurance Price"
            value={price}
            onChange={(value) => setPrice(value)}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please enter the insurance description!",
            },
          ]}
        >
          <Input.TextArea
            placeholder="Enter Insurance Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Coverage"
          name="coverage"
          rules={[
            {
              required: true,
              message: "Please enter the coverage!",
            },
          ]}
        >
          <Input.TextArea
            placeholder="Enter Coverage (comma-separated)"
            value={coverage}
            onChange={(e) => setCoverage(e.target.value.split(","))}
          />
        </Form.Item>

        {/* Added Duration field */}
        <Form.Item
          label="Duration"
          name="duration"
          rules={[
            { required: true, message: "Please enter the insurance duration!" },
          ]}
        >
          <Input
            placeholder="Enter Insurance Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 10 }}>
          <Button type="primary" htmlType="submit">
            Add Insurance
          </Button>
          <Button style={{ marginLeft: 10 }} onClick={clearForm}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AddInsurance;
