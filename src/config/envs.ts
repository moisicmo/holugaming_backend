import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),
  
  DNI: get('DNI').required().asString(),
  NAME_SEED: get('NAME_SEED').required().asString(),
  LAST_NAME_SEED: get('LAST_NAME_SEED').required().asString(),
  EMAIL_SEED: get('EMAIL_SEED').required().asString(),
  PHONE_SEED: get('PHONE_SEED').required().asString(),

  JWT_SEED: get('JWT_SEED').required().asString(),

  SEND_EMAIL: get('SEND_EMAIL').default('false').asBool(),
  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),
  
  WEBSERVICE_URL: get('WEBSERVICE_URL').required().asString(),

}



