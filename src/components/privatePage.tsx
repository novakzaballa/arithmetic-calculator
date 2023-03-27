import {Navigate, useOutlet} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';
import {Bar} from './Bar';

export const PrivatePage = () => {
  const {token} = useAuth();
  const outlet = useOutlet();

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Bar
        pages={[
          {label: 'Operations', path: 'operations'},
          {label: 'Records', path: 'records'},
        ]}
      />
      {outlet}
    </div>
  );
};
