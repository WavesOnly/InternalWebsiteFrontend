import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
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
      </Box>
    </Box>
  );
}

export default Login;
