import { Link } from 'react-router-dom';
import { Button } from '@mui/material';


const PasswordVault = () => {
  return (
    <div>
      <h1 className='title'>Password Vault</h1>

      <Link to='/password-vault/add'>
        <Button>Add new Password</Button>
      </Link>
    </div>
  );
};

export default PasswordVault;
