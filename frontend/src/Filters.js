import React from "react";
import { lighten, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import {
  List,
  ListSubheader,
  ListItemText,
  ListItemIcon,
  ListItem,
  InputLabel,
  MenuItem,
  TextField,
  FormControl,
  Select,
  Checkbox,
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: theme.spacing(42),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: theme.spacing(42),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const attributes = [
  "specversion",
  "datacontenttype",
  "dataschema",
  "source",
  "type",
  "subject",
  "time",
];

const headCells = [
  { id: "attr", label: "Name" },
  { id: "match", label: "Match" },
  { id: "value", label: "Value" },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all filters" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id}>{headCell.label}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

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

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Filters
        </Typography>
      )}

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={props.onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function Filters(props) {
  const classes = useStyles();

  const [selected, setSelected] = React.useState([]);

  const [filters, setFilters] = React.useState([]);

  const [filterValue, setFilterValue] = React.useState("");
  const [filterMatch, setFilterMatch] = React.useState(3);

  const handleChange = (event) => {
    setFilterMatch(event.target.value);
  };

  const handleAdd = (event) => {
    let match;
    switch (filterMatch) {
      case 0:
        match = "Exact";
        break;
      case 1:
        match = "Prefix";
        break;
      case 2:
        match = "Suffix";
        break;
      case 3:
      default:
        match = "Includes";
    }
    let attr = inputValue;
    let val = filterValue;
    if (attr !== "" && val !== "") {
      setFilters((og) => {
        const newFilters = [
          ...og.filter((g) => {
            return g.key !== attr;
          }),
          { key: attr, attr: attr, match: match, value: val },
        ];

        props.onChange(event, newFilters);

        return newFilters;
      });

      setFilterMatch(3);
      setValue("");
      setInputValue("");
      setFilterValue("");
    } else {
      // TODO: add validation feedback.
    }
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleValChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.attr);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleDelete = (event) => {
    let newFilters = filters.filter((f) => {
      return !isSelected(f.attr);
    });

    setFilters(newFilters);
    props.onChange(event, newFilters);

    setSelected([]);
  };

  const [value, setValue] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");

  const rows = filters;

  return (
    <List>
      <ListSubheader>
        <EnhancedTableToolbar
          numSelected={selected.length}
          onDelete={handleDelete}
        />
      </ListSubheader>
      <ListItem>
        {filters.length > 0 && (
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                onSelectAllClick={handleSelectAllClick}
                rowCount={rows.length}
              />
              <TableBody>
                {rows.map((row, index) => {
                  const isItemSelected = isSelected(row.attr);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.attr)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.attr}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.attr}
                      </TableCell>
                      <TableCell>{row.match}</TableCell>
                      <TableCell>{row.value}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </ListItem>
      <ListItem>
        <Autocomplete
          freeSolo
          options={attributes}
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
            <FormControl className={classes.formControl}>
              <TextField
                id="input-filter-attribute"
                {...params}
                label="Attribute"
              />
            </FormControl>
          )}
        />
      </ListItem>
      <ListItem>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Match</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filterMatch}
            onChange={handleChange}
          >
            <MenuItem value={0}>Exact</MenuItem>
            <MenuItem value={1}>Prefix</MenuItem>
            <MenuItem value={2}>Suffix</MenuItem>
            <MenuItem value={3}>Includes</MenuItem>
          </Select>
        </FormControl>
      </ListItem>
      <ListItem>
        <FormControl className={classes.formControl}>
          <TextField
            id="input-filter-value"
            label="Value"
            value={filterValue}
            onChange={handleValChange}
            type="search"
          />
        </FormControl>
      </ListItem>
      <ListItem button onClick={handleAdd}>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary="Add Filter" />
      </ListItem>
      <ListItem>
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
            />
          </Table>
        </TableContainer>
      </ListItem>
    </List>
  );
}
