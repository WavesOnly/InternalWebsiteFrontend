import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import GoogleIcon from "@mui/icons-material/Google";

import PageInfo from "../../components/PageInfo";
import { loginUser, setPersistLogin } from "../../slices/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.user?.loading);

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
        <LoadingButton
          variant="contained"
          disableElevation
          color="secondary"
          fullWidth
          loading={loading}
          startIcon={<GoogleIcon />}
          onClick={handleClick}
        >
          Login with Google
        </LoadingButton>
      </Box>
    </Box>
  );
}

export default Login;
