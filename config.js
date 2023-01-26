const config = {};

config.dev = {
    name: 'dev',
    port: 11101,
}

config.prod = {
    name: 'prod',
    port: 11102,
}

//console.log(process.env.NODE_ENV); // konsole siaip paleidzia suktis programos procesa

const envName = process.env.NODE_ENV;
const envObj = config[envName] ? config[envName] : config.dev;

export default envObj;