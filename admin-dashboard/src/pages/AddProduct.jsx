import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  message,
  Typography,
} from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";

const baseUrl = process.env.REACT_APP_BASE_URL;

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [description, setDescription] = useState("");
  const [productImages, setProductImages] = useState([]);

  const onFinish = async (values) => {
    // Handle form submission
    const formData = new FormData();
    formData.append("productName", values.productName);
    formData.append("price", values.price);
    formData.append("quantity", values.quantity);
    formData.append("description", values.description);
    for (let i = 0; i < productImages.length; i++) {
      formData.append(`images`, productImages[i]);
    }

    try {
      const response = await axios.post(
        `${baseUrl}product/save-product`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 201) {
        setProductName("");
        setPrice(null);
        setQuantity(null);
        setDescription("");
        setProductImages([]);
        message.success(response.data.message);
      } else message.error(response.data.message);
    } catch (error) {
      console.log("Error uploading product:", error);
      message.error("Failed to add product. Please try again.");
    }
  };

  const beforeUpload = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      message.error("You can only upload JPG, JPEG, or PNG files!");
      return false;
    }

    return true;
  };

  const customRequest = ({ file, onSuccess, onError }) => {
    productImages.push(file);
    setProductImages(productImages);
    onSuccess();
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <>
      <Typography.Title level={2}>Add Product Information</Typography.Title>
      <Form
        name="addProductForm"
        onFinish={onFinish}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 10 }}
      >
        <Form.Item
          label="Product Name"
          name="productName"
          rules={[
            { required: true, message: "Please enter the product name!" },
          ]}
        >
          <Input
            placeholder="Enter Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[
            { type: "number", message: "Price must be a number" },
            { required: true, message: "Please enter the product price!" },
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
            placeholder="Enter Product Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[
            { type: "number", message: "Quantity must be a number" },
            { required: true, message: "Please enter the product quantity!" },
            {
              validator: (rule, value) => {
                if (value < 0) {
                  return Promise.reject("Quantity cannot be negative!");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            placeholder="Enter Product Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please enter the product description!",
            },
          ]}
        >
          <Input.TextArea
            placeholder="Enter Product Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Image"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="Please upload an image for the product"
          rules={[
            {
              required: true,
              message: "Please upload an image of the product",
            },
          ]}
        >
          <Upload
            multiple={true}
            name="image"
            listType="picture"
            accept=".png, .jpeg, .jpg"
            beforeUpload={beforeUpload}
            customRequest={customRequest}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 10 }}>
          <Button type="primary" htmlType="submit">
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AddProduct;
