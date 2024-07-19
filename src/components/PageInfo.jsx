import React from "react";
import { useMediaQuery, Box, Button } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import Header from "./Header";

function PageInfo(props) {
  const { LinkComponent, title, subTitle, buttonWidth } = props;
  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return (
    <Box
      display="flex"
      flexDirection={isMedium ? "column" : "row"}
      alignItems={isMedium ? "flex-start" : "flex-end"}
      mb="10px"
    >
      <Header title={title} subTitle={subTitle} />
      {LinkComponent && (
        <Button
          variant="contained"
          disableElevation
          color="secondary"
          sx={{
            minWidth: buttonWidth,
            mt: isMedium ? "5px" : "0px",
            ml: isMedium ? "0px" : "40px",
          }}
          endIcon={<OpenInNewIcon />}
        >
          {<LinkComponent />}
        </Button>
      )}
    </Box>
  );
}

export default PageInfo;
