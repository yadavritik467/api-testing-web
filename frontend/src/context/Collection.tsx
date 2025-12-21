import axios, { AxiosError, AxiosResponse } from 'axios'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Collection, Request } from '../layouts/Sidebar'

export interface KeyValueItem {
  type?: 'text' | 'file'
  key: string
  value: string | File
  enabled: boolean
}

export interface ApiResponse extends Partial<AxiosResponse> {
  time?: number
  size?: number
}

export interface CollectionState {
  method: string
  baseUrl: string
  finalUrl: string
  activeTab: string
  params: KeyValueItem[]
  formData: KeyValueItem[]
  formattedHeaders: Record<string, string>
  headers: KeyValueItem[]
  body: string
  showResponse: ApiResponse | null
  bodyMode: 'raw' | 'formData'
}

export interface CollectionContextType {
  // all state
  method: string
  baseUrl: string
  finalUrl: string
  activeTab: string
  params: KeyValueItem[]
  formData: KeyValueItem[]
  formattedHeaders: Record<string, string>
  headers: KeyValueItem[]
  body: string
  showResponse: ApiResponse | null
  bodyMode: 'raw' | 'formData'
  requestArr: Request[]
  collection: Collection[]

  // update functions
  setMethod: React.Dispatch<React.SetStateAction<string>>
  setBaseUrl: React.Dispatch<React.SetStateAction<string>>
  setFinalUrl: React.Dispatch<React.SetStateAction<string>>
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
  setParams: React.Dispatch<React.SetStateAction<KeyValueItem[]>>
  setFormData: React.Dispatch<React.SetStateAction<KeyValueItem[]>>
  setFormattedHeaders: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >
  setHeaders: React.Dispatch<React.SetStateAction<KeyValueItem[]>>
  setBody: React.Dispatch<React.SetStateAction<string>>
  setShowResponse: React.Dispatch<React.SetStateAction<ApiResponse | null>>
  setBodyMode: React.Dispatch<React.SetStateAction<'raw' | 'formData'>>
  setRequestArr: React.Dispatch<React.SetStateAction<Request[]>>
  setCollection: React.Dispatch<React.SetStateAction<Collection[]>>

  //api controller functions
  GetMethod: () => Promise<void>
  PostMethod: () => Promise<void>
  PutMethod: () => Promise<void>
  PatchMethod: () => Promise<void>
  DeleteMethod: () => Promise<void>
}

export const CollectionContext = createContext<CollectionContextType | null>(
  null
)

export const useCollection = () => {
  const context = useContext(CollectionContext)
  if (!context) {
    throw new Error('useCollection must be used within an CollectionProvider')
  }
  return context
}

