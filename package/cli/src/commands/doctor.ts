import { checkEnvironment } from '@phoenix/core';

export async function doctor() {
  console.log('🩺 Running Phoenix Engine environment check...');
  await checkEnvironment();
}
