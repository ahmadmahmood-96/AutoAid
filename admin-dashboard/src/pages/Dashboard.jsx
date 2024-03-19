import { useState, useEffect } from "react";
import { Statistic, Typography, Card, Row, Col, message } from "antd";
import CountUp from "react-countup";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;

const formatter = (value) => <CountUp end={value} separator="," />;

export default function Dashboard() {
  const [totalVehicleOwners, setTotalVehicleOwners] = useState(0);
  const [totalServiceProviders, setTotalServiceProviders] = useState(0);
  const [totalWorkshopOwners, setTotalWorkshopOwners] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalDispatchedOrders, setTotalDispatchedOrders] = useState(0);
  const [totalDeliveredOrders, setTotalDeliveredOrders] = useState(0);

  useEffect(() => {
    axios
      .get(`${baseUrl}admin/total-vehicle-owners`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setTotalVehicleOwners(response.data.totalVehicleOwners);
      })
      .catch((error) => {
        message.error("Error fetching records:", error);
      });

    axios
      .get(`${baseUrl}admin/total-service-providers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setTotalServiceProviders(response.data.totalServiceProviders);
      })
      .catch((error) => {
        message.error("Error fetching records:", error);
      });

    axios
      .get(`${baseUrl}admin/total-workshop-owners`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setTotalWorkshopOwners(response.data.totalWorkshopOwners);
      })
      .catch((error) => {
        message.error("Error fetching records:", error);
      });

    axios
      .get(`${baseUrl}admin/total-products`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setTotalProducts(response.data.totalProducts);
      })
      .catch((error) => {
        message.error("Error fetching records:", error);
      });

    axios
      .get(`${baseUrl}admin/total-orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setTotalOrders(response.data.totalOrders);
      })
      .catch((error) => {
        message.error("Error fetching records:", error);
      });

    axios
      .get(`${baseUrl}admin/total-dispatched-orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setTotalDispatchedOrders(response.data.totalDispatchedOrders);
      })
      .catch((error) => {
        message.error("Error fetching records:", error);
      });

    axios
      .get(`${baseUrl}admin/total-delivered-orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setTotalDeliveredOrders(response.data.totalDeliveredOrders);
      })
      .catch((error) => {
        message.error("Error fetching records:", error);
      });
  }, []);
  return (
    <>
      <Typography.Title level={2}>Dashboard</Typography.Title>
      <Row gutter={[16, 16]} wrap>
        <Col span={6} xxl={6} xl={6} lg={6} md={6} sm={12} xs={24}>
          <Card bordered={false}>
            <Statistic
              title="Number of Vehicle Owners"
              value={totalVehicleOwners}
              valueStyle={styles}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6} xxl={6} xl={6} lg={6} md={6} sm={12} xs={24}>
          <Card bordered={false}>
            <Statistic
              title="Number of Service Providers"
              value={totalServiceProviders}
              valueStyle={styles}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6} xxl={6} xl={6} lg={6} md={6} sm={12} xs={24}>
          <Card bordered={false}>
            <Statistic
              title="Number of Workshop Owners"
              value={totalWorkshopOwners}
              valueStyle={styles}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6} xxl={6} xl={6} lg={6} md={6} sm={12} xs={24}>
          <Card bordered={false}>
            <Statistic
              title="Number of Products"
              value={totalProducts}
              valueStyle={styles}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6} xxl={6} xl={6} lg={6} md={6} sm={12} xs={24}>
          <Card bordered={false}>
            <Statistic
              title="Total Number of Orders"
              value={totalOrders}
              valueStyle={styles}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6} xxl={6} xl={6} lg={6} md={6} sm={12} xs={24}>
          <Card bordered={false}>
            <Statistic
              title="Orders Dispatched"
              value={totalDispatchedOrders}
              valueStyle={styles}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6} xxl={6} xl={6} lg={6} md={6} sm={12} xs={24}>
          <Card bordered={false}>
            <Statistic
              title="Orders Delivered"
              value={totalDeliveredOrders}
              valueStyle={styles}
              formatter={formatter}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}

const styles = {
  color: "#50ab00",
  fontSize: 30,
};
