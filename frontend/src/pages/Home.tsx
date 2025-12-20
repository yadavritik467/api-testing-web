import Editor from '@monaco-editor/react'
import { Plus, Send, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Resizable } from 'react-resizable'
import { useSearchParams } from 'react-router-dom'
import { KeyValueItem, useCollection } from '../context/Collection'
import {
  Collection,
  Folder,
  methodColors1,
  RequestMethod,
} from '../layouts/Sidebar'

const Home = () => {
  const {
    // states,
    method,
    baseUrl,
    finalUrl,
    activeTab,
    params,
    formData,
    headers,
    body,
    showResponse,
    bodyMode,
    requestArr,

    // states update func
    setMethod,
    setBaseUrl,
    setFinalUrl,
    setActiveTab,
    setParams,
    setFormData,
    setFormattedHeaders,
    setHeaders,
    setBody,
    setBodyMode,
    setRequestArr,
    setCollection,

    // apis handler

    GetMethod,
    PostMethod,
    PutMethod,
    PatchMethod,
    DeleteMethod,
  } = useCollection()
  const [editorHeight, setEditorHeight] = useState(300) // px

  const [searchParams, setSearchParams] = useSearchParams()
  const CollectionId = Number(searchParams?.get('colId'))
  const FolderID = Number(searchParams?.get('folderId'))
  const RequestID = Number(searchParams?.get('reqId'))

  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

  const methodColors: { [key: string]: any } = {
    GET: 'bg-green-500 hover:bg-green-600',
    POST: 'bg-yellow-500 hover:bg-yellow-600',
    PUT: 'bg-blue-500 hover:bg-blue-600',
    PATCH: 'bg-purple-500 hover:bg-purple-600',
    DELETE: 'bg-red-500 hover:bg-red-600',
  }

  // parmas logic
  const addParam = () => {
    setParams([...params, { key: '', value: '', enabled: false }])
  }

  const removeParam = (index: number) => {
    setParams(params.filter((_: any, i: number) => i !== index))
  }

  const updateParam = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    setParams((prev: typeof params) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  // header logic
  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: false }])
  }

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_: any, i: number) => i !== index))
  }

  const updateHeader = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    setHeaders((prev: KeyValueItem[]) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  // form data logic
  const addFormData = () => {
    setFormData([
      ...formData,
      { type: 'text', key: '', value: '', enabled: false },
    ])
  }

  const removeFormData = (index: number) => {
    setFormData(formData.filter((_: any, i: number) => i !== index))
  }

  const updateFormData = (index: number, field: string, value: any) => {
    setFormData((prev: KeyValueItem[]) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  // generate and upate url in live thorough params

  const generateParamsUrl = () => {
    const activeParams = params
      .filter((p) => p?.enabled && p.key.trim() !== '')
      .map(
        (p) =>
          `${encodeURIComponent(p?.key)}=${encodeURIComponent(
            p?.value as string
          )}`
      )
      .join('&')

    return activeParams ? `${baseUrl}?${activeParams}` : baseUrl
  }

  useEffect(() => {
    if (headers) {
      const formatHeaders = headers.reduce(
        (acc, item) => {
          if (item?.enabled) acc[item.key] = String(item.value)
          return acc
        },
        {} as Record<string, string>
      )
      setFormattedHeaders(formatHeaders)
    }
  }, [headers])

  useEffect(() => {
    const updated = generateParamsUrl()
    setFinalUrl(updated)
  }, [params, baseUrl])

  const sendRequest = () => {
    if (method === 'GET') {
      GetMethod()
      return
    } else if (method === 'POST') {
      PostMethod()
      return
    } else if (method === 'PUT') {
      PutMethod()
      return
    } else if (method === 'PATCH') {
      PatchMethod()
      return
    } else if (method === 'DELETE') {
      DeleteMethod()
      return
    }
  }

  const formatTime = (ms: number) => {
    if (!ms) return ''

    if (ms < 1000) return `${Math.round(ms)} ms`
    return `${(ms / 1000).toFixed(2)} s`
  }

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 200:
        return {
          label: 'Success',
          bg: 'bg-green-100',
          text: 'text-green-700',
        }

      case 201:
        return {
          label: 'Created',
          bg: 'bg-green-100',
          text: 'text-green-700',
        }

      case 301:
        return {
          label: 'Redirect',
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
        }

      case 400:
        return {
          label: 'Bad Request',
          bg: 'bg-orange-100',
          text: 'text-orange-700',
        }

      case 404:
        return {
          label: 'Not Found',
          bg: 'bg-orange-100',
          text: 'text-orange-700',
        }

      case 500:
        return {
          label: 'Server Error',
          bg: 'bg-red-100',
          text: 'text-red-700',
        }

      case 503:
        return {
          label: 'Service Unavailable',
          bg: 'bg-red-100',
          text: 'text-red-700',
        }

      default:
        return {
          label: 'Unknown Status',
          bg: 'bg-gray-200',
          text: 'text-gray-700',
        }
    }
  }

  const handleEditorChange = (value: string) => {
    setBody(value)
  }

  // collection logic
  const updateCollection = (
    colId: number,
    fn: (c: Collection) => Collection
  ) => {
    setCollection((cols) => cols?.map((c) => (c.id === colId ? fn(c) : c)))
  }

  // folders logic
  const updateFolders = (
    colId: number,
    folderId: number,
    fn: (f: Folder) => Folder
  ) => {
    updateCollection(colId, (c) => ({
      ...c,
      hasFolder: c?.hasFolder.map((f) =>
        f?.folderId === folderId ? fn(f) : f
      ),
    }))
  }

  const updatingReqMethod = (e: any) => {
    const value = e?.target?.value
    setMethod(value)
    setRequestArr((prev) =>
      prev.map((p) =>
        p.colId === CollectionId &&
        p.folderId === FolderID &&
        p.reqId === RequestID
          ? { ...p, method: value as RequestMethod }
          : p
      )
    )
    updateFolders(CollectionId, FolderID, (f) => ({
      ...f,
      hasRequests: f?.hasRequests.map((r) =>
        r.reqId === RequestID ? { ...r, method: value } : r
      ),
    }))
  }
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            API Testing Frameworkd
          </h1>
          <p className="text-gray-600 mt-1">Test your API endpoints</p>
        </div>

        {requestArr?.length ? (
          <div className="w-[100%] overflow-x-scroll border h-[60px] flex ">
            {requestArr?.map((r, i) => (
              <div
                key={i}
                onClick={() =>
                  setSearchParams({
                    colId: String(r?.colId),
                    folderId: String(r?.folderId),
                    reqId: String(r.reqId),
                  })
                }
                className={`${
                  r?.colId === CollectionId &&
                  r?.folderId === FolderID &&
                  r?.reqId === RequestID
                    ? 'bg-slate-200'
                    : 'bg-white'
                } w-[300px] h-full border border-blue-200 cursor-pointer `}
              >
                <div className="flex justify-start items-center gap-3 py-2 px-3 border-b last:border-b-0 border-slate-200 transition-colors duration-150 cursor-pointer group">
                  <span
                    className={`${methodColors1['GET']} font-bold text-xs px-2 py-1 rounded bg-white border border-current min-w-[60px] text-center`}
                  >
                    {r?.method}
                  </span>

                  <p
                    // onDoubleClick={() => changeRequestName()}
                    className="text-sm text-slate-700 flex-1 truncate group-hover:text-blue-600 transition-colors"
                  >
                    {r?.reqName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Main Request Builder */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          {/* Method and URL Row */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            {/* Method Dropdown */}
            <div className="relative">
              <select
                value={method}
                onChange={(e) => updatingReqMethod(e)}
                className={`${methodColors[method]} text-white font-semibold px-4 py-3 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 appearance-none pr-10 w-full md:w-auto`}
              >
                {methods.map((m) => (
                  <option key={m} value={m} className="bg-white text-gray-800">
                    {m}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* URL Input */}
            <input
              type="text"
              value={finalUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="Enter request URL"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Send Button */}
            <button
              onClick={() => sendRequest()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <div className="flex flex-wrap gap-2 md:gap-0">
              {['params', 'headers', 'body'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[200px]">
            {/* Params Tab */}
            {activeTab === 'params' && (
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-600">
                        <th className="pb-2 w-8"></th>
                        <th className="pb-2 px-2">Key</th>
                        <th className="pb-2 px-2">Value</th>
                        <th className="pb-2 w-8"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {params.map((param, index) => (
                        <tr key={index} className="group">
                          <td className="py-1">
                            <input
                              type="checkbox"
                              checked={param.enabled}
                              onChange={(e) =>
                                updateParam(index, 'enabled', e.target.checked)
                              }
                              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-1 px-2">
                            <input
                              type="text"
                              value={param.key}
                              onChange={(e) =>
                                updateParam(index, 'key', e.target.value)
                              }
                              placeholder="Key"
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-1 px-2">
                            <input
                              type="text"
                              value={String(param.value)}
                              onChange={(e) =>
                                updateParam(index, 'value', e.target.value)
                              }
                              placeholder="Value"
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-1">
                            <button
                              onClick={() => removeParam(index)}
                              className="text-gray-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={addParam}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Parameter
                </button>
              </div>
            )}

            {/* Headers Tab */}
            {activeTab === 'headers' && (
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-600">
                        <th className="pb-2 w-8"></th>
                        <th className="pb-2 px-2">Key</th>
                        <th className="pb-2 px-2">Value</th>
                        <th className="pb-2 w-8"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {headers.map((header, index) => (
                        <tr key={index} className="group">
                          <td className="py-1">
                            <input
                              type="checkbox"
                              checked={header.enabled}
                              onChange={(e) =>
                                updateHeader(index, 'enabled', e.target.checked)
                              }
                              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-1 px-2">
                            <input
                              type="text"
                              value={header.key}
                              onChange={(e) =>
                                updateHeader(index, 'key', e.target.value)
                              }
                              placeholder="Key"
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-1 px-2">
                            <input
                              type="text"
                              value={String(header.value)}
                              onChange={(e) =>
                                updateHeader(index, 'value', e.target.value)
                              }
                              placeholder="Value"
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-1">
                            <button
                              onClick={() => removeHeader(index)}
                              className="text-gray-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={addHeader}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Header
                </button>
              </div>
            )}

            {/* Body Tab */}
            {activeTab === 'body' && (
              <div className="flex flex-col w-full">
                <div className="flex w-full">
                  <button
                    onClick={() => setBodyMode('raw')}
                    className={`w-[50%] mb-4  ${
                      bodyMode === 'raw'
                        ? 'text-blue-600 border-r-2 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }  `}
                  >
                    Raw
                  </button>
                  <button
                    onClick={() => setBodyMode('formData')}
                    className={`w-[50%] mb-4  ${
                      bodyMode === 'formData'
                        ? 'text-blue-600 border-l-2 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }  `}
                  >
                    Form Data
                  </button>
                </div>
                {bodyMode === 'raw' ? (
                  <Resizable
                    height={editorHeight}
                    width={600}
                    onResize={(_: any, data) =>
                      setEditorHeight(data.size.height)
                    }
                    resizeHandles={['s']}
                  >
                    <div style={{ height: editorHeight }}>
                      <Editor
                        height="100%"
                        defaultLanguage="json"
                        defaultValue={body}
                        onChange={(val: string | undefined) =>
                          handleEditorChange(val ?? '')
                        }
                      />
                    </div>
                  </Resizable>
                ) : (
                  <div className="space-y-3">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-sm text-gray-600">
                            <th className="pb-2 w-8"></th>
                            <th className="pb-2 px-2">type</th>
                            <th className="pb-2 px-2">Key</th>
                            <th className="pb-2 px-2">Value</th>
                            <th className="pb-2 w-8"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.map((fd, index) => (
                            <tr key={index} className="group">
                              <td className="py-1">
                                <input
                                  type="checkbox"
                                  checked={fd.enabled}
                                  onChange={(e) =>
                                    updateFormData(
                                      index,
                                      'enabled',
                                      e.target.checked
                                    )
                                  }
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                              </td>
                              <td className="py-1">
                                <select
                                  onChange={(e) =>
                                    setFormData((prev) =>
                                      prev.map((p, i: number) =>
                                        i === index
                                          ? {
                                              ...p,
                                              type: e.target.value as
                                                | 'text'
                                                | 'file',
                                            }
                                          : p
                                      )
                                    )
                                  }
                                  className="w-full px-4 py-2 bg-white cursor-pointer border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="text">Text</option>
                                  <option value="file">File</option>
                                </select>
                              </td>
                              <td className="py-1 px-2">
                                <input
                                  type="text"
                                  value={fd.key}
                                  onChange={(e) =>
                                    updateFormData(index, 'key', e.target.value)
                                  }
                                  placeholder="Key"
                                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </td>
                              <td className="py-1 px-2">
                                <input
                                  type={fd?.type}
                                  value={
                                    fd?.type !== 'file' ? String(fd?.value) : ''
                                  }
                                  onChange={(e) =>
                                    updateFormData(
                                      index,
                                      'value',
                                      fd?.type === 'text'
                                        ? String(e.target.value)
                                        : e?.target?.files?.[0]
                                    )
                                  }
                                  placeholder="Value"
                                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </td>
                              <td className="py-1">
                                <button
                                  onClick={() => removeFormData(index)}
                                  className="text-gray-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button
                      onClick={addFormData}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add Form Data
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Response Section */}
        {showResponse !== null ? (
          <div className="w-full">
            <div className="flex justify-end items-center gap-3">
              <div
                className={`px-3 my-3 w-fit py-1 flex gap-4 rounded-md border ${
                  getStatusInfo(showResponse?.status ?? -1)?.bg
                } ${getStatusInfo(showResponse?.status ?? -1).text}`}
              >
                {showResponse?.status}{' '}
                {getStatusInfo(showResponse?.status ?? -1).label}
              </div>
              <div
                className={`px-3 my-3 w-fit py-1 gap-4 rounded-md border ${
                  getStatusInfo(showResponse?.status ?? -1).bg
                } ${getStatusInfo(showResponse?.status ?? -1).text}`}
              >
                {formatTime(showResponse?.time ?? -1)}
              </div>
            </div>
            <pre
              style={{
                height: '600px',
                overflow: 'scroll',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                background: '#1e1e1e',
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
              }}
            >
              {JSON.stringify(showResponse?.data, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Response
            </h2>
            <div className="bg-gray-100 rounded-lg p-4 min-h-[200px] text-gray-500 flex items-center justify-center">
              Click "Send" to see the response
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
