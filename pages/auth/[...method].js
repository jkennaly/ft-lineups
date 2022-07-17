// pages/auth/[...method].js
import { handleAuth } from '../../services/noauth';
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';

export default function Method(req, res) {
    const [output, setOutput] = useState()
    const router = useRouter()
    useEffect(async () => setOutput(router.query.method && await handleAuth(router.query, router.push)(req, res)), [router.query])
    console.log('hanldeAuth method', router.pathname, router.query.method)
    if (!router.query.method) return 'loading'
    return output || 'loading'
}
