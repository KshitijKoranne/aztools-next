import { Metadata } from 'next'
import { ApiTesterClient } from './client'

export const metadata: Metadata = {
  title: 'API Tester - Test REST APIs Online | AZ Tools',
  description: 'Test REST APIs with GET, POST, PUT, DELETE requests. Add headers, parameters, and request body. View formatted responses.',
  keywords: ['api tester', 'rest api', 'http client', 'api testing', 'postman alternative'],
  openGraph: {
    title: 'API Tester - Test REST APIs Online | AZ Tools',
    description: 'Test REST APIs with GET, POST, PUT, DELETE requests. Add headers, parameters, and request body.',
    type: 'website',
  }
}

export default function ApiTesterPage() {
  return <ApiTesterClient />
}