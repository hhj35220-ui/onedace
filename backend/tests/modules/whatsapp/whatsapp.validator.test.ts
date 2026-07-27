import { connectWhatsAppSchema, sendWhatsAppMessageSchema } from '../../../src/modules/whatsapp/validators/whatsapp.validator';

describe('whatsapp validators', () => {
  it('requires an organization id for connect requests', () => {
    expect(() => connectWhatsAppSchema.parse({})).toThrow();
  });

  it('requires a recipient and content for text messages', () => {
    expect(() => sendWhatsAppMessageSchema.parse({ to: '123' })).toThrow();
  });
});
