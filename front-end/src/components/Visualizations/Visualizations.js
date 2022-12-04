import { Typography, Container, Stack } from "@mui/material";
import CulturePrepTimes from "./CulturePrepTimes";
import RestaurantPrices from "./RestaurantPrices";
import NumRestaurantsCuisine from "./NumRestaurantsCuisine";

function Visualizations() {
    return(
        <Container className="page-container" sx={{textAlign: "center"}}>
            <Stack justifyContent="center" direction="column" textAlign="center">
                <Typography className="modelTitle" variant="h2" gutterBottom>
                    Visualizations
                </Typography>
                <Typography gutterBottom sx={{ marginTop: "16px", marginBottom: "8px" }} variant="h4">
                    Average Recipe Times for Different Cultures
                </Typography>
                <CulturePrepTimes />
                <Typography gutterBottom sx={{ marginTop: "16px", marginBottom: "8px" }} variant="h4">
                    Number of Different Restaurant Types
                </Typography>
                <NumRestaurantsCuisine/>
                <Typography gutterBottom sx={{ marginTop: "16px", marginBottom: "8px" }} variant="h4">
                    Restaurant Pricing
                </Typography>
                <RestaurantPrices/>
            </Stack>
        </Container>
    );
}

export default Visualizations;