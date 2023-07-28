import { registerAs } from '@nestjs/config';

export default registerAs('cloudinary', () => ({
  dryRun: process.env.DRY_RUN,
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
}));
