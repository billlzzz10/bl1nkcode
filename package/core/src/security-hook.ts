export async function beforeToolExecution(toolName: string, args: any) {
  // Check for secrets
  const sensitiveKeys = ['api_key', 'auth_token', 'password', 'secret'];
  const argsStr = JSON.stringify(args).toLowerCase();
  
  for (const key of sensitiveKeys) {
    if (argsStr.includes(key)) {
        console.warn(`⚠️ Potential secret detected in arguments for ${toolName}.`);
        return false; // Block
    }
  }
  return true;
}
