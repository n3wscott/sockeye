import React from "react";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import {MenuItem,TextField,TableRow,FormControl,Button, TableBody} from "@material-ui/core";
import { TextArea } from "grommet";
const axios = require("axios");


export default function Injection(props) {
  const destinations = props.destinations;
  const dest = props.destination;

  const [id, setID] = React.useState("0123211");
  const [type, setType] = React.useState("test.type");
  const [source, setSource] = React.useState("test.source");
  const [contenttype, setContenttype] = React.useState("application/json");
  const [data, setData] = React.useState('{"test":"data"}');
  const [destination, setDestination] = React.useState(dest);

  const divStyle = {
    width: "380px",
  };

  const corsOptions = {
    origin: "*",
  };

  const useToolbarStyles = makeStyles((theme) => ({
    root: {
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === "light"
        ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
        : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
    title: {
      flex: "1 1 100%",
      paddingLeft: 8,
    },
  }));

  const classes = useToolbarStyles();


  const handleInjection = (event) => {
    axios
      .post(
        "/inject",
        {
          destination,
          data,
          headers: {
            "Ce-Id": id,
            "Ce-Specversion": "1.0",
            "Ce-Type": type,
            "Ce-Source": source,
            "Content-Type": contenttype,
          },
        },
        corsOptions
      )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <TableBody>
      <Typography
        className={classes.title}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Injection
      </Typography>
      ID:
      <TableRow>
        <FormControl style={divStyle}>
          <TextField
            id="input-injection-ceid"
            value={id}
            onChange={(e) => setID(e.target.value)}
          />
        </FormControl>
      </TableRow>
      Type:
      <TableRow>
        <FormControl style={divStyle}>
          <TextField
            id="input-injection-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </FormControl>
      </TableRow>
      Source:
      <TableRow>
        <FormControl style={divStyle}>
          <TextField
            id="input-injection-source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </FormControl>
      </TableRow>
      Content-Type:
      <TableRow>
        <FormControl style={divStyle}>
          <TextField
            id="input-injection-contenttype"
            value={contenttype}
            onChange={(e) => setContenttype(e.target.value)}
          />
        </FormControl>
      </TableRow>
      Avalible Destinations:
      <TableRow>
        <FormControl style={divStyle}>
          <Select
            // value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            {destinations.map((data, index) => (
              <MenuItem value={data}>{data}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </TableRow>
      Custom Destination:
      <TableRow>
        <FormControl style={divStyle}>
          <TextField
            id="input-injection-add"
            // value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </FormControl>
      </TableRow>
      Data:
      <TableRow>
        <FormControl style={divStyle}>
          <TextArea
            id="input-injection-data"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </FormControl>
      </TableRow>
      <TableRow>
        <FormControl style={divStyle}>
          <Button
            id="input-injection-button"
            label="Submit"
            onClick={handleInjection}
          >
            Send
          </Button>
        </FormControl>
      </TableRow>
    </TableBody>
  );
}
