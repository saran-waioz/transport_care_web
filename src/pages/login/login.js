import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@material-ui/core";
import Apicall from "../../component/Api/Apicall";
import { useHistory } from "react-router";


const LoginPage = () => {
  const history = useHistory();
  const [values, setvalues] = useState({
    email: "",
    password: "",
  });
  const { email, password } = values;
  useEffect(() => {
    localStorage.getItem("adminLogin") === email
      ? history.push({ pathname: "/" })
      : history.push({ pathname: "/admin" });
  }, []);

  const handleChange = (name) => (event) => {
    setvalues({ ...values, error: false, [name]: event.target.value });
  };

  const onClick = async () => {
    if (email === "" || password === "") {
      console.log("Please fill data");
    } else {
      const res = await Apicall({ email, password }, "/auth/admin_login");
      console.log(res.data);
      if (res.data.status) {
        localStorage.setItem("adminLogin", email);
        history.push("/");
      } else {
      }
    }
  };
  return (
    <div>
      <Box
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          {/* <img className="logo_image" src={Logo} alt="your Place" /> */}
          <Formik>
            <form>
              <Box sx={{ mb: 3 }}>
                <Typography color="textPrimary" variant="h2">
                  Sign in
                </Typography>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Sign in on the internal platform
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="Email Address.."
                margin="normal"
                name="email"
                type="email"
                value={email}
                variant="outlined"
                onChange={handleChange("email")}
                required
              />
              <TextField
                fullWidth
                label="Password"
                margin="normal"
                name="password"
                type="password"
                onChange={handleChange("password")}
                value={password}
                variant="outlined"
                required
              />
              <Box sx={{ py: 2 }}>
                <Button
                  color="primary"
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={onClick}
                >
                  Sign in
                </Button>
              </Box>
            </form>
          </Formik>
        </Container>
      </Box>
    </div>
  );
};

export default LoginPage;
