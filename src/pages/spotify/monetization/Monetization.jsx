import React, { useState, useEffect } from "react";
import {
  useMediaQuery,
  Box,
  FormGroup,
  InputAdornment,
  TextField,
  Button,
  Link,
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MusicVideoIcon from "@mui/icons-material/MusicVideo";

import PageInfo from "../../../components/PageInfo";

function Monetization() {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [formValidation, setFormValidation] = useState({ link: false });
  const [newMonetization, setNewMonetization] = useState({
    link: "",
    type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMonetization((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newMonetization?.link) {
      setFormValidation((prevState) => {
        return {
          ...prevState,
          link: true,
        };
      });
    }
  };

  useEffect(() => {
    newMonetization?.link &&
      setFormValidation((prevState) => {
        return {
          ...prevState,
          link: false,
        };
      });
  }, [newMonetization?.link]);

  return (
    <Box mt="0px" ml="20px" mr="20px" mb="20px">
      <PageInfo
        title="Monetization"
        subTitle="Trigger the monetization pipeline in one click"
        buttonWidth="200px"
        LinkComponent={() => (
          <Link
            href="https://studio.youtube.com/channel/UCOMeaHyvxDJHdveqbYfDPDg"
            target="_blank"
            color="inherit"
            style={{ textDecoration: "none" }}
          >
            Open Monetization Channel
          </Link>
        )}
      />
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <TextField
            label="Spotify Link"
            variant="outlined"
            name="link"
            type="text"
            fullWidth
            value={newMonetization?.link}
            margin="normal"
            onChange={handleChange}
            error={formValidation?.link}
            color="secondary"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MonetizationOnIcon />
                </InputAdornment>
              ),
            }}
          />
        </FormGroup>
        <Box
          display="flex"
          justifyContent={isSmall ? "center" : "flex-end"}
          mt="5px"
        >
          <Button
            variant="contained"
            disableElevation
            color="secondary"
            fullWidth={isSmall ? true : false}
            endIcon={<MusicVideoIcon />}
            onClick={handleSubmit}
            sx={{ minWidth: 200 }}
          >
            Create Videos
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default Monetization;
