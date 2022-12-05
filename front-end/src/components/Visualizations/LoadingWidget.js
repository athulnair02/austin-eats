import { Box, CircularProgress } from "@mui/material";

function LoadingWidget(props) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: props.height ?? "none",
        flexGrow: props.grow ?? false ? 2 : 0,
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export default LoadingWidget;
