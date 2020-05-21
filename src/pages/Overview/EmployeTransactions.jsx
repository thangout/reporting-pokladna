import React, {useState} from 'react';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const EmployeeTransactions  = (props) => {


  const {tableHead,tableRows,tableSums} = props;

  const handleClick = (data) => {


  }


   const classes = {
     table: {
      minWidth: 650,
    },
    }



    return (
      <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
          {tableHead.map((value, index)=> {
            return <TableCell key={value} align="right">{value}</TableCell>
          })}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows.map((value, index)=> {
            let row = value.map((cell, index) => <TableCell key={value + index} align="right" >{cell}</TableCell>)
            return <TableRow key={index}>{row}</TableRow>
          })}
          <TableRow>
          {tableSums.map((value, index)=> {
            return <TableCell key={value + index} align="right" >{value}</TableCell>
          })}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
        );
   }

export default EmployeeTransactions;

