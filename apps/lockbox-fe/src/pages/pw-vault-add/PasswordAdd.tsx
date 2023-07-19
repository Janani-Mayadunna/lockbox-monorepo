import { Link } from 'react-router-dom';


const PasswordAdd = () => {
  return (
    <div>
      <h1 className='title'>Add Password</h1>

      <form>
        <label htmlFor='category'>Category</label>
        <input type='text' id='category' name='category' />
        <br />

        <label htmlFor='username'>Username</label>
        <input type='text' id='username' name='username' />
        <br />

        <label htmlFor='password'>Password</label>
        <input type='text' id='password' name='password' />
        <br />

        <label htmlFor='url'>URL</label>
        <input type='text' id='url' name='url' />
        <br />

        <label htmlFor='notes'>Notes</label>
        <input type='text' id='notes' name='notes' />
        <br />

        <button type='submit'>Submit</button>
        <br />

        <button type='reset'>Reset</button>
        <br />

        <button type='button'>Cancel</button>
        <br />

      </form>

      <br />
      <br />
      <br />

      <Link to='/dashboard'>
        <button>User Dashboard</button>
      </Link>
    </div>
  );
};

export default PasswordAdd;
