import { Link } from 'react-router-dom';
import { Button, Container } from '@mui/material';
import DataTable from 'react-data-table-component';
import { tableCustomStyles } from '../../../src/components/global/TableCustomStyles';
import {
  authorizedFetch,
  getVaultKey,
} from '../../../src/helpers/request-interceptor';
import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SendIcon from '@mui/icons-material/Send';
import { decryptVault } from '../../../src/helpers/crypto';

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
          <Button>
            <VisibilityIcon />
          </Button>

          {/* edit */}
          <Link to={`/ao/updatefertilizer/${row._id}`}>
            <Button className='editBtnAo'>
              <EditIcon />
            </Button>
          </Link>

          {/* delete */}
          <Button
            // onClick={(e) => deleteHandler(row._id)}
            className='deleteBtnAo'
          >
            <DeleteIcon />
          </Button>

          {/* share */}

          <Button>
            <SendIcon />
          </Button>
        </>
      ),
    },
  ];

  return (
    <Container sx={{ marginY: 10, marginTop: 4 }}>
      <h3 className='title'>Password Vault</h3>

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
