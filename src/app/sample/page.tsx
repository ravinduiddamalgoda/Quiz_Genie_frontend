'use client'
import React from 'react'
import { useBearStore, useStudentStore } from '@/store/useStore'

function page() {
    const bears = useBearStore((state) => state.bears)
    const student = useStudentStore((state) => state.id)
  return (
    <div><h1>page</h1>
        <div>{bears}</div>
        <div>{student}</div>
    </div>
    
  )
}

export default page