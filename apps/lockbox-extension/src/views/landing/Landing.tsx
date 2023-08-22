import React from 'react'
import { useNavigate } from 'react-router-dom'
import { authorizedFetch } from '../../utils/request-interceptor';

type Props = {}

const Landing = (props: Props) => {

    const getAllVaults = async () => {
    await authorizedFetch('https://surge-lockbox-prod.up.railway.app/api/vault', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('just data login', data);
        // chrome.runtime.sendMessage(
        //   { action: 'setAllUserVaults', userVaults: data },
        //   (response) => {
        //     console.log('Background script response:', response);
        //   }
        // );
      })
      .catch((err: any) => {
        // throw new Error(err);
        console.log('err', err);
      });
  };

  React.useEffect(() => {
    getAllVaults();

    setTimeout(() => {
      getAllVaults();
    }, 5000);
  }, []);

    const navigate = useNavigate()
  return (
    <div>
        <button onClick={() => navigate('/login')}>Login</button>
    </div>
  )
}

export default Landing