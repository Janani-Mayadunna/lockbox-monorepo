import { Link } from 'react-router-dom';


const Dashboard = () => {
  return (
    <div>
      <h1 className='title'>Dashboard</h1>

      <Link to='/category'>
        <button>Password Category</button>
      </Link>

      <br />

      <Link to='/password-vault'>
        <button>Password Vault</button>
      </Link>
    </div>
  );
};

export default Dashboard;
