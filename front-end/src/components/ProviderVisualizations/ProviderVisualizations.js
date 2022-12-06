import { Typography, Container, Stack } from "@mui/material";
import ChampionshipsByState from "./ChampionshipsByState";
import SalaryByPos from "./SalaryByPos";
import WinsByState from "./WinsByState";

function ProviderVisualizations() {
    return(
        <Container className="page-container" sx={{textAlign: "center"}}>
            <Stack justifyContent="center" direction="column" textAlign="center">
                <Typography className="modelTitle" variant="h2" gutterBottom>
                    Lowball Visualizations
                </Typography>
                <Typography gutterBottom sx={{ marginTop: "16px", marginBottom: "8px" }} variant="h4">
                    Championships by State
                </Typography>
                <ChampionshipsByState/>
                <Typography gutterBottom sx={{ marginTop: "16px", marginBottom: "8px" }} variant="h4">
                    Average Salary by Position
                </Typography>
                <SalaryByPos/>
                <Typography gutterBottom sx={{ marginTop: "16px", marginBottom: "8px" }} variant="h4">
                    Wins by State
                </Typography>
                <WinsByState/>
            </Stack>
        </Container>
    );
}

export default ProviderVisualizations;