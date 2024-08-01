import React, { useState } from "react";
import { Box, Link } from "@mui/material";
import PageInfo from "../../components/PageInfo";
import Spinner from "../../components/Spinner";

function Meetings() {
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <Box mt="0px" ml="20px" mr="20px" mb="20px">
      <PageInfo
        title="Meetings"
        subTitle="Notes from the WavesOnly vault"
        buttonWidth="200px"
        LinkComponent={() => (
          <Link
            href="https://docs.google.com/document/d/1ezZGS5UPeKMOODX4bK0V5WCfd9HOxzTaMzlQNEjiuJI/edit?usp=sharing"
            target="_blank"
            color="inherit"
            style={{ textDecoration: "none" }}
          >
            Open on Google Docs
          </Link>
        )}
      />
      {loading && <Spinner />}
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <iframe
          src="https://docs.google.com/document/d/e/2PACX-1vSReMzqJ83slKVkq6AV6NiYWFZfBHDYotQxr0W1fBgD2d1v5IwoBUZPU8Efk-vc5BxVpD_V6YRs_t8B/pub?embedded=true"
          onLoad={handleLoad}
          style={{
            height: "100%",
            minWidth: "100%",
            border: "none",
          }}
        />
      </Box>
    </Box>
  );
}

export default Meetings;
