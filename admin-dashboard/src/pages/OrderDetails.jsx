import React, { useState, useEffect } from "react";
import { Table, Typography, Tag } from "antd";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;

export default function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});

  useEffect(() => {
    axios
      .get(`${baseUrl}admin/get-orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  const renderStatusTag = (status) => {
    const verb = status.split(" ")[1]; // Extract the verb from the status string
    let color = "";
    switch (verb) {
      case "Delivered":
        color = "green";
        break;
      case "Dispatched":
        color = "blue";
        break;
      case "Placed":
        color = "red";
        break;
      default:
        color = "default";
        break;
    }
    return (
      <Tag color={color} style={{ fontSize: 14 }}>
        {verb}
      </Tag>
    );
  };

  const columns = [
    {
      key: 1,
      title: "Name",
      render: (_, record) => {
        return record.user ? record.shippingAddress.name : "N/A";
      },
    },
    {
      key: 2,
      title: "Phone Number",
      render: (_, record) => {
        return record.shippingAddress
          ? record.shippingAddress.phoneNumber
          : "N/A";
      },
    },
    {
      key: 3,
      title: "Address",
      render: (_, record) => {
        if (record.shippingAddress) {
          const { houseNo, street, town } = record.shippingAddress;
          return `${houseNo}, ${street}, ${town}`;
        } else {
          return "N/A";
        }
      },
    },
    {
      key: 4,
      title: "Total Price",
      dataIndex: "totalPrice",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      key: 5,
      title: "Order Placed Date",
      dataIndex: "createdAt",
      render: (createdAt) => {
        const date = new Date(createdAt);
        return date.toLocaleString(); // Convert date to a human-readable format
      },
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },

    {
      key: 6,
      title: "Status",
      dataIndex: "status",
      filters: [
        { text: "Order Placed", value: "Order Placed" },
        { text: "Order Dispatched", value: "Order Dispatched" },
        { text: "Order Delivered", value: "Order Delivered" },
      ],
      onFilter: (value, record) => record.status === value,
      render: renderStatusTag,
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  return (
    <>
      <Typography.Title level={2}>Order Details</Typography.Title>
      <Table
        columns={columns}
        dataSource={orders}
        onChange={handleTableChange}
        {...{ sortedInfo }}
      />
    </>
  );
}
