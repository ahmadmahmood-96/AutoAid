import React, { useState, useEffect } from "react";
import {
  Input,
  InputNumber,
  Modal,
  Table,
  Tooltip,
  Typography,
  message,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;

export default function ViewProduct() {
  const [products, setProducts] = useState([]);
  const [editedProductId, setEditedProductId] = useState("");
  const [editedName, setEditedName] = useState(null);
  const [editedPrice, setEditedPrice] = useState(null);
  const [editedQuantity, setEditedQuantity] = useState(null);
  const [editedDescription, setEditedDescription] = useState(null);
  const [record, setRecord] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    axios
      .get(`${baseUrl}product/get-products`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const columns = [
    {
      key: 1,
      title: "Product Name",
      dataIndex: "productName",
      width: 150,
    },
    {
      key: 2,
      title: "Category",
      dataIndex: "category",
      width: 150,
      filters: [
        { text: "Car", value: "Car" },
        { text: "Bike", value: "Bike" },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      key: 3,
      title: "Price",
      dataIndex: "price",
      width: 150,
      render: (text) => `Rs. ${text}`,
      sorter: (record1, record2) => {
        return record1.price > record2.price;
      },
    },
    {
      key: 4,
      title: "Quantity",
      dataIndex: "quantity",
      width: 150,
      sorter: (record1, record2) => {
        return record1.quantity > record2.quantity;
      },
    },
    {
      key: 5,
      title: "Description",
      dataIndex: "description",
      width: 250,
      render: (text) => (
        <div
          style={{
            maxHeight: 45,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      key: 6,
      title: "Actions",
      width: 150,
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
          .delete(`${baseUrl}product/delete-product/${record._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            if (response.data.success) {
              message.success(response.data.message);
              // Refresh the product list after deletion
              setProducts(
                products.filter((product) => product._id !== record._id)
              );
            } else {
              message.error("Failed to delete product");
            }
          })
          .catch((error) => {
            message.error("Error deleting product");
          });
      },
    });
  };

  const onEdit = (record) => {
    setShowEditModal(true);
    setRecord(record);
    setEditedProductId(record._id);
    setEditedName(record.productName);
    setEditedPrice(record.price);
    setEditedQuantity(record.quantity);
    setEditedDescription(record.description);
  };

  const handleEditRecords = async () => {
    if (!editedName || !editedPrice || !editedQuantity || !editedDescription) {
      message.error("Please fill all the fields");
      return;
    }
    const data = {
      productName: editedName,
      price: editedPrice,
      quantity: editedQuantity,
      description: editedDescription,
    };

    const initialData = {
      productName: record.productName,
      price: record.price,
      quantity: record.quantity,
      description: record.description,
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
        `${baseUrl}product/edit-product/${editedProductId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 201) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === editedProductId ? { ...product, ...data } : product
          )
        );
        message.success(response.data.message);
        setShowEditModal(false);
      }
    } catch (error) {
      message.error("Error Updating Product");
    }
  };

  return (
    <>
      <Typography.Title level={2}>Products Details</Typography.Title>
      <Table
        columns={columns}
        dataSource={products}
        scroll={{ x: 768 }}
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title="Edit Product"
        open={showEditModal}
        okText="Save"
        onOk={handleEditRecords}
        onCancel={() => setShowEditModal(false)}
      >
        <Typography.Text>Product Name:</Typography.Text>
        <Input
          value={editedName}
          placeholder="Enter Product Name"
          onChange={(e) => setEditedName(e.target.value)}
          style={{ marginBottom: 15 }}
        />
        <Typography.Text>Product Price:</Typography.Text>
        <InputNumber
          value={editedPrice}
          placeholder="Enter Product Price"
          onChange={(value) => setEditedPrice(value)}
          style={{ width: "100%", marginBottom: 15 }}
        />
        <Typography.Text>Product Quantity:</Typography.Text>
        <InputNumber
          value={editedQuantity}
          placeholder="Enter Product Quantity"
          onChange={(value) => setEditedQuantity(value)}
          style={{ width: "100%", marginBottom: 15 }}
        />
        <Typography.Text>Product Description:</Typography.Text>
        <Input
          value={editedDescription}
          placeholder="Enter Product Description"
          onChange={(e) => setEditedDescription(e.target.value)}
        />
      </Modal>
    </>
  );
}
