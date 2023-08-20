interface ENV {
    BACKEND_API: string;
    APP_DOMAIN: string;
}

const ENVIRONMENT: ENV = {
    BACKEND_API: process.env?.REACT_APP_BACKEND_API || '',
    APP_DOMAIN: process.env?.REACT_APP_APP_DOMAIN || '',
};

export default ENVIRONMENT;