import * as React from 'react';
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
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

interface Data {
  key: string;
  operation_id: string;
  balance: number;
  operation_response: number;
  date: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  id: keyof Data;
  label: string;
  numeric: boolean;
  sort: boolean;
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
    id: 'balance',
    numeric: true,
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
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  setRecordRows: any;
  token: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    setRecordRows,
    token
  } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  const sortBy = (operation_id: string, pageNumber: number, rowsPerPage: number) => {
    axios.get('https://68i17san2e.execute-api.us-east-1.amazonaws.com/dev/api/v1/operations',
    {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        page_number: pageNumber || 1,
        rows_per_page: rowsPerPage || 10
      },
    },
    ).then((response) => {
      console.log(response);
      setRecordRows(response.data.result)
    }).catch((e) => {
      console.log(e);
    });
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
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
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={() => sortBy(headCell.id, 1, 10)}
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
  numSelected: number;
  handleFilterValue: any;
  filterValue: string;
 // filerList: Array<Data>;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  // const { numSelected, handleFilterValue, filterValue } = props;
  const { numSelected, handleFilterValue, filterValue } = props;

  const handleChange = (event: SelectChangeEvent) => {
    handleFilterValue(event.target.value as string);
  };

  return (
    <Toolbar
      sx={{
        mt: 1,
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Records
        </Typography>
      )}
      {numSelected > 0 &&
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>}
        {
          /*<TextField
            id="input-with-icon-textfield"
            label="Search"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon/>
                </InputAdornment>
              ),
            }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleFilterValue(event.target.value);
            }}
          />*/
        }
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
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filterValue, setFilterValue] = React.useState('');
  const [recordRows, setRecordRows] = React.useState([
    {
        "key": "asder22",
        "operation_id": "addition",
        "balance": 50,
        "operation_response": 3,
        "date": "2023/05/04"
    },
    {
        "key": "39djdjia",
        "operation_id": "subtraction",
        "balance": 43,
        "operation_response": 4,
        "date": "2023/05/05"
    },
    {
        "key": "aosd993",
        "operation_id": "multiplication",
        "balance": 89,
        "operation_response": 8,
        "date": "2023/05/05"
    },
    {
        "key": "dno29aiis",
        "operation_id": "division",
        "balance": 54,
        "operation_response": 4,
        "date": "2023/05/06"
    },
    {
        "key": "e83ujnda",
        "operation_id": "addition",
        "balance": 89,
        "operation_response": 45,
        "date": "2023/05/08"
    },
    {
        "key": "asd82uhn",
        "operation_id": "division",
        "balance": 47,
        "operation_response": 4,
        "date": "2023/05/08"
    },
    {
        "key": "mei82hi10",
        "operation_id": "square root",
        "balance": 29,
        "operation_response": 222,
        "date": "2023/05/08"
    },
    {
        "key": "3innakq",
        "operation_id": "subtraction",
        "balance": 375,
        "operation_response": 48,
        "date": "2023/05/09"
    },
    {
        "key": "1emmamwm4",
        "operation_id": "addition",
        "balance": 68,
        "operation_response": 89,
        "date": "2023/05/13"
    },
    {
        "key": "so9jj3jjc",
        "operation_id": "random string generation",
        "balance": 90,
        "operation_response": 74,
        "date": "2023/05/14"
    },
    {
        "key": "demve23r5",
        "operation_id": "subtraction",
        "balance": 93,
        "operation_response": 67,
        "date": "2023/05/14"
    },
    {
        "key": "r4tmsk201",
        "operation_id": "random string generation",
        "balance": 23,
        "operation_response": 3,
        "date": "2023/05/15"
    },
    {
        "key": "9fj29jns",
        "operation_id": "square root",
        "balance": 488,
        "operation_response": 44,
        "date": "2023/05/21"
    }
  ]);

  const { token } = useAuth();

  const handleFilterValue = (text: string) => {
    setFilterValue(text)
  }

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - recordRows.length) : 0;

  const test = stableSort(recordRows, getComparator(order, orderBy))
  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  let result = test;

  if(filterValue){
    result = recordRows.filter(word => word.operation_id === filterValue);
    result = stableSort(result, getComparator(order, orderBy))
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = recordRows.map((n) => n.operation_id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} handleFilterValue={handleFilterValue} filterValue={filterValue} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={recordRows.length}
              setRecordRows={setRecordRows}
              token={token}
            />
            <TableBody>
              {result
                .map((row, index) => {
                  const isItemSelected = isSelected(row.key);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.key)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.key}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell align="left">{row.date}</TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.operation_id}
                      </TableCell>
                      <TableCell align="right">{row.balance}</TableCell>
                      <TableCell align="right">{row.operation_response}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filterValue ? result.length : recordRows.length }
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
