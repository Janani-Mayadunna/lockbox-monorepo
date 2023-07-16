import { Link } from 'react-router-dom';
import { Button } from '@mui/material';



const CategoryPW = () => {
  return (
    <div>
      <h1 className='title'>Category</h1>

      <Link to='/category/add'>
        <Button>Add new Category</Button>
      </Link>

  
    </div>
  );
};

export default CategoryPW;
