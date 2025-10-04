"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Page = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                // Utilisez le proxy local au lieu de l'URL externe directement
                const response = await axios.get('/api/events')
                setData(response.data)
                console.log('Fetched data:', response.data)
            } catch (err) {
                setError(err.message)
                console.error('Error fetching data:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div>
            <h1>Articles</h1>
            {data && (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            )}
        </div>
    )
}

export default Page