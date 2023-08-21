import {
  Box,
  Container,
  Grid,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import {
  authorizedFetch,
  getVaultKey,
} from '../../helpers/request-interceptor';
import React, { useEffect, useState } from 'react';
import CustomCrypto from '../../helpers/custom-crypto';
import ResponsiveAppBar from '../../../src/components/global/AppBar';
import { ICreateVault } from '../dashboard/interfaces';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ENVIRONMENT from '../../../src/helpers/environment';

interface VaultData {
  vaultId: any;
  vaultUsername: string;
  vaultPassword: string;
  vaultLink: string;
  vaultAlias: string;
  sharedUserName: string;
  sharedUserEmail: string;
  sharedSecret: string;
  isAllowedToSave: boolean;
}

/* new */
interface Column {
  id: 'image' | 'sender' | 'sender_email' | 'link' | 'username' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right' | 'center' | 'left';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'image', label: '', minWidth: 50 },
  {
    id: 'sender',
    label: 'Sender',
    minWidth: 100,
    align: 'left',
  },
  {
    id: 'sender_email',
    label: 'Sender Email',
    minWidth: 100,
    align: 'left',
  },
  {
    id: 'link',
    label: 'URI',
    minWidth: 100,
    align: 'center',
  },
  {
    id: 'username',
    label: 'Username',
    minWidth: 80,
    align: 'left',
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 150,
    align: 'center',
  },
];

/* new */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const ReceivedPasswordsVault = () => {
  const [decryptedVaults, setDecryptedVaults] = useState([
    {
      vaultId: '',
      vaultUsername: '',
      vaultPassword: '',
      vaultLink: '',
      vaultAlias: '',
      sharedUserName: '',
      sharedUserEmail: '',
      sharedSecret: '',
      isAllowedToSave: false,
    },
  ]);
  const [receivedVaults, setReceivedVaults] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // handler of snackbar
  const handleSnackbarClose = (
    e?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAddToVault = async (
    vaultPassword: string,
    vaultUsername: string,
    vaultLink: string,
    vaultId: any,
    vaultAlias: string,
  ) => {
    const vaultKey = getVaultKey();

    const encryptedVaultPW = await CustomCrypto.encrypt(
      vaultKey,
      vaultPassword,
    );

    const encryptedUsername = await CustomCrypto.encrypt(
      vaultKey,
      vaultUsername,
    );

    const newVault: ICreateVault = {
      link: vaultLink,
      username: encryptedUsername,
      password: encryptedVaultPW,
      note: '',
      folder: '',
      name: vaultAlias,
    };

    await createVault(newVault);
    await handleVaultDelete(vaultId);
    await getAllReceivedVaults();
  };

  const handleVaultDelete = async (id: string) => {
    await authorizedFetch(`${ENVIRONMENT.BACKEND_API}/vault/delete-received`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('Failed to delete vault');
        } else {
          setSnackbarOpen(true);
          return res.json();
        }
      })
      .catch((err) => {
        throw new Error('Failed to delete vault' + err.message);
      });

    await getAllReceivedVaults();
  };

  const getAllReceivedVaults = async () => {
    await authorizedFetch(`${ENVIRONMENT.BACKEND_API}/vault/received-vaults`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setReceivedVaults(data);
      })
      .catch((err: any) => {
        throw new Error(err);
      });
  };

  const createVault = async (newVault: ICreateVault) => {
    authorizedFetch(`${ENVIRONMENT.BACKEND_API}/vault`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newVault),
    })
      .then((res) => {
        if (res.status !== 201) {
          throw new Error('Failed to create vault');
        } else {
          return res.json();
        }
      })
      .catch((err) => {
        throw new Error('Failed to create vault' + err.message);
      });
  };

  useEffect(() => {
    getAllReceivedVaults();
  }, []);

  useEffect(() => {
    const getDecryptedVaults = async () => {
      const decryptedVault = receivedVaults.map(async (vault: VaultData) => {
        return await CustomCrypto.decrypt(
          vault.sharedSecret,
          vault.vaultPassword,
        );
      });

      const decx = await Promise.all(decryptedVault);

      const sanitizedDecryptedVaults = decx.map((value: string | undefined) =>
        value === undefined ? '' : value,
      );

      setDecryptedVaults(
        receivedVaults.map((vault: VaultData, index: number) => {
          return {
            ...vault,
            vaultPassword: sanitizedDecryptedVaults[index],
          };
        }),
      );
    };

    getDecryptedVaults();
  }, [receivedVaults]);

  return (
    <>
      <ResponsiveAppBar />
      <Container sx={{ width: 1000 }}>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2500}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity='success'
            sx={{ width: '100%' }}
          >
            Successfully Done!
          </Alert>
        </Snackbar>
        <div>
          <Typography
            sx={{ mt: 4, mb: 4 }}
            variant='h4'
            component='h2'
            gutterBottom
          >
            Shared Passwords
          </Typography>

          <Box>
            {/* map over vaultData array and display */}
            {/* {decryptedVaults.map((data: any, index: any) => (
              <Accordion key={index} sx={{ mb: 1 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  sx={{ backgroundColor: '#ebeef4' }}
                >
                  <Typography variant="subtitle1" component="h5">
                    Shared by : {data.sharedUserName}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box display="flex" justifyContent="space-around">
                    <Box>
                      <Typography
                        gutterBottom
                        sx={{ mt: 1, mb: 1 }}
                        variant="h6"
                      >
                        <strong>Username: </strong> {data.vaultUsername}
                      </Typography>
                      {data.vaultLink !== '' ? (
                        <Typography
                          gutterBottom
                          sx={{ mt: 1, mb: 1 }}
                          variant="h6"
                        >
                          <strong>Website: </strong> {data.vaultLink}
                        </Typography>
                      ) : (
                        ''
                      )}
                      <Typography
                        gutterBottom
                        sx={{ mt: 1, mb: 1 }}
                        variant="h6"
                      >
                        <strong>Password:</strong> {data.vaultPassword}
                      </Typography>
                      <Typography
                        gutterBottom
                        sx={{ mt: 1, mb: 1 }}
                        variant="h6"
                      >
                        <strong>Sender Name:</strong> {data.sharedUserName}
                      </Typography>
                      <Typography
                        gutterBottom
                        sx={{ mt: 1, mb: 1 }}
                        variant="h6"
                      >
                        <strong>Sender Email:</strong> {data.sharedUserEmail}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {data.isAllowedToSave ? (
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ mt: 4, mb: 4 }}
                          onClick={() =>
                            handleAddToVault(
                              data.vaultPassword,
                              data.vaultUsername,
                              data.vaultLink,
                              data.vaultId,
                              data.vaultAlias,
                            )
                          }
                        >
                          Add to My Vault
                        </Button>
                      ) : (
                        ''
                      )}
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{
                          width: 150,
                        }}
                        onClick={() => {
                          handleVaultDelete(data.vaultId);
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))} */}

            {decryptedVaults.length === 0 ? (
              <Box>
                <Typography variant='body1' align='center'>
                  No Items Found
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer sx={{ maxHeight: 500, maxWidth: 1000 }}>
                  <Table
                    stickyHeader
                    aria-label='sticky table'
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
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                        .map((row) => {
                          return (
                            <TableRow
                              hover
                              role='checkbox'
                              tabIndex={-1}
                              key={row.vaultId}
                              sx={{
                                '&:last-child td, &:last-child th': {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell align='left'>
                                {row.vaultLink?.split('//') &&
                                row.vaultLink.split('//')[1] ? (
                                  <img
                                    src={`https://icons.bitwarden.net/${
                                      row.vaultLink.split('//')[1]
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
                                // onClick={() => handleUpdateModalOpen(row)}
                              >
                                {row.sharedUserName}
                              </TableCell>
                              <TableCell align='left'>
                                {row.sharedUserEmail}
                              </TableCell>
                              <TableCell align='left'>
                                {row.vaultLink}
                              </TableCell>
                              <TableCell align='left'>
                                {row.vaultUsername}
                              </TableCell>
                              <TableCell align='center'>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    ml: 6,
                                  }}
                                >
                                  <Grid container spacing={2} columns={12}>
                                    {row.isAllowedToSave ? (
                                      <Grid
                                        item
                                        xs={4}
                                        sx={{ display: 'flex' }}
                                      >
                                        <Tooltip title='Save to your vault'>
                                          <Box
                                            onClick={() =>
                                              handleAddToVault(
                                                row.vaultPassword,
                                                row.vaultUsername,
                                                row.vaultLink,
                                                row.vaultId,
                                                row.vaultAlias,
                                              )
                                            }
                                            sx={{ cursor: 'pointer' }}
                                          >
                                            <AddCircleOutlineIcon />
                                          </Box>
                                        </Tooltip>
                                      </Grid>
                                    ) : (
                                      <Grid
                                        item
                                        xs={4}
                                        sx={{ display: 'flex' }}
                                      ></Grid>
                                    )}

                                    <Grid item xs={4} sx={{ display: 'flex' }}>
                                      <ContentCopyIcon />
                                      {/* <Typography
                                        variant="caption"
                                        sx={{
                                          ml: 1,
                                          display: 'flex',
                                          alignItems: 'flex-end',
                                        }}
                                      >
                                        Copy
                                      </Typography> */}
                                    </Grid>

                                    <Grid item xs={4} sx={{ display: 'flex' }}>
                                      <Box
                                        onClick={() => {
                                          handleVaultDelete(row.vaultId);
                                        }}
                                        sx={{ cursor: 'pointer' }}
                                      >
                                        <DeleteIcon />
                                      </Box>
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
                  count={decryptedVaults.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            )}
          </Box>
        </div>
      </Container>
    </>
  );
};

export default ReceivedPasswordsVault;
