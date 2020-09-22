export interface AppConfig {
    JWT_SECRET: string;
    ENCRYPTION_KEY: string;
    ENCRYPTION_IV: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;
    VPC_SECURITY_GROUP_ID: string;
    VPC_SUBNET_ID_A: string;
    VPC_SUBNET_ID_B: string;
    LOG_TO_FILE: boolean;
}
declare const config: AppConfig;
export default config;
