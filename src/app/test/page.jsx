'use client'
import axios from 'axios'

const Page = () => {
  const testPaiement = async () => {
    try {
      const res = await axios.get('/api/pay')

      console.log('SATIM RESPONSE:', res.data)

      if (res.data.formUrl) {
        window.location.href = res.data.formUrl
      }
    } catch (err) {
      console.error(err)
    }
  }

  return <button onClick={testPaiement}>Test paiement</button>
}

export default Page
