import { Box, Typography, useTheme } from "@mui/material";

const DashboardCard = (props) => {
  const { title, subtitle, icon, navigateUrl } = props;
  const theme = useTheme();

  const handleClick = () => {
    if (navigateUrl) {
      window.open(navigateUrl, "_blank");
    }
  };

  return (
    <Box
      p="15px"
      width="100%"
      sx={{
        backgroundColor: theme.palette.layer.default,
        border:
          theme.palette.mode === "dark" ? "" : "1px solid rgba(0, 0, 0, 0.23);",
        borderRadius: "8px",
        cursor: navigateUrl ? "pointer" : "inherit",
        "&:hover": {
          backgroundColor: navigateUrl ? theme.palette.secondary.main : "",
          color:
            theme.palette.mode === "dark" ? "" : navigateUrl ? "white" : "",
        },
      }}
      onClick={handleClick}
    >
      <Box display="flex" justifyContent="space-between" width="100%">
        <Box width="100%">
          {icon}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              width: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography
          variant="h5"
          sx={{
            width: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardCard;
