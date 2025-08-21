import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    region: process.env.NEXT_PUBLIC_COGNITO_REGION!,
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
    userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID!,
    mandatorySignIn: false,
    cookieStorage: {
      domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost',
      path: '/',
      expires: 365,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    }
  },
  Storage: {
    AWSS3: {
      bucket: process.env.S3_BUCKET_NAME!,
      region: process.env.NEXT_PUBLIC_S3_REGION!,
    }
  }
};

Amplify.configure(awsConfig);

export default awsConfig;