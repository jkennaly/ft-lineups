// pages/auth/[...auth].js
import { handleAuth } from '../../services/noauth';
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';

export default function auth(req, res) {
    const [output, setOutput] = useState()
    const router = useRouter()
    useEffect(async () => setOutput(router.query.method && await handleAuth(router.query, router.push)(req, res)), [router.query])
    console.log('hanldeAuth method', router.pathname, router.query.method)
    if (!router.query.method) return 'loading'
    return output || 'loading'
}


//from: https://stackoverflow.com/questions/53819864/how-to-async-await-in-react-render-function
function delayed_render(async_fun, deps = []) {
    const [output, setOutput] = useState()
    useEffect(async () => setOutput(await async_fun()), deps)
    return (output === undefined) ? null : output
}