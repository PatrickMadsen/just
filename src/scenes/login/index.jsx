import { Box, Typography, useTheme, TextField } from "@mui/material";
import Button, { ButtonProps } from '@mui/material/Button';
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { tokens } from "../../theme";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";

import { LoginContext } from "../../contexts/Login.js";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Header from "../../components/Header";

const onSubmitLogin = (e, setUser, isAdmin) => {
  e.preventDefault();

  if (!isAdmin) {
    setUser({
      "user_id": e.target.Medlemsnummer.value,
      "name": e.target.Navn.value,
      "distrikt": e.target.Distrikt.value,
      "klub": e.target.Klub.value,
      "email": e.target.Email.value,
      "number": e.target.Telefon.value,
      "isAdmin": false
    });
  } else {
    let token = e.target.AdgangskodeAdmin.value
    setUser({
      "email": e.target.EmailAdmin.value,
      "auth": token,
      "isAdmin": true
    });
  }
};

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { user, setUser } = useContext(LoginContext);
  const [ isAdmin, setIsAdmin ] = useState(false);

  if (user.user_id != undefined) {
    return <Navigate to="/" replace={true} />;
  } else if (user.isAdmin != undefined) {
    return <Navigate to="/admin/apps" replace={true} />;
  }

  return (
    <Box m="20px">
      <Box 
        className="centered" 
        backgroundColor={colors.primary[400]}
        p={5}
        component="form"
        onSubmit={(e) => {onSubmitLogin(e, setUser, isAdmin)}}
        sx={{
          '& .MuiTextField-root': { m: 1, width: '35ch' },
          '& .Mui-focused': { color: colors.grey[200] }
        }}
      >
        <Typography 
          variant="h2"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ mb: 1, ml: 1 }}
        >
          Rotary Login
        </Typography>  
        { !isAdmin ? (
          <>
          <div>
            <TextField id="outlined-basic" label="Medlemsnummer" name="Medlemsnummer" variant="outlined" />
            <TextField id="outlined-basic" label="Navn" name="Navn" variant="outlined" />
          </div>
          <div>
            <TextField id="outlined-basic" label="Distrikt" name="Distrikt" variant="outlined" />
            <TextField id="outlined-basic" label="Klub" name="Klub" variant="outlined" />
          </div>
          <div>
            <TextField id="outlined-basic" label="Email" name="Email" variant="outlined" />
            <TextField id="outlined-basic" label="Telefon nr." name="Telefon" variant="outlined" />
          </div>
          </>
        ) : (
          <>
            <TextField 
              id="outlined-basic" 
              label="Email" 
              name="EmailAdmin" 
              sx={{ width: "72ch !important" }}
              variant="outlined" 
            />
            <div></div> {/* Create a newline */}
            <TextField 
              id="outlined-basic" 
              label="Adgangskode" 
              name="AdgangskodeAdmin" 
              sx={{ width: "72ch !important" }}
              variant="outlined" 
              type="password" 
            />
          </>
        )

        }
        <Box
          flexDirection="row"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Button 
            variant="contained" 
            type="submit"
            color="success" 
            size="large" 
            sx={{ mt: 1, ml: 1, width: '16ch'}}
          >LOGIN</Button>
        <Typography 
          variant="span"
          color={theme.palette.mode == "dark" ? colors.primary[300] : colors.primary[700]}
          sx={{ cursor: "pointer", mr: 1, pt: 2 }}
          onClick={(e) => {setIsAdmin(!isAdmin)}}
        >
          {!isAdmin ? "Admin" : "Bruger"} Login
        </Typography>  
        </Box>
        
      </Box>
    </Box>
  )
}

export default Login;
