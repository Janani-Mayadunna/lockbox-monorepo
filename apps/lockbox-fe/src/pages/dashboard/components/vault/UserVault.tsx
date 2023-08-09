/* eslint-disable no-console */
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  authorizedFetch,
  getVaultKey,
} from '../../../../../src/helpers/request-interceptor';
import { Grid } from '@mui/material';
import CustomizedMenus from '../options-menu/OptionsMenu';
import CustomCrypto from '../../../../../src/helpers/custom-crypto';
import { IVault } from '../../interfaces';
import VaultUpdateModal from '../modals/UpdateVaultModal';

interface Column {
  id: 'image' | 'name' | 'folder' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right' | 'center' | 'left';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'image', label: '', minWidth: 80 },
  {
    id: 'name',
    label: 'Alias',
    minWidth: 120,
    align: 'left',
  },
  {
    id: 'folder',
    label: 'Folder',
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'actions',
    label: '',
    minWidth: 100,
    align: 'center',
  },
];

interface UserVaultTableProps {
  selectedFilter: {
    filter: string;
    keyword: string;
  };
}

export default function UserVaultTable({
  selectedFilter,
}: UserVaultTableProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [vaultData, setVaultData] = React.useState([]);
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<IVault>({
    _id: '',
    name: '',
    link: '',
    username: '',
    password: '',
    note: '',
    folder: '',

  });
  const [decryptedVaults, setDecryptedVaults] = React.useState<IVault[]>([
    {
      _id: '',
      name: '',
      link: '',
      username: '',
      password: '',
      note: '',
      folder: '',
    },
  ]);
  const backendUrl = 'http://localhost:4000/api/vault';

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleUpdateModalOpen = async (data: any) => {
    setSelectedRow(data);
    setOpenUpdateModal(true);
  };

  // get all vaults API call

  React.useEffect(() => {
    const getAllVaults = async () => {
      await authorizedFetch(
        `${backendUrl}/?${selectedFilter.keyword}=${selectedFilter.filter}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
        .then((res) => res.json())
        .then((data) => {
          setVaultData(data);
        })
        .catch((err: any) => {
          throw new Error(err);
        });
    };

    getAllVaults();
  }, [selectedFilter.filter, selectedFilter.keyword]);

  React.useEffect(() => {
    const decryptedPasswords = async (vaultData: any) => {
      const vaultKey = getVaultKey();

      const decryptedData = await Promise.all(
        vaultData.map(async (row: IVault) => {
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
    <Paper sx={{ width: '100%', overflow: 'hidden', px: 4, py: 2 }}>
      <VaultUpdateModal
        open={openUpdateModal}
        setOpenModal={setOpenUpdateModal}
        data={selectedRow}
      />
      {decryptedVaults.length === 0 ? (
        <Box>
          <Typography variant="body1" align="center">
            No Passwords Found
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer sx={{ maxHeight: 500, maxWidth: 800 }}>
            <Table
              stickyHeader
              aria-label="sticky table"
              sx={{ minWidth: 650 }}
            >
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
                {decryptedVaults
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row._id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          cursor: 'pointer',
                        }}
                        onClick={() => handleUpdateModalOpen(row)}
                      >
                        <TableCell align="left">
                          {row.link?.split('//') && row.link.split('//')[1] ? (
                            <img
                              src={`https://icons.bitwarden.net/${
                                row.link.split('//')[1]
                              }/icon.png`}
                              alt="logo"
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '30%',
                              }}
                            />
                          ) : (
                            <img
                              src="https://cdn-icons-png.flaticon.com/512/3170/3170748.png"
                              alt="logo"
                              style={{ width: '30px', height: '30px' }}
                            />
                          )}
                        </TableCell>
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="left">{row.username}</TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              ml: 6,
                            }}
                          >
                            <Grid container spacing={0} columns={12}>
                              <Grid item xs={4}>
                                <CustomizedMenus
                                  password={row.password}
                                  username={row.username}
                                  link={row.link}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={decryptedVaults.length}
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
