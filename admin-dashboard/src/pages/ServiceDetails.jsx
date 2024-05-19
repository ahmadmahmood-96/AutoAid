import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  message,
  Typography,
  Row,
  Col,
  Table,
  Tooltip,
  Modal,
} from "antd";
import axios from "axios";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const baseUrl = process.env.REACT_APP_BASE_URL;

const ServiceDetails = () => {
  const [form] = Form.useForm();
  const [serviceTypesPrices, setServiceTypesPrices] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState();
  const [record, setRecord] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedName, setEditedName] = useState(null);
  const [editedPrice, setEditedPrice] = useState(null);
  const [editedServiceTypePriceId, setEditedServiceTypePriceId] = useState("");

  useEffect(() => {
    axios
      .get(`${baseUrl}admin/get-service-types-prices`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setServiceTypesPrices(response.data);
        console.log(serviceTypesPrices);
      })
      .catch((error) => {
        message.error("Error fetching orders:", error);
      });
    // eslint-disable-next-line
  }, [serviceName]);

  const onFinish = async (values) => {
    try {
      const requestData = {
        serviceType: values.serviceName,
        price: values.price,
      };

      const response = await axios.post(
        `${baseUrl}admin/save-service-type-prices`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const newServiceTypePrice = {
        _id: response.data.serviceId, // Assuming the service ID is returned in the response
        serviceType: values.serviceName,
        price: values.price,
      };

      if (response.status === 201) {
        clearForm();
        setServiceTypesPrices([...serviceTypesPrices, newServiceTypePrice]);
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log("Error uploading service price:", error);
      message.error("Failed to add service price. Please try again.");
    }
  };

  const columns = [
    {
      key: 1,
      title: "Service Type Name",
      dataIndex: "serviceType",
    },
    {
      key: 2,
      title: "Price",
      dataIndex: "price",
      render: (text) => `Rs. ${text}`,
      sorter: (record1, record2) => {
        return record1.price > record2.price;
      },
    },
    {
      key: 3,
      title: "Actions",
      render: (record) => {
        return (
          <>
            <Tooltip title="Click to edit the product">
              <EditOutlined
                onClick={() => onEdit(record)}
                style={{ color: "#164863", fontSize: 20, marginRight: 25 }}
              />
            </Tooltip>
            <Tooltip title="Click to delete the product">
              <DeleteOutlined
                onClick={() => onDelete(record)}
                style={{ color: "red", fontSize: 20 }}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];

  const onDelete = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this product?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        await axios
          .delete(`${baseUrl}admin/delete-service-type-price/${record._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            if (response.data.success) {
              message.success(response.data.message);
              // Refresh the product list after deletion
              setServiceTypesPrices(
                serviceTypesPrices.filter(
                  (serviceTypePrice) => serviceTypePrice._id !== record._id
                )
              );
            } else {
              message.error("Failed to delete service type price");
            }
          })
          .catch((error) => {
            message.error("Error deleting service type price");
          });
      },
    });
  };

  const onEdit = (record) => {
    setShowEditModal(true);
    setRecord(record);
    setEditedServiceTypePriceId(record._id);
    setEditedName(record.serviceType);
    setEditedPrice(record.price);
  };

  const handleEditRecords = async () => {
    if (!editedName || !editedPrice) {
      message.error("Please fill all the fields");
      return;
    }
    const data = {
      serviceType: editedName,
      price: editedPrice,
    };

    const initialData = {
      serviceType: record.serviceType,
      price: record.price,
    };

    const dataChanged = Object.keys(data).some(
      (key) => data[key] !== initialData[key]
    );

    if (!dataChanged) {
      message.warning("No changes made. Nothing to update.");
      setShowEditModal(false);
      return;
    }

    try {
      const response = await axios.put(
        `${baseUrl}admin/edit-service-type-price/${editedServiceTypePriceId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 201) {
        setServiceTypesPrices((prevProducts) =>
          prevProducts.map((product) =>
            product._id === editedServiceTypePriceId
              ? { ...product, ...data }
              : product
          )
        );
        message.success(response.data.message);
        setShowEditModal(false);
      }
    } catch (error) {
      message.error("Error Updating service type price");
    }
  };

  const clearForm = () => {
    form.resetFields(); // Reset form fields
  };

  return (
    <>
      <Typography.Title level={2}>
        Add Service Types Prices Information
      </Typography.Title>
      <Form
        form={form}
        name="addPricesForm"
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
      >
        <Row>
          <Col span={12}>
            <Form.Item
              label="Service Type Name"
              name="serviceName"
              rules={[
                {
                  required: true,
                  message: "Please enter the Service type name!",
                },
              ]}
            >
              <Input
                placeholder="Enter Service Type Name"
                value={serviceName}
                allowClear
                onChange={(e) => setServiceName(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                { type: "number", message: "Price must be a number" },
                {
                  required: true,
                  message: "Please enter the service type price!",
                },
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
                placeholder="Enter Service Type Price"
                value={price}
                onChange={(value) => setPrice(value)}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item wrapperCol={{ offset: 16, span: 6 }}>
          <Button type="primary" htmlType="submit">
            Add Service Type Price
          </Button>
          <Button style={{ marginLeft: 10 }} onClick={clearForm}>
            Reset
          </Button>
        </Form.Item>
      </Form>
      <Typography.Title level={2}>
        Service Type Prices Details{" "}
      </Typography.Title>
      <Table
        columns={columns}
        dataSource={serviceTypesPrices}
        scroll={{ x: 768 }}
        pagination={{ pageSize: 4 }}
      />
      <Modal
        title="Edit Product"
        open={showEditModal}
        okText="Save"
        onOk={handleEditRecords}
        onCancel={() => setShowEditModal(false)}
      >
        <Typography.Text>Service Type Name:</Typography.Text>
        <Input
          value={editedName}
          placeholder="Enter Product Name"
          onChange={(e) => setEditedName(e.target.value)}
          style={{ marginBottom: 15 }}
        />
        <Typography.Text>Service Price:</Typography.Text>
        <InputNumber
          value={editedPrice}
          placeholder="Enter Product Price"
          onChange={(value) => setEditedPrice(value)}
          style={{ width: "100%", marginBottom: 15 }}
        />
      </Modal>
    </>
  );
};

export default ServiceDetails;
