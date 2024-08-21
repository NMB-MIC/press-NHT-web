import React from 'react'
import { useNavigate } from 'react-router-dom';
import { key } from '../constant';
import Swal from 'sweetalert2';

function LogoutButton() {
    let navigate = useNavigate();

    const initLocalStorage = async() => {
        localStorage.removeItem(key.LOGIN_PASSED);
        localStorage.removeItem(key.USER_NAME);
        localStorage.removeItem(key.USER_LV);
        localStorage.removeItem(key.USER_EMP);
        await Swal.fire({
            title: 'Logout!',
            text: 'Processing Logout',
            icon: 'success',
            showConfirmButton: false,
            timer: 15000
          })
    }
  return (
    <>
    <li className="nav-item">
      <div className="nav-link" role="button"
      onClick = {() =>{
        initLocalStorage();
        navigate("/");
        window.location.reload();
      }}>
        <b>Logout</b>
      </div>
    </li>
    </>
  )
}
export { LogoutButton };
