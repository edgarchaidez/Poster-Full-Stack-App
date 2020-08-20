import { useState, useCallback, useEffect, useRef } from 'react';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {

        try {
            setIsLoading(true);
            const httpAbortCtr = new AbortController();
            activeHttpRequests.current.push(httpAbortCtr);

            const response = await fetch(url, {
                method: method,
                body: body,
                headers: headers,
                signal: httpAbortCtr.signal
            });
          
            const responseData = await response.json();

            activeHttpRequests.current = activeHttpRequests.current.filter(reqCtr => reqCtr !== httpAbortCtr);

            if(!response.ok) {
                throw new Error(responseData.message);
            }

            setIsLoading(false);
            return responseData;
        }
        catch(error) {
            setIsLoading(false);
            setError(error.message);
            throw error;
        }
    }, []);

    const clearError = () => {
        setError(null);
    };

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtr => abortCtr.abort());
        }
    }, []);

    return { error, isLoading, sendRequest, clearError };
};

