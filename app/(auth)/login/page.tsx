import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function Login() {
  return (
    <Suspense fallback={<p className="text-fog/50">Loading…</p>}>
      <LoginForm />
    </Suspense>
  );
}
