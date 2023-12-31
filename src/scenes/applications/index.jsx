import { Box, Typography, useTheme, TextField } from "@mui/material";
import Button, { ButtonProps } from '@mui/material/Button';
import { tokens } from "../../theme";
import { useContext, useState, useEffect } from "react";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { LoginContext } from "../../contexts/Login.js";
import { ReloadContext } from "../../contexts/Reload.js";

import { applications, application_tmp } from "../../data/mockData.js";

import Header from "../../components/Header";
import QuestioneerInput from "../../components/QuestioneerInput";
import UserInfo from "../../components/UserInfo";

const submitForm = (e, flag, app) => {
  e.preventDefault();
  console.log(e, flag);
  // TODO: Save output data

  // Isolate the application fields with data in them
  let filtered = app.form.filter((item) => {
    return !["plaintext"].includes(item.type);
  });
  
  let res = filtered.map((item) => {
    return [item.id, e.target[`inp${item.id}`].value]
  });
  let obj = Object.fromEntries(res);
  console.log(obj);

  // Obj er et objekt hvor keys er id og value er svar, brug når der skal gemmes 

  switch (flag) {
    case "Gem":
      
      break;

    case "Indsend":

      break;

    default:
      break;
  }
}

const Apps = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { user, setUser } = useContext(LoginContext);
  const [ activeApp, setActiveApp ] = useState(-1);
  const [ application, setApplication ] = useState({});
  const [flag, setFlag] = useState("Indsend");

  useEffect(() => {
    setApplication(application_tmp)
  }, [activeApp])

  const { reload, setReload } = useContext(ReloadContext);
  useEffect(() => {
    setActiveApp(-1);
    setReload(false);
  }, [reload])

  return (
    <Box 
      m="40px"
      sx={{ 
        '& .css-8er80j-MuiPaper-root-MuiTableContainer-root': { backgroundColor: colors.primary[800] },
        '& .MuiTableBody-root .MuiTableCell-root': { cursor: 'pointer' }
      }}
    >
      {
        activeApp == -1 ?
          <>
            <Header title="ANSØNINGER" subtitle="Alle aktive ansøgninger lige nu" />
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Navn</TableCell>
                    <TableCell>Start dato</TableCell>
                    <TableCell>Slut dato</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      onClick={(e) => {setActiveApp(row.id)}}
                    >
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.start}</TableCell>
                      <TableCell>{row.stop}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </> : <Box
              component="form"
              onSubmit={(e) => {submitForm(e, flag, application)}}
            >
            <Header title={application.title} subtitle={application.subtitle} />        
            {application.desc.split("\n").map((text) => {
              return (
                <Typography 
                  variant="h6"
                  color={colors.grey[100]}
                >
                  {text != "" ? text : " "}
                </Typography>  
              )
            })}
            <Box mb={5} />
            <UserInfo />
            {application.form.map(row => {
              return <QuestioneerInput row={row} />
            })}
            <Button 
              variant="contained" 
              type="submit"
              color="success" 
              size="large" 
              sx={{ mt: 1, ml: 1, width: '16ch'}}
              onClick={(e) => {setFlag("Indsend")}}
            >Indsend</Button>
            <Button 
              variant="contained" 
              type="submit"
              size="large" 
              color="info"
              sx={{ mt: 1, ml: 1, width: '16ch'}}
              onClick={(e) => {setFlag("Gem")}}
            >Gem</Button>
          </Box>
      }
    </Box>
  )
}

export default Apps;
