import React, { useState, useEffect } from "react";
import { Input, InputNumber, Modal, Table, Typography, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;

export default function ViewInsurances() {
  const [insurances, setInsurances] = useState([]);
  const [editedInsuranceId, setEditedInsuranceId] = useState("");
  const [editedName, setEditedName] = useState(null);
  const [editedPrice, setEditedPrice] = useState(null);
  const [editedDescription, setEditedDescription] = useState(null);
  const [editedCoverage, setEditedCoverage] = useState([]);
  const [editedDuration, setEditedDuration] = useState(null);
  const [record, setRecord] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    axios
      .get(`${baseUrl}insurance/get-insurances`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setInsurances(response.data);
      })
      .catch((error) => {
        console.error("Error fetching insurances:", error);
      });
  }, []);

  const columns = [
    {
      key: 1,
      title: "Insurance Name",
      dataIndex: "name",
      width: 150,
    },
    {
      key: 2,
      title: "Price",
      dataIndex: "price",
      width: 150,
      render: (text) => `Rs. ${text}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      key: 3,
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
      key: 4,
      title: "Coverage",
      dataIndex: "coverage",
      width: 250,
      render: (coverage) => (
        <ul>
          {coverage.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ),
    },
    {
      key: 5,
      title: "Duration",
      dataIndex: "duration",
      width: 100,
    },
    {
      key: 6,
      title: "Actions",
      width: 150,
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => onEdit(record)}
              style={{
                color: "#164863",
                fontSize: 20,
                marginRight: 25,
                cursor: "pointer",
              }}
            />
            <DeleteOutlined
              onClick={() => onDelete(record)}
              style={{ color: "red", fontSize: 20, cursor: "pointer" }}
            />
          </>
        );
      },
    },
  ];

  const onDelete = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this insurance?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        await axios
          .delete(`${baseUrl}insurance/delete-insurance/${record._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            if (response.data.success) {
              message.success(response.data.message);
              // Refresh the insurance list after deletion
              setInsurances(
                insurances.filter((insurance) => insurance._id !== record._id)
              );
            } else {
              message.error("Failed to delete insurance");
            }
          })
          .catch((error) => {
            message.error("Error deleting insurance");
          });
      },
    });
  };

  const onEdit = (record) => {
    setShowEditModal(true);
    setRecord(record);
    setEditedInsuranceId(record._id);
    setEditedName(record.name);
    setEditedPrice(record.price);
    setEditedDescription(record.description);
    setEditedCoverage(record.coverage);
    setEditedDuration(record.duration);
  };

  const handleEditRecords = async () => {
    if (
      !editedName ||
      !editedPrice ||
      !editedDescription ||
      !editedCoverage ||
      !editedDuration
    ) {
      message.error("Please fill all the fields");
      return;
    }
    const data = {
      name: editedName,
      price: editedPrice,
      description: editedDescription,
      coverage: editedCoverage,
      duration: editedDuration,
    };

    const initialData = {
      name: record.name,
      price: record.price,
      description: record.description,
      coverage: record.coverage,
      duration: record.duration,
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
        `${baseUrl}insurance/edit-insurance/${editedInsuranceId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 201) {
        setInsurances((prevInsurances) =>
          prevInsurances.map((insurance) =>
            insurance._id === editedInsuranceId
              ? { ...insurance, ...data }
              : insurance
          )
        );
        message.success(response.data.message);
        setShowEditModal(false);
      }
    } catch (error) {
      message.error("Error Updating Insurance");
    }
  };

  return (
    <>
      <Typography.Title level={2}>Insurance Details</Typography.Title>
      <Table
        columns={columns}
        dataSource={insurances}
        scroll={{ x: 768 }}
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title="Edit Insurance"
        visible={showEditModal}
        okText="Save"
        onOk={handleEditRecords}
        onCancel={() => setShowEditModal(false)}
      >
        <Typography.Text>Insurance Name:</Typography.Text>
        <Input
          value={editedName}
          placeholder="Enter Insurance Name"
          onChange={(e) => setEditedName(e.target.value)}
          style={{ marginBottom: 15 }}
        />
        <Typography.Text>Insurance Price:</Typography.Text>
        <InputNumber
          value={editedPrice}
          placeholder="Enter Insurance Price"
          onChange={(value) => setEditedPrice(value)}
          style={{ width: "100%", marginBottom: 15 }}
        />
        <Typography.Text>Insurance Description:</Typography.Text>
        <Input
          value={editedDescription}
          placeholder="Enter Insurance Description"
          onChange={(e) => setEditedDescription(e.target.value)}
          style={{ marginBottom: 15 }}
        />
        <Typography.Text>Insurance Coverage:</Typography.Text>
        <Input
          value={editedCoverage.join(",")}
          placeholder="Enter Insurance Coverage (comma-separated)"
          onChange={(e) => setEditedCoverage(e.target.value.split(","))}
          style={{ marginBottom: 15 }}
        />
        <Typography.Text>Insurance Duration:</Typography.Text>
        <Input
          value={editedDuration}
          placeholder="Enter Insurance Duration"
          onChange={(e) => setEditedDuration(e.target.value)}
        />
      </Modal>
    </>
  );
}
