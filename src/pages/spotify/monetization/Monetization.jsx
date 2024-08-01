import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useMediaQuery,
  useTheme,
  Box,
  FormGroup,
  InputAdornment,
  TextField,
  Link,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MusicVideoIcon from "@mui/icons-material/MusicVideo";
import { useDispatch } from "react-redux";
import { triggerMonetizationPipeline } from "../../../slices/spotify/spotifySlice";
import { setAlert } from "../../../slices/user/userSlice";

import PageInfo from "../../../components/PageInfo";

function Monetization() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const loading = useSelector((state) => state.spotify.loading);
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [formValidation, setFormValidation] = useState({ link: false });
  const [newMonetization, setNewMonetization] = useState({
    link: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newMonetization?.link) {
      setFormValidation((prevState) => {
        return {
          ...prevState,
          link: true,
        };
      });
    }
    const result = await dispatch(
      triggerMonetizationPipeline(newMonetization)
    ).unwrap();
    setNewMonetization({ link: "" });
    dispatch(setAlert({ alert: result.message, severity: "success" }));
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
            autoComplete="off"
            size="small"
            disabled={true}
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
            sx={{
              backgroundColor: theme.palette.layer.default,
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.secondary.main,
              },
            }}
          />
        </FormGroup>
        <Box
          display="flex"
          justifyContent={isSmall ? "center" : "flex-end"}
          mt="5px"
        >
          <LoadingButton
            variant="contained"
            loading={loading ? true : false}
            disableElevation
            color="secondary"
            fullWidth={isSmall ? true : false}
            endIcon={<MusicVideoIcon />}
            onClick={handleSubmit}
            sx={{ minWidth: 200 }}
            disabled={true}
          >
            Create Videos
          </LoadingButton>
        </Box>
      </form>
    </Box>
  );
}

export default Monetization;
