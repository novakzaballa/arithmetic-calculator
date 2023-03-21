import React, { useEffect } from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@mui/material';

interface Data {
  id: number;
  operation_id: string;
  user_balance: string;
  operation_response: number;
  date: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
  id: keyof Data;
  label: string;
  numeric: boolean;
  sort: boolean;
}

interface sortBy {
  operation_id: string;
  page_number: number;
  rows_per_page: number;
  sort_by: string;
  sort_type: string;
}
interface Params {
  params: Array<sortBy>
}

const headCells: readonly HeadCell[] = [
  {
    id: 'date',
    numeric: false,
    label: 'Date',
    sort: true
  },
  {
    id: 'operation_id',
    numeric: false,
    label: 'Arithmetic operation',
    sort: true
  },
  {
    id: 'user_balance',
    numeric: false,
    label: 'Balance',
    sort: true
  },
  {
    id: 'operation_response',
    numeric: true,
    label: 'Result',
    sort: false
  },
];

interface EnhancedTableProps {
  setOrder: any
  order: Order;
  orderBy: string;
  rowCount: number;
  sortBy: any;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    order,
    orderBy,
    rowCount,
    setOrder,
    sortBy
  } = props;
  // console.log('DEBUG: order:', order);
  // console.log('DEBUG: orderBy:', orderBy);

  const setOrderHandler = (order: string, operationId: string) =>{
    const or = order === 'asc' ? 'desc' : 'asc'
    setOrder(or)
    sortBy({sort_by : operationId, page_number: 1, rows_per_page : 10, sort_type: order})
  }
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {
              headCell.sort ?
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={order}
                  onClick={() => (
                    setOrderHandler(order, headCell.id)
                  )}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel> :
                  headCell.label
            }
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  handleFilterValue: any;
  filterValue: string;
 // filerList: Array<Data>;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  // const { numSelected, handleFilterValue, filterValue } = props;
  const { handleFilterValue, filterValue } = props;

  const handleChange = (event: SelectChangeEvent) => {
    handleFilterValue(event.target.value as string);
  };

  return (
    <Toolbar
      sx={{
        mt: 1,
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...({
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Records
      </Typography>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="demo-simple-select-label">Operation</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filterValue}
          label="operation"
          onChange={handleChange}
        >
          <MenuItem value={''}>
            <em>None</em>
          </MenuItem>
          <MenuItem value={'addition'}>Addition</MenuItem>
          <MenuItem value={'subtraction'}>Subtraction</MenuItem>
          <MenuItem value={'multiplication'}>Multiplication</MenuItem>
          <MenuItem value={'division'}>Division</MenuItem>
          <MenuItem value={'square root'}>Square Root</MenuItem>
          <MenuItem value={'random string generation'}>Random string generation</MenuItem>
        </Select>
      </FormControl>
    </Toolbar>
  );
}

export default function DataTable() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('operation_id');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterValue, setFilterValue] = React.useState('');
  const [recordRows, setRecordRows] = React.useState([]);
  const [totalRecord, setTotalRecord] = React.useState(0);

  const sortBy = (params: any) => {
    // console.log('Params:', params);
    axios.get('https://68i17san2e.execute-api.us-east-1.amazonaws.com/dev/api/v1/operations',
    {
      headers: { Authorization: `Bearer ${token}` },
      params
    },
    ).then((response) => {
      console.log(response);
      setRecordRows(response.data.payload.result)
      setTotalRecord(response.data.payload.count)

    }).catch((e) => {
      console.log(e);
    });
  }

  useEffect(() => {
    sortBy({page_number: 1, rows_per_page : 10})
  }, []);

  const { token } = useAuth();

  const handleFilterValue = (text: string) => {
    setFilterValue(text)
  }

  const handleRequestSort = () => {
    setOrder(order === 'asc' ? 'asc' : 'desc');
    //setOrderBy(property);
  };

  const deleteRecord = (operation_id: string) => {
    axios.delete(`https://68i17san2e.execute-api.us-east-1.amazonaws.com/dev/api/v1/operations/${operation_id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
    ).then((response) => {
      console.log(response);
      sortBy({page_number: 1, rows_per_page : 10})
    }).catch((e) => {
      console.log(e);
    });

  };


  const handleChangePage = (event: unknown, newPage: number) => {
    sortBy({page_number: newPage + 1 , rows_per_page: rowsPerPage, sort_type: order})
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    sortBy({page_number:1, rows_per_page: event.target.value})
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar handleFilterValue={handleFilterValue} filterValue={filterValue} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              setOrder={setOrder}
              rowCount={recordRows.length}
              sortBy={sortBy}
            />
            <TableBody>
              {recordRows
                .map((row: Data, index: number) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                    >
                      <TableCell align="left">{row.date}</TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.operation_id.substring(10)}
                      </TableCell>
                      <TableCell align="right">{row.user_balance}</TableCell>
                      <TableCell align="right">{row.operation_response}</TableCell>
                      <TableCell align="right"><Button onClick={() => deleteRecord(row.id.toString())}> <DeleteIcon sx={{color: 'red'}}/> </Button></TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRecord}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
