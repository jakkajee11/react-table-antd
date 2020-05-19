import * as React from 'react';
import { useState } from 'react';
import { TimeMode } from '../types/timeMode';

export default function useTimeMode() {
  const [timeMode, setTimeMode] = useState<TimeMode>('utc');

  return { timeMode, setTimeMode };
}
