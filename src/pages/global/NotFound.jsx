import React from "react";
import { Box, Button } from "@mui/material";
import PageInfo from "../../components/PageInfo";

function NotFound() {
  return (
    <Box mt="0px" ml="20px" mr="20px" mb="20px">
      <PageInfo
        title="Error 😐"
        subTitle="The page you're looking for doesn't exist"
        buttonWidth=""
        LinkComponent={null}
      />
    </Box>
  );
}

export default NotFound;
