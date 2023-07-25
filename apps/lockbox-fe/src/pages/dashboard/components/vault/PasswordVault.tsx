import { Button, Container, Grid } from '@mui/material';
import DataTable from 'react-data-table-component';
import { tableCustomStyles } from '../../../../components/global/TableCustomStyles';
import {
  authorizedFetch,
  getVaultKey,
} from '../../../../helpers/request-interceptor';
import { useEffect, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { decryptVault } from '../../../../helpers/crypto';
import CustomizedMenus from '../options-menu/OptionsMenu';

export const PasswordVault = () => {
  const [vaultData, setVaultData] = useState([]);

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
      .catch((err) => {
        console.log('err: ', err);
      });
  };

  useEffect(() => {
    getAllVaults();
  }, []);

  //loop through vaultData array and decrypt each password
  const decryptedVaults = vaultData.map((row: any) => {
    const vaultKey = getVaultKey();

    const decryptedVaultPW = decryptVault({
      vault: row.password,
      vaultKey: vaultKey,
    });

    return {
      ...row,
      password: decryptedVaultPW,
    };
  });

  const vaults = decryptedVaults.map((row: any, index: any) => ({
    ...row,
    id: index + 1,
  }));

  const columns: any = [
    {
      name: '#',
      selector: (row: any) => row.id,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Link',
      selector: (row: any) => row.link,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Username',
      selector: (row: any) => row.username,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Password',
      selector: (row: any) => row.password,
      sortable: true,
      width: '200px',
    },

    {
      name: 'Actions',
      selector: (row: any) => (
        <>
          {/* visibility */}

          <Grid container spacing={0} columns={16}>
            <Grid item xs={8}>
              <Button>
                <VisibilityIcon />
              </Button>
            </Grid>
            <Grid item xs={8}>
              <CustomizedMenus password={row.password} />
            </Grid>
          </Grid>
        </>
      ),
    },
  ];

  return (
    <Container sx={{ marginY: 10, marginTop: 4 }}>
      <DataTable
        customStyles={tableCustomStyles}
        columns={columns}
        data={vaults}
        pagination={true}
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30]}
        noDataComponent='No Products Found'
      />
    </Container>
  );
};

export default PasswordVault;
