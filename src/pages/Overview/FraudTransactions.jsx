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


const FraudTransactions  = (props) => {


  const {transactions} = props;

  const handleClick = (data) => {


  }


   const classes = {
     table: {
      minWidth: 650,
    },
    }



    return (
        <>
        <h2>Fraud transactions</h2>
            <ul>
        {
            transactions && transactions.map(k =>{

                /*
                let tmp = item.map(k =>{
                    return <li>{k.money}</li>
                })
                */

                let tmp = <li>{k.id},{k.money}, {k.firstDate} - {k.secondDate}, {k.diff}</li>

                return tmp;
            })
        }

          </ul> 
        </>
        );
   }

export default FraudTransactions;

