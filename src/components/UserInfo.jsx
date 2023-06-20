import { typography, Box, useTheme, textField, menuItem, Select } from "@mui/material";
import { useContext } from "react";
import { tokens } from "../theme.js";
import { LoginContext } from "../contexts/Login.js";


const Row = ({ title, value }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      flexdirection="row"
      display="flex"
      pt={2}
    >
      <Box
        sx={{ width: 300 }}
      >
        <typography 
          variant="h6"
          color={colors.grey[100]}
          name={"test"}
        >
          {title}
        </typography>  
      </Box>
      <typography 
        variant="h6"
        color={colors.grey[100]}
        sx={{ width: 300 }}
      >
        {value}
      </typography>  
    </Box>
  )
};

const UserInfo = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useContext(LoginContext);

  return (
    <Box
      mb={2}
      borderTop={`2px solid ${colors.primary[400]}`}
    >
      <Row title="Navn" value={user.name} />
      <Row title="Bruger ID" value={user.user_id} />
      <Row title="Distrikt" value={user.distrikt} />
      <Row title="Klub" value={user.klub} />
      <Row title="Email" value={user.email} />
      <Row title="Tlf. nummer" value={user.number} />
    </Box>
  );
};

export default UserInfo;
