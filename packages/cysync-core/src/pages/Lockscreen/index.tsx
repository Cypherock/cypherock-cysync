import React, { useState } from 'react';
import { useLockscreen } from '~/context';

export const Lockscreen: React.FC = () => {
  const { unlock } = useLockscreen();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onPasswordSubmit: React.FormEventHandler<
    HTMLFormElement
  > = async event => {
    if (isLoading) return;

    event.preventDefault();
    setIsLoading(true);

    const isCorrect = await unlock(password);

    if (!isCorrect) {
      window.alert('Incorrect password');
    }

    setIsLoading(false);
  };

  return (
    <div>
      <form onSubmit={onPasswordSubmit}>
        <input
          name="password"
          type="password"
          onChange={e => setPassword(e.target.value)}
          value={password}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Submit
        </button>
      </form>
    </div>
  );
};
