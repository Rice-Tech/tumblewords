
import {Outlet, Link} from 'react-router-dom';

const Root = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to={'/'}>Home</Link>
          </li>
          <li>
            <Link to={'/about'}>About</Link>
          </li>
        </ul>
      </nav>
      <main>
        <Outlet/>
      </main>
    </>
  );
};

export default Root;
