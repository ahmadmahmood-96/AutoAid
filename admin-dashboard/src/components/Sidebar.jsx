import { MenuUnfoldOutlined } from "@ant-design/icons";

const Sidebar = () => {
  return (
    <>
      <MenuUnfoldOutlined
        style={{ fontSize: 28 }}
        onClick={() => console.log("icon clicked")}
      />
      <div>Side Bar</div>
    </>
  );
};

export default Sidebar;
