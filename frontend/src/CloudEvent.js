import React, { Component } from 'react';

import {
  Box, List,
} from 'grommet';

const Attributes = (props) => {
  let data = [];

  Object.keys(props.event).forEach(key => {
    if (key === "data") {
      return;
    }
    data.push({"key":key, "value":props.event[key]});
  });

  return (
  <Box direction="column">
    <List
      pad="xxsmall"
      margin="xsmall"
      primaryKey="key"
      secondaryKey="value"
      data={data}
    />
  </Box>
)};

const Data = (props) => {
  return (
    <Box direction="column">
      <p>{props.data}</p>
    </Box>
  )};


export class CloudEvent extends Component {
  render() {
    let event = this.props.event;
    let data = this.props.event.data;
    return(
      <Box direction="row" border={{ color: 'brand', size: 'small' }} round="xsmall">
        <Attributes event={event}/>
        <Data data={data}/>
      </Box>
    )
  }
}

export default CloudEvent;