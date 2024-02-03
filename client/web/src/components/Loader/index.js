import React from 'react';
import {CircularProgress} from '@chakra-ui/react';

const Loader = () => {
    return (
        <div>
            <CircularProgress isIndeterminate />
        </div>
    );
};

export default Loader;