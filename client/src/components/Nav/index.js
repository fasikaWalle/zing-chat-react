import React from "react";
import { Layout } from "antd";
import Auth from "../../utils/auth";
import { Link } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
import Logo from "../../images/zing-logo.png";
const { Header } = Layout;

class Nav extends React.Component {
  handleClick = (e) => {
    this.setState({ current: e.key });
  };

  render() {
    return (
      <Header
        style={{
          backgroundColor: "#434379",
          height: "70px",
          display: "flex",

          justifyContent: "space-between",
        }}
      >
        <Link style={{ color: "#fff" }} to="/">
          <img width={160} preview="false" src={Logo} />
        </Link>

        {Auth.loggedIn() ? (
          <a className="nav-link" to="/" onClick={() => Auth.logout()}>
            <LogoutOutlined style={{ fontSize: "1.3rem", color: "#fff" }} />
          </a>
        ) : null}
      </Header>
    );
  }
}

export default Nav;
