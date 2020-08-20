import React, { useEffect, useState } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';

import ErrorModal from '../../shared/components/UI/ErrorModal';
import Spinner from '../../shared/components/UI/LoadingSpinner';
import UsersList from '../components/UsersList';

const Users = () => {

    const [usersList, setUsersList] = useState([]);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    useEffect(() => {
        const getUsers = async () => {
            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + "/api/users");
                setUsersList(responseData.users);
            }
            catch(error) {
            }
        }
        getUsers();
    }, [sendRequest]);

    return (
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && (
          <div className="center">
            <Spinner />
          </div>
        )}
        {!isLoading && usersList && <UsersList users={usersList} />}
      </React.Fragment>
    );
};

export default Users;