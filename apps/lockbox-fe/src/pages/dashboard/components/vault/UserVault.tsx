import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  authorizedFetch,
  getVaultKey,
} from '../../../../../src/helpers/request-interceptor';
import { Grid } from '@mui/material';
import CustomizedMenus from '../options-menu/OptionsMenu';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomCrypto from '../../../../../src/helpers/custom-crypto';

interface Column {
  id: 'id' | 'link' | 'username' | 'password' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right' | 'center' | 'left';
  format?: (value: number) => string;
}

interface Row {
  id: string;
  link: string;
  username: string;
  password: string;
}

const columns: readonly Column[] = [
  { id: 'id', label: 'id', minWidth: 50 },
  { id: 'link', label: 'Website\u00a0Link', minWidth: 100 },
  {
    id: 'username',
    label: 'Username',
    minWidth: 50,
    align: 'right',
  },
  {
    id: 'password',
    label: 'Password',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'actions',
    label: '',
    minWidth: 100,
    align: 'center',
  },
];

interface Data {
  id: string;
  link: string;
  username: string;
  password: string;
  actions: string;
}

function createData(
  id: string,
  link: string,
  username: string,
  password: string,
): Data {
  return { id, link, username, password, actions: '' };
}

export default function UserVaultTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [vaultData, setVaultData] = React.useState([]);
  const [decryptedVaults, setDecryptedVaults] = React.useState([
    {
      id: '',
      link: '',
      username: '',
      password: '',
    },
  ]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // get all vaults API call
  const getAllVaults = async () => {
    await authorizedFetch('http://localhost:4000/api/vault', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setVaultData(data);
      })
      .catch((err: any) => {
        throw new Error(err);
      });
  };

  const vaults = decryptedVaults.map((row: any, index: number) => ({
    ...row,
    id: index + 1,
  }));

  const rows = vaults.map((row: Row) => {
    return createData(row.id, row.link, row.username, row.password);
  });

  React.useEffect(() => {
    getAllVaults();
  }, []);

  React.useEffect(() => {
    const decryptedPasswords = async (vaultData: Row[]) => {
      const vaultKey = getVaultKey();

      const decryptedData = await Promise.all(
        vaultData.map(async (row: Row) => {
          const decryptedVaultPW = await CustomCrypto.decrypt(
            vaultKey,
            row.password,
          );

          return {
            ...row,
            password: decryptedVaultPW,
          };
        }),
      );
      return decryptedData;
    };

    async function test() {
      const decryptedData = await decryptedPasswords(vaultData);
      setDecryptedVaults(decryptedData);
    }

    test();
  }, [vaultData]);

  return (
    <Paper sx={{ width: '90%', overflow: 'hidden', px: 4, py: 2 }}>
      {rows.length === 0 ? (
        <Box>
          <Typography variant="body1" align="center">
            No Passwords Found
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        fontWeight: 'bold',
                        fontSize: '1rem',
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.id === 'actions' ? (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    ml: 6,
                                  }}
                                >
                                  <Grid container spacing={0} columns={12}>
                                    <Grid item xs={8}>
                                      <Button>
                                        <VisibilityIcon />
                                      </Button>
                                    </Grid>
                                    <Grid item xs={4}>
                                      <CustomizedMenus
                                        password={row.password}
                                        username={row.username}
                                        link={row.link}
                                      />
                                    </Grid>
                                  </Grid>
                                </Box>
                              ) : column.format && typeof value === 'number' ? (
                                column.format(value)
                              ) : (
                                value
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Paper>
  );
}
