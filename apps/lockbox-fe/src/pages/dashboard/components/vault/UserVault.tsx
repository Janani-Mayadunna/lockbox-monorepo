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
import { Grid } from '@mui/material';
import CustomizedMenus from '../options-menu/OptionsMenu';
import VaultUpdateModal from '../modals/UpdateVaultModal';
import { useAppDispatch, useAppSelector } from '../../../../../src/store';
import {
  getAllFoldersRequest,
  getVaultByIdRequest,
  getVaultRequest,
} from '../../redux/actions';

interface Column {
  id: 'image' | 'name' | 'username' | 'actions';
  label: string;
  minWidth?:
    | {
        xs: number;
        sm: number;
        md: number;
        lg: number;
      }
    | number;
  align?: 'right' | 'center' | 'left';
  display?: {
    xs: 'none' | 'block';
    sm: 'none' | 'block';
    md: 'none' | 'revert';
    lg: 'none' | 'revert';
  };
  p?: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  {
    id: 'image',
    label: '',
    minWidth: {
      xs: 60,
      sm: 80,
      md: 90,
      lg: 100,
    },
    p: {
      xs: 2,
      sm: 0,
      md: 1,
      lg: 2,
    },
  },
  {
    id: 'name',
    label: 'Alias',
    align: 'left',
    p: {
      xs: 0,
      sm: 0,
      md: 1,
      lg: 2,
    },
    minWidth: {
      xs: 60,
      sm: 90,
      md: 100,
      lg: 120,
    },
  },
  {
    id: 'username',
    label: 'Username',
    minWidth: 160,
    align: 'left',
    display: {
      xs: 'none',
      sm: 'none',
      md: 'revert',
      lg: 'revert',
    },
  },
  {
    id: 'actions',
    label: '',
    minWidth: 100,
    align: 'center',
    p: {
      xs: 0,
      sm: 0,
      md: 1,
      lg: 2,
    },
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
  const dispatch = useAppDispatch();
  const { vaults } = useAppSelector((state) => state.vaults);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState('');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleUpdateModalOpen = async (data: string) => {
    dispatch(getVaultByIdRequest(data));

    setSelectedRow(data);
    // setTimeout(() => {
    setOpenUpdateModal(true);
    // }, 1500);
  };

  // get all vaults API call
  React.useEffect(() => {
    dispatch(getVaultRequest(selectedFilter.keyword, selectedFilter.filter));
  }, [dispatch, selectedFilter.filter, selectedFilter.keyword]);

  React.useEffect(() => {
    if (selectedFilter.filter === '') {
      dispatch(getVaultRequest('', ''));
    }
  }, [dispatch, selectedFilter]);

  React.useEffect(() => {
    dispatch(getAllFoldersRequest());
  }, [dispatch]);

  React.useEffect(() => {}, [selectedRow]);

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        px: {
          xs: 0,
          sm: 0,
          md: 2,
          lg: 2,
        },
        py: {
          xs: 0,
          sm: 0,
          md: 2,
          lg: 2,
        },
      }}
    >
      <VaultUpdateModal
        open={openUpdateModal}
        setOpenModal={setOpenUpdateModal}
        data={selectedRow}
      />
      {vaults && vaults?.length === 0 ? (
        <Box>
          <Typography variant='body1' align='center'>
            No Items Found
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer
            sx={{
              maxHeight: 500,
              maxWidth: {
                xs: 250,
                sm: 300,
                md: 600,
                lg: 800,
              },
            }}
          >
            <Table
              stickyHeader
              aria-label='sticky table'
              sx={{
                minWidth: {
                  xs: 40,
                  sm: 100,
                  md: 300,
                  lg: 650,
                },
              }}
            >
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{
                        minWidth: column.minWidth,
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        display: {
                          xs: column.display?.xs,
                          sm: column.display?.sm,
                          md: column.display?.md,
                          lg: column.display?.lg,
                        },
                        p: {
                          xs: column.p?.xs,
                          sm: column.p?.sm,
                          md: column.p?.md,
                          lg: column.p?.lg,
                        },
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {vaults &&
                  vaults
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role='checkbox'
                          tabIndex={-1}
                          key={row._id}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell align='left'>
                            {row.link?.split('//') &&
                            row.link.split('//')[1] ? (
                              <img
                                src={`https://icons.bitwarden.net/${
                                  new URL(row.link).hostname
                                }/icon.png`}
                                alt='logo'
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '30%',
                                }}
                              />
                            ) : (
                              <img
                                src='https://cdn-icons-png.flaticon.com/512/3170/3170748.png'
                                alt='logo'
                                style={{ width: '30px', height: '30px' }}
                              />
                            )}
                          </TableCell>
                          <TableCell
                            align='left'
                            sx={{
                              cursor: 'pointer',
                              textDecoration: 'underline',
                            }}
                            onClick={() => handleUpdateModalOpen(row._id)}
                          >
                            {row.name}
                          </TableCell>
                          <TableCell
                            sx={{
                              display: {
                                xs: columns[2].display?.xs,
                                sm: columns[2].display?.sm,
                                md: columns[2].display?.md,
                                lg: columns[2].display?.lg,
                              },
                            }}
                            align='left'
                          >
                            {row.username}
                          </TableCell>
                          <TableCell align='center'>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                ml: {
                                  xs: 0,
                                  sm: 1,
                                  md: 4,
                                  lg: 6,
                                },
                                p: {
                                  xs: 0,
                                  sm: 0,
                                  md: 1,
                                  lg: 2,
                                },
                              }}
                            >
                              <Grid container spacing={0} columns={12}>
                                <Grid item xs={4}>
                                  <CustomizedMenus
                                    password={row.password}
                                    username={row.username}
                                    link={row.link}
                                    alias={row.name}
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
            component='div'
            count={vaults!.length || 0}
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
