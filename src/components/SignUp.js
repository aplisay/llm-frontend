import React from "react";
import { Link } from "react-router-dom";
import cx from "classnames";

import { useCreateUser } from "../api/user";
import Card from "./Card";
import { Form, Field, Label, Input } from "./Form";
import Cover from "../styles/Cover.module.css";
import Stack from "../styles/stack.module.css";
import Button from "../styles/button.module.css";
import Cluster from "../styles/cluster.module.css";
import Text from "../styles/text.module.css";
import { ReactComponent as GoogleG } from "../icons/google-g.svg";

function SignUp() {
  const [createUser, { status }] = useCreateUser();
  return (
    <section className={Cover.wrapper}>
      <Card columnCount={1} className={Cover.center}>
        <div className={Stack.lg}>
          <h1 className={Text.cardTitle}>Create your account</h1>
          <Form onSubmit={createUser}>
            <div className={Stack.lg}>
              <Field id="name">
                <Label>Name</Label>
                <Input required />
              </Field>

              <Field id="company">
                <Label>Company</Label>
                <Input required />
              </Field>

              <Field id="phone">
                <Label>Phone number</Label>
                <Input type="tel" required />
              </Field>

              <button type="submit" className={cx(Button.lg, Button.fullWidth)}>
                <GoogleG className="icon" style={{ marginRight: "1em" }} />
                Sign in with Google
              </button>

              {status === "error" && <div>Something went wrong</div>}
            </div>
          </Form>
          <p className={Cluster.md}>
            Already have an account?
            <Link to="/" className={Button.text}>
              Log in
            </Link>
          </p>
        </div>
      </Card>
    </section>
  );
}

export default SignUp;
