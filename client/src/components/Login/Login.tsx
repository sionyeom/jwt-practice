import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { FaUserCircle, FaKey, FaArrowCircleRight } from "react-icons/fa";
import "./login.scss";
import axios from "axios";

type Props = {};
type LoginInputType = {
  id: string;
  pw: string;
};

const Login = (props: Props) => {
  const [user, setUser] = useState<LoginInputType>({
    id: "",
    pw: "",
  });

  const { id, pw } = user;

  const onChange = (e: any) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const onClickSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    axios({
      method: "post",
      url: "http://localhost:8080/api/user/login",
      data: {
        id: id,
        pw: pw,
      },
    }).then((res) => {
      if (res.status === 200) {
        console.log(res.data);
      }
    });
  };

  return (
    <div className="container">
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <span className="icon">
          <FaUserCircle />
        </span>
        <TextField
          name="id"
          value={id}
          id="input-with-sx"
          label="ID"
          variant="standard"
          onChange={onChange}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <span className="icon">
          <FaKey />
        </span>
        <TextField
          name="pw"
          type={"password"}
          value={pw}
          id="input-with-sx"
          label="PW"
          variant="standard"
          onChange={onChange}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <Button
          variant="contained"
          startIcon={<FaArrowCircleRight />}
          onClick={onClickSubmit}
        >
          Login
        </Button>
      </Box>
    </div>
  );
};

export default Login;
