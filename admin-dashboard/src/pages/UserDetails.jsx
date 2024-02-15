import React, { useState, useEffect } from "react";
import { Modal, Table, Tooltip, Typography, message, Tag } from "antd";
import {
  UserAddOutlined,
  UserDeleteOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;

export default function UserDetails() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseUrl}admin/total-users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const columns = [
    {
      key: 1,
      title: "User's Name",
      dataIndex: "name",
    },
    {
      key: 2,
      title: "Email",
      dataIndex: "email",
    },
    {
      key: 3,
      title: "Role",
      dataIndex: "__t",
      render: (role) => {
        const roleMap = {
          VehicleOwner: "Vehicle Owner",
          ServiceProvider: "Service Provider",
          WorkshopOwner: "Workshop Owner",
        };
        return roleMap[role] || role;
      },
      filters: [
        { text: "Vehicle Owner", value: "VehicleOwner" },
        { text: "Service Provider", value: "ServiceProvider" },
        { text: "Workshop Owner", value: "WorkshopOwner" },
      ],
      onFilter: (value, record) => record.__t === value,
    },
    {
      key: 4,
      title: "Verified",
      dataIndex: "isVerified",
      render: (isVerified) => (
        <Tag color={isVerified ? "green" : "red"} style={{ fontSize: 14 }}>
          {isVerified ? "Yes" : "No"}
        </Tag>
      ),
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.isVerified === value,
    },
    {
      key: 5,
      title: "Blocked",
      dataIndex: "isBlocked",
      render: (isBlocked) => (
        <Tag color={isBlocked ? "red" : "green"} style={{ fontSize: 14 }}>
          {isBlocked ? "Yes" : "No"}
        </Tag>
      ),
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.isBlocked === value,
    },
    {
      key: 6,
      title: "Actions",
      render: (record) => {
        return (
          <>
            {record.isBlocked ? (
              <Tooltip title="Click to Unblock the user">
                <UserAddOutlined
                  onClick={() => onUnblock(record)}
                  style={{
                    color: "green",
                    fontSize: 20,
                    marginLeft: 10,
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Click to Block the user">
                <UserDeleteOutlined
                  onClick={() => onBlock(record)}
                  style={{
                    color: "red",
                    fontSize: 20,
                    marginLeft: 10,
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            )}
            <Tooltip title="Click to Delete the user">
              <DeleteOutlined
                onClick={() => onDelete(record)}
                style={{
                  color: "red",
                  fontSize: 20,
                  marginLeft: 15,
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];

  const onBlock = async (record) => {
    try {
      const response = await axios.put(
        `${baseUrl}admin/block-user/${record._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        message.success(response.data.message);
        // Update the user's isBlocked status in the state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === record._id ? { ...user, isBlocked: true } : user
          )
        );
      } else {
        console.log(response);
        message.error("Failed to block user");
      }
    } catch (error) {
      message.error("Error blocking user");
    }
  };

  const onUnblock = async (record) => {
    try {
      const response = await axios.put(
        `${baseUrl}admin/unblock-user/${record._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        message.success(response.data.message);
        // Update the user's isBlocked status in the state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === record._id ? { ...user, isBlocked: false } : user
          )
        );
      } else {
        message.error("Failed to unblock user");
      }
    } catch (error) {
      message.error("Error unblocking user");
    }
  };

  const onDelete = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this user?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        await axios
          .delete(`${baseUrl}admin/delete-user/${record._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            if (response.data.success) {
              message.success(response.data.message);
              // Refresh the product list after deletion
              setUsers(users.filter((user) => user._id !== record._id));
            } else {
              console.log(response);
              message.error("Failed to delete user");
            }
          })
          .catch((error) => {
            message.error("Error deleting user");
          });
      },
    });
  };

  return (
    <>
      <Typography.Title level={2}>User Details</Typography.Title>
      <Table columns={columns} dataSource={users} />
    </>
  );
}
