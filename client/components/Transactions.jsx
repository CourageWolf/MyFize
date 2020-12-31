import React, { useState, useEffect } from 'react';
import Transaction from './Transaction.jsx';
import ScrollToBottom from 'react-scroll-to-bottom';
import { DataGrid } from '@material-ui/data-grid';
import { element } from 'prop-types';
import { Bar } from 'react-chartjs-2';
const columns = [
  { field: 'merchant_name', headerName: 'Transaction', width: 150 },
  { field: 'category', headerName: 'Category', width: 130 },
  { field: 'date_of_transaction', headerName: 'Date', width: 130 },
  { field: 'amount', headerName: 'Amount', type: 'number', width: 130 },
  { field: 'account_subtype', headerName: 'Account Type', width: 150 },
];

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const [dbData, setDbData] = useState({});

  const genData = () => {
    console.log('dbData', dbData);
    const categories =
      Object.keys(dbData).length === 0 ? null : Object.keys(dbData);
    const values =
      Object.keys(dbData).length === 0 ? null : Object.values(dbData);
    return {
      labels: categories,
      datasets: [
        {
          label: 'Scale',
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const [barData, setBarData] = useState(genData());

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (Object.keys(dbData).length === 0) {
      setCounter(counter + 1);
    } else {
      setCounter(10);
    }
  }, [dbData]);

  useEffect(() => {
    fetch('/test/get_transactions')
      .then((res) => res.json())
      .then((res) => {
        //gather data for the grid display
        setTransactions(
          res.transactions.map((ele) => {
            return {
              id: ele.row_id,
              account_id: ele.account_id,
              merchant_name: ele.merchant_name,
              amount: ele.amount,
              account_type: ele.account_type,
              date_of_transaction: ele.date_of_transaction,
              category: ele.category,
            };
          })
        );

        const data = res.transactions.reduce((acc, val) => {
          const type = val.category;
          if (!acc.hasOwnProperty(type)) {
            acc[type] = val.amount;
          } else {
            acc[type] += val.amount;
          }
          return acc;
        }, {});
        setTimeout(() => {
          console.log('in setTimeout');
          setDbData(data);
        }, 2000);
      })
      .then(() => {
        setBarData(genData());
        console.log('barData');
      })
      .catch((err) => console.log(err));
  }, [counter]);

  return (
    <div className='transactions'>
      <Bar data={barData} options={options} />
      <h3>Transactions</h3>
      <div className='table' style={{ height: 800, width: '90%' }}>
        <DataGrid rows={transactions} columns={columns} pageSize={25} />
      </div>
    </div>
  );
}
