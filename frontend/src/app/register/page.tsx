import { redirect } from 'next/navigation';

export default function RegisterPage() {
  // Registration is handled manually by admins; send users to login.
  redirect('/login');
}