import { Link } from 'react-router-dom';


const CategoryAdd = () => {
  return (
    <div>
      <h1 className='title'>Add Category</h1>

      <form>
        <label htmlFor='category'>Add Category</label>
        <input type='text' id='category' name='category' />

        <br />

        <button type='submit'>Submit</button>

        <br />
        <br />

        <Link to='/dashboard'>
          <button>User Dashboard</button>
        </Link>
        
      </form>
    </div>
  );
};

export default CategoryAdd;
