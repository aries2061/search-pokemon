import { renderHook, act } from '@testing-library/react';
import { useOnlineStatus } from '@/lib/utils';

describe('useOnlineStatus', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns navigator.onLine and reacts to online/offline events', () => {
    const onLine = jest.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);

    onLine.mockReturnValue(false);
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current).toBe(false);

    onLine.mockReturnValue(true);
    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current).toBe(true);
  });
});
