import { WhatsappService } from './src/services/whatsapp.service';

const service = new WhatsappService();
const timeout = setTimeout(() => {
  console.log('TIMEOUT');
  process.exit(0);
}, 90000);

try {
  const result = await service.startSession('verify-user', { sessionName: 'verify-session' });
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(error);
} finally {
  clearTimeout(timeout);
}
