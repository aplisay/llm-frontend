import React from "react";
import { Link } from "react-router-dom";
import cx from "classnames";

import { useLogin } from "../api/user";
import { Card } from "@mui/joy";
import Loading from "./Loading";
import Stack from "../styles/stack.module.css";
import Cover from "../styles/Cover.module.css";
import Button from "../styles/button.module.css";
import Cluster from "../styles/cluster.module.css";
import Text from "../styles/text.module.css";
import { ReactComponent as GoogleG } from "../icons/google-g.svg";

function LogIn() {
  const [login, { status }] = useLogin();
  return (
    <section className={Cover.wrapper}>
      <Card columnCount={1} className={cx(Cover.center)}>
        <div className={Stack.lg}>
          <h1 className={Text.cardTitle}>Log in to your account</h1>

          <button onClick={login} className={cx(Button.lg, Button.fullWidth)}>
            <GoogleG className="icon" style={{ marginRight: "1em" }} />
            Sign in with Google
            <Loading status={status} size="sm" />
          </button>
          {status === "error" && <div>Something went wrong logging you in</div>}
          <p className={Cluster.md}>
            Don't have an account?
            <Link to="/sign-up" className={Button.text}>
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </section>
  );
}

export default LogIn;
