import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  message,
  Typography,
  Select,
} from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";

const baseUrl = process.env.REACT_APP_BASE_URL;

const { Option } = Select;

const AddProduct = () => {
  const [form] = Form.useForm();
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [productImages, setProductImages] = useState([]);

  const onFinish = async (values) => {
    if (productImages.length > 5) {
      message.error("You can only upload up to 5 images!");
      return;
    }

    const imageArray = productImages.map((image) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
      });
    });

    try {
      const base64Images = await Promise.all(imageArray);

      const requestData = {
        productName: values.productName,
        price: values.price,
        quantity: values.quantity,
        category: values.category,
        description: values.description,
        images: base64Images,
      };

      const response = await axios.post(
        `${baseUrl}product/save-product`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        clearForm();
        setProductImages([]);
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
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

  const clearForm = () => {
    form.resetFields(); // Reset form fields
    setProductImages([]); // Clear the productImages state
  };

  return (
    <>
      <Typography.Title level={2}>Add Product Information</Typography.Title>
      <Form
        form={form}
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
            allowClear
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
            onChange={(value) => setPrice(value)}
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
            onChange={(value) => setQuantity(value)}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder="Select a category"
            value={category}
            onChange={(value) => setCategory(value)}
            allowClear
          >
            <Option value="Bike">Bike</Option>
            <Option value="Car">Car</Option>
          </Select>
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
          extra="Please upload image(s) for the product"
          rules={[
            {
              required: true,
              message: "Please upload image(s) of the product",
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
            onRemove={(file) => {
              // Remove the file from productImages state
              setProductImages((prevImages) =>
                prevImages.filter((image) => image.uid !== file.uid)
              );
            }}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 10 }}>
          <Button type="primary" htmlType="submit">
            Add Product
          </Button>
          <Button style={{ marginLeft: 10 }} onClick={clearForm}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AddProduct;
