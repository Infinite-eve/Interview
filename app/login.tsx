'use client'

import { signIn } from 'next-auth/react';

const LoginPage = () => {
  return (
    <div>
      <h1>登录</h1>
      <button onClick={() => signIn()}>登录</button>
    </div>
  )
}

export default LoginPage;
