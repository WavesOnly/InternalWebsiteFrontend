import React, { useEffect, useRef, useState } from "react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { Box, Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

import PageInfo from "../../components/PageInfo";
import { loginUser, setPersistLogin } from "../../slices/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = useGoogleLogin({
    onSuccess: (response) => login(response),
    flow: "auth-code",
  });

  const login = (response) => {
    console.log(response);
    dispatch(loginUser({ code: response?.code }))
      .unwrap()
      .then(() => {
        dispatch(setPersistLogin(true));
        navigate("/home");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box mt="0px" ml="20px" mr="20px" mb="20px">
      <PageInfo title="Login" subTitle="" buttonWidth="" LinkComponent={null} />
      <Box sx={{ width: "100%" }}>
        <Button
          variant="contained"
          disableElevation
          color="secondary"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={handleClick}
        >
          Login with Google
        </Button>
        {/* <GoogleLogin
          flow="implicit"
          onSuccess={(response) => login(response)}
          onError={(error) => console.log("Login Failed:", error)}
          size="medium"
          width={310}
        /> */}
      </Box>
    </Box>
  );
}

export default Login;
