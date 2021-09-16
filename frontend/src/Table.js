import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import JSONPretty from 'react-json-pretty';
import Fade from '@material-ui/core/Fade';
import './Json.css';


import './App.css';

import XMLViewer from 'react-xml-viewer'

import Attributes from './Attributes';

const useStyles = makeStyles({
  root: {
    //width: '100%',
    //maxWidth: 600,
  },
  table: {
    minWidth: 650,
    paddingTop: 0,
  },
  attributes: {
    minWidth: 300,
    maxWidth: 500,
  },
});

function Data(props) {
  let data = props.item.data;

  let data_base64 = null;
  if ("data_base64" in props.item) {
    data_base64 = props.item["data_base64"];
  }

  if (data_base64 !== null) {
    try {
      data = atob(data_base64);
    } catch (err) {
      console.error(err);
      data = data_base64;
    }
  }

  let mediaType = "unknown";
  if ("datacontenttype" in props.item) {
    mediaType = props.item["datacontenttype"]
  }

  if (mediaType.startsWith("application/json") || mediaType.startsWith("text/json")) {
    let src = JSON.parse(data);

    return (
      <JSONPretty data={src}/>
    );
  }
  if (mediaType.startsWith("application/xml") || mediaType.startsWith("text/xml")) {
    if (data.startsWith("\"")) {
      // Data was part of a JSON string, parse it.
      data = JSON.parse(data);
    }
    return (
      <div>
        <XMLViewer xml={data}/>
      </div>
    );
  }
  return (
    <pre>
      {data}
    </pre>
  );
}



export default function BasicTable(props) {
  const classes = useStyles();
  const rows = props.items;
  const filter = props.filter;

  function evalFilter(event) {
    for (let i = 0; i < filter.length; ++i) {
      if (filter[i].attr in event) {
        switch (filter[i].match) {
          case "Exact":
            if (event[filter[i].attr] !== filter[i].value) {
              return false;
            }
            break;
          case "Includes":
            if (!event[filter[i].attr].includes(filter[i].value)) {
              return false;
            }
            break;
          case "Prefix":
            if (!event[filter[i].attr].startsWith(filter[i].value)) {
              return false;
            }
            break;
          case "Suffix":
            if (!event[filter[i].attr].endsWith(filter[i].value)) {
              return false;
            }
            break;
          default:
            break;
        }
      } else {
        return false;
      }
    }
    return true;
  }

  return (
    <>
    {filter.map((f) => (<Fade in={true}><p>{f.attr} [{f.match}] {f.value}</p></Fade>))}
    <TableContainer component={Paper}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Attributes</TableCell>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>



          {rows.filter(evalFilter).map((row) => (
            <Fade in={true} mountOnEnter={true} appear={true} timeout={300}>
            <TableRow hover key={row.id}>
              <TableCell component="th" scope="row" className={classes.attributes}>
                <Attributes item={row}/>
              </TableCell>
              <TableCell>
                <Data item={row}/>
              </TableCell>
            </TableRow>
            </Fade>
            ))}


        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}
