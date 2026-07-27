import { describe, expect, it } from '@jest/globals';

import { reportQuerySchema } from '../src/validators/report.validator';

describe('reportQuerySchema', () => {
  it('accepts date-only strings from form inputs', () => {
    const result = reportQuerySchema.parse({
      startDate: '2025-06-01',
      endDate: '2025-06-30',
    });

    expect(result.startDate).toBe('2025-06-01');
    expect(result.endDate).toBe('2025-06-30');
  });
});
