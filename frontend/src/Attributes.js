import React from "react";
import {
  withStyles,
  makeStyles,
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";

const CssTextField = withStyles({
  root: {
    "& label": {
      color: "green"
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "lightgray"
    },
    "& .MuiInputBase-input": {
      padding: 0,
      width: "100%"
    }
  }
})(TextField);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    padding: 0,
    margin: 4
  },
  list: {
    "list-style-type": "none",
    "padding-inline-start": 0,
    "width": "100%",
  }
}));

export default function CustomizedInputs(props) {
  const classes = useStyles();

  let rows = [];

  let specVersion = "??";
  let dataContentType = "unknown";

  Object.keys(props.item).forEach(key => {
    if (key === "data" || key === "data_base64" || key === "key") {
      return;
    }
    if (key === "specversion") {
      specVersion = props.item[key];
      return
    }
    if (key === "datacontenttype") {
      dataContentType = props.item[key];
      return
    }
    rows.push({"key":key, "value":props.item[key]});
  });

  rows.sort(function(a, b) {
    if (a.key < b.key) {
      return -1;
    }
    if (a.key > b.key) {
      return 1;
    }
    // a must be equal to b
    return 0;
  });

  return (
    <form className={classes.root} noValidate>
      <ul className={classes.list}>
        <li>
          <Chip variant="outlined" color="lightgray" size="small" avatar={<Avatar>{specVersion}</Avatar>} label={dataContentType}/>
        </li>
        {rows.map((row) => (
        <li>
        <CssTextField fullWidth
          className={classes.margin}
          value={row.value}
          label={row.key}
        />
        </li>
      ))}
      </ul>
    </form>
  );
}
