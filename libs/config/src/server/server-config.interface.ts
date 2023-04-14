export interface ServerConfig {
  port: number;
  cors: CorsConfig;
}

export interface CorsConfig {
  origin: string;
}
