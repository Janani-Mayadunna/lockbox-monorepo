import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div>
      <h1 className='title'>Landing</h1>
      <br />

      <Link to='/auth'>
        <button>Go to Auth</button>
      </Link>
      <br />
      <br />

      <Link to='/signup'>
        <button>Sign up</button>
      </Link>

      <br />
      <br />

      <Link to='/dashboard'>
        <button>User Dashboard</button>
      </Link>
    </div>
  );
};

export default Landing;