export const CollectionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [collection, setCollection] = useState<Collection[]>([])
  const [method, setMethod] = useState('GET')
  const [baseUrl, setBaseUrl] = useState('https://dummyjson.com/products')
  const [finalUrl, setFinalUrl] = useState(baseUrl)
  const [activeTab, setActiveTab] = useState('params')
  const [params, setParams] = useState<KeyValueItem[]>([
    { key: '', value: '', enabled: false },
  ])
  const [formData, setFormData] = useState<KeyValueItem[]>([
    { type: 'text', key: '', value: '', enabled: false },
  ])
  const [formattedHeaders, setFormattedHeaders] = useState<
    Record<string, string>
  >({})
  const [headers, setHeaders] = useState<KeyValueItem[]>([
    { key: 'Content-Type', value: 'application/json', enabled: true },
    {
      key: 'Authorization',
      value:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0MDRmMTc4Yy04NGIyLTQxZGItODA3Ni03MThlY2Y3ODRiYzkiLCJuYW1lIjoicml0aWsgc2VydmljZWhpdmUiLCJ1c2VybmFtZSI6InlhZGF2cml0aWs0NDUiLCJpYXQiOjE3NjUyMDcyMjcsImV4cCI6MTc2NTI5MzYyN30.YRGy0g006-m4QfqpRK2FBuwIXGJyhiz9liXmO4dNxQg',
      enabled: true,
    },
  ])
  const [body, setBody] = useState('')
  const [showResponse, setShowResponse] = useState<ApiResponse  |AxiosError| null>(null)
  const [bodyMode, setBodyMode] = useState<'raw' | 'formData'>('raw')

  const [requestArr, setRequestArr] = useState<Request[]>([])

  //   api handler

  const createFormData = () => {
    const valid = formData.filter((f) => f.enabled && f.key.trim() !== '')

    if (valid.length === 0) return null

    const fd = new FormData()

    valid.forEach((f) => {
      fd.append(f.key, f.value)
    })

    return fd
  }

  const sendBodyInAPi = () => {
    return bodyMode === 'raw' ? { ...JSON.parse(body) } : createFormData()
  }

  const GetMethod = async () => {
    try {
      console.log('exe')
      const start = performance.now()
      const data = await axios.get(finalUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...formattedHeaders,
        },
      })
      const end = performance.now()
      const duration = end - start
      setShowResponse({ ...data, time: Math.round(duration) })
    } catch (err) {
      const error = err as AxiosError
      
      // console.log("error", error);
      if(error?.response){
        const  errorData =error.response as ApiResponse
        errorData.time = 0
        setShowResponse(errorData)
      }else{
        setShowResponse(error)
      }
    }
  }

  useEffect(()=>{
    console.log('show res',showResponse)
  },[showResponse])

  const PostMethod = async () => {
    try {
      const payload = sendBodyInAPi()
      const isFormData = payload instanceof FormData
      const data = await axios.post(finalUrl, payload, {
        headers: {
          ...formattedHeaders,
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        },
      })

      setShowResponse(data)
    } catch (err) {
      const error = err as AxiosError
      // console.log("error", error);
      if(error?.response){
        const  errorData =error.response as ApiResponse
        errorData.time = 0
        setShowResponse(errorData)
      }else{
        setShowResponse(error)
      }
    }
  }

  const PutMethod = async () => {
    try {
      const payload = sendBodyInAPi()
      const isFormData = payload instanceof FormData
      const data = await axios.put(finalUrl, payload, {
        headers: {
          ...formattedHeaders,
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        },
      })

      setShowResponse(data)
    } catch (err) {
      const error = err as AxiosError
      // console.log("error", error);
      if(error?.response){
        const  errorData =error.response as ApiResponse
        errorData.time = 0
        setShowResponse(errorData)
      }else{
        setShowResponse(error)
      }
    }
  }

  const PatchMethod = async () => {
    try {
      const payload = sendBodyInAPi()
      const isFormData = payload instanceof FormData
      const data = await axios.patch(finalUrl, payload, {
        headers: {
          ...formattedHeaders,
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        },
      })

      setShowResponse(data)
    } catch (err) {
      const error = err as AxiosError
      // console.log("error", error);
      if(error?.response){
        const  errorData =error.response as ApiResponse
        errorData.time = 0
        setShowResponse(errorData)
      }else{
        setShowResponse(error)
      }
    }
  }

  const DeleteMethod = async () => {
    try {
      const data = await axios.delete(finalUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...formattedHeaders,
        },
      })

      setShowResponse(data)
    } catch (err) {
      const error = err as AxiosError
      // console.log("error", error);
      if(error?.response){
        const  errorData =error.response as ApiResponse
        errorData.time = 0
        setShowResponse(errorData)
      }else{
        setShowResponse(error)
      }
    }
  }

  const all_states = {
    method,
    baseUrl,
    finalUrl,
    activeTab,
    params,
    formData,
    formattedHeaders,
    headers,
    body,
    showResponse,
    bodyMode,
    requestArr,
    collection,
  }
  const all_states_update_func = {
    setMethod,
    setBaseUrl,
    setFinalUrl,
    setActiveTab,
    setParams,
    setFormData,
    setFormattedHeaders,
    setHeaders,
    setBody,
    setShowResponse,
    setBodyMode,
    setRequestArr,
    setCollection,
  }

  const all_api_controllers = {
    GetMethod,
    PostMethod,
    PutMethod,
    PatchMethod,
    DeleteMethod,
  }
  return (
    <CollectionContext.Provider
      value={{
        ...all_states,
        ...all_states_update_func,
        ...all_api_controllers,
      }}
    >
      {children}
    </CollectionContext.Provider>
  )
}
