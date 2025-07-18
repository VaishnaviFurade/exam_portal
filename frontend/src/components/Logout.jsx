import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login'); // or your login page path
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
